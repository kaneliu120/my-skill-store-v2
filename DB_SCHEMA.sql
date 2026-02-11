-- ============================================================
-- MySkillStore v2 — 完整数据库 Schema
-- 基于 TypeORM 实体定义生成
-- ============================================================

-- 用户表
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),                       -- 密码哈希
    nickname VARCHAR(100),                            -- 昵称
    avatar_url TEXT,                                  -- 头像地址
    role VARCHAR(20) DEFAULT 'user',                  -- 角色：user, admin
    crypto_wallet_address TEXT,                       -- 加密钱包地址
    crypto_qr_code_url TEXT,                          -- 收款二维码地址
    created_at TIMESTAMP DEFAULT NOW()
);

-- 商品表
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    seller_id INTEGER REFERENCES users(id),           -- 卖家 ID
    title VARCHAR(200) NOT NULL,                      -- 商品标题
    description TEXT,                                 -- 商品描述
    category VARCHAR(100),                            -- 分类
    tags VARCHAR(255),                                -- 标签
    preview_image_url TEXT,                           -- 预览图地址
    price_usd DECIMAL(10, 2) NOT NULL,               -- 价格（美元）
    delivery_type VARCHAR(20) NOT NULL,               -- 交付类型：auto_hosted, manual
    delivery_content TEXT,                            -- 交付内容（文件密钥或手动说明）
    status VARCHAR(20) DEFAULT 'draft',               -- 状态：draft, pending_review, approved, rejected, off_shelf
    review_reason TEXT,                               -- 审核理由
    created_at TIMESTAMP DEFAULT NOW()
);

-- 订单表
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    buyer_id INTEGER NOT NULL REFERENCES users(id),   -- 买家 ID
    seller_id INTEGER NOT NULL REFERENCES users(id),  -- 卖家 ID
    product_id INTEGER NOT NULL REFERENCES products(id), -- 商品 ID
    amount_usd DECIMAL(10, 2) NOT NULL,               -- 订单金额（美元）
    status VARCHAR(20) DEFAULT 'created',             -- 状态：created, paid_reported, payment_verified,
                                                      --       confirmed, completed, cancelled,
                                                      --       refund_requested, refunded
    transaction_hash VARCHAR(255),                    -- 交易哈希
    payment_network VARCHAR(50),                      -- 支付网络：ethereum, bsc, polygon, solana, bitcoin
    payment_verified BOOLEAN DEFAULT FALSE,           -- 是否已验证支付
    verification_details JSONB,                       -- 验证详情（JSON）
    created_at TIMESTAMP DEFAULT NOW()
);

-- 评价表（每订单唯一约束）
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL UNIQUE REFERENCES orders(id),  -- 订单 ID（唯一）
    product_id INTEGER NOT NULL REFERENCES products(id),     -- 商品 ID
    reviewer_id INTEGER NOT NULL REFERENCES users(id),       -- 评价人 ID（买家）
    seller_id INTEGER NOT NULL REFERENCES users(id),         -- 卖家 ID
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5), -- 评分（1-5）
    comment TEXT,                                            -- 评价内容
    created_at TIMESTAMP DEFAULT NOW()
);

-- 退款表
CREATE TABLE refunds (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id),  -- 关联订单 ID
    requester_id INTEGER NOT NULL REFERENCES users(id), -- 申请人 ID
    amount_usd DECIMAL(10, 2) NOT NULL,               -- 退款金额（美元）
    reason TEXT NOT NULL,                              -- 退款原因
    status VARCHAR(20) DEFAULT 'pending',             -- 状态：pending, approved, rejected, completed
    admin_note TEXT,                                   -- 管理员备注
    processed_by INTEGER REFERENCES users(id),         -- 处理人 ID
    refund_transaction_hash VARCHAR(255),              -- 退款交易哈希
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 博客文章表
CREATE TABLE blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,                      -- 文章标题
    slug VARCHAR(255) UNIQUE NOT NULL,                -- URL 友好标识
    content TEXT NOT NULL,                            -- 文章内容
    excerpt VARCHAR(500),                             -- 摘要
    cover_image TEXT,                                 -- 封面图地址
    author VARCHAR(100) DEFAULT 'Admin',              -- 作者
    is_published BOOLEAN DEFAULT FALSE,               -- 是否已发布
    published_at TIMESTAMP,                           -- 发布时间
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 通知表
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),    -- 接收用户 ID
    type VARCHAR(50) NOT NULL,                        -- 通知类型：order_created, payment_reported,
                                                      --   payment_verified, payment_confirmed,
                                                      --   order_completed, order_cancelled,
                                                      --   refund_requested, refund_approved,
                                                      --   refund_rejected, product_approved,
                                                      --   product_rejected, new_review, system
    title VARCHAR(255) NOT NULL,                      -- 通知标题
    message TEXT NOT NULL,                            -- 通知内容
    metadata JSONB,                                   -- 附加元数据（JSON）
    is_read BOOLEAN DEFAULT FALSE,                    -- 是否已读
    created_at TIMESTAMP DEFAULT NOW()
);

-- 行为追踪事件表
CREATE TABLE tracking_events (
    id SERIAL PRIMARY KEY,
    event_name VARCHAR(100) NOT NULL,                 -- 事件名称
    element_id VARCHAR(255),                          -- 元素 ID
    page_url VARCHAR(500) NOT NULL,                   -- 页面 URL
    user_id INTEGER,                                  -- 用户 ID（可为空）
    metadata JSONB,                                   -- 附加元数据（JSON）
    ip_address VARCHAR(45),                           -- IP 地址
    user_agent TEXT,                                  -- 用户代理
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 索引（推荐）
-- ============================================================

CREATE INDEX idx_products_seller_id ON products(seller_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX idx_orders_seller_id ON orders(seller_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_seller_id ON reviews(seller_id);
CREATE INDEX idx_refunds_order_id ON refunds(order_id);
CREATE INDEX idx_refunds_status ON refunds(status);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_tracking_events_event_name ON tracking_events(event_name);
CREATE INDEX idx_tracking_events_user_id ON tracking_events(user_id);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_is_published ON blog_posts(is_published);
