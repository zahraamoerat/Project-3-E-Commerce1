import express from 'express';
import {
	fetchOrders,
	fetchOrderById,
	chooseDeliveryMethod
} from '../controllers/b_orderController.js';

const router = express.Router();

// GET /api/orders
router.get('/', fetchOrders);

// POST /api/orders/:orderId/delivery-method
router.post('/:orderId/delivery-method', chooseDeliveryMethod);

// GET /api/orders/:orderId
router.get('/:orderId', fetchOrderById);

export default router;
