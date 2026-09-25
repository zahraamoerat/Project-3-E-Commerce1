import pool from "../config/db.js";

export async function getProductReviews(productId) {
  const [rows] = await pool.query(`
    SELECT
      r.review_id AS reviewId,
      r.buyer_id AS buyerId,
      r.product_id AS productId,
      r.rating,
      r.review_text AS reviewText,
      r.review_date AS reviewDate,
      b.business_name AS buyerName,
      rp.reply_id AS replyId,
      rp.reply_text AS supplierReply,
      rp.replied_at AS repliedAt
    FROM reviews r
    LEFT JOIN buyers b
      ON r.buyer_id = b.buyer_id
    LEFT JOIN review_replies rp
      ON rp.review_id = r.review_id
    WHERE r.product_id = ?
      AND r.status = 'Published'
    ORDER BY r.review_date DESC
  `, [productId]);

  return rows;
}

export async function createProductReview({ buyerId, productId, orderId, rating, reviewText }) {
  const [result] = await pool.query(`
    INSERT INTO reviews (
      buyer_id,
      product_id,
      order_id,
      rating,
      review_text,
      status
    )
    VALUES (?, ?, ?, ?, ?, 'Published')
  `, [buyerId, productId, orderId || null, rating, reviewText]);

  return {
    reviewId: result.insertId,
    buyerId,
    productId,
    orderId: orderId || null,
    rating,
    reviewText
  };
}