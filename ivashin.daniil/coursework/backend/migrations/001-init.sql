CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  image_path TEXT NOT NULL,
  price_kopecks INTEGER NOT NULL CHECK (price_kopecks >= 0),
  rating NUMERIC(2, 1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
  category TEXT NOT NULL,
  color TEXT NOT NULL,
  description TEXT NOT NULL,
  specifications JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_new BOOLEAN NOT NULL DEFAULT FALSE,
  is_hit BOOLEAN NOT NULL DEFAULT FALSE,
  popularity INTEGER NOT NULL DEFAULT 0 CHECK (popularity >= 0)
);

CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id),
  phone TEXT NOT NULL,
  email TEXT,
  delivery_type TEXT NOT NULL CHECK (delivery_type IN ('pickup', 'delivery')),
  address TEXT,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('card', 'cash')),
  packaging BOOLEAN NOT NULL DEFAULT FALSE,
  total_kopecks INTEGER NOT NULL CHECK (total_kopecks >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT delivery_address_required CHECK (
    delivery_type = 'pickup' OR NULLIF(TRIM(address), '') IS NOT NULL
  )
);

CREATE TABLE IF NOT EXISTS order_items (
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_kopecks INTEGER NOT NULL CHECK (unit_price_kopecks >= 0),
  PRIMARY KEY (order_id, product_id)
);

CREATE TABLE IF NOT EXISTS session (
  sid VARCHAR NOT NULL PRIMARY KEY,
  sess JSON NOT NULL,
  expire TIMESTAMP(6) NOT NULL
);

CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders(user_id);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS session_expire_idx ON session(expire);
