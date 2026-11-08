package main

import (
	"context"
	"errors"
	"flag"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"gadgethub/backend/internal/shop"
)

func env(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}

func main() {
	addr := flag.String("addr", "127.0.0.1:8080", "HTTP listen address")
	data := flag.String("data", "data", "directory containing goods.json and orders.json")
	flag.Parse()
	store, err := shop.OpenStore(*data)
	if err != nil {
		log.Fatal(err)
	}
	handler := shop.NewHandler(store, shop.Config{
		Username: env("SHOP_USER", "student"), Password: env("SHOP_PASSWORD", "gadget123"),
		Origins: strings.Split(env("FRONTEND_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000"), ","),
	})
	server := &http.Server{Addr: *addr, Handler: handler, ReadHeaderTimeout: 5 * time.Second, ReadTimeout: 10 * time.Second, WriteTimeout: 15 * time.Second, IdleTimeout: 60 * time.Second}
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	go func() {
		<-ctx.Done()
		shutdown, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		if err := server.Shutdown(shutdown); err != nil {
			log.Printf("shutdown: %v", err)
		}
	}()
	log.Printf("Gadget Hub API: http://%s | data: %s", *addr, *data)
	if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Fatal(err)
	}
}
