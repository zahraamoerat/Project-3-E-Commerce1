import {
  getProductReviews,
  createProductReview
} from '../models/reviewModel.js';

export async function fetchProductReviews(req, res) {
  try {
    const productId = Number(req.params.productId);

    if (!productId) {
      return res.status(400).json({
        message: 'Product ID is required'
      });
    }

    const reviews = await getProductReviews(productId);

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching product reviews:', error.message);

    res.status(500).json({
      message: 'Failed to fetch product reviews'
    });
  }
}

export async function submitProductReview(req, res) {
  try {
    const productId = Number(req.params.productId);
    const buyerId = Number(req.body.buyerId || 1);
    const rating = Number(req.body.rating);
    const reviewText = String(req.body.reviewText || '').trim();

    if (!productId) {
      return res.status(400).json({
        message: 'Product ID is required'
      });
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: 'Rating must be a whole number between 1 and 5'
      });
    }

    if (!reviewText) {
      return res.status(400).json({
        message: 'Review text is required'
      });
    }

    const review = await createProductReview({
      buyerId,
      productId,
      orderId: req.body.orderId ? Number(req.body.orderId) : null,
      rating,
      reviewText
    });

    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating product review:', error.message);

    res.status(500).json({
      message: 'Failed to create product review'
    });
  }
}