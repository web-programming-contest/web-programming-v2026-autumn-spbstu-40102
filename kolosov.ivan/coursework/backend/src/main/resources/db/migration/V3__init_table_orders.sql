CREATE TABLE orders (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    client_id BIGINT REFERENCES authorisation(id) ON DELETE CASCADE,
    products JSON NOT NULL,
    products_amount BIGINT NOT NULL,
    total_price BIGINT NOT NULL,
    email VARCHAR,
    phone VARCHAR NOT NULL,
    address VARCHAR,
    is_cash BOOLEAN NOT NULL,
    is_packaging_required BOOLEAN NOT NULL,
    create_date TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT LOCALTIMESTAMP
)