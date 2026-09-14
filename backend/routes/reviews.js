const express = require("express");
const pool = require("../config/db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

// GET /api/reviews
// Returns two lists: delivered orders that haven't been rated yet, and past reviews.
router.get("/", async (req, res) => {
  try {
    const [pending] = await pool.query(
      `SELECT o.order_id AS orderId, s.company_name AS supplierName, d.delivered_at AS deliveredDate
       FROM orders o
       JOIN deliveries d ON d.order_id = o.order_id
       JOIN order_items oi ON oi.order_id = o.order_id
       JOIN products p ON p.product_id = oi.product_id
       JOIN suppliers s ON s.supplier_id = p.supplier_id
       WHERE o.user_id = ? AND d.status = 'delivered'
         AND o.order_id NOT IN (SELECT order_id FROM supplier_ratings WHERE user_id = ?)
       GROUP BY o.order_id`,
      [req.user.userId, req.user.userId]
    );

    const [history] = await pool.query(
      `SELECT sr.rating_id AS ratingId, s.company_name AS supplierName,
              sr.rating, sr.comment, sr.created_at AS date
       FROM supplier_ratings sr
       JOIN suppliers s ON s.supplier_id = sr.supplier_id
       WHERE sr.user_id = ?
       ORDER BY sr.created_at DESC`,
      [req.user.userId]
    );

    res.json({ pending, history });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch reviews" });
  }
});

// POST /api/reviews
// Body: { orderId, rating, comment }
router.post("/", async (req, res) => {
  try {
    const { orderId, rating, comment } = req.body;

    if (!orderId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "orderId and a rating between 1 and 5 are required" });
    }

    // Find which supplier this order was from
    const [[order]] = await pool.query(
      `SELECT p.supplier_id
       FROM orders o
       JOIN order_items oi ON oi.order_id = o.order_id
       JOIN products p ON p.product_id = oi.product_id
       WHERE o.order_id = ? AND o.user_id = ?
       LIMIT 1`,
      [orderId, req.user.userId]
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const [result] = await pool.query(
      "INSERT INTO supplier_ratings (order_id, user_id, supplier_id, rating, comment) VALUES (?, ?, ?, ?, ?)",
      [orderId, req.user.userId, order.supplier_id, rating, comment || null]
    );

    res.status(201).json({ ratingId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not submit review" });
  }
});

// DELETE /api/reviews/:id
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM supplier_ratings WHERE rating_id = ? AND user_id = ?",
      [req.params.id, req.user.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.json({ message: "Review deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not delete review" });
  }
});

module.exports = router;
