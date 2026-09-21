-- ============================================================
-- WECONNECT DATABASE
-- Fully updated schema + seed/demo data for zanda-dev
-- ============================================================

CREATE DATABASE IF NOT EXISTS weconnect;
USE weconnect;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS review_replies;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS delivery_locations;
DROP TABLE IF EXISTS deliveries;
DROP TABLE IF EXISTS stock_movements;
DROP TABLE IF EXISTS reorder_requests;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS product_variants;
DROP TABLE IF EXISTS product_media;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS supplier_subscriptions;
DROP TABLE IF EXISTS subscription_plans;
DROP TABLE IF EXISTS buyers;
DROP TABLE IF EXISTS suppliers;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

-- ============================================================
-- 1. USERS
-- ============================================================

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    user_role ENUM('buyer','supplier','admin') NOT NULL DEFAULT 'buyer',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. CATEGORIES
-- ============================================================

CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 3. BUYERS
-- ============================================================

CREATE TABLE buyers (
    buyer_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    business_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    category_id INT,
    phone VARCHAR(30),
    address VARCHAR(255),
    city VARCHAR(100),
    province VARCHAR(100),
    postal_code VARCHAR(20),
    profile_image VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_buyers_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_buyers_category
        FOREIGN KEY (category_id) REFERENCES categories(category_id)
        ON DELETE SET NULL
);

-- ============================================================
-- 4. SUPPLIERS
-- ============================================================

CREATE TABLE suppliers (
    supplier_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    business_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(30),
    address VARCHAR(255),
    city VARCHAR(100),
    province VARCHAR(100),
    postal_code VARCHAR(20),
    logo_url VARCHAR(500),
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    quick_delivery BOOLEAN NOT NULL DEFAULT FALSE,
    min_order_value DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    lead_time_days INT NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_suppliers_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
);

-- ============================================================
-- 5. SUBSCRIPTION PLANS
-- ============================================================

CREATE TABLE subscription_plans (
    plan_id INT AUTO_INCREMENT PRIMARY KEY,
    plan_name VARCHAR(100) NOT NULL UNIQUE,
    monthly_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    max_products INT NOT NULL DEFAULT 10,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 6. SUPPLIER SUBSCRIPTIONS
-- ============================================================

CREATE TABLE supplier_subscriptions (
    subscription_id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_id INT NOT NULL,
    plan_id INT NOT NULL,
    status ENUM('Active','Paused','Cancelled','Expired')
        NOT NULL DEFAULT 'Active',
    start_date DATE NOT NULL,
    end_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_supplier_subscriptions_supplier
        FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_supplier_subscriptions_plan
        FOREIGN KEY (plan_id) REFERENCES subscription_plans(plan_id)
        ON DELETE RESTRICT
);

-- ============================================================
-- 7. PRODUCTS
-- Added for the zanda-dev frontend:
-- subcategory, compare_price, selling_type and dimensions.
-- ============================================================

CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_id INT NOT NULL,
    category_id INT,

    product_name VARCHAR(150) NOT NULL,
    subcategory VARCHAR(100),

    description TEXT,

    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    compare_price DECIMAL(10,2),

    unit VARCHAR(50) NOT NULL DEFAULT 'unit',

    selling_type ENUM('in-store','online-only','both')
        NOT NULL DEFAULT 'online-only',

    weight_kg DECIMAL(10,2),
    length_in DECIMAL(10,2),
    breadth_in DECIMAL(10,2),
    width_in DECIMAL(10,2),

    sku VARCHAR(100) UNIQUE,

    -- Kept for compatibility with the existing product query.
    -- Multiple images are stored in product_media.
    product_image VARCHAR(500),

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_products_supplier
        FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_products_category
        FOREIGN KEY (category_id) REFERENCES categories(category_id)
        ON DELETE SET NULL,

    CONSTRAINT chk_product_price
        CHECK (price >= 0),

    CONSTRAINT chk_product_compare_price
        CHECK (compare_price IS NULL OR compare_price >= 0),

    CONSTRAINT chk_product_weight
        CHECK (weight_kg IS NULL OR weight_kg >= 0),

    CONSTRAINT chk_product_dimensions
        CHECK (
            (length_in IS NULL OR length_in >= 0)
            AND (breadth_in IS NULL OR breadth_in >= 0)
            AND (width_in IS NULL OR width_in >= 0)
        )
);

-- ============================================================
-- 8. PRODUCT MEDIA
-- Multiple images/videos per product.
-- ============================================================

