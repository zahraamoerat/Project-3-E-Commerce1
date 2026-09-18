const express = require("express");
const bcrypt = require("bcryptjs");
const { crypto } = require("crypto");
const db = require("../config/db");
const { createToken } = require("../middleware/auth");

const router = express.Router();

// Register Buyer
router.post("/register-buyer", async (req, res) => {
  const { email, password, business_name, phone, address, city, province, postal_code, contact_person } = req.body;
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [existing] = await connection.query("SELECT user_id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      await connection.rollback();
      return res.status(400).json({ message: "Email is already registered." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [userResult] = await connection.query(
      "INSERT INTO users (email, password_hash, user_role, is_approved) VALUES (?, ?, 'buyer', FALSE)",
      [email, passwordHash]
    );

    const userId = userResult.insertId;
    const registrationNum = `REG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    await connection.query(
      `INSERT INTO buyers (user_id, business_name, email, phone, address, city, province, postal_code, contact_person, registration_number)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, business_name, email, phone, address, city, province, postal_code, contact_person, registrationNum]
    );

    await connection.commit();
    res.status(201).json({ message: "Buyer registered successfully. Pending admin approval." });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: "Registration failed.", error: error.message });
  } finally {
    connection.release();
  }
});

// Register Supplier
router.post("/register-supplier", async (req, res) => {
  const { email, password, first_name, last_name, business_name, phone, address, city, province, postal_code } = req.body;
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [existing] = await connection.query("SELECT user_id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      await connection.rollback();
      return res.status(400).json({ message: "Email is already registered." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [userResult] = await connection.query(
      "INSERT INTO users (email, password_hash, user_role, is_approved) VALUES (?, ?, 'supplier', FALSE)",
      [email, passwordHash]
    );

    const userId = userResult.insertId;

    await connection.query(
      `INSERT INTO suppliers (user_id, first_name, last_name, business_name, email, phone, address, city, province, postal_code)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, first_name, last_name, business_name, email, phone, address, city, province, postal_code]
    );

    await connection.commit();
    res.status(201).json({ message: "Supplier registered successfully. Pending admin approval." });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: "Registration failed.", error: error.message });
  } finally {
    connection.release();
  }
});

// Login (All Roles)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const user = users[0];

    if (!user.is_active) {
      return res.status(403).json({ message: "Account is deactivated." });
    }

    if (!user.is_approved && user.user_role !== "admin") {
      return res.status(403).json({ message: "Account is pending admin approval." });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = createToken(user);
    res.json({ token, role: user.user_role, userId: user.user_id });
  } catch (error) {
    res.status(500).json({ message: "Login failed.", error: error.message });
  }
});

module.exports = router;