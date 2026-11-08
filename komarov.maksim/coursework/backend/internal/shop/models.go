package shop

import "time"

type Specification struct {
	Name  string `json:"name"`
	Value string `json:"value"`
}

type Product struct {
	ID             int             `json:"id"`
	Name           string          `json:"name"`
	Price          int64           `json:"price"`
	Image          string          `json:"image"`
	Category       string          `json:"category"`
	Color          string          `json:"color"`
	Rating         float64         `json:"rating"`
	IsNew          bool            `json:"isNew"`
	IsHit          bool            `json:"isHit"`
	ReleaseDate    string          `json:"releaseDate"`
	Popularity     int             `json:"popularity"`
	CatalogOrder   int             `json:"catalogOrder"`
	Description    string          `json:"description"`
	Specifications []Specification `json:"specifications"`
}

type CartItem struct {
	ProductID int `json:"productId"`
	Quantity  int `json:"quantity"`
}

type Checkout struct {
	Phone    string `json:"phone"`
	Email    string `json:"email"`
	Delivery string `json:"delivery"`
	Address  string `json:"address"`
	Payment  string `json:"payment"`
	Wrapping bool   `json:"wrapping"`
}

type OrderRequest struct {
	Items []CartItem `json:"items"`
	Checkout
}

type OrderItem struct {
	ProductID int    `json:"productId"`
	Name      string `json:"name"`
	Price     int64  `json:"price"`
	Quantity  int    `json:"quantity"`
}

type Order struct {
	ID        int64       `json:"id"`
	User      string      `json:"user"`
	CreatedAt time.Time   `json:"createdAt"`
	Items     []OrderItem `json:"items"`
	Quantity  int         `json:"quantity"`
	Total     int64       `json:"total"`
	Checkout
}
