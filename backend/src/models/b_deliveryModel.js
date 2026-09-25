import pool from "../config/db.js";

// Get all deliveries with the related order, buyer, supplier, and payment information.
export async function getAllDeliveries(buyerId = null) {
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
      o.order_status AS order_status,
      o.delivery_method,
      o.total_amount,

      b.business_name AS buyer_name,
      s.business_name AS supplier_name,
      b.city AS buyer_city,
      s.city AS supplier_city,
      b.address AS buyer_address,
      b.province AS buyer_province,
      b.postal_code AS buyer_postal_code,
      s.address AS supplier_address,
      s.province AS supplier_province,
      s.postal_code AS supplier_postal_code,

      d.pickup_label,
      d.pickup_latitude,
      d.pickup_longitude,
      d.destination_label,
      d.destination_latitude,
      d.destination_longitude,
      d.route_distance_m,
      d.route_duration_s,
      d.setup_confirmed_at,

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

    WHERE (? IS NULL OR o.buyer_id = ?)
    ORDER BY d.created_at DESC
  `, [buyerId, buyerId]);

  return rows;
}

// Get the saved delivery address details for one delivery.
export async function getDeliveryAddressContext(deliveryId) {
  const [rows] = await pool.query(`
    SELECT
      d.delivery_id,
      o.order_number,
      o.delivery_method,
      d.current_status,
      b.business_name AS buyer_name,
      b.address AS buyer_address,
      b.city AS buyer_city,
      b.province AS buyer_province,
      b.postal_code AS buyer_postal_code,
      s.business_name AS supplier_name,
      s.address AS supplier_address,
      s.city AS supplier_city,
      s.province AS supplier_province,
      s.postal_code AS supplier_postal_code,
      d.pickup_label,
      d.pickup_latitude,
      d.pickup_longitude,
      d.destination_label,
      d.destination_latitude,
      d.destination_longitude,
      d.route_distance_m,
      d.route_duration_s,
      d.setup_confirmed_at
    FROM deliveries d
    INNER JOIN orders o
      ON d.order_id = o.order_id
    INNER JOIN buyers b
      ON o.buyer_id = b.buyer_id
    INNER JOIN suppliers s
      ON o.supplier_id = s.supplier_id
    WHERE d.delivery_id = ?
    LIMIT 1
  `, [deliveryId]);

  return rows[0] || null;
}

// Persist the confirmed pickup, destination, and route snapshot for a delivery.
export async function saveDeliverySetup(deliveryId, setup) {
  await pool.query(`
    UPDATE deliveries
    SET
      pickup_label = ?,
      pickup_latitude = ?,
      pickup_longitude = ?,
      destination_label = ?,
      destination_latitude = ?,
      destination_longitude = ?,
      route_distance_m = ?,
      route_duration_s = ?,
      setup_confirmed_at = NOW()
    WHERE delivery_id = ?
  `, [
    setup.pickup_label || null,
    setup.pickup_latitude,
    setup.pickup_longitude,
    setup.destination_label || null,
    setup.destination_latitude,
    setup.destination_longitude,
    setup.route_distance_m,
    setup.route_duration_s,
    deliveryId
  ]);
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