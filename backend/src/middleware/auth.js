import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import db from "../config/db.js";

// Load backend environment variables before JWT_SECRET is read.
// This module is imported before server.js executes dotenv.config(), so
// authentication must initialise dotenv here as well.
dotenv.config();

const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error("JWT_SECRET must be configured in backend/.env.");
}

}

export function signUser(user, options = {}) {
  return jwt.sign(
    {
      user_id: user.user_id,
      email: user.email,
      user_role: user.user_role,
      supplier_id: user.supplier_id || null,
      auth_version: Number(user.auth_version || 0),
      purpose: user.purpose || "access",
    },
    secret,
    { expiresIn: options.expiresIn || "8h" },
  );
}

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Authentication required." });
  }

  try {
    const payload = jwt.verify(token, secret);
    const [rows] = await db.execute(
      "SELECT user_id, is_active, auth_version, must_change_password FROM users WHERE user_id = ? LIMIT 1",
      [payload.user_id],
    );
    const account = rows[0];

    if (!account || !account.is_active) {
      return res.status(401).json({ message: "This account is unavailable." });
    }

    if (Number(payload.auth_version ?? -1) !== Number(account.auth_version || 0)) {
      return res.status(401).json({ message: "Your session has expired. Please sign in again." });
    }

    req.user = {
      ...payload,
      auth_version: Number(account.auth_version || 0),
      must_change_password: Boolean(Number(account.must_change_password)),
    };

    if (
      req.user.must_change_password &&
      !req.path.endsWith("/password/change")
    ) {
      return res.status(403).json({
        message: "Change your temporary password before continuing.",
        code: "PASSWORD_CHANGE_REQUIRED",
      });
    }

    return next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Your session has expired. Please sign in again." });
    }
    return next(error);
  }
}


export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.user_role)) {
      return res.status(403).json({ message: "You are not authorised to perform this action." });
    }
    return next();
  };
}

export async function requireSupplier(req, res, next) {
  try {
    const [rows] = await db.execute(
      "SELECT supplier_id FROM suppliers WHERE user_id = ? LIMIT 1",
      [req.user?.user_id],
    );
    const supplierId = rows[0]?.supplier_id;
    if (!supplierId) {
      return res.status(403).json({ message: "A supplier account is required." });
    }
    req.supplierId = Number(supplierId);
    return next();
  } catch (error) {
    return next(error);
  }
}