const express = require("express");
const pool = require("../config/db");

const router = express.Router();

// GET /api/suppliers?search=&category=&verifiedOnly=true&quickDelivery=true
// Public - a buyer needs to browse suppliers even if not logged in yet.
router.get("/", async (req, res) => {
  try {
    const { search, category, verifiedOnly, quickDelivery } = req.query;

    let sql = `
      SELECT s.supplier_id AS supplierId, s.company_name AS companyName, s.city,
             s.is_verified AS isVerified, s.quick_delivery AS quickDelivery,
             s.min_order_value AS minOrderValue, s.lead_time_days AS leadTimeDays,
             c.name AS categoryName,
             COALESCE(AVG(sr.rating), 0) AS avgRating,
             COUNT(sr.rating_id) AS ratingCount
      FROM suppliers s
      LEFT JOIN categories c ON c.category_id = s.category_id
      LEFT JOIN supplier_ratings sr ON sr.supplier_id = s.supplier_id
      WHERE 1 = 1
    `;
    const params = [];

    if (search) {
      sql += " AND s.company_name LIKE ?";
      params.push(`%${search}%`);
    }
    if (category) {
      sql += " AND s.category_id = ?";
      params.push(category);
    }
    if (verifiedOnly === "true") {
      sql += " AND s.is_verified = TRUE";
    }
    if (quickDelivery === "true") {
      sql += " AND s.quick_delivery = TRUE";
    }

    sql += " GROUP BY s.supplier_id ORDER BY s.company_name";

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch suppliers" });
  }
});

module.exports = router;
