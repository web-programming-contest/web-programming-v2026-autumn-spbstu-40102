package shop

import (
	"crypto/rand"
	"crypto/sha256"
	"crypto/subtle"
	"encoding/hex"
	"encoding/json"
	"errors"
	"io"
	"log"
	"net/http"
	"strings"
	"sync"
	"time"
)

const sessionDuration = 8 * time.Hour
const cookieName = "gadget_session"

type Config struct {
	Username string
	Password string
	Origins  []string
}

type session struct {
	user    string
	expires time.Time
}

type API struct {
	store    *Store
	config   Config
	mu       sync.Mutex
	sessions map[string]session
}

func NewHandler(store *Store, config Config) http.Handler {
	a := &API{store: store, config: config, sessions: make(map[string]session)}
	mux := http.NewServeMux()
	mux.HandleFunc("GET /api/health", func(w http.ResponseWriter, r *http.Request) { respond(w, 200, map[string]string{"status": "ok"}) })
	mux.HandleFunc("GET /api/goods", func(w http.ResponseWriter, r *http.Request) { respond(w, 200, store.Products()) })
	mux.HandleFunc("GET /api/session", a.getSession)
	mux.HandleFunc("POST /api/login", a.login)
	mux.HandleFunc("POST /api/logout", a.logout)
	mux.HandleFunc("GET /api/orders", a.getOrders)
	mux.HandleFunc("POST /api/orders", a.createOrder)
	return a.middleware(mux)
}

func respond(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(data); err != nil {
		log.Printf("write response: %v", err)
	}
}

func fail(w http.ResponseWriter, status int, message string) {
	respond(w, status, map[string]string{"error": message})
}

func decode(w http.ResponseWriter, r *http.Request, data any) bool {
	if strings.Split(r.Header.Get("Content-Type"), ";")[0] != "application/json" {
		fail(w, 415, "Ожидается application/json")
		return false
	}
	r.Body = http.MaxBytesReader(w, r.Body, 64<<10)
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(data); err != nil {
		fail(w, 400, "Некорректный JSON запроса")
		return false
	}
	if err := decoder.Decode(new(any)); err != io.EOF {
		fail(w, 400, "Запрос должен содержать один JSON-объект")
		return false
	}
	return true
}

func (a *API) middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "no-store")
		w.Header().Set("X-Content-Type-Options", "nosniff")
		origin := r.Header.Get("Origin")
		if origin != "" {
			allowed := false
			for _, candidate := range a.config.Origins {
				if origin == candidate {
					allowed = true
					break
				}
			}
			if !allowed {
				fail(w, 403, "Источник запроса не разрешён")
				return
			}
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			w.Header().Add("Vary", "Origin")
		}
		if r.Method == http.MethodOptions {
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, X-Gadget-Request")
			w.WriteHeader(http.StatusNoContent)
			return
		}
		if r.Method == http.MethodPost && r.Header.Get("X-Gadget-Request") != "true" {
			fail(w, 403, "Отсутствует заголовок X-Gadget-Request")
			return
		}
		next.ServeHTTP(w, r)
	})
}

func (a *API) currentUser(r *http.Request) string {
	cookie, err := r.Cookie(cookieName)
	if err != nil {
		return ""
	}
	a.mu.Lock()
	defer a.mu.Unlock()
	s, ok := a.sessions[cookie.Value]
	if !ok {
		return ""
	}
	if time.Now().After(s.expires) {
		delete(a.sessions, cookie.Value)
		return ""
	}
	return s.user
}

func (a *API) getSession(w http.ResponseWriter, r *http.Request) {
	user := a.currentUser(r)
	respond(w, 200, map[string]any{"authenticated": user != "", "user": user})
}

func (a *API) login(w http.ResponseWriter, r *http.Request) {
	var request struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	if !decode(w, r, &request) {
		return
	}
	username := sha256.Sum256([]byte(strings.TrimSpace(request.Username)))
	wantedUser := sha256.Sum256([]byte(a.config.Username))
	password := sha256.Sum256([]byte(request.Password))
	wantedPassword := sha256.Sum256([]byte(a.config.Password))
	if subtle.ConstantTimeCompare(username[:], wantedUser[:])&subtle.ConstantTimeCompare(password[:], wantedPassword[:]) != 1 {
		fail(w, 401, "Такого пользователя нет, возможно неправильный логин или пароль — проверьте данные")
		return
	}
	var bytes [32]byte
	if _, err := rand.Read(bytes[:]); err != nil {
		fail(w, 500, "Не удалось создать сессию")
		return
	}
	token := hex.EncodeToString(bytes[:])
	a.mu.Lock()
	for key, s := range a.sessions {
		if time.Now().After(s.expires) {
			delete(a.sessions, key)
		}
	}
	if old, err := r.Cookie(cookieName); err == nil {
		delete(a.sessions, old.Value)
	}
	a.sessions[token] = session{a.config.Username, time.Now().Add(sessionDuration)}
	a.mu.Unlock()
	http.SetCookie(w, &http.Cookie{Name: cookieName, Value: token, Path: "/api", MaxAge: int(sessionDuration.Seconds()), HttpOnly: true, SameSite: http.SameSiteLaxMode})
	respond(w, 200, map[string]any{"authenticated": true, "user": a.config.Username})
}

func (a *API) logout(w http.ResponseWriter, r *http.Request) {
	if cookie, err := r.Cookie(cookieName); err == nil {
		a.mu.Lock()
		delete(a.sessions, cookie.Value)
		a.mu.Unlock()
	}
	http.SetCookie(w, &http.Cookie{Name: cookieName, Path: "/api", MaxAge: -1, HttpOnly: true, SameSite: http.SameSiteLaxMode})
	respond(w, 200, map[string]bool{"authenticated": false})
}

func (a *API) getOrders(w http.ResponseWriter, r *http.Request) {
	user := a.currentUser(r)
	if user == "" {
		fail(w, 401, "Войдите в аккаунт")
		return
	}
	respond(w, 200, a.store.Orders(user))
}

func (a *API) createOrder(w http.ResponseWriter, r *http.Request) {
	user := a.currentUser(r)
	if user == "" {
		fail(w, 401, "Войдите в аккаунт")
		return
	}
	var request OrderRequest
	if !decode(w, r, &request) {
		return
	}
	order, err := a.store.CreateOrder(user, request)
	if errors.Is(err, ErrSave) {
		log.Printf("save order: %v", err)
		fail(w, 500, ErrSave.Error())
		return
	}
	if err != nil {
		fail(w, 400, err.Error())
		return
	}
	respond(w, 201, order)
}
