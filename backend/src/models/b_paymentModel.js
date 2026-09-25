import pool from "../config/db.js";

// Get all payments with the related order and payment method.
export async function getAllPayments(buyerId = null) {
  const [rows] = await pool.query(`
    SELECT
      p.payment_id,
      p.order_id,
      p.method_id,
      p.amount,
      p.payment_status,
      p.transaction_reference,
      p.due_date,
      p.paid_at,
      p.created_at,
      o.order_number,
      pm.method_name
    FROM payments p
    INNER JOIN orders o ON p.order_id = o.order_id
    LEFT JOIN payment_methods pm ON p.method_id = pm.method_id
    WHERE (? IS NULL OR o.buyer_id = ?)
    ORDER BY p.created_at DESC
  `, [buyerId, buyerId]);

  return rows;
}

// Get payments for one specific order.
export async function getPaymentsByOrder(orderId, buyerId = null) {
  const [rows] = await pool.query(`
    SELECT
      p.payment_id,
      p.order_id,
      p.method_id,
      p.amount,
      p.payment_status,
      p.transaction_reference,
      p.due_date,
      p.paid_at,
      p.created_at,
      pm.method_name
    FROM payments p
    INNER JOIN orders o ON p.order_id = o.order_id
    LEFT JOIN payment_methods pm ON p.method_id = pm.method_id
    WHERE p.order_id = ?
      AND (? IS NULL OR o.buyer_id = ?)
    ORDER BY p.created_at DESC
  `, [orderId, buyerId, buyerId]);

  return rows;
}

// Create a completed payment for an order.
export async function createPayment(orderId, methodName, amount, transactionReference) {
  // Find the payment method selected by the user.
  const [methodRows] = await pool.query(`
    SELECT
      method_id,
      method_name
    FROM payment_methods
    WHERE LOWER(method_name) = LOWER(?)
    LIMIT 1
  `, [methodName]);

  if (!methodRows.length) {
    throw new Error(`Payment method not found: ${methodName}`);
  }

  const methodId = methodRows[0].method_id;

  // Record the payment without storing sensitive card information.
  const [result] = await pool.query(`
    INSERT INTO payments (
      order_id,
      method_id,
      amount,
      payment_status,
      transaction_reference,
      paid_at
    )
    VALUES (?, ?, ?, 'Completed', ?, NOW())
  `, [
    orderId,
    methodId,
    amount,
    transactionReference
  ]);

  return {
    paymentId: result.insertId,
    transactionReference
  };
}
