import pool from '../database/connection.js';

// Get all items belonging to one order.
export async function getOrderItems(orderId) {
  const [rows] = await pool.query(`
    SELECT
      oi.order_item_id,
      oi.order_id,
      oi.product_id,
      oi.quantity,
      oi.unit_price,
      oi.subtotal,
      p.name AS product_name,
      p.image AS product_image
    FROM order_items oi
    INNER JOIN products p
      ON oi.product_id = p.product_id
    WHERE oi.order_id = ?
    ORDER BY oi.order_item_id ASC
  `, [orderId]);

  return rows;
}