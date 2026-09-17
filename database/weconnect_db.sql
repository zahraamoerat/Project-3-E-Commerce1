CREATE DATABASE IF NOT EXISTS weconnect_db;
USE weconnect_db;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. CENTRAL AUTHENTICATION
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    user_role ENUM('buyer', 'supplier', 'admin') NOT NULL DEFAULT 'buyer',
    is_active BOOLEAN DEFAULT TRUE,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. CATEGORIES
DROP TABLE IF EXISTS categories;
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. BUYERS
DROP TABLE IF EXISTS buyers;
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
    description TEXT,
    registration_number VARCHAR(50) UNIQUE,
    contact_person VARCHAR(100),
    is_verified BOOLEAN DEFAULT FALSE,
    approval_status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    approved_at DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_buyers_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_buyers_category FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL
);

-- 4. SUPPLIERS
DROP TABLE IF EXISTS suppliers;
CREATE TABLE suppliers (
    supplier_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    business_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(30),
    address VARCHAR(255),
    city VARCHAR(100),
    province VARCHAR(100),
    postal_code VARCHAR(20),
    logo_url VARCHAR(500),
    is_verified BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    quick_delivery BOOLEAN DEFAULT FALSE,
    min_order_value DECIMAL(10,2) DEFAULT 0.00,
    lead_time_days INT DEFAULT 1,
    approval_status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    approved_at DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_suppliers_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 5. SUBSCRIPTION PLANS & SUPPLIER SUBSCRIPTIONS
DROP TABLE IF EXISTS subscription_plans;
CREATE TABLE subscription_plans (
    plan_id INT AUTO_INCREMENT PRIMARY KEY,
    plan_name VARCHAR(100) NOT NULL,
    monthly_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    max_products INT NOT NULL DEFAULT 10,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS supplier_subscriptions;
CREATE TABLE supplier_subscriptions (
    subscription_id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_id INT NOT NULL,
    plan_id INT NOT NULL,
    status ENUM('Active', 'Past_Due', 'Canceled', 'Pending') DEFAULT 'Active',
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_subscriptions_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE CASCADE,
    CONSTRAINT fk_subscriptions_plan FOREIGN KEY (plan_id) REFERENCES subscription_plans(plan_id) ON DELETE RESTRICT
);

-- 6. PRODUCTS & CART ITEMS
DROP TABLE IF EXISTS products;
CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_id INT NOT NULL,
    category_id INT,
    product_name VARCHAR(150) NOT NULL,
    description TEXT,
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    stock_quantity INT NOT NULL DEFAULT 0,
    low_stock_threshold INT DEFAULT 20,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    image_url VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_products_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE CASCADE,
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL
);

DROP TABLE IF EXISTS cart_items;
CREATE TABLE cart_items (
    cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
    buyer_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_cart_buyer FOREIGN KEY (buyer_id) REFERENCES buyers(buyer_id) ON DELETE CASCADE,
    CONSTRAINT fk_cart_product FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- 7. ORDERS & ORDER ITEMS
DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    buyer_id INT NOT NULL,
    supplier_id INT NOT NULL,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    order_status ENUM('Pending', 'Confirmed', 'Processing', 'Dispatched', 'Out for delivery', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Pending',
    total_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_orders_buyer FOREIGN KEY (buyer_id) REFERENCES buyers(buyer_id) ON DELETE CASCADE,
    CONSTRAINT fk_orders_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS order_items;
CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    subtotal DECIMAL(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- 8. PAYMENTS & PAYMENT METHODS
DROP TABLE IF EXISTS payment_methods;
CREATE TABLE payment_methods (
    method_id INT AUTO_INCREMENT PRIMARY KEY,
    method_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

DROP TABLE IF EXISTS payments;
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    method_id INT,
    amount DECIMAL(12,2) NOT NULL,
    payment_status ENUM('Pending', 'Completed', 'Overdue', 'Failed') DEFAULT 'Pending',
    transaction_reference VARCHAR(150),
    due_date DATETIME,
    paid_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_payments_order FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    CONSTRAINT fk_payments_method FOREIGN KEY (method_id) REFERENCES payment_methods(method_id) ON DELETE SET NULL
);

-- 9. DELIVERIES & GPS TRACKING
DROP TABLE IF EXISTS deliveries;
CREATE TABLE deliveries (
    delivery_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL UNIQUE,
    courier_name VARCHAR(100),
    tracking_reference VARCHAR(100),
    current_status VARCHAR(100) DEFAULT 'Preparing Dispatch',
    estimated_arrival VARCHAR(100),
    dispatched_at DATETIME,
    delivered_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_deliveries_order FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS delivery_locations;
CREATE TABLE delivery_locations (
    location_id INT AUTO_INCREMENT PRIMARY KEY,
    delivery_id INT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    location_description VARCHAR(255),
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_locations_delivery FOREIGN KEY (delivery_id) REFERENCES deliveries(delivery_id) ON DELETE CASCADE
);

-- 10. REVIEWS & SUPPLIER REPLIES
DROP TABLE IF EXISTS reviews;
CREATE TABLE reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    buyer_id INT NOT NULL,
    product_id INT NOT NULL,
    order_id INT,
    rating TINYINT NOT NULL,
    review_text TEXT NOT NULL,
    status ENUM('Published', 'Hidden', 'Pending') DEFAULT 'Published',
    review_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_review_rating CHECK (rating BETWEEN 1 AND 5),
    CONSTRAINT fk_reviews_buyer FOREIGN KEY (buyer_id) REFERENCES buyers(buyer_id) ON DELETE CASCADE,
    CONSTRAINT fk_reviews_product FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    CONSTRAINT fk_reviews_order FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE SET NULL
);

DROP TABLE IF EXISTS review_replies;
CREATE TABLE review_replies (
    reply_id INT AUTO_INCREMENT PRIMARY KEY,
    review_id INT NOT NULL,
    supplier_id INT NOT NULL,
    reply_text TEXT NOT NULL,
    replied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_review_replies_review FOREIGN KEY (review_id) REFERENCES reviews(review_id) ON DELETE CASCADE,
    CONSTRAINT fk_review_replies_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE CASCADE
);

-- 11. MESSAGING
DROP TABLE IF EXISTS conversations;
CREATE TABLE conversations (
    conversation_id INT AUTO_INCREMENT PRIMARY KEY,
    buyer_id INT NOT NULL,
    supplier_id INT NOT NULL,
    last_message_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_conv_buyer FOREIGN KEY (buyer_id) REFERENCES buyers(buyer_id) ON DELETE CASCADE,
    CONSTRAINT fk_conv_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS messages;
CREATE TABLE messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    conversation_id INT NOT NULL,
    sender_id INT NOT NULL,
    message_text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_messages_conversation FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id) ON DELETE CASCADE,
    CONSTRAINT fk_messages_sender FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 12. NOTIFICATIONS & ADMIN MESSAGES
DROP TABLE IF EXISTS notifications;
CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS admin_messages;
CREATE TABLE admin_messages (
    admin_message_id INT AUTO_INCREMENT PRIMARY KEY,
    sender_admin_id INT NOT NULL,
    recipient_user_id INT NOT NULL,
    subject VARCHAR(150) NOT NULL,
    message_text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_admin_msg_sender FOREIGN KEY (sender_admin_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_admin_msg_recipient FOREIGN KEY (recipient_user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- PERFORMANCE INDEXES
CREATE INDEX idx_products_supplier ON products(supplier_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_orders_supplier ON orders(supplier_id);

SET FOREIGN_KEY_CHECKS = 1;

-- SEED INITIAL ADMIN ACCOUNT (Password: AdminPassword123!)
INSERT INTO users (email, password_hash, user_role, is_active, is_approved)
VALUES ('admin@weconnect.co.za', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQOEg6Lruj3vjPGga31lW', 'admin', TRUE, TRUE);



-- INSERTING DUMMY DATA

USE weconnect_db;

SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------
-- 1. CATEGORIES
-- ------------------------------------------------------------
TRUNCATE TABLE categories;
INSERT INTO categories (category_id, category_name, description) VALUES
(1, 'Beverages & Soft Drinks', 'Wholesale juices, sodas, hot drinks, and bottled water.'),
(2, 'Fresh Produce & Farming', 'Locally sourced fresh fruits, vegetables, and herbs.'),
(3, 'Meat & Poultry', 'Quality butchery, processed meats, and poultry cuts.'),
(4, 'Packaging & Disposables', 'Eco-friendly take-away containers, boxes, and cutlery.'),
(5, 'Dairy & Refrigerated', 'Cheeses, milk, yogurts, and butter for bulk commercial use.');

-- ------------------------------------------------------------
-- 2. CENTRAL USERS (1 Admin + 10 Suppliers + 4 Buyers)
-- Passwords set to hashed string for: Password123!
-- ------------------------------------------------------------
TRUNCATE TABLE users;
INSERT INTO users (user_id, email, password_hash, user_role, is_active, is_approved) VALUES
-- Admin (ID 1)
(1, 'admin@weconnect.co.za', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQOEg6Lruj3vjPGga31lW', 'admin', TRUE, TRUE),

-- Suppliers (IDs 2 - 11)
(2, 'contact@capebeverages.co.za', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQOEg6Lruj3vjPGga31lW', 'supplier', TRUE, TRUE),
(3, 'sales@bolandfarms.co.za', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQOEg6Lruj3vjPGga31lW', 'supplier', TRUE, TRUE),
(4, 'info@paarlpackaging.co.za', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQOEg6Lruj3vjPGga31lW', 'supplier', TRUE, TRUE),
(5, 'orders@winelandsmeats.co.za', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQOEg6Lruj3vjPGga31lW', 'supplier', TRUE, TRUE),
(6, 'hello@tablemountaindairy.co.za', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQOEg6Lruj3vjPGga31lW', 'supplier', TRUE, TRUE),
(7, 'supplies@karooorganics.co.za', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQOEg6Lruj3vjPGga31lW', 'supplier', TRUE, TRUE),
(8, 'sales@ecopackza.co.za', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQOEg6Lruj3vjPGga31lW', 'supplier', TRUE, TRUE),
(9, 'contact@atlanticseafood.co.za', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQOEg6Lruj3vjPGga31lW', 'supplier', TRUE, TRUE),
(10, 'orders@stellenboschbakery.co.za', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQOEg6Lruj3vjPGga31lW', 'supplier', TRUE, TRUE),
(11, 'info@overbergpoultry.co.za', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQOEg6Lruj3vjPGga31lW', 'supplier', TRUE, TRUE),

-- Buyers (IDs 12 - 15)
(12, 'manager@woodstockcafe.co.za', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQOEg6Lruj3vjPGga31lW', 'buyer', TRUE, TRUE),
(13, 'procurement@campsbayhotel.co.za', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQOEg6Lruj3vjPGga31lW', 'buyer', TRUE, TRUE),
(14, 'owner@bo-kaapkitchen.co.za', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQOEg6Lruj3vjPGga31lW', 'buyer', TRUE, TRUE),
(15, 'purchasing@bellvilleeatery.co.za', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQOEg6Lruj3vjPGga31lW', 'buyer', TRUE, TRUE);

-- ------------------------------------------------------------
-- 3. SUPPLIER PROFILES (10 Suppliers)
-- ------------------------------------------------------------
TRUNCATE TABLE suppliers;
INSERT INTO suppliers 
(supplier_id, user_id, first_name, last_name, business_name, email, phone, address, city, province, postal_code, is_verified, is_featured, quick_delivery, min_order_value, lead_time_days, approval_status, approved_at) VALUES
(1, 2, 'Johan', 'Van Der Merwe', 'Cape Beverages Wholesale', 'contact@capebeverages.co.za', '0215551001', '12 Industrial Way', 'Cape Town', 'Western Cape', '8001', TRUE, TRUE, TRUE, 500.00, 1, 'Approved', NOW()),
(2, 3, 'Sipho', 'Dlamini', 'Boland Fresh Produce', 'sales@bolandfarms.co.za', '0215551002', 'Farm 42 Main Road', 'Paarl', 'Western Cape', '7646', TRUE, TRUE, FALSE, 800.00, 2, 'Approved', NOW()),
(3, 4, 'Anika', 'Botha', 'Paarl Eco Packaging', 'info@paarlpackaging.co.za', '0215551003', '88 Plant Street', 'Paarl', 'Western Cape', '7620', FALSE, FALSE, TRUE, 350.00, 1, 'Approved', NOW()),
(4, 5, 'Lian', 'Chen', 'Winelands Quality Meats', 'orders@winelandsmeats.co.za', '0215551004', '45 Abattoir Lane', 'Stellenbosch', 'Western Cape', '7600', TRUE, FALSE, FALSE, 1200.00, 3, 'Approved', NOW()),
(5, 6, 'Sarah', 'Jenkins', 'Table Mountain Dairy Co.', 'hello@tablemountaindairy.co.za', '0215551005', '10 Milk Depot Rd', 'Milnerton', 'Western Cape', '7441', TRUE, TRUE, TRUE, 400.00, 1, 'Approved', NOW()),
(6, 7, 'Gideon', 'Smit', 'Karoo Organics', 'supplies@karooorganics.co.za', '0215551006', 'Plot 11 Valley Way', 'Worcester', 'Western Cape', '6850', FALSE, FALSE, FALSE, 650.00, 2, 'Approved', NOW()),
(7, 8, 'Fatima', 'Patel', 'EcoPack South Africa', 'sales@ecopackza.co.za', '0215551007', '22 Supply Hub Ave', 'Epping', 'Western Cape', '7460', TRUE, FALSE, TRUE, 300.00, 1, 'Approved', NOW()),
(8, 9, 'Mark', 'Taylor', 'Atlantic Seafood Suppliers', 'contact@atlanticseafood.co.za', '0215551008', 'Quay 5 Harbor Rd', 'Hout Bay', 'Western Cape', '7806', TRUE, TRUE, FALSE, 1500.00, 1, 'Approved', NOW()),
(9, 10, 'Marie', 'Du Toit', 'Stellenbosch Craft Bakers', 'orders@stellenboschbakery.co.za', '0215551009', '3 Bakery Street', 'Stellenbosch', 'Western Cape', '7600', FALSE, FALSE, TRUE, 250.00, 1, 'Approved', NOW()),
(10, 11, 'Thabo', 'Mokoena', 'Overberg Free Range Poultry', 'info@overbergpoultry.co.za', '0215551010', 'Route 43 Farmstead', 'Caledon', 'Western Cape', '7230', TRUE, FALSE, FALSE, 900.00, 2, 'Approved', NOW());

-- ------------------------------------------------------------
-- 4. BUYER PROFILES (4 Buyers)
-- ------------------------------------------------------------
TRUNCATE TABLE buyers;
INSERT INTO buyers 
(buyer_id, user_id, business_name, email, category_id, phone, address, city, province, postal_code, registration_number, contact_person, is_verified, approval_status, approved_at) VALUES
(1, 12, 'The Woodstock Coffee House', 'manager@woodstockcafe.co.za', 1, '0214442001', '105 Albert Road', 'Woodstock', 'Western Cape', '7925', 'REG-2026-001', 'David Miller', TRUE, 'Approved', NOW()),
(2, 13, 'Camps Bay Grand Hotel', 'procurement@campsbayhotel.co.za', 1, '0214442002', '12 Victoria Road', 'Camps Bay', 'Western Cape', '8005', 'REG-2026-002', 'Elena Rostova', TRUE, 'Approved', NOW()),
(3, 14, 'Bo-Kaap Traditional Kitchen', 'owner@bo-kaapkitchen.co.za', 3, '0214442003', '44 Rose Street', 'Bo-Kaap', 'Western Cape', '8001', 'REG-2026-003', 'Amina Hendricks', TRUE, 'Approved', NOW()),
(4, 15, 'Bellville Family Diner', 'purchasing@bellvilleeatery.co.za', 1, '0214442004', '88 Voortrekker Rd', 'Bellville', 'Western Cape', '7535', 'REG-2026-004', 'Peter Adams', TRUE, 'Approved', NOW());

-- ------------------------------------------------------------
-- 5. SUBSCRIPTION PLANS & SUPPLIER SUBSCRIPTIONS
-- ------------------------------------------------------------
TRUNCATE TABLE subscription_plans;
INSERT INTO subscription_plans (plan_id, plan_name, monthly_price, max_products, description) VALUES
(1, 'Starter', 299.00, 15, 'Ideal for small suppliers listing basic produce.'),
(2, 'Growth', 699.00, 50, 'Standard plan with featured badge options.'),
(3, 'Enterprise', 1499.00, 200, 'Unlimited visibility, priority indexing, and quick delivery badges.');

TRUNCATE TABLE supplier_subscriptions;
INSERT INTO supplier_subscriptions (supplier_id, plan_id, status, start_date, end_date) VALUES
(1, 3, 'Active', '2026-01-01 00:00:00', '2026-12-31 23:59:59'),
(2, 2, 'Active', '2026-01-01 00:00:00', '2026-12-31 23:59:59'),
(3, 1, 'Active', '2026-02-01 00:00:00', '2026-12-31 23:59:59'),
(4, 2, 'Active', '2026-01-15 00:00:00', '2026-12-31 23:59:59'),
(5, 3, 'Active', '2026-01-01 00:00:00', '2026-12-31 23:59:59');

-- ------------------------------------------------------------
-- 6. PRODUCTS
-- ------------------------------------------------------------
TRUNCATE TABLE products;
INSERT INTO products (product_id, supplier_id, category_id, product_name, description, unit_price, stock_quantity, low_stock_threshold, status) VALUES
(1, 1, 1, 'Sparkling Apple Juice (24x330ml)', '100% pure Cape apple juice carbonated cases.', 280.00, 150, 20, 'Active'),
(2, 1, 1, 'Spring Water Bottles (48x500ml)', 'Still natural mountain spring water.', 195.00, 300, 50, 'Active'),
(3, 2, 2, 'Bulk Grade A Potatoes (10kg Bag)', 'Locally grown washed potatoes.', 85.00, 80, 15, 'Active'),
(4, 2, 2, 'Fresh Roma Tomatoes (5kg Box)', 'Ripe tomatoes suitable for culinary sauces.', 90.00, 40, 10, 'Active'),
(5, 3, 4, 'Compostable Coffee Cups (500 Pack)', 'Single wall eco-friendly 300ml cups.', 450.00, 25, 5, 'Active'),
(6, 4, 3, 'Prime Beef Sirloin (5kg Vacuum Pack)', 'A-Grade aged South African beef sirloin.', 650.00, 18, 5, 'Active'),
(7, 5, 5, 'Commercial Cheddar Cheese Block (2.5kg)', 'Full cream matured cheddar.', 210.00, 60, 10, 'Active');

-- ------------------------------------------------------------
-- 7. ORDERS & ORDER ITEMS
-- ------------------------------------------------------------
TRUNCATE TABLE orders;
INSERT INTO orders (order_id, buyer_id, supplier_id, order_number, order_status, total_amount, delivery_fee) VALUES
(1, 1, 1, 'ORD-2026-1001', 'Delivered', 755.00, 80.00),
(2, 2, 4, 'ORD-2026-1002', 'Dispatched', 1450.00, 150.00),
(3, 3, 2, 'ORD-2026-1003', 'Processing', 260.00, 80.00),
(4, 4, 5, 'ORD-2026-1004', 'Pending', 500.00, 80.00);

TRUNCATE TABLE order_items;
INSERT INTO order_items (order_item_id, order_id, product_id, quantity, unit_price) VALUES
(1, 1, 1, 2, 280.00), -- 2x Apple Juice = R560
(2, 1, 2, 1, 195.00), -- 1x Spring Water = R195
(3, 2, 6, 2, 650.00), -- 2x Beef Sirloin = R1300
(4, 3, 3, 2, 85.00),  -- 2x Potatoes = R170
(5, 3, 4, 1, 90.00),  -- 1x Tomatoes = R90
(6, 4, 7, 2, 210.00); -- 2x Cheddar Cheese = R420

-- ------------------------------------------------------------
-- 8. REVIEWS
-- ------------------------------------------------------------
TRUNCATE TABLE reviews;
INSERT INTO reviews (review_id, buyer_id, product_id, order_id, rating, review_text, status) VALUES
(1, 1, 1, 1, 5, 'Excellent delivery speed and juice quality was top notch for our cafe!', 'Published'),
(2, 3, 3, 3, 4, 'Potatoes were fresh and well packaged. Will reorder next week.', 'Published');

SET FOREIGN_KEY_CHECKS = 1;