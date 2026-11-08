package shop

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"sync"
	"testing"
)

func fixture(t *testing.T) (*Store, string) {
	t.Helper()
	dir := t.TempDir()
	goods := []Product{{ID: 1, Name: "Товар с длинным названием", Price: 1500}, {ID: 2, Name: "Другой товар", Price: 2299}}
	data, _ := json.Marshal(goods)
	if err := os.WriteFile(filepath.Join(dir, "goods.json"), data, 0600); err != nil {
		t.Fatal(err)
	}
	s, err := OpenStore(dir)
	if err != nil {
		t.Fatal(err)
	}
	return s, dir
}

func validOrder() OrderRequest {
	return OrderRequest{Items: []CartItem{{1, 2}, {2, 1}}, Checkout: Checkout{Phone: "+7 (999) 123-45-67", Delivery: "pickup", Payment: "card"}}
}

func TestOrderTotalsPersistenceAndOwnership(t *testing.T) {
	s, dir := fixture(t)
	request := validOrder()
	request.Address = "should be removed for pickup"
	order, err := s.CreateOrder("student", request)
	if err != nil {
		t.Fatal(err)
	}
	if order.Total != 5299 || order.Quantity != 3 || order.Address != "" {
		t.Fatalf("incorrect order: %+v", order)
	}
	if len(s.Orders("another-user")) != 0 {
		t.Fatal("orders leaked between users")
	}
	reopened, err := OpenStore(dir)
	if err != nil || len(reopened.Orders("student")) != 1 {
		t.Fatalf("order did not survive restart: %v", err)
	}
	next, err := reopened.CreateOrder("student", validOrder())
	if err != nil || next.ID != order.ID+1 {
		t.Fatalf("ID did not continue after restart: %v", err)
	}
}

func TestRejectInvalidOrders(t *testing.T) {
	cases := map[string]func(*OrderRequest){
		"empty cart":        func(r *OrderRequest) { r.Items = nil },
		"unknown product":   func(r *OrderRequest) { r.Items[0].ProductID = 999 },
		"zero quantity":     func(r *OrderRequest) { r.Items[0].Quantity = 0 },
		"negative quantity": func(r *OrderRequest) { r.Items[0].Quantity = -3 },
		"too many":          func(r *OrderRequest) { r.Items[0].Quantity = 100 },
		"duplicate":         func(r *OrderRequest) { r.Items = append(r.Items, r.Items[0]) },
		"missing phone":     func(r *OrderRequest) { r.Phone = "" },
		"invalid phone":     func(r *OrderRequest) { r.Phone = "a79991234567" },
		"missing address":   func(r *OrderRequest) { r.Delivery = "delivery" },
		"invalid email":     func(r *OrderRequest) { r.Email = "invalid@" },
		"missing payment":   func(r *OrderRequest) { r.Payment = "" },
		"bad delivery":      func(r *OrderRequest) { r.Delivery = "unknown" },
	}
	for name, change := range cases {
		t.Run(name, func(t *testing.T) {
			s, _ := fixture(t)
			r := validOrder()
			change(&r)
			if _, err := s.CreateOrder("student", r); err == nil {
				t.Fatal("invalid order accepted")
			}
			if len(s.Orders("student")) != 0 {
				t.Fatal("invalid order changed history")
			}
		})
	}
}

func TestSaveFailureDoesNotCommit(t *testing.T) {
	s, _ := fixture(t)
	s.orderFile = filepath.Join(t.TempDir(), "missing-directory", "orders.json")
	if _, err := s.CreateOrder("student", validOrder()); err == nil {
		t.Fatal("missing save error")
	}
	if len(s.Orders("student")) != 0 || s.nextID != 10001 {
		t.Fatal("failed save changed store")
	}
}

func TestConcurrentOrdersAreNotLost(t *testing.T) {
	s, dir := fixture(t)
	const count = 20
	var group sync.WaitGroup
	for i := 0; i < count; i++ {
		group.Add(1)
		go func() {
			defer group.Done()
			if _, err := s.CreateOrder("student", validOrder()); err != nil {
				t.Error(err)
			}
		}()
	}
	group.Wait()
	reopened, err := OpenStore(dir)
	if err != nil {
		t.Fatal(err)
	}
	orders := reopened.Orders("student")
	if len(orders) != count {
		t.Fatalf("lost orders: got %d", len(orders))
	}
	seen := make(map[int64]bool)
	for _, order := range orders {
		if seen[order.ID] {
			t.Fatal("duplicate order ID")
		}
		seen[order.ID] = true
	}
}

func TestHTTPLoginOrderLogout(t *testing.T) {
	s, _ := fixture(t)
	handler := NewHandler(s, Config{Username: "student", Password: "test-password", Origins: []string{"http://localhost:3000"}})
	call := func(method, path, body, origin string, cookie *http.Cookie) *httptest.ResponseRecorder {
		t.Helper()
		r := httptest.NewRequest(method, path, bytes.NewBufferString(body))
		r.Header.Set("Content-Type", "application/json")
		r.Header.Set("X-Gadget-Request", "true")
		if origin != "" {
			r.Header.Set("Origin", origin)
		}
		if cookie != nil {
			r.AddCookie(cookie)
		}
		w := httptest.NewRecorder()
		handler.ServeHTTP(w, r)
		return w
	}
	if w := call("GET", "/api/orders", "", "", nil); w.Code != 401 {
		t.Fatalf("anonymous history status %d", w.Code)
	}
	if w := call("GET", "/api/goods", "", "", nil); w.Code != 200 {
		t.Fatal("public product feed is unavailable")
	}
	if w := call("POST", "/api/login", `{"username":"student","password":"wrong"}`, "", nil); w.Code != 401 {
		t.Fatal("incorrect password was accepted")
	}
	w := call("POST", "/api/login", `{"username":"student","password":"test-password"}`, "http://localhost:3000", nil)
	if w.Code != 200 || len(w.Result().Cookies()) != 1 {
		t.Fatalf("login failed: %d %s", w.Code, w.Body)
	}
	cookie := w.Result().Cookies()[0]
	if !cookie.HttpOnly || cookie.SameSite != http.SameSiteLaxMode || cookie.Path != "/api" {
		t.Fatal("session cookie properties are incorrect")
	}
	if w := call("POST", "/api/orders", `{"items":[{"productId":1,"quantity":2}],"phone":"79991234567","delivery":"pickup","payment":"card","total":1}`, "", cookie); w.Code != 400 {
		t.Fatal("client price injection was accepted")
	}
	data, _ := json.Marshal(validOrder())
	w = call("POST", "/api/orders", string(data), "http://evil.example", cookie)
	if w.Code != 403 {
		t.Fatal("untrusted origin was accepted")
	}
	w = call("POST", "/api/orders", string(data), "http://localhost:3000", cookie)
	if w.Code != 201 {
		t.Fatalf("order failed: %d %s", w.Code, w.Body)
	}
	var order Order
	json.Unmarshal(w.Body.Bytes(), &order)
	if order.Total != 5299 || order.Quantity != 3 {
		t.Fatal("HTTP order totals are incorrect")
	}
	if w := call("GET", "/api/orders", "", "", cookie); w.Code != 200 || !bytes.Contains(w.Body.Bytes(), []byte(fmt.Sprint(order.ID))) {
		t.Fatal("created order is not in history")
	}
	if w := call("POST", "/api/logout", `{}`, "", cookie); w.Code != 200 {
		t.Fatal("logout failed")
	}
	if w := call("GET", "/api/orders", "", "", cookie); w.Code != 401 {
		t.Fatal("logout did not revoke the session")
	}
}
