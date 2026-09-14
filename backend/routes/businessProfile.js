const express = require("express");
const pool = require("../config/db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

// GET /api/business-profile
router.get("/", async (req, res) => {
  try {
    const [[profile]] = await pool.query(
      `SELECT bp.profile_id, bp.business_name, bp.category_id, c.name AS category_name,
              bp.registration_number, bp.logo_url, bp.description,
              bp.contact_person, bp.contact_phone, bp.is_verified
       FROM business_profiles bp
       LEFT JOIN categories c ON c.category_id = bp.category_id
       WHERE bp.user_id = ?`,
      [req.user.userId]
    );

    if (!profile) {
      return res.status(404).json({ error: "No business profile found for this account" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch business profile" });
  }
});

// PUT /api/business-profile
// Creates the profile if one doesn't exist yet, otherwise updates it.
router.put("/", async (req, res) => {
  try {
    const { businessName, categoryId, registrationNumber, contactPerson, contactPhone, description } = req.body;

    if (!businessName || !businessName.trim()) {
      return res.status(400).json({ error: "Business name is required" });
    }

    const [[existing]] = await pool.query(
      "SELECT profile_id FROM business_profiles WHERE user_id = ?",
      [req.user.userId]
    );

    if (existing) {
      await pool.query(
        `UPDATE business_profiles
         SET business_name = ?, category_id = ?, registration_number = ?,
             contact_person = ?, contact_phone = ?, description = ?
         WHERE user_id = ?`,
        [businessName, categoryId, registrationNumber, contactPerson, contactPhone, description, req.user.userId]
      );
    } else {
      await pool.query(
        `INSERT INTO business_profiles
         (user_id, business_name, category_id, registration_number, contact_person, contact_phone, description)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [req.user.userId, businessName, categoryId, registrationNumber, contactPerson, contactPhone, description]
      );
    }

    res.json({ message: "Business profile saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not save business profile" });
  }
});

module.exports = router;
