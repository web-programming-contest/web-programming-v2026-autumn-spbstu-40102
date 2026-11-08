package shop

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/mail"
	"os"
	"path/filepath"
	"slices"
	"strings"
	"sync"
	"time"
	"unicode"
)

type Store struct {
	mu        sync.Mutex
	products  []Product
	orders    []Order
	orderFile string
	nextID    int64
}

func OpenStore(directory string) (*Store, error) {
	s := &Store{orderFile: filepath.Join(directory, "orders.json"), nextID: 10001}
	data, err := os.ReadFile(filepath.Join(directory, "goods.json"))
	if err != nil {
		return nil, fmt.Errorf("read goods: %w", err)
	}
	if err = json.Unmarshal(data, &s.products); err != nil {
		return nil, fmt.Errorf("parse goods: %w", err)
	}
	seen := make(map[int]bool)
	for _, p := range s.products {
		if p.ID <= 0 || p.Price <= 0 || p.Name == "" || seen[p.ID] {
			return nil, fmt.Errorf("invalid or duplicate product: %d", p.ID)
		}
		seen[p.ID] = true
	}
	data, err = os.ReadFile(s.orderFile)
	if errors.Is(err, os.ErrNotExist) {
		s.orders = []Order{}
		return s, nil
	}
	if err != nil {
		return nil, fmt.Errorf("read orders: %w", err)
	}
	if err = json.Unmarshal(data, &s.orders); err != nil {
		return nil, fmt.Errorf("parse orders: %w", err)
	}
	for _, order := range s.orders {
		if order.ID >= s.nextID {
			s.nextID = order.ID + 1
		}
	}
	return s, nil
}

func (s *Store) Products() []Product {
	return slices.Clone(s.products)
}

func (s *Store) Orders(user string) []Order {
	s.mu.Lock()
	defer s.mu.Unlock()
	orders := make([]Order, 0)
	for i := len(s.orders) - 1; i >= 0; i-- {
		if s.orders[i].User == user {
			orders = append(orders, s.orders[i])
		}
	}
	return orders
}

func validateCheckout(c *Checkout) error {
	c.Phone = strings.TrimSpace(c.Phone)
	c.Email = strings.TrimSpace(c.Email)
	c.Address = strings.TrimSpace(c.Address)
	digits := 0
	for _, r := range c.Phone {
		if r >= '0' && r <= '9' {
			digits++
		} else if !strings.ContainsRune("+-() ", r) {
			return errors.New("Проверьте номер телефона")
		}
	}
	if digits < 10 || digits > 15 || len(c.Phone) > 40 {
		return errors.New("Укажите телефон: от 10 до 15 цифр")
	}
	if c.Email != "" {
		address, err := mail.ParseAddress(c.Email)
		if err != nil || address.Address != c.Email || len(c.Email) > 254 {
			return errors.New("Проверьте адрес электронной почты")
		}
	}
	if c.Delivery != "pickup" && c.Delivery != "delivery" {
		return errors.New("Выберите способ получения")
	}
	if c.Delivery == "delivery" && c.Address == "" {
		return errors.New("Укажите адрес доставки")
	}
	if len([]rune(c.Address)) > 500 || strings.IndexFunc(c.Address, unicode.IsControl) >= 0 {
		return errors.New("Проверьте адрес доставки")
	}
	if c.Delivery == "pickup" {
		c.Address = ""
	}
	if c.Payment != "card" && c.Payment != "cash" {
		return errors.New("Выберите способ оплаты")
	}
	return nil
}

func (s *Store) CreateOrder(user string, request OrderRequest) (Order, error) {
	if err := validateCheckout(&request.Checkout); err != nil {
		return Order{}, err
	}
	if len(request.Items) == 0 || len(request.Items) > 100 {
		return Order{}, errors.New("В заказе должно быть от 1 до 100 позиций")
	}
	order := Order{User: user, CreatedAt: time.Now().UTC(), Checkout: request.Checkout, Items: make([]OrderItem, 0, len(request.Items))}
	seen := make(map[int]bool)
	for _, item := range request.Items {
		if item.Quantity < 1 || item.Quantity > 99 || seen[item.ProductID] {
			return Order{}, errors.New("Некорректное количество или повторяющийся товар")
		}
		seen[item.ProductID] = true
		index := slices.IndexFunc(s.products, func(p Product) bool { return p.ID == item.ProductID })
		if index < 0 {
			return Order{}, errors.New("Один из товаров больше не доступен")
		}
		product := s.products[index]
		order.Items = append(order.Items, OrderItem{product.ID, product.Name, product.Price, item.Quantity})
		order.Quantity += item.Quantity
		order.Total += product.Price * int64(item.Quantity)
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	order.ID = s.nextID
	orders := append(slices.Clone(s.orders), order)
	if err := saveOrders(s.orderFile, orders); err != nil {
		return Order{}, fmt.Errorf("%w: %v", ErrSave, err)
	}
	s.orders = orders
	s.nextID++
	return order, nil
}

var ErrSave = errors.New("Не удалось сохранить заказ. Попробуйте ещё раз")

func saveOrders(path string, orders []Order) error {
	data, err := json.MarshalIndent(orders, "", "  ")
	if err != nil {
		return err
	}
	f, err := os.CreateTemp(filepath.Dir(path), ".orders-*.tmp")
	if err != nil {
		return err
	}
	defer os.Remove(f.Name())
	if _, err = f.Write(append(data, '\n')); err != nil {
		f.Close()
		return err
	}
	if err = f.Sync(); err != nil {
		f.Close()
		return err
	}
	if err = f.Close(); err != nil {
		return err
	}
	return os.Rename(f.Name(), path)
}
