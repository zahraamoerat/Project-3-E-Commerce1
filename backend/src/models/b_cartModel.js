import pool from '../database/b_connection.js';

export async function getCartItems(buyerId) {
  const [rows] = await pool.query(`
    SELECT
      ci.cart_item_id AS cartItemId,
      ci.buyer_id AS buyerId,
      ci.product_id AS productId,
      ci.quantity,
      p.product_name AS title,
      p.price,
      p.product_image AS image,
      p.unit,
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

  return rows;
}

export async function addCartItem(buyerId, productId, quantity) {
  const [result] = await pool.query(`
    INSERT INTO cart_items (buyer_id, product_id, quantity)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
  `, [buyerId, productId, quantity]);

  return { cartItemId: result.insertId, buyerId, productId, quantity };
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