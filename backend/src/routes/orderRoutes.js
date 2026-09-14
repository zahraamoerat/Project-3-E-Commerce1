import express from 'express';
import {
	fetchOrders,
	fetchOrderById
} from '../controllers/orderController.js';

const router = express.Router();

// GET /api/orders
router.get('/', fetchOrders);

// GET /api/orders/:orderId
router.get('/:orderId', fetchOrderById);

export default router;
