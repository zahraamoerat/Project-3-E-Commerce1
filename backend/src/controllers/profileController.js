import db from "../config/db.js";

const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || ""));

function getIdentity(req) {
  const userId = Number(req.user?.userId ?? req.user?.user_id);
  const role = req.user?.role ?? req.user?.user_role;
  return { userId, role };
}

export async function getProfile(req, res, next) {
  try {
    const { userId, role } = getIdentity(req);
    if (!userId || !["buyer", "supplier"].includes(role)) {
      return res.status(403).json({ message: "A valid account is required." });
    }

    if (role === "supplier") {
      const [[profile]] = await db.execute(
        `SELECT supplier_id AS businessId, user_id AS userId, first_name AS firstName,
          last_name AS lastName, business_name AS businessName, email, phone, address,
          city, province, postal_code AS postalCode, is_verified AS isVerified,
          approval_status AS approvalStatus
         FROM suppliers WHERE user_id = ? LIMIT 1`,
        [userId],
      );
      if (!profile) return res.status(404).json({ message: "Supplier profile not found." });

      const [[stats]] = await db.execute(
        `SELECT
          (SELECT COUNT(*) FROM products WHERE supplier_id = s.supplier_id) AS products,
          (SELECT COUNT(*) FROM orders WHERE supplier_id = s.supplier_id) AS orders
         FROM suppliers s WHERE s.supplier_id = ?`,
        [profile.businessId],
      );
      return res.json({
        role, profile,
        stats: { products: Number(stats.products), orders: Number(stats.orders) },
      });
    }

    const [[profile]] = await db.execute(
      `SELECT buyer_id AS businessId, user_id AS userId, business_name AS businessName,
        email, contact_person AS contactPerson, phone, address, city, province,
        postal_code AS postalCode
       FROM buyers WHERE user_id = ? LIMIT 1`,
      [userId],
    );
    if (!profile) return res.status(404).json({ message: "Small business profile not found." });

    const [[stats]] = await db.execute(
      `SELECT
        (SELECT COUNT(*) FROM orders WHERE buyer_id = b.buyer_id) AS orders,
        (SELECT COUNT(DISTINCT supplier_id) FROM orders WHERE buyer_id = b.buyer_id) AS suppliers
       FROM buyers b WHERE b.buyer_id = ?`,
      [profile.businessId],
    );

    const nameParts = String(profile.contactPerson || "").trim().split(/\s+/).filter(Boolean);
    profile.firstName = nameParts.shift() || "";
    profile.lastName = nameParts.join(" ");

    res.json({
      role, profile,
      stats: { orders: Number(stats.orders), suppliers: Number(stats.suppliers) },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const { userId, role } = getIdentity(req);
    if (!userId || !["buyer", "supplier"].includes(role)) {
      return res.status(403).json({ message: "A valid account is required." });
    }

    const {
      firstName = "", lastName = "", businessName = "", email = "",
      phone = "", city = "", province = "", postalCode = "", address = "",
    } = req.body;

    if (!validEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }
    if (String(businessName).trim().length < 2) {
      return res.status(400).json({ message: "Business name must be at least 2 characters." });
    }

    if (role === "supplier") {
      await db.execute(
        `UPDATE suppliers
         SET first_name=?, last_name=?, business_name=?, email=?, phone=?,
             address=?, city=?, province=?, postal_code=?
         WHERE user_id=?`,
        [firstName.trim(), lastName.trim(), businessName.trim(), email.trim(),
         phone.trim(), address.trim(), city.trim(), province.trim(), postalCode.trim(), userId],
      );
    } else {
      await db.execute(
        `UPDATE buyers
         SET business_name=?, email=?, contact_person=?, phone=?,
             address=?, city=?, province=?, postal_code=?
         WHERE user_id=?`,
        [businessName.trim(), email.trim(),
         [firstName.trim(), lastName.trim()].filter(Boolean).join(" "),
         phone.trim(), address.trim(), city.trim(), province.trim(), postalCode.trim(), userId],
      );
    }

    await db.execute("UPDATE users SET email=? WHERE user_id=?", [email.trim(), userId]);
    return getProfile(req, res, next);
  } catch (error) {
    if (error?.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "That email address is already in use." });
    }
    next(error);
  }
}
