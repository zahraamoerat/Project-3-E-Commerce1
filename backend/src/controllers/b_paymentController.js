import {
  getAllPayments,
  getPaymentsByOrder,
  createPayment
} from '../models/b_paymentModel.js';

// Return all payments to the frontend.
export async function fetchPayments(req, res) {
  try {
    const buyerId = req.query.buyerId ? Number(req.query.buyerId) : null;
    const payments = await getAllPayments(buyerId);

    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error.message);

    res.status(500).json({
      message: 'Failed to fetch payments'
    });
  }
}

// Return payments for one order.
export async function fetchOrderPayments(req, res) {
  try {
    const { orderId } = req.params;

    const buyerId = req.query.buyerId ? Number(req.query.buyerId) : null;
    const payments = await getPaymentsByOrder(orderId, buyerId);

    res.json(payments);
  } catch (error) {
    console.error('Error fetching order payments:', error.message);

    res.status(500).json({
      message: 'Failed to fetch order payments'
    });
  }
}

// Create a payment for an order.
export async function processPayment(req, res) {
  try {
    const {
      orderId,
      methodName,
      amount
    } = req.body;

    // Make sure the required payment information was provided.
    if (!orderId || !methodName || !amount) {
      return res.status(400).json({
        message: 'Order, payment method and amount are required'
      });
    }

    // Generate a unique payment reference.
    const transactionReference =
      `PAY-${orderId}-${Date.now()}`;

    const payment = await createPayment(
      orderId,
      methodName,
      amount,
      transactionReference
    );

    res.status(201).json({
      message: 'Payment recorded successfully',
      ...payment
    });
  } catch (error) {
    console.error('Error processing payment:', error.message);

    res.status(500).json({
      message: 'Failed to process payment'
    });
  }
}
