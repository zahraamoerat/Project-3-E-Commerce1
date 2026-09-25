import db from "../config/db.js";
import bcrypt from "bcryptjs";
import { signUser } from "../middleware/auth.js";

export async function login(req, res, next) {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const [rows] = await db.execute(
      `SELECT
        u.user_id,
        u.email,
        u.password_hash,
        u.user_role,
        u.is_active,
        u.is_approved,
        s.supplier_id,
        s.approval_status
      FROM users u
      LEFT JOIN suppliers s ON s.user_id = u.user_id
      WHERE u.email = ?
      LIMIT 1`,
      [email]
    );

    const userRecord = rows[0];

    if (!userRecord || !(await bcrypt.compare(password, userRecord.password_hash))) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    if (!userRecord.is_active) {
      return res.status(403).json({
        message: "This account has been disabled.",
      });
    }

    if (userRecord.user_role === "supplier" && !userRecord.is_approved) {
      const rejected = userRecord.approval_status === "Rejected";
      return res.status(403).json({
        message: rejected
          ? "Your supplier application was rejected. Please contact support."
          : "Your supplier application is pending approval. You will be able to sign in once an administrator approves it.",
      });
    }

    if (!userRecord.is_approved) {
      return res.status(403).json({
        message: "Your account is pending approval.",
      });
    }

    const user = {
      user_id: userRecord.user_id,
      email: userRecord.email,
      user_role: userRecord.user_role,
      supplier_id: userRecord.supplier_id || null,
    };

    const buyerId =
      user.user_role === "buyer"
        ? await getBuyerId(user.user_id)
        : null;

    return res.json({
      token: signUser(user),
      user,
      role: user.user_role,
      userId: user.user_id,
      buyerId,
      supplierId: user.supplier_id,
    });
  } catch (error) {
    next(error);
  }
}

async function getBuyerId(userId) {
  const [rows] = await db.execute(
    "SELECT buyer_id FROM buyers WHERE user_id = ? LIMIT 1",
    [userId]
  );

  return rows[0]?.buyer_id || null;
}

export async function me(req, res) {
  res.json({
    user: req.user,
  });
}

// ===============================
// SUBSCRIPTION PLANS
// ===============================

export async function getSubscriptionPlans(req, res, next) {
  try {
    const [plans] = await db.execute(
      `SELECT plan_id, plan_name, monthly_price, max_products, description
       FROM subscription_plans
       ORDER BY plan_id`
    );

    res.json(plans);
  } catch (error) {
    next(error);
  }
}

// ===============================
// REGISTER BUYER / SUPPLIER
// ===============================

function isUniqueViolation(error) {
  return (
    error?.code === "ER_DUP_ENTRY" ||
    (error?.sqlState === "23000" && error?.errno === 1062)
  );
}

export async function registerBuyer(req, res, next) {
  const connection = await db.getConnection();

  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const businessName = String(req.body.business_name || "").trim();
    const contactPerson = String(req.body.contact_person || "").trim();

    if (!email || !password || !businessName) {
      return res
        .status(400)
        .json({ message: "Email, password and business name are required." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await connection.beginTransaction();

    const [userResult] = await connection.execute(
      `INSERT INTO users (email, password_hash, user_role, is_approved)
       VALUES (?, ?, 'buyer', TRUE)`,
      [email, passwordHash]
    );

    const userId = userResult.insertId;

    await connection.execute(
      `INSERT INTO buyers (user_id, business_name, email, contact_person)
       VALUES (?, ?, ?, ?)`,
      [userId, businessName, email, contactPerson || null]
    );

    const [[buyer]] = await connection.execute(
      `SELECT buyer_id FROM buyers WHERE user_id = ? LIMIT 1`,
      [userId]
    );

    await connection.commit();

    const user = {
      user_id: userId,
      email,
      user_role: "buyer",
      supplier_id: null,
    };

    return res.status(201).json({
      message: "Buyer account registered successfully.",
      token: signUser(user),
      role: "buyer",
      userId,
      buyerId: buyer?.buyer_id || null,
      supplierId: null,
    });
  } catch (error) {
    await connection.rollback();

    if (isUniqueViolation(error)) {
      return res.status(409).json({ message: "This email is already registered." });
    }

    console.error("Register buyer error:", error.message);
    next(error);
  } finally {
    connection.release();
  }
}

export async function registerSupplier(req, res, next) {
  const connection = await db.getConnection();

  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const firstName = String(req.body.first_name || "").trim();
    const lastName = String(req.body.last_name || "").trim();
    const businessName = String(req.body.business_name || "").trim();
    const planId = Number(req.body.plan_id);

    if (!email || !password || !businessName) {
      return res
        .status(400)
        .json({ message: "Email, password and company name are required." });
    }

    const [plans] = await connection.execute(
      "SELECT plan_id FROM subscription_plans WHERE plan_id = ? LIMIT 1",
      [planId]
    );
    if (plans.length === 0) {
      return res
        .status(400)
        .json({ message: "Please select a valid subscription plan." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await connection.beginTransaction();

    const [userResult] = await connection.execute(
      `INSERT INTO users (email, password_hash, user_role, is_approved)
       VALUES (?, ?, 'supplier', 0)`,
      [email, passwordHash]
    );

    const userId = userResult.insertId;

    await connection.execute(
      `INSERT INTO suppliers (user_id, business_name, email, first_name, last_name, approval_status)
       VALUES (?, ?, ?, ?, ?, 'Pending')`,
      [userId, businessName, email, firstName || null, lastName || null]
    );

    const [[supplier]] = await connection.execute(
      `SELECT supplier_id FROM suppliers WHERE user_id = ? LIMIT 1`,
      [userId]
    );

    await connection.execute(
      `INSERT INTO supplier_subscriptions (supplier_id, plan_id, status, start_date, end_date)
       VALUES (?, ?, 'Paused', NOW(), DATE_ADD(NOW(), INTERVAL 1 MONTH))`,
      [supplier?.supplier_id, planId]
    );

    await connection.commit();

    return res.status(201).json({
      message: "Supplier application submitted successfully.",
      plan_id: planId,
    });
  } catch (error) {
    await connection.rollback();

    if (isUniqueViolation(error)) {
      return res.status(409).json({ message: "This email is already registered." });
    }

    console.error("Register supplier error:", error.message);
    next(error);
  } finally {
    connection.release();
  }
}