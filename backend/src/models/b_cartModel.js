import pool from "../config/db.js";
import { normalizeProductImage } from "../utils/productImage.js";

export async function getCartItems(buyerId) {
  const [rows] = await pool.query(`
    SELECT
      ci.cart_item_id AS cartItemId,
      ci.buyer_id AS buyerId,
      ci.product_id AS productId,
      p.supplier_id AS supplierId,
      ci.quantity,
      p.product_name AS title,
      p.price,
       COALESCE(
         (
           SELECT pm.media_url
           FROM product_media pm
           WHERE pm.product_id = p.product_id
             AND pm.media_type = 'image'
           ORDER BY pm.is_primary DESC, pm.sort_order ASC, pm.media_id ASC
           LIMIT 1
         ),
         NULLIF(p.product_image, '')
       ) AS image,
      p.unit,
      p.sku,
      COALESCE((SELECT MAX(t.discount_percent) FROM product_discount_tiers t WHERE t.product_id=p.product_id AND ci.quantity >= t.minimum_quantity), 0) AS discountPercent,
      ROUND(p.price * (1 - COALESCE((SELECT MAX(t.discount_percent) FROM product_discount_tiers t WHERE t.product_id=p.product_id AND ci.quantity >= t.minimum_quantity), 0) / 100), 2) AS effectivePrice,
      COALESCE(i.quantity, 0) AS stockQty,
      s.business_name AS supplier,
      CASE
        WHEN p.is_active = 0 OR COALESCE(i.quantity, 0) <= 0 THEN 'Out of stock'
        WHEN COALESCE(i.quantity, 0) <= COALESCE(i.low_stock_threshold, 20) THEN 'Low stock'
        ELSE 'Active'
      END AS status
    FROM cart_items ci
    INNER JOIN products p
      ON ci.product_id = p.product_id
    LEFT JOIN inventory i
      ON p.product_id = i.product_id
    LEFT JOIN suppliers s
      ON p.supplier_id = s.supplier_id
    WHERE ci.buyer_id = ?
    ORDER BY ci.created_at DESC
  `, [buyerId]);

  return rows.map((row) => ({
    ...row,
    image: normalizeProductImage(row.image),
  }));
}

export async function addCartItem(buyerId, productId, quantity) {
  await pool.query(`
    INSERT INTO cart_items (buyer_id, product_id, quantity)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
  `, [buyerId, productId, quantity]);

  const [rows] = await pool.query(`
    SELECT cart_item_id AS cartItemId, buyer_id AS buyerId,
           product_id AS productId, quantity
    FROM cart_items
    WHERE buyer_id = ? AND product_id = ?
    LIMIT 1
  `, [buyerId, productId]);

  return rows[0];
}

export async function updateCartItem(cartItemId, quantity) {
  await pool.query(`
    UPDATE cart_items
    SET quantity = ?
    WHERE cart_item_id = ?
  `, [quantity, cartItemId]);
}

export async function removeCartItem(cartItemId) {
  await pool.query(`
    DELETE FROM cart_items
    WHERE cart_item_id = ?
  `, [cartItemId]);
}

export async function getCartCount(buyerId) {
  const [rows] = await pool.query(`
    SELECT COALESCE(SUM(quantity), 0) AS count
    FROM cart_items
    WHERE buyer_id = ?
  `, [buyerId]);

  return Number(rows[0].count);
}