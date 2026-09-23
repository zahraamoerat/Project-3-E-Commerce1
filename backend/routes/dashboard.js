const express = require("express");
const pool = require("../config/db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

// Converts DB orders.status ENUM values ("Out for delivery", "Shipped", etc.)
// into the lowercase_snake_case slugs the frontend's statusLabel()/CSS classes expect.
// Current allowed values (per the rebuilt schema): Pending, Processing,
// Shipped, Out for delivery, Delivered, Cancelled.
function normalizeStatus(status) {
  if (!status) return status;
  return status.toLowerCase().replace(/ /g, "_");
}

// deliveries.estimated_arrival is a VARCHAR like "24 min" or "2 hours".
// The tracking widget wants a plain number of minutes, so pull the first
// integer out of the string. Returns null if there's nothing numeric in it.
function parseEtaMinutes(eta) {
  if (!eta) return null;
  const match = String(eta).match(/\d+/);
  return match ? Number(match[0]) : null;
}

// GET /api/dashboard
// Returns everything the Dashboard page needs in one call, so the frontend
// only has to make a single request on page load.
router.get("/", async (req, res) => {
  const userId = req.user.userId;

  try {
    // --- Resolve the buyer row for this logged-in user ---
    // orders/payments/deliveries all key off buyer_id, not user_id directly.
    // NOTE: /api/auth/register only creates a `users` row, so a freshly
    // registered account has no `buyers` row and will 404 here until one
    // is created via the Business Profile page.
    const [[buyer]] = await pool.query(
      "SELECT buyer_id AS buyerId, business_name AS businessName FROM buyers WHERE user_id = ?",
      [userId]
    );

    if (!buyer) {
      return res.status(404).json({ error: "No buyer profile found for this user" });
    }
    const buyerId = buyer.buyerId;

    // --- Stat cards ---
    const [[activeOrdersRow]] = await pool.query(
      `SELECT COUNT(*) AS count FROM orders
       WHERE buyer_id = ? AND status NOT IN ('Delivered', 'Cancelled')`,
      [buyerId]
    );

    const [[pendingPaymentRow]] = await pool.query(
      `SELECT COALESCE(SUM(p.amount), 0) AS total, COUNT(*) AS count
       FROM payments p
       JOIN orders o ON p.order_id = o.order_id
       WHERE o.buyer_id = ? AND p.payment_status = 'Pending'`,
      [buyerId]
    );

    // NOTE: deliveries.current_status is now a real ENUM defaulting to
    // 'Preparing Dispatch' on the rebuilt schema — the full list of allowed
    // values hasn't been confirmed yet, so 'In Transit' below is still an
    // assumption carried over from before the rebuild. If it isn't a valid
    // enum member, this simply matches 0 rows rather than erroring — worth
    // confirming with:
    //   SELECT COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS
    //   WHERE TABLE_SCHEMA='weconnect' AND TABLE_NAME='deliveries'
    //     AND COLUMN_NAME='current_status';
    const [[inTransitRow]] = await pool.query(
      `SELECT COUNT(*) AS count
       FROM deliveries d
       JOIN orders o ON d.order_id = o.order_id
       WHERE o.buyer_id = ? AND d.current_status = 'In Transit'`,
      [buyerId]
    );

    const [[thisMonthRow]] = await pool.query(
      `SELECT COALESCE(SUM(total_amount), 0) AS total
       FROM orders
       WHERE buyer_id = ? AND status != 'Cancelled'
         AND ordered_at >= DATE_FORMAT(CURRENT_DATE(), '%Y-%m-01')`,
      [buyerId]
    );

    // Same window, one month back — used for the "+X% vs last month" trend.
    const [[lastMonthRow]] = await pool.query(
      `SELECT COALESCE(SUM(total_amount), 0) AS total
       FROM orders
       WHERE buyer_id = ? AND status != 'Cancelled'
         AND ordered_at >= DATE_FORMAT(CURRENT_DATE() - INTERVAL 1 MONTH, '%Y-%m-01')
         AND ordered_at <  DATE_FORMAT(CURRENT_DATE(), '%Y-%m-01')`,
      [buyerId]
    );

    // DECIMAL columns come back from mysql2 as strings, so coerce before maths.
    const thisMonthSpend = Number(thisMonthRow.total);
    const lastMonthSpend = Number(lastMonthRow.total);
    const spendChangePercent =
      lastMonthSpend > 0
        ? Math.round(((thisMonthSpend - lastMonthSpend) / lastMonthSpend) * 100)
        : 0;

    // --- Recent orders (orders already has supplier_id directly) ---
    // Every non-aggregated column is listed in GROUP BY: MySQL 8 runs with
    // ONLY_FULL_GROUP_BY on by default (Aiven included) and rejects columns
    // from the null-supplying side of a LEFT JOIN otherwise (error 1055).
    const [recentOrdersRaw] = await pool.query(
      `SELECT o.order_id AS orderId, o.order_number AS orderNumber,
              s.business_name AS supplierName,
              o.status AS status, d.estimated_arrival AS eta,
              GROUP_CONCAT(DISTINCT p.product_name SEPARATOR ', ') AS itemsSummary
       FROM orders o
       LEFT JOIN suppliers s ON s.supplier_id = o.supplier_id
       LEFT JOIN order_items oi ON oi.order_id = o.order_id
       LEFT JOIN products p ON p.product_id = oi.product_id
       LEFT JOIN deliveries d ON d.order_id = o.order_id
       WHERE o.buyer_id = ?
       GROUP BY o.order_id, o.order_number, s.business_name,
                o.status, d.estimated_arrival, o.ordered_at
       ORDER BY o.ordered_at DESC
       LIMIT 5`,
      [buyerId]
    );
    // The table renders "#{{ order.orderId }}", and the design shows order
    // numbers like SB-1042 — so send order_number as orderId, keeping the
    // numeric PK under a separate key in case a detail page needs it later.
    const recentOrders = recentOrdersRaw.map((o) => ({
      orderId: o.orderNumber || o.orderId,
      orderPk: o.orderId,
      supplierName: o.supplierName,
      itemsSummary: o.itemsSummary,
      status: normalizeStatus(o.status),
      eta: o.eta,
    }));

    // --- Tracking widget: most recently dispatched in-transit order ---
    const [[trackedOrderRaw]] = await pool.query(
      `SELECT o.order_id AS orderId, o.order_number AS orderNumber,
              d.current_status AS status,
              d.estimated_arrival AS eta, b.city AS destinationCity
       FROM orders o
       JOIN deliveries d ON d.order_id = o.order_id
       JOIN buyers b ON b.buyer_id = o.buyer_id
       WHERE o.buyer_id = ? AND d.current_status = 'In Transit'
       ORDER BY d.dispatched_at DESC
       LIMIT 1`,
      [buyerId]
    );
    // Can legitimately be null (nothing in transit) — the frontend guards
    // this block with v-if, so don't fake an object here.
    const trackedOrder = trackedOrderRaw
      ? {
          orderId: trackedOrderRaw.orderNumber || trackedOrderRaw.orderId,
          status: normalizeStatus(trackedOrderRaw.status),
          etaMinutes: parseEtaMinutes(trackedOrderRaw.eta),
          destinationCity: trackedOrderRaw.destinationCity,
        }
      : null;

    // --- Suggested suppliers: featured suppliers the buyer hasn't ordered from yet ---
    // suppliers has no description column, so city is used as a stand-in.
    const [suggestedSuppliers] = await pool.query(
      `SELECT s.supplier_id AS supplierId, s.business_name AS companyName, s.city AS description
       FROM suppliers s
       WHERE s.is_featured = TRUE
         AND s.supplier_id NOT IN (
           SELECT DISTINCT o.supplier_id
           FROM orders o
           WHERE o.buyer_id = ? AND o.supplier_id IS NOT NULL
         )
       LIMIT 3`,
      [buyerId]
    );

    // --- Notifications ---
    const [notificationsRaw] = await pool.query(
      `SELECT notification_id AS notificationId, title, message,
              is_read AS isRead, created_at AS createdAt
       FROM notifications
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 10`,
      [userId]
    );
    // TINYINT(1) arrives as 0/1 — send a real boolean so `!n.isRead` is honest.
    const notifications = notificationsRaw.map((n) => ({
      ...n,
      isRead: Boolean(n.isRead),
    }));

    res.json({
      business: { name: buyer.businessName || "Your Business" },
      stats: {
        activeOrders: activeOrdersRow.count,
        pendingPayment: Number(pendingPaymentRow.total),
        pendingInvoices: pendingPaymentRow.count,
        inTransit: inTransitRow.count,
        totalSpend: thisMonthSpend,
        spendChangePercent,
      },
      recentOrders,
      trackedOrder,
      suggestedSuppliers,
      notifications,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load dashboard data" });
  }
});

module.exports = router;