const express = require("express");
const pool = require("../config/db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

// GET /api/business-profile
// A buyer may not have a buyers row yet - it isn't created at registration,
// only the first time this page is saved. 404 in that case; the frontend
// falls back to its placeholder sample data.
router.get("/", async (req, res) => {
  try {
    const [[profile]] = await pool.query(
      `SELECT buyer_id AS buyerId, business_name AS businessName, category_id AS categoryId,
              phone AS contactPhone, profile_image AS profileImage
       FROM buyers
       WHERE user_id = ?`,
      [req.user.userId]
    );

    if (!profile) {
      return res.status(404).json({ error: "No buyer profile found for this account" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch business profile" });
  }
});

// PUT /api/business-profile
// Creates the buyers row on first save (buyers.email is NOT NULL and isn't
// collected by this form, so it's sourced from the account's own users.email),
// otherwise updates the existing row.
router.put("/", async (req, res) => {
  try {
    const { businessName, categoryId, contactPhone } = req.body;

    if (!businessName || !businessName.trim()) {
      return res.status(400).json({ error: "Business name is required" });
    }

    const [[existing]] = await pool.query(
      "SELECT buyer_id FROM buyers WHERE user_id = ?",
      [req.user.userId]
    );

    if (existing) {
      await pool.query(
        `UPDATE buyers
         SET business_name = ?, category_id = ?, phone = ?
         WHERE user_id = ?`,
        [businessName, categoryId || null, contactPhone || null, req.user.userId]
      );
    } else {
      const [[account]] = await pool.query(
        "SELECT email FROM users WHERE user_id = ?",
        [req.user.userId]
      );
      if (!account) {
        return res.status(404).json({ error: "Account not found" });
      }

      await pool.query(
        `INSERT INTO buyers (user_id, business_name, email, category_id, phone)
         VALUES (?, ?, ?, ?, ?)`,
        [req.user.userId, businessName, account.email, categoryId || null, contactPhone || null]
      );
    }

    res.json({ message: "Business profile saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not save business profile" });
  }
});

module.exports = router;