CREATE TABLE product_media (
    media_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    media_url VARCHAR(500) NOT NULL,
    media_type ENUM('image','video') NOT NULL DEFAULT 'image',
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INT NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_product_media_product
        FOREIGN KEY (product_id) REFERENCES products(product_id)
        ON DELETE CASCADE
);

-- ============================================================
-- 9. PRODUCT VARIANTS
-- ============================================================

CREATE TABLE product_variants (
    variant_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    variant_name VARCHAR(100) NOT NULL,
    variant_value VARCHAR(150) NOT NULL,
    sku VARCHAR(100) UNIQUE,
    price DECIMAL(10,2),
    quantity INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_product_variants_product
        FOREIGN KEY (product_id) REFERENCES products(product_id)
        ON DELETE CASCADE,

    CONSTRAINT chk_variant_quantity
        CHECK (quantity >= 0),

    CONSTRAINT chk_variant_price
        CHECK (price IS NULL OR price >= 0)
);

-- ============================================================
-- 10. INVENTORY
-- ============================================================

CREATE TABLE inventory (
    inventory_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL UNIQUE,
    quantity INT NOT NULL DEFAULT 0,
    low_stock_threshold INT NOT NULL DEFAULT 10,
    last_restocked DATE NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_inventory_product
        FOREIGN KEY (product_id) REFERENCES products(product_id)
        ON DELETE CASCADE,

    CONSTRAINT chk_inventory_quantity
        CHECK (quantity >= 0),

    CONSTRAINT chk_inventory_threshold
        CHECK (low_stock_threshold >= 0)
);

-- ============================================================
-- 11. ORDERS
-- ============================================================

CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    buyer_id INT NOT NULL,
    supplier_id INT NOT NULL,
    order_number VARCHAR(50) NOT NULL UNIQUE,

    status ENUM(
        'Pending',
        'Processing',
        'Shipped',
        'Out for delivery',
        'Delivered',
        'Cancelled'
    ) NOT NULL DEFAULT 'Pending',

    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,

    ordered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_orders_buyer
        FOREIGN KEY (buyer_id) REFERENCES buyers(buyer_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_orders_supplier
        FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id)
        ON DELETE CASCADE,

    CONSTRAINT chk_order_total
        CHECK (total_amount >= 0)
);

-- ============================================================
-- 12. ORDER ITEMS
-- ============================================================

CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_order_items_order
        FOREIGN KEY (order_id) REFERENCES orders(order_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_order_items_product
        FOREIGN KEY (product_id) REFERENCES products(product_id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_order_item_quantity
        CHECK (quantity > 0),

    CONSTRAINT chk_order_item_price
        CHECK (unit_price >= 0),

    CONSTRAINT chk_order_item_subtotal
        CHECK (subtotal >= 0)
);

-- ============================================================
-- 13. REORDER REQUESTS
-- ============================================================

CREATE TABLE reorder_requests (
    reorder_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    requested_quantity INT NOT NULL DEFAULT 0,

    status ENUM(
        'Pending',
        'Confirmed',
        'Ordered',
        'Received',
        'Cancelled'
    ) NOT NULL DEFAULT 'Pending',

    requested_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expected_date DATE NULL,
    received_at DATETIME NULL,
    notes TEXT,

    CONSTRAINT fk_reorder_requests_product
        FOREIGN KEY (product_id) REFERENCES products(product_id)
        ON DELETE CASCADE,

    CONSTRAINT chk_reorder_quantity
        CHECK (requested_quantity > 0)
);

-- ============================================================
-- 14. STOCK MOVEMENTS
-- ============================================================

CREATE TABLE stock_movements (
    movement_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,

    movement_type ENUM(
        'Purchase',
        'Sale',
        'Adjustment',
        'Return',
        'Damaged'
    ) NOT NULL,

    quantity INT NOT NULL,
    reference_type VARCHAR(50),
    reference_id INT NULL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_stock_movements_product
        FOREIGN KEY (product_id) REFERENCES products(product_id)
        ON DELETE CASCADE,

    CONSTRAINT chk_stock_movement_quantity
        CHECK (quantity > 0)
);

-- ============================================================
-- 15. DELIVERIES
-- ============================================================

CREATE TABLE deliveries (
    delivery_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL UNIQUE,

    delivery_method VARCHAR(100)
        NOT NULL DEFAULT 'Courier - own fleet',

    courier_name VARCHAR(100),
    tracking_reference VARCHAR(100),

    current_status ENUM(
        'Preparing Dispatch',
        'Dispatched',
        'In Transit',
        'Out for Delivery',
        'Delivered',
        'Delayed',
        'Cancelled'
    ) NOT NULL DEFAULT 'Preparing Dispatch',

    estimated_arrival VARCHAR(100),
    dispatched_at DATETIME,
    delivered_at DATETIME,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_deliveries_order
        FOREIGN KEY (order_id) REFERENCES orders(order_id)
        ON DELETE CASCADE
);

-- ============================================================
-- 16. DELIVERY LOCATIONS
-- ============================================================

CREATE TABLE delivery_locations (
    location_id INT AUTO_INCREMENT PRIMARY KEY,
    delivery_id INT NOT NULL,

    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,

    location_description VARCHAR(255),
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_locations_delivery
        FOREIGN KEY (delivery_id) REFERENCES deliveries(delivery_id)
        ON DELETE CASCADE
);

-- ============================================================
-- 17. REVIEWS
-- ============================================================

CREATE TABLE reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    buyer_id INT NOT NULL,
    product_id INT NOT NULL,
    order_id INT,

    rating TINYINT NOT NULL,
    review_text TEXT NOT NULL,

    status ENUM('Published','Hidden','Pending')
        NOT NULL DEFAULT 'Published',

    review_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_review_rating
        CHECK (rating BETWEEN 1 AND 5),

    CONSTRAINT fk_reviews_buyer
        FOREIGN KEY (buyer_id) REFERENCES buyers(buyer_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_reviews_product
        FOREIGN KEY (product_id) REFERENCES products(product_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_reviews_order
        FOREIGN KEY (order_id) REFERENCES orders(order_id)
        ON DELETE SET NULL
);

-- ============================================================
-- 18. REVIEW REPLIES
-- ============================================================

CREATE TABLE review_replies (
    reply_id INT AUTO_INCREMENT PRIMARY KEY,
    review_id INT NOT NULL,
    supplier_id INT NOT NULL,
    reply_text TEXT NOT NULL,

    replied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_review_replies_review
        FOREIGN KEY (review_id) REFERENCES reviews(review_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_review_replies_supplier
        FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id)
        ON DELETE CASCADE
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_products_supplier ON products(supplier_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_subcategory ON products(subcategory);

CREATE INDEX idx_product_media_product ON product_media(product_id);
CREATE INDEX idx_product_media_primary ON product_media(is_primary);

CREATE INDEX idx_product_variants_product ON product_variants(product_id);

CREATE INDEX idx_inventory_quantity ON inventory(quantity);
CREATE INDEX idx_inventory_threshold ON inventory(low_stock_threshold);

CREATE INDEX idx_orders_supplier ON orders(supplier_id);
CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_date ON orders(ordered_at);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

CREATE INDEX idx_reorder_requests_product ON reorder_requests(product_id);
CREATE INDEX idx_reorder_requests_status ON reorder_requests(status);
CREATE INDEX idx_reorder_requests_date ON reorder_requests(requested_at);

CREATE INDEX idx_stock_movements_product ON stock_movements(product_id);
CREATE INDEX idx_stock_movements_type ON stock_movements(movement_type);
CREATE INDEX idx_stock_movements_date ON stock_movements(created_at);

CREATE INDEX idx_deliveries_status ON deliveries(current_status);

CREATE INDEX idx_delivery_locations_delivery ON delivery_locations(delivery_id);
CREATE INDEX idx_delivery_locations_date ON delivery_locations(recorded_at);

CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_buyer ON reviews(buyer_id);
CREATE INDEX idx_reviews_order ON reviews(order_id);
CREATE INDEX idx_reviews_status ON reviews(status);

CREATE INDEX idx_review_replies_review ON review_replies(review_id);
CREATE INDEX idx_review_replies_supplier ON review_replies(supplier_id);

-- ============================================================
-- INSERT DATA
-- ============================================================

-- Demo password for all accounts: password
INSERT INTO users
    (user_id, email, password_hash, user_role, is_active)
VALUES
    (1, 'supplier@weconnect.co.za', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'supplier', TRUE),
    (2, 'buyer@weconnect.co.za',    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'buyer', TRUE),
    (3, 'admin@weconnect.co.za',    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin', TRUE);

-- Category names match AddProducts.vue in zanda-dev.
INSERT INTO categories
    (category_id, category_name, description)
VALUES
    (1, 'Health & Medicine', 'Healthcare, medical and wellness products'),
    (2, 'Beauty', 'Beauty, skincare and personal care products'),
    (3, 'Eco-friendly Packaging', 'Environmentally friendly packaging products'),
    (4, 'Food & Beverage', 'Food, beverages and related products'),
    (5, 'Cleaning Supplies', 'Commercial and household cleaning supplies'),
    (6, 'Office Supplies', 'Office and workplace supplies'),
    (7, 'Shipping Supplies', 'Packaging and shipping materials');

INSERT INTO buyers
    (buyer_id, user_id, business_name, email, category_id, phone,
     address, city, province, postal_code)
VALUES
    (1, 2, 'Cape Business Supplies', 'buyer@weconnect.co.za', 6,
     '+27 21 555 0101', '20 Main Road', 'Cape Town',
     'Western Cape', '8001');

INSERT INTO suppliers
    (supplier_id, user_id, business_name, email, phone, address,
     city, province, postal_code, logo_url, is_verified, is_featured,
     quick_delivery, min_order_value, lead_time_days)
VALUES
    (1, 1, 'WeConnect Supplies', 'supplier@weconnect.co.za',
     '+27 11 555 0100', '100 Business Park', 'Johannesburg',
     'Gauteng', '2000',
     'https://placehold.co/300x100?text=WeConnect+Supplies',
     TRUE, TRUE, TRUE, 500.00, 2);

INSERT INTO subscription_plans
    (plan_id, plan_name, monthly_price, max_products, description)
VALUES
    (1, 'Starter', 0.00, 10, 'Free supplier plan for small catalogs'),
    (2, 'Business', 299.00, 100, 'Business plan for growing suppliers'),
    (3, 'Enterprise', 799.00, 1000, 'Large supplier plan with a high product limit');

INSERT INTO supplier_subscriptions
    (subscription_id, supplier_id, plan_id, status, start_date, end_date)
VALUES
    (1, 1, 2, 'Active', CURDATE(), NULL);

-- ============================================================
-- PRODUCTS
-- ============================================================

INSERT INTO products
    (product_id, supplier_id, category_id, product_name, subcategory,
     description, price, compare_price, unit, selling_type, weight_kg,
     length_in, breadth_in, width_in, sku, product_image, is_active)
VALUES
    (1, 1, 3, 'Eco Kraft Food Boxes', 'Packaging',
     'Durable recyclable kraft food boxes suitable for restaurants and takeaway businesses.',
     89.99, 119.99, 'pack', 'both', 1.50,
     12.00, 10.00, 8.00, 'ECO-KRAFT-001',
     'https://placehold.co/800x800?text=Eco+Kraft+Boxes', TRUE),

    (2, 1, 2, 'Natural Body Lotion', 'Beauty',
     'Moisturising natural body lotion for everyday skincare.',
     149.99, 199.99, 'bottle', 'online-only', 0.75,
     8.00, 4.00, 4.00, 'BEAUTY-LOT-001',
     'https://placehold.co/800x800?text=Body+Lotion', TRUE),

    (3, 1, 5, 'Commercial Surface Cleaner', 'Cleaning',
     'Professional-grade surface cleaner for offices and businesses.',
     129.99, 159.99, 'bottle', 'both', 1.00,
     10.00, 5.00, 5.00, 'CLEAN-SURF-001',
     'https://placehold.co/800x800?text=Surface+Cleaner', TRUE),

    (4, 1, 6, 'Premium Office Notebook', 'Stationery',
     'Hardcover notebook suitable for office notes and meetings.',
     79.99, 99.99, 'each', 'both', 0.45,
     9.00, 7.00, 1.00, 'OFFICE-NOTE-001',
     'https://placehold.co/800x800?text=Office+Notebook', TRUE),

    (5, 1, 7, 'Recyclable Shipping Mailers', 'Shipping',
     'Recyclable mailing bags for ecommerce shipments.',
     119.99, 149.99, 'pack', 'online-only', 0.80,
     14.00, 10.00, 2.00, 'SHIP-MAIL-001',
     'https://placehold.co/800x800?text=Shipping+Mailer', TRUE);

-- ============================================================
-- INVENTORY
-- ============================================================

INSERT INTO inventory
    (inventory_id, product_id, quantity, low_stock_threshold, last_restocked)
VALUES
    (1, 1, 150, 30, CURDATE()),
    (2, 2, 45, 10, CURDATE()),
    (3, 3, 8, 15, CURDATE()),
    (4, 4, 0, 10, CURDATE()),
    (5, 5, 72, 20, CURDATE());

-- ============================================================
-- PRODUCT MEDIA
-- ============================================================

INSERT INTO product_media
    (media_id, product_id, media_url, media_type, is_primary, sort_order)
VALUES
    (1, 1, 'https://placehold.co/800x800?text=Kraft+Box+Front', 'image', TRUE, 1),
    (2, 1, 'https://placehold.co/800x800?text=Kraft+Box+Side', 'image', FALSE, 2),
    (3, 1, 'https://placehold.co/800x800?text=Kraft+Box+Packaging', 'image', FALSE, 3),
    (4, 2, 'https://placehold.co/800x800?text=Body+Lotion+Front', 'image', TRUE, 1),
    (5, 2, 'https://placehold.co/800x800?text=Body+Lotion+Back', 'image', FALSE, 2),
    (6, 3, 'https://placehold.co/800x800?text=Surface+Cleaner', 'image', TRUE, 1),
    (7, 4, 'https://placehold.co/800x800?text=Office+Notebook', 'image', TRUE, 1),
    (8, 5, 'https://placehold.co/800x800?text=Shipping+Mailer', 'image', TRUE, 1);

-- ============================================================
-- PRODUCT VARIANTS
-- ============================================================

INSERT INTO product_variants
    (variant_id, product_id, variant_name, variant_value, sku,
     price, quantity, is_active)
VALUES
    (1, 1, 'Size', 'Small', 'ECO-KRAFT-S', 69.99, 60, TRUE),
    (2, 1, 'Size', 'Large', 'ECO-KRAFT-L', 109.99, 90, TRUE),
    (3, 2, 'Size', '250ml', 'BEAUTY-LOT-250', 149.99, 25, TRUE),
    (4, 2, 'Size', '500ml', 'BEAUTY-LOT-500', 229.99, 20, TRUE);

-- ============================================================
-- ORDERS
-- ============================================================

INSERT INTO orders
    (order_id, buyer_id, supplier_id, order_number, status,
     total_amount, ordered_at)
VALUES
    (1, 1, 1, 'WC-2026-0001', 'Delivered', 269.97,
     DATE_SUB(NOW(), INTERVAL 10 DAY)),
    (2, 1, 1, 'WC-2026-0002', 'Processing', 389.97,
     DATE_SUB(NOW(), INTERVAL 2 DAY)),
    (3, 1, 1, 'WC-2026-0003', 'Pending', 239.98, NOW());

-- ============================================================
-- ORDER ITEMS
-- ============================================================

INSERT INTO order_items
    (order_item_id, order_id, product_id, quantity,
     unit_price, subtotal)
VALUES
    (1, 1, 1, 2, 89.99, 179.98),
    (2, 1, 2, 1, 89.99, 89.99),
    (3, 2, 2, 1, 149.99, 149.99),
    (4, 2, 3, 1, 129.99, 129.99),
    (5, 2, 4, 1, 79.99, 79.99),
    (6, 2, 5, 1, 30.00, 30.00),
    (7, 3, 1, 1, 89.99, 89.99),
    (8, 3, 5, 1, 119.99, 119.99),
    (9, 3, 3, 1, 30.00, 30.00);

-- ============================================================
-- REORDER REQUESTS
-- ============================================================

INSERT INTO reorder_requests
    (reorder_id, product_id, requested_quantity, status,
     expected_date, notes)
VALUES
    (1, 3, 50, 'Pending',
     DATE_ADD(CURDATE(), INTERVAL 5 DAY),
     'Restock because inventory is below threshold.'),
    (2, 4, 100, 'Confirmed',
     DATE_ADD(CURDATE(), INTERVAL 7 DAY),
     'Notebook restock confirmed.');

-- ============================================================
-- STOCK MOVEMENTS
-- ============================================================

INSERT INTO stock_movements
    (movement_id, product_id, movement_type, quantity,
     reference_type, reference_id, notes)
VALUES
    (1, 1, 'Purchase', 200, 'Initial Stock', NULL,
     'Initial product inventory'),
    (2, 1, 'Sale', 50, 'Order', 1,
     'Stock sold through order WC-2026-0001'),
    (3, 2, 'Purchase', 60, 'Initial Stock', NULL,
     'Initial product inventory'),
    (4, 2, 'Sale', 15, 'Order', 2,
     'Stock sold through order WC-2026-0002'),
    (5, 3, 'Purchase', 20, 'Initial Stock', NULL,
     'Initial product inventory'),
    (6, 3, 'Sale', 12, 'Order', 2,
     'Stock sold through order WC-2026-0002'),
    (7, 4, 'Purchase', 25, 'Initial Stock', NULL,
     'Initial product inventory');

-- ============================================================
-- DELIVERIES
-- ============================================================

INSERT INTO deliveries
    (delivery_id, order_id, delivery_method, courier_name,
     tracking_reference, current_status, estimated_arrival,
     dispatched_at, delivered_at)
VALUES
    (1, 1, 'Courier - own fleet', 'WeConnect Courier',
     'WC-TRK-0001', 'Delivered', 'Delivered',
     DATE_SUB(NOW(), INTERVAL 8 DAY),
     DATE_SUB(NOW(), INTERVAL 7 DAY)),

    (2, 2, 'Courier - partner', 'FastRoute Logistics',
     'WC-TRK-0002', 'In Transit', 'Tomorrow',
     DATE_SUB(NOW(), INTERVAL 1 DAY), NULL),

    (3, 3, 'Courier - own fleet', 'WeConnect Courier',
     'WC-TRK-0003', 'Preparing Dispatch',
     'Within 3 business days', NULL, NULL);

-- ============================================================
-- DELIVERY LOCATIONS
-- ============================================================

INSERT INTO delivery_locations
    (location_id, delivery_id, latitude, longitude, location_description)
VALUES
    (1, 1, -33.92490000, 18.42410000, 'Cape Town delivery point'),
    (2, 2, -26.20410000, 28.04730000, 'Johannesburg distribution centre'),
    (3, 3, -26.10760000, 28.05670000, 'Supplier dispatch point');

-- ============================================================
-- REVIEWS
-- ============================================================

INSERT INTO reviews
    (review_id, buyer_id, product_id, order_id, rating,
     review_text, status)
VALUES
    (1, 1, 1, 1, 5,
     'Excellent quality packaging and fast delivery.', 'Published'),
    (2, 1, 2, 2, 4,
     'Good product and the packaging was secure.', 'Published'),
    (3, 1, 3, 2, 5,
     'Very effective cleaner for our office.', 'Published');

-- ============================================================
-- REVIEW REPLIES
-- ============================================================

INSERT INTO review_replies
    (reply_id, review_id, supplier_id, reply_text)
VALUES
    (1, 1, 1,
     'Thank you for your feedback. We are glad the packaging worked well for your business.'),
    (2, 2, 1,
     'Thank you for the review. We appreciate your order.'),
    (3, 3, 1,
     'Thank you. We are pleased the cleaner met your expectations.');

-- ============================================================
-- FINISH + VERIFICATION
-- ============================================================

SET FOREIGN_KEY_CHECKS = 1;

SELECT 'users' AS table_name, COUNT(*) AS rows_count FROM users
UNION ALL SELECT 'categories', COUNT(*) FROM categories
UNION ALL SELECT 'buyers', COUNT(*) FROM buyers
UNION ALL SELECT 'suppliers', COUNT(*) FROM suppliers
UNION ALL SELECT 'subscription_plans', COUNT(*) FROM subscription_plans
UNION ALL SELECT 'supplier_subscriptions', COUNT(*) FROM supplier_subscriptions
UNION ALL SELECT 'products', COUNT(*) FROM products
UNION ALL SELECT 'product_media', COUNT(*) FROM product_media
UNION ALL SELECT 'product_variants', COUNT(*) FROM product_variants
UNION ALL SELECT 'inventory', COUNT(*) FROM inventory
UNION ALL SELECT 'orders', COUNT(*) FROM orders
UNION ALL SELECT 'order_items', COUNT(*) FROM order_items
UNION ALL SELECT 'reorder_requests', COUNT(*) FROM reorder_requests
UNION ALL SELECT 'stock_movements', COUNT(*) FROM stock_movements
UNION ALL SELECT 'deliveries', COUNT(*) FROM deliveries
UNION ALL SELECT 'delivery_locations', COUNT(*) FROM delivery_locations
UNION ALL SELECT 'reviews', COUNT(*) FROM reviews
UNION ALL SELECT 'review_replies', COUNT(*) FROM review_replies;

SELECT
    p.product_id,
    p.product_name,
    c.category_name,
    p.price,
    p.compare_price,
    i.quantity,
    i.low_stock_threshold,
    p.product_image
FROM products p
LEFT JOIN categories c ON p.category_id = c.category_id
LEFT JOIN inventory i ON p.product_id = i.product_id
ORDER BY p.product_id;
