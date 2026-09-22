import pool from '../database/b_connection.js';

// Get all orders with buyer, supplier, and delivery information.
export async function getAllOrders(buyerId = null) {
  const [rows] = await pool.query(`
    SELECT
      o.order_id,
      o.order_number,
      o.status AS order_status,
      o.total_amount,
      o.ordered_at AS order_date,
      o.updated_at,

      b.business_name AS buyer_name,
      s.business_name AS supplier_name,
      b.city AS buyer_city,
      s.city AS supplier_city,

      d.delivery_id,
      d.tracking_reference,
      d.current_status AS delivery_status,
      d.estimated_arrival

    FROM orders o

    INNER JOIN buyers b
      ON o.buyer_id = b.buyer_id

    INNER JOIN suppliers s
      ON o.supplier_id = s.supplier_id

    LEFT JOIN deliveries d
      ON d.order_id = o.order_id

    WHERE (? IS NULL OR o.buyer_id = ?)\n    ORDER BY o.ordered_at DESC
  `);

  return rows;
}

// Get one order with its buyer, supplier, and delivery information.
export async function getOrderById(orderId, buyerId = null) {
  const [rows] = await pool.query(`
    SELECT
      o.order_id,
      o.order_number,
      o.status AS order_status,
      o.total_amount,
      o.ordered_at AS order_date,
      o.updated_at,

      b.business_name AS buyer_name,
      s.business_name AS supplier_name,
      b.city AS buyer_city,
      s.city AS supplier_city,

      d.delivery_id,
      d.tracking_reference,
      d.current_status AS delivery_status,
      d.estimated_arrival

    FROM orders o

    INNER JOIN buyers b
      ON o.buyer_id = b.buyer_id

    INNER JOIN suppliers s
      ON o.supplier_id = s.supplier_id

    LEFT JOIN deliveries d
      ON d.order_id = o.order_id

    WHERE o.order_id = ?\n      AND (? IS NULL OR o.buyer_id = ?)
    LIMIT 1
  `, [orderId, buyerId, buyerId]);

  return rows[0] || null;
}