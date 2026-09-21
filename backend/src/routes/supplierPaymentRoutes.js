import express from 'express';
import {
  fetchPayments,
  fetchOrderPayments,
  processPayment
} from '../controllers/paymentController.js';

const router = express.Router();

// GET /api/payments
router.get('/', fetchPayments);

// GET /api/payments/order/:orderId
router.get('/order/:orderId', fetchOrderPayments);

// POST /api/payments
router.post('/', processPayment);

export default router;
