import pool from '../database/b_connection.js';

// Get all orders with buyer, supplier, and delivery information.
export async function getAllOrders(buyerId = null) {
  const [rows] = await pool.query(`
    SELECT
      o.order_id,
      o.order_number,
      o.status AS order_status,
      o.delivery_method,
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
      d.estimated_arrival,
      d.setup_confirmed_at

    FROM orders o

    INNER JOIN buyers b
      ON o.buyer_id = b.buyer_id

    INNER JOIN suppliers s
      ON o.supplier_id = s.supplier_id

    LEFT JOIN deliveries d
      ON d.order_id = o.order_id

    WHERE (? IS NULL OR o.buyer_id = ?)\n    ORDER BY o.ordered_at DESC
  `, [buyerId, buyerId]);

  return rows;
}

// Get one order with its buyer, supplier, and delivery information.
export async function getOrderById(orderId, buyerId = null) {
  const [rows] = await pool.query(`
    SELECT
      o.order_id,
      o.order_number,
      o.status AS order_status,
      o.delivery_method,
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
      d.estimated_arrival,
      d.setup_confirmed_at

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

// Get an order together with its delivery record for lifecycle decisions.
export async function getOrderWithDelivery(orderId, buyerId = null) {
  const [rows] = await pool.query(`
    SELECT
      o.order_id,
      o.status AS order_status,
      o.delivery_method,
      o.supplier_id,
      d.delivery_id,
      d.current_status AS delivery_status
    FROM orders o
    LEFT JOIN deliveries d
      ON d.order_id = o.order_id
    WHERE o.order_id = ?
      AND (? IS NULL OR o.buyer_id = ?)
    LIMIT 1
  `, [orderId, buyerId, buyerId]);

  return rows[0] || null;
}

// Store the buyer's chosen delivery method on the order.
export async function setOrderDeliveryMethod(orderId, method) {
  await pool.query(
    'UPDATE orders SET delivery_method = ? WHERE order_id = ?',
    [method, orderId]
  );
}

// Create the WeConnect delivery record when the buyer requests delivery.
// The delivery starts in "Preparing Dispatch", never "In Transit". If a
// previously cancelled delivery exists for this order it is reactivated.
export async function createDeliveryForOrder(orderId) {
  await pool.query(`
    INSERT INTO deliveries (order_id, delivery_method)
    VALUES (?, 'WeConnect Delivery')
    ON DUPLICATE KEY UPDATE
      delivery_method = 'WeConnect Delivery',
      current_status = IF(current_status = 'Cancelled', 'Preparing Dispatch', current_status)
  `, [orderId]);

  const [rows] = await pool.query(
    'SELECT delivery_id FROM deliveries WHERE order_id = ? LIMIT 1',
    [orderId]
  );

  return rows[0]?.delivery_id || null;
}

// Remove a not-yet-committed delivery when the buyer switches to self
// collection before the shipment has actually been prepared.
export async function cancelDeliveryForOrder(orderId) {
  const [result] = await pool.query(`
    UPDATE deliveries
    SET current_status = 'Cancelled'
    WHERE order_id = ?
      AND current_status = 'Preparing Dispatch'
  `, [orderId]);

  return result.affectedRows > 0;
}

export async function createOrdersFromCart(buyerId) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [items] = await connection.query(`
      SELECT ci.cart_item_id, ci.product_id, ci.quantity, p.supplier_id, p.price AS base_unit_price, COALESCE((SELECT MAX(t.discount_percent) FROM product_discount_tiers t WHERE t.product_id=p.product_id AND ci.quantity >= t.minimum_quantity), 0) AS discount_percent, ROUND(p.price * (1 - COALESCE((SELECT MAX(t.discount_percent) FROM product_discount_tiers t WHERE t.product_id=p.product_id AND ci.quantity >= t.minimum_quantity), 0) / 100), 2) AS unit_price
      FROM cart_items ci
      INNER JOIN products p ON p.product_id = ci.product_id
      WHERE ci.buyer_id = ?
      FOR UPDATE
    `, [buyerId]);
    if (!items.length) {
      const error = new Error('Your cart is empty.');
      error.status = 400;
      throw error;
    }
    const bySupplier = new Map();
    for (const item of items) {
      if (!bySupplier.has(item.supplier_id)) bySupplier.set(item.supplier_id, []);
      bySupplier.get(item.supplier_id).push(item);
    }
    const createdOrders = [];
    for (const [supplierId, supplierItems] of bySupplier) {
      const total = supplierItems.reduce((sum, item) => sum + Number(item.unit_price) * Number(item.quantity), 0);
      const orderNumber = `WC-${Date.now()}-${supplierId}-${createdOrders.length + 1}`;
      const [orderResult] = await connection.query(
        `INSERT INTO orders (buyer_id, supplier_id, order_number, status, total_amount)
         VALUES (?, ?, ?, 'Pending', ?)`,
        [buyerId, supplierId, orderNumber, total]
      );
      for (const item of supplierItems) {
        await connection.query(
          `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
           VALUES (?, ?, ?, ?)`,
          [orderResult.insertId, item.product_id, item.quantity, item.unit_price]
        );
      }
      createdOrders.push({ order_id: orderResult.insertId, order_number: orderNumber, supplier_id: supplierId, total_amount: total });
    }
    await connection.query('DELETE FROM cart_items WHERE buyer_id = ?', [buyerId]);
    await connection.commit();
    return createdOrders;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}