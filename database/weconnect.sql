CREATE DATABASE IF NOT EXISTS weconnect;
USE weconnect;

SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------
-- 1. CENTRAL AUTHENTICATION (Prevents Email/Account Conflicts)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    user_role ENUM('buyer', 'supplier', 'admin') NOT NULL DEFAULT 'buyer',
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 2. CATEGORIES (Reused for Products & Business Category Dropdowns)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS categories;
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 3. BUYERS / BUSINESS PROFILES
-- ------------------------------------------------------------
DROP TABLE IF EXISTS buyers;
CREATE TABLE buyers (
    buyer_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,                         -- Foreign key to auth user
    business_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    category_id INT,                            -- Business category dropdown
    phone VARCHAR(30),
    address VARCHAR(255),
    city VARCHAR(100),
    province VARCHAR(100),
    postal_code VARCHAR(20),
    profile_image VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_buyers_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_buyers_category
        FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
        ON DELETE SET NULL
);

-- adding 'description', 'registration_number', 'contact_person' and 'is_verified' columns to the 'buyers' table.
ALTER TABLE `weconnect`.`buyers` 
ADD COLUMN `description` TEXT NULL DEFAULT NULL AFTER `updated_at`,
ADD COLUMN `registration_number` VARCHAR(50) NULL DEFAULT NULL AFTER `description`,
ADD COLUMN `contact_person` VARCHAR(100) NULL DEFAULT NULL AFTER `registration_number`,
ADD COLUMN `is_verified` BOOLEAN NULL DEFAULT FALSE AFTER `contact_person`,
ADD UNIQUE INDEX `registration_number_UNIQUE` (`registration_number` ASC) VISIBLE;

-- this will allow the registration number to be auto generated while also allowiing it to be unique
DELIMITER $$

CREATE TRIGGER before_buyer_insert
BEFORE INSERT ON `weconnect`.`buyers`
FOR EACH ROW
BEGIN
    IF NEW.registration_number IS NULL OR NEW.registration_number = '' THEN
        SET NEW.registration_number = UUID();
    END IF;
END$$

DELIMITER ;

-- Update buyers table to track approval state
ALTER TABLE buyers 
ADD COLUMN approval_status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
ADD COLUMN approved_at DATETIME NULL;

-- Update users table to prevent login before admin approval
ALTER TABLE users 
ADD COLUMN is_approved BOOLEAN DEFAULT FALSE;

ALTER TABLE users
ADD COLUMN must_change_password BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN auth_version INT UNSIGNED NOT NULL DEFAULT 0;

-- ------------------------------------------------------------
-- 4. SUPPLIERS
-- Includes Browse Filters & Dashboard flags
-- ------------------------------------------------------------
DROP TABLE IF EXISTS suppliers;
CREATE TABLE suppliers (
    supplier_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,                         -- Foreign key to auth user
    business_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(30),
    address VARCHAR(255),
    city VARCHAR(100),                         -- City filter
    province VARCHAR(100),
    postal_code VARCHAR(20),
    logo_url VARCHAR(500),

    -- Special Dashboard & Search Filter Flags
    is_verified BOOLEAN DEFAULT FALSE,         -- "Verified only" filter
    is_featured BOOLEAN DEFAULT FALSE,         -- "Suggested suppliers" dashboard card
    quick_delivery BOOLEAN DEFAULT FALSE,      -- "Quick delivery" badge
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    approval_status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    approved_at DATETIME NULL,
    min_order_value DECIMAL(10,2) DEFAULT 0.00, -- Minimum Order Value (ZAR)
    lead_time_days INT DEFAULT 1,              -- Lead time (e.g. 1-2 days)

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_suppliers_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
        
);


