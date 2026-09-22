import { Router } from 'express';
import { fetchProducts } from '../controllers/b_productController.js';
import {
  fetchProductReviews,
  submitProductReview
} from '../controllers/b_reviewController.js';

const router = Router();

router.get('/', fetchProducts);

// GET /api/products/:productId/reviews
router.get('/:productId/reviews', fetchProductReviews);

// POST /api/products/:productId/reviews
router.post('/:productId/reviews', submitProductReview);

export default router;