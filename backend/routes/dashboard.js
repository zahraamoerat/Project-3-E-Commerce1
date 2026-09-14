const express = require("express");
const pool = require("../config/db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

// GET /api/dashboard
// Returns everything the Dashboard page needs in one call, so the frontend
// only has to make a single request on page load.
router.get("/", async (req, res) => {
  const userId = req.user.userId;

  try {
    // --- Business name for the "Welcome back" header ---
    const [[profile]] = await pool.query(
      "SELECT business_name FROM business_profiles WHERE user_id = ?",
      [userId]
    );

    // --- Stat cards ---
    const [[activeOrdersRow]] = await pool.query(
      `SELECT COUNT(*) AS count FROM orders
       WHERE user_id = ? AND status NOT IN ('delivered', 'cancelled')`,
      [userId]
    );

    const [[pendingPaymentRow]] = await pool.query(
      `SELECT COALESCE(SUM(p.amount), 0) AS total, COUNT(*) AS count
       FROM payments p
       JOIN orders o ON p.order_id = o.order_id
       WHERE o.user_id = ? AND p.status = 'pending'`,
      [userId]
    );

    const [[inTransitRow]] = await pool.query(
      `SELECT COUNT(*) AS count
       FROM deliveries d
       JOIN orders o ON d.order_id = o.order_id
       WHERE o.user_id = ? AND d.status = 'in_transit'`,
      [userId]
    );

    const [[totalSpendRow]] = await pool.query(
      `SELECT COALESCE(SUM(total_amount), 0) AS total
       FROM orders
       WHERE user_id = ? AND status != 'cancelled'
         AND MONTH(order_date) = MONTH(CURRENT_DATE())
         AND YEAR(order_date) = YEAR(CURRENT_DATE())`,
      [userId]
    );

    // --- Recent orders (with supplier name + delivery ETA) ---
    const [recentOrders] = await pool.query(
      `SELECT o.order_id AS orderId, s.company_name AS supplierName,
              o.status, d.estimated_arrival AS eta,
              GROUP_CONCAT(p.name SEPARATOR ', ') AS itemsSummary
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.order_id
       LEFT JOIN products p ON p.product_id = oi.product_id
       LEFT JOIN suppliers s ON s.supplier_id = p.supplier_id
       LEFT JOIN deliveries d ON d.order_id = o.order_id
       WHERE o.user_id = ?
       GROUP BY o.order_id
       ORDER BY o.order_date DESC
       LIMIT 5`,
      [userId]
    );

    // --- One order to show in the tracking widget (most recent in-transit one) ---
    const [[trackedOrder]] = await pool.query(
      `SELECT o.order_id AS orderId, d.status, d.current_latitude, d.current_longitude,
              d.estimated_arrival
       FROM orders o
       JOIN deliveries d ON d.order_id = o.order_id
       WHERE o.user_id = ? AND d.status = 'in_transit'
       ORDER BY d.dispatched_at DESC
       LIMIT 1`,
      [userId]
    );

    // --- Suggested suppliers: featured suppliers the buyer hasn't ordered from yet ---
    const [suggestedSuppliers] = await pool.query(
      `SELECT s.supplier_id AS supplierId, s.company_name AS companyName, s.city
       FROM suppliers s
       WHERE s.is_featured = TRUE
         AND s.supplier_id NOT IN (
           SELECT DISTINCT p.supplier_id
           FROM orders o
           JOIN order_items oi ON oi.order_id = o.order_id
           JOIN products p ON p.product_id = oi.product_id
           WHERE o.user_id = ?
         )
       LIMIT 3`,
      [userId]
    );

    // --- Notifications ---
    const [notifications] = await pool.query(
      `SELECT notification_id AS notificationId, type, message, is_read AS isRead, created_at AS createdAt
       FROM notifications
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 10`,
      [userId]
    );

    res.json({
      business: { name: profile?.business_name || "Your Business" },
      stats: {
        activeOrders: activeOrdersRow.count,
        pendingPayment: pendingPaymentRow.total,
        pendingInvoices: pendingPaymentRow.count,
        inTransit: inTransitRow.count,
        totalSpend: totalSpendRow.total,
      },
      recentOrders,
      trackedOrder: trackedOrder || null,
      suggestedSuppliers,
      notifications,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load dashboard data" });
  }
});

module.exports = router;
