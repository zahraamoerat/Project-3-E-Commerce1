import {
  getAllPayments,
  getPaymentsByOrder,
  createPayment
} from '../models/paymentModel.js';
import db from "../config/db.js";

// Return all payments to the frontend.
export async function fetchPayments(req, res) {
  try {
    const payments = await getAllPayments();

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

    const payments = await getPaymentsByOrder(orderId);

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
export async function createPaymentIntent(req,res,next){try{const orderNumber=String(req.body.order_number||"").trim();const amount=Number(req.body.amount);if(!orderNumber||!Number.isFinite(amount)||amount<=0)return res.status(400).json({message:"A valid order number and payment amount are required."});const [rows]=await db.execute("SELECT order_id,total_amount,status FROM orders WHERE order_number=? LIMIT 1",[orderNumber]);if(!rows[0])return res.status(404).json({message:"Order not found."});if(Math.abs(Number(rows[0].total_amount)-amount)>0.01)return res.status(400).json({message:"Payment amount does not match the order total."});if(!process.env.PAYMENT_PROVIDER||!process.env.PAYMENT_SECRET_KEY)return res.status(503).json({message:"Online payment is not configured. Set PAYMENT_PROVIDER and PAYMENT_SECRET_KEY on the server."});return res.status(501).json({message:"Payment provider adapter is not enabled yet."});}catch(e){next(e);}}
