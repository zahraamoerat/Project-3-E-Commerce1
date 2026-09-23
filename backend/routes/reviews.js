const express = require("express");
const pool = require("../config/db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

async function getBuyerId(userId) {
  const [[buyer]] = await pool.query(
    "SELECT buyer_id AS buyerId FROM buyers WHERE user_id = ?",
    [userId]
  );
  return buyer ? buyer.buyerId : null;
}

// mysql2 returns DATETIME columns as JS Date objects, which would otherwise
// serialize to a raw ISO string in the JSON response instead of the
// relative-time style the UI expects ("3 days ago", "2 weeks ago").
function formatRelativeTime(dateVal) {
  if (!dateVal) return "";
  const d = new Date(dateVal);
  const now = new Date();
  const diffDays = Math.floor((now - d) / 86400000);

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks === 1) return "1 week ago";
  if (diffWeeks < 5) return `${diffWeeks} weeks ago`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths <= 1) return "1 month ago";
  return `${diffMonths} months ago`;
}

// GET /api/reviews
// Returns two lists: delivered orders that haven't been rated yet, and past reviews.
router.get("/", async (req, res) => {
  try {
    const buyerId = await getBuyerId(req.user.userId);
    if (!buyerId) {
      return res.status(404).json({ error: "No buyer profile found for this account" });
    }

    // orders already has supplier_id directly, so no need to go via
    // order_items/products just to find who the order was from.
    // NOTE: deliveries.current_status is a real ENUM on the rebuilt schema
    // and its full allowed value list hasn't been confirmed - 'Delivered'
    // below is an assumption. If it isn't a valid enum member this simply
    // returns 0 pending rows rather than erroring.
    const [pendingRaw] = await pool.query(
      `SELECT o.order_id AS orderId, s.business_name AS supplierName, d.delivered_at AS deliveredDate
       FROM orders o
       JOIN deliveries d ON d.order_id = o.order_id
       JOIN suppliers s ON s.supplier_id = o.supplier_id
       WHERE o.buyer_id = ? AND d.current_status = 'Delivered'
         AND o.order_id NOT IN (
           SELECT order_id FROM reviews WHERE buyer_id = ? AND order_id IS NOT NULL
         )
       ORDER BY d.delivered_at DESC`,
      [buyerId, buyerId]
    );
    const pending = pendingRaw.map((o) => ({
      ...o,
      deliveredDate: formatRelativeTime(o.deliveredDate),
    }));

    // reviews.product_id is NOT NULL (reviews are product-level), so joining
    // through products to find the supplier always works - unlike order_id,
    // which is nullable.
    const [historyRaw] = await pool.query(
      `SELECT r.review_id AS ratingId, s.business_name AS supplierName,
              r.rating, r.review_text AS comment, r.review_date AS date
       FROM reviews r
       JOIN products p ON p.product_id = r.product_id
       JOIN suppliers s ON s.supplier_id = p.supplier_id
       WHERE r.buyer_id = ?
       ORDER BY r.review_date DESC`,
      [buyerId]
    );
    const history = historyRaw.map((r) => ({
      ...r,
      date: formatRelativeTime(r.date),
    }));

    res.json({ pending, history });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch reviews" });
  }
});

// POST /api/reviews
// Body: { orderId, rating, comment }
// reviews.product_id is required, so the order's first product (by
// order_items insertion order) is used automatically.
router.post("/", async (req, res) => {
  try {
    const { orderId, rating, comment } = req.body;

    if (!orderId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "orderId and a rating between 1 and 5 are required" });
    }

    const buyerId = await getBuyerId(req.user.userId);
    if (!buyerId) {
      return res.status(404).json({ error: "No buyer profile found for this account" });
    }

    const [[orderItem]] = await pool.query(
      `SELECT oi.product_id AS productId
       FROM orders o
       JOIN order_items oi ON oi.order_id = o.order_id
       WHERE o.order_id = ? AND o.buyer_id = ?
       ORDER BY oi.order_item_id ASC
       LIMIT 1`,
      [orderId, buyerId]
    );

    if (!orderItem) {
      return res.status(404).json({ error: "Order not found, or it has no products" });
    }

    const [result] = await pool.query(
      `INSERT INTO reviews (buyer_id, product_id, order_id, rating, review_text, status, review_date)
       VALUES (?, ?, ?, ?, ?, 'Pending', NOW())`,
      [buyerId, orderItem.productId, orderId, rating, comment || null]
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
    const buyerId = await getBuyerId(req.user.userId);
    if (!buyerId) {
      return res.status(404).json({ error: "No buyer profile found for this account" });
    }

    const [result] = await pool.query(
      "DELETE FROM reviews WHERE review_id = ? AND buyer_id = ?",
      [req.params.id, buyerId]
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