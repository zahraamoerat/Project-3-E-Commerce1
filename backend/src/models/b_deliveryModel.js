import pool from '../database/connection.js';

// Get all deliveries with the related order, buyer, supplier, and payment information.
export async function getAllDeliveries() {
  const [rows] = await pool.query(`
    SELECT
      d.delivery_id,
      d.order_id,
      d.courier_name,
      d.tracking_reference,
      d.current_status,
      d.estimated_arrival,
      d.dispatched_at,
      d.delivered_at,
      d.created_at,
      d.updated_at,

      o.order_number,
      o.status AS order_status,
      o.total_amount,

      b.business_name AS buyer_name,
      s.business_name AS supplier_name,
      b.city AS buyer_city,
      s.city AS supplier_city,

      p.payment_status

    FROM deliveries d

    INNER JOIN orders o
      ON d.order_id = o.order_id

    INNER JOIN buyers b
      ON o.buyer_id = b.buyer_id

    INNER JOIN suppliers s
      ON o.supplier_id = s.supplier_id

    LEFT JOIN payments p
      ON p.payment_id = (
        SELECT p2.payment_id
        FROM payments p2
        WHERE p2.order_id = o.order_id
        ORDER BY p2.created_at DESC
        LIMIT 1
      )

    ORDER BY d.created_at DESC
  `);

  return rows;
}

// Get the latest GPS location for a delivery.
export async function getLatestDeliveryLocation(deliveryId) {
  const [rows] = await pool.query(`
    SELECT
      location_id,
      delivery_id,
      latitude,
      longitude,
      location_description,
      recorded_at
    FROM delivery_locations
    WHERE delivery_id = ?
    ORDER BY recorded_at DESC
    LIMIT 1
  `, [deliveryId]);

  return rows[0] || null;
}