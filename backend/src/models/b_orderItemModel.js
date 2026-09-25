import pool from "../config/db.js";
import { normalizeProductImage } from "../utils/productImage.js";

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
      p.product_name AS product_name,
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
       ) AS product_image
    FROM order_items oi
    INNER JOIN products p
      ON oi.product_id = p.product_id
    WHERE oi.order_id = ?
    ORDER BY oi.order_item_id ASC
  `, [orderId]);

  return rows.map((row) => ({
    ...row,
    product_image: normalizeProductImage(row.product_image),
  }));
}