import express from 'express';
import {
  fetchCart,
  addItemToCart,
  editCartItem,
  deleteCartItem,
  fetchCartCount
} from '../controllers/cartController.js';

const router = express.Router();

// GET /api/cart?buyerId=1
router.get('/', fetchCart);

// GET /api/cart/count?buyerId=1
router.get('/count', fetchCartCount);

// POST /api/cart
router.post('/', addItemToCart);

// PUT /api/cart/:cartItemId
router.put('/:cartItemId', editCartItem);

// DELETE /api/cart/:cartItemId
router.delete('/:cartItemId', deleteCartItem);

export default router;