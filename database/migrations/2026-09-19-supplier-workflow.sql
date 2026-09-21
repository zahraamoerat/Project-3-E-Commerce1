USE weconnect_db;

-- WeConnect supplier workflow migration. Safe to run repeatedly.
SET @db = DATABASE();

SET @sql = (SELECT IF(
  EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema=@db AND table_name='products' AND column_name='catalog_status'),
  'SELECT 1',
  "ALTER TABLE products ADD COLUMN catalog_status ENUM('Active','Archived') NOT NULL DEFAULT 'Active' AFTER is_active"
)); PREPARE s FROM @sql; EXECUTE s; DEALLOCATE PREPARE s;

SET @sql = (SELECT IF(
  EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema=@db AND table_name='products' AND column_name='created_at'),
  'SELECT 1',
  'ALTER TABLE products ADD COLUMN created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP'
)); PREPARE s FROM @sql; EXECUTE s; DEALLOCATE PREPARE s;

SET @sql = (SELECT IF(
  EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema=@db AND table_name='products' AND column_name='updated_at'),
  'SELECT 1',
  'ALTER TABLE products ADD COLUMN updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
)); PREPARE s FROM @sql; EXECUTE s; DEALLOCATE PREPARE s;

CREATE TABLE IF NOT EXISTS stock_history (
  stock_history_id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  supplier_id INT NOT NULL,
  previous_quantity INT NOT NULL,
  new_quantity INT NOT NULL,
  change_quantity INT NOT NULL,
  reason VARCHAR(100) NOT NULL DEFAULT 'Manual adjustment',
  notes VARCHAR(500),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_stock_history_product (product_id, created_at),
  CONSTRAINT fk_stock_history_product FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
  CONSTRAINT fk_stock_history_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_variants (
  variant_id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  variant_name VARCHAR(120) NOT NULL,
  sku VARCHAR(80),
  price DECIMAL(10,2),
  stock_quantity INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_variants_product (product_id),
  UNIQUE KEY uq_variant_sku (sku),
  CONSTRAINT fk_variants_product FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS audit_activity (
  activity_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  supplier_id INT,
  user_id INT,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(60) NOT NULL,
  entity_id INT,
  details JSON,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audit_supplier (supplier_id, created_at),
  CONSTRAINT fk_audit_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE SET NULL,
  CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS supplier_notifications (
  notification_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  supplier_id INT NOT NULL,
  notification_type VARCHAR(60) NOT NULL,
  title VARCHAR(180) NOT NULL,
  message VARCHAR(500) NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_supplier_notifications (supplier_id, is_read, created_at),
  CONSTRAINT fk_supplier_notifications_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS supplier_saved_filters (
  filter_id INT AUTO_INCREMENT PRIMARY KEY,
  supplier_id INT NOT NULL,
  filter_name VARCHAR(100) NOT NULL,
  filter_json JSON NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_supplier_filter_name (supplier_id, filter_name),
  CONSTRAINT fk_saved_filters_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_imports (
  import_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  supplier_id INT NOT NULL,
  filename VARCHAR(255) NOT NULL,
  imported_rows INT NOT NULL DEFAULT 0,
  failed_rows INT NOT NULL DEFAULT 0,
  errors_json JSON,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_product_imports_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE CASCADE
);

UPDATE products SET catalog_status = CASE WHEN is_active = TRUE THEN 'Active' ELSE 'Archived' END WHERE catalog_status IS NULL;
