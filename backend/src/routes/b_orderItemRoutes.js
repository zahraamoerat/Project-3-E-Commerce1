import express from 'express';
import { fetchOrderItems } from '../controllers/b_orderItemController.js';

const router = express.Router();

// GET /api/orders/:orderId/items
router.get('/:orderId/items', fetchOrderItems);

export default router;