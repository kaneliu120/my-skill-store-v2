-- Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    nickname VARCHAR(100),
    avatar_url TEXT,
    role VARCHAR(20) DEFAULT 'user', -- user, admin
    crypto_wallet_address TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Products
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    seller_id INTEGER REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    price_usd DECIMAL(10, 2) NOT NULL,
    delivery_type VARCHAR(20) NOT NULL, -- auto, manual
    delivery_content TEXT, -- file_key or manual_instruction
    status VARCHAR(20) DEFAULT 'draft', -- draft, pending, approved, rejected
    created_at TIMESTAMP DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    buyer_id INTEGER REFERENCES users(id),
    seller_id INTEGER REFERENCES users(id),
    product_id INTEGER REFERENCES products(id),
    amount_usd DECIMAL(10, 2),
    status VARCHAR(20) DEFAULT 'created', -- created, paid_reported, confirmed, completed
    created_at TIMESTAMP DEFAULT NOW()
);
