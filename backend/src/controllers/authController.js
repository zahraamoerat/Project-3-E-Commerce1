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
        s.supplier_id
      FROM users u
      LEFT JOIN suppliers s ON s.user_id = u.user_id
      WHERE u.email = ?
      LIMIT 1`,
      [email]
    );

    const userRecord = rows[0];

    if (
      !userRecord ||
      !userRecord.is_active ||
      userRecord.is_approved === 0 ||
      !(await bcrypt.compare(password, userRecord.password_hash))
    ) {
      return res.status(401).json({
        message: "Invalid email or password.",
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