-- ------------------------------------------------------------
-- 5. SUPPLIER SUBSCRIPTIONS & BILLING (Pay-to-Sell)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS subscription_plans;
CREATE TABLE subscription_plans (
    plan_id INT AUTO_INCREMENT PRIMARY KEY,
    plan_name VARCHAR(100) NOT NULL,            -- e.g. 'Starter', 'Growth', 'Enterprise'
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

    CONSTRAINT fk_subscriptions_supplier
        FOREIGN KEY (supplier_id)
        REFERENCES suppliers(supplier_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_subscriptions_plan
        FOREIGN KEY (plan_id)
        REFERENCES subscription_plans(plan_id)
        ON DELETE RESTRICT
);

-- ------------------------------------------------------------
-- 6. PRODUCTS & SHOPPING CART
-- ------------------------------------------------------------
DROP TABLE IF EXISTS products;
CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_id INT NOT NULL,
    category_id INT,
    product_name VARCHAR(150) NOT NULL,
    description TEXT,
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    stock_quantity INT NOT NULL DEFAULT 0,
    low_stock_threshold INT DEFAULT 20,         -- Low stock badge threshold
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    image_url VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_products_supplier
        FOREIGN KEY (supplier_id)
        REFERENCES suppliers(supplier_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_products_category
        FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
        ON DELETE SET NULL
);

DROP TABLE IF EXISTS cart_items;
CREATE TABLE cart_items (
    cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
    buyer_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_cart_buyer
        FOREIGN KEY (buyer_id)
        REFERENCES buyers(buyer_id)
        ON DELETE CASCADE,

    CONSTRAINT uq_cart_buyer_product UNIQUE (buyer_id, product_id),

    CONSTRAINT fk_cart_product
        FOREIGN KEY (product_id)
        REFERENCES products(product_id)
        ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- 7. ORDERS & ORDER ITEMS
-- ------------------------------------------------------------
DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    buyer_id INT NOT NULL,
    supplier_id INT NOT NULL,
    order_number VARCHAR(50) NOT NULL UNIQUE,  -- e.g. 'SB-1042'
    order_status ENUM(
        'Pending',
        'Confirmed',
        'Processing',
        'Dispatched',
        'Out for delivery',
        'Shipped',
        'Delivered',
        'Cancelled'
    ) DEFAULT 'Pending',
    total_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_orders_buyer
        FOREIGN KEY (buyer_id)
        REFERENCES buyers(buyer_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_orders_supplier
        FOREIGN KEY (supplier_id)
        REFERENCES suppliers(supplier_id)
        ON DELETE CASCADE
);
-- altering the 'orders' table and adding a delivery_fee column
ALTER TABLE orders
ADD COLUMN delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00
AFTER total_amount;

DROP TABLE IF EXISTS order_items;
CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    subtotal DECIMAL(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_order_items_order
        FOREIGN KEY (order_id)
        REFERENCES orders(order_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_order_items_product
        FOREIGN KEY (product_id)
        REFERENCES products(product_id)
        ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- 8. PAYMENT METHODS & ORDER PAYMENTS
-- ------------------------------------------------------------
DROP TABLE IF EXISTS payment_methods;
CREATE TABLE payment_methods (
    method_id INT AUTO_INCREMENT PRIMARY KEY,
    method_name VARCHAR(100) NOT NULL,         -- e.g. 'Credit Card', 'Invoice Due', 'Instant EFT'
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
    due_date DATETIME,                         -- Used for "1 invoice due (R2,140)"
    paid_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_payments_order
        FOREIGN KEY (order_id)
        REFERENCES orders(order_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_payments_method
        FOREIGN KEY (method_id)
        REFERENCES payment_methods(method_id)
        ON DELETE SET NULL
);

-- ------------------------------------------------------------
-- 9. DELIVERIES & GPS TRACKING
-- ------------------------------------------------------------
DROP TABLE IF EXISTS deliveries;
CREATE TABLE deliveries (
    delivery_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL UNIQUE,
    courier_name VARCHAR(100),                 -- e.g. "Paarl to Woodstock Route"
    tracking_reference VARCHAR(100),            -- e.g. "CFP-68213-ZA"
    current_status VARCHAR(100) DEFAULT 'Preparing Dispatch',
    estimated_arrival VARCHAR(100),            -- ETA string (e.g. "24 min" or "Tomorrow 9-11am")
    dispatched_at DATETIME,
    delivered_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_deliveries_order
        FOREIGN KEY (order_id)
        REFERENCES orders(order_id)
        ON DELETE CASCADE
);

DROP TABLE IF EXISTS delivery_locations;
CREATE TABLE delivery_locations (
    location_id INT AUTO_INCREMENT PRIMARY KEY,
    delivery_id INT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,          -- GPS Marker Latitude
    longitude DECIMAL(11, 8) NOT NULL,         -- GPS Marker Longitude
    location_description VARCHAR(255),         -- e.g. "Courier is approx 24 minutes from Woodstock"
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_locations_delivery
        FOREIGN KEY (delivery_id)
        REFERENCES deliveries(delivery_id)
        ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- 10. REVIEWS & SUPPLIER REPLIES
-- ------------------------------------------------------------
DROP TABLE IF EXISTS reviews;
CREATE TABLE reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    buyer_id INT NOT NULL,
    product_id INT NOT NULL,
    order_id INT,
    rating TINYINT NOT NULL,                    -- Rating score (1 to 5)
    review_text TEXT NOT NULL,
    status ENUM('Published', 'Hidden', 'Pending') DEFAULT 'Published',
    review_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_review_rating CHECK (rating BETWEEN 1 AND 5),

    CONSTRAINT fk_reviews_buyer
        FOREIGN KEY (buyer_id)
        REFERENCES buyers(buyer_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_reviews_product
        FOREIGN KEY (product_id)
        REFERENCES products(product_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_reviews_order
        FOREIGN KEY (order_id)
        REFERENCES orders(order_id)
        ON DELETE SET NULL
);

DROP TABLE IF EXISTS review_replies;
CREATE TABLE review_replies (
    reply_id INT AUTO_INCREMENT PRIMARY KEY,
    review_id INT NOT NULL,
    supplier_id INT NOT NULL,
    reply_text TEXT NOT NULL,
    replied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_review_replies_review
        FOREIGN KEY (review_id)
        REFERENCES reviews(review_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_review_replies_supplier
        FOREIGN KEY (supplier_id)
        REFERENCES suppliers(supplier_id)
        ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- 11. MESSAGING (CONVERSATIONS & MESSAGES)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS conversations;
CREATE TABLE conversations (
    conversation_id INT AUTO_INCREMENT PRIMARY KEY,
    buyer_id INT NOT NULL,
    supplier_id INT NOT NULL,
    last_message_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_conv_buyer
        FOREIGN KEY (buyer_id)
        REFERENCES buyers(buyer_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_conv_supplier
        FOREIGN KEY (supplier_id)
        REFERENCES suppliers(supplier_id)
        ON DELETE CASCADE
);

DROP TABLE IF EXISTS messages;
CREATE TABLE messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    conversation_id INT NOT NULL,
    sender_id INT NOT NULL,                    -- Foreign key to users(user_id)
    message_text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_messages_conversation
        FOREIGN KEY (conversation_id)
        REFERENCES conversations(conversation_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_messages_sender
        FOREIGN KEY (sender_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- 12. NOTIFICATIONS
-- ------------------------------------------------------------
DROP TABLE IF EXISTS notifications;
CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,              -- e.g. "Order #SB-1041 Confirmed"
    message TEXT NOT NULL,                     -- e.g. "Invoice for #SB-1035 is due in 2 days"
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notifications_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

SET FOREIGN_KEY_CHECKS = 1;

-- ------------------------------------------------------------
-- 13. ADMIN MESSAGES
-- ------------------------------------------------------------
DROP TABLE IF EXISTS admin_messages;
CREATE TABLE admin_messages (
    admin_message_id INT AUTO_INCREMENT PRIMARY KEY,
    sender_admin_id INT NOT NULL,
    recipient_user_id INT NOT NULL,
    subject VARCHAR(150) NOT NULL,
    message_text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_admin_msg_sender
        FOREIGN KEY (sender_admin_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_admin_msg_recipient
        FOREIGN KEY (recipient_user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

INSERT INTO users (email, password_hash, user_role, is_active, is_approved)
VALUES ('admin@weconnect.co.za', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQOEg6Lruj3vjPGga31lW', 'admin', TRUE, TRUE);