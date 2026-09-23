const express = require("express");
const pool = require("../config/db");

const router = express.Router();

// GET /api/suppliers?search=&category=&verifiedOnly=true&quickDelivery=true
// Public - a buyer needs to browse suppliers even if not logged in yet.
//
// NOTE: suppliers has no category_id column yet (still an open item from
// earlier handoffs), so "category" is filtered by checking whether the
// supplier has any product in that category, via the products table.
// Swap this for a direct s.category_id filter once that column exists.
router.get("/", async (req, res) => {
  try {
    const { search, category, verifiedOnly, quickDelivery } = req.query;

    let sql = `
      SELECT s.supplier_id AS supplierId, s.business_name AS companyName, s.city,
             s.is_verified AS isVerified, s.quick_delivery AS quickDelivery,
             s.min_order_value AS minOrderValue, s.lead_time_days AS leadTimeDays,
             COALESCE(AVG(r.rating), 0) AS avgRating,
             COUNT(DISTINCT r.review_id) AS ratingCount
      FROM suppliers s
      LEFT JOIN products p ON p.supplier_id = s.supplier_id
      LEFT JOIN reviews r ON r.product_id = p.product_id AND r.status = 'Published'
      WHERE 1 = 1
    `;
    const params = [];

    if (search) {
      sql += " AND s.business_name LIKE ?";
      params.push(`%${search}%`);
    }
    if (category) {
      sql += ` AND s.supplier_id IN (
        SELECT DISTINCT supplier_id FROM products WHERE category_id = ?
      )`;
      params.push(category);
    }
    if (verifiedOnly === "true") {
      sql += " AND s.is_verified = TRUE";
    }
    if (quickDelivery === "true") {
      sql += " AND s.quick_delivery = TRUE";
    }

    sql += " GROUP BY s.supplier_id ORDER BY s.business_name";

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch suppliers" });
  }
});

module.exports = router;