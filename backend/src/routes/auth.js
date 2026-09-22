const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");

// Login and account registration routes.
router.get("/plans", async (req, res) => {
  try {
    const [plans] = await pool.query(
      "SELECT plan_id, plan_name, monthly_price, max_products, description FROM subscription_plans ORDER BY plan_id",
    );
    res.json(plans);
  } catch (error) {
    console.error("Get subscription plans error:", error);
    res.status(500).json({ message: "Failed to retrieve subscription plans." });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await pool.query(
      "SELECT * FROM users WHERE email = ? LIMIT 1",
      [email],
    );
    if (users.length === 0) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    let buyerId = null;
    let supplierId = null;

    if (user.user_role === "buyer") {
      const [buyers] = await pool.query(
        "SELECT buyer_id FROM buyers WHERE user_id = ? LIMIT 1",
        [user.user_id],
      );
      if (buyers.length > 0) buyerId = buyers[0].buyer_id;
    } else if (user.user_role === "supplier") {
      const [suppliers] = await pool.query(
        "SELECT supplier_id FROM suppliers WHERE user_id = ? LIMIT 1",
        [user.user_id],
      );
      if (suppliers.length > 0) supplierId = suppliers[0].supplier_id;
    }

    const token = jwt.sign(
      { userId: user.user_id, role: user.user_role, buyerId, supplierId },
      process.env.JWT_SECRET || "your_jwt_secret_key_here",
      { expiresIn: "24h" },
    );

    res.json({
      token,
      role: user.user_role,
      userId: user.user_id,
      buyerId,
      supplierId,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login." });
  }
});

router.post("/register-buyer", async (req, res) => {
  const { email, password, business_name, contact_person } = req.body;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const hashedPassword = await bcrypt.hash(password, 10);
    const [userResult] = await connection.query(
      "INSERT INTO users (email, password_hash, user_role) VALUES (?, ?, 'buyer')",
      [email, hashedPassword],
    );

    const buyerInsertValues = [
      userResult.insertId,
      business_name,
      email,
      contact_person || null,
      null,
      null,
      null,
      null,
      null,
    ];

    await connection.query(
      "INSERT INTO buyers (user_id, business_name, email, contact_person, category_id, phone, address, city, province, postal_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      buyerInsertValues,
    );

    const [buyers] = await connection.query(
      "SELECT buyer_id FROM buyers WHERE user_id = ? LIMIT 1",
      [userResult.insertId],
    );

    await connection.commit();
    const token = jwt.sign(
      {
        userId: userResult.insertId,
        role: "buyer",
        buyerId: buyers[0].buyer_id,
        supplierId: null,
      },
      process.env.JWT_SECRET || "your_jwt_secret_key_here",
      { expiresIn: "24h" },
    );

    res.status(201).json({
      message: "Buyer account registered successfully.",
      token,
      role: "buyer",
      userId: userResult.insertId,
      buyerId: buyers[0].buyer_id,
      supplierId: null,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Register buyer error:", error);
    res.status(500).json({
      message:
        error && error.sqlState === "23000"
          ? "Email already exists."
          : "Registration failed.",
    });
  } finally {
    connection.release();
  }
});

// Supplier applications create both the login and supplier records together.
router.post("/register-supplier", async (req, res) => {
  const { email, password, first_name, last_name, business_name, plan_id } =
    req.body;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [plans] = await connection.query(
      "SELECT plan_id FROM subscription_plans WHERE plan_id = ? LIMIT 1",
      [plan_id],
    );
    if (plans.length === 0) {
      await connection.rollback();
      return res
        .status(400)
        .json({ message: "Please select a valid subscription plan." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [userResult] = await connection.query(
      "INSERT INTO users (email, password_hash, user_role) VALUES (?, ?, 'supplier')",
      [email, hashedPassword],
    );

    await connection.query(
      "INSERT INTO suppliers (user_id, business_name, email, first_name, last_name) VALUES (?, ?, ?, ?, ?)",
      [
        userResult.insertId,
        business_name,
        email,
        first_name || null,
        last_name || null,
      ],
    );

    const [supplierResult] = await connection.query(
      "SELECT supplier_id FROM suppliers WHERE user_id = ? LIMIT 1",
      [userResult.insertId],
    );
    await connection.query(
      "INSERT INTO supplier_subscriptions (supplier_id, plan_id, status, start_date, end_date) VALUES (?, ?, 'Pending', NOW(), DATE_ADD(NOW(), INTERVAL 1 MONTH))",
      [supplierResult[0].supplier_id, plan_id],
    );

    await connection.commit();
    res.status(201).json({
      message: "Supplier application submitted successfully.",
      plan_id,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Register supplier error:", error);
    res.status(500).json({
      message:
        error && error.sqlState === "23000"
          ? "Email already exists."
          : "Registration failed.",
    });
  } finally {
    connection.release();
  }
});

module.exports = router;
