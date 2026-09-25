import db from "../config/db.js";

export async function listSuppliers(req, res, next) {
  try {
    const [rows] = await db.execute(
      `SELECT
         s.supplier_id,
         s.business_name,
         s.email,
         s.first_name,
         s.last_name,
         s.phone,
         s.city,
         s.province,
         s.approval_status,
         s.approved_at,
         s.created_at AS applied_at,
         u.is_approved,
         u.user_id,
         sp.plan_id,
         sp.plan_name,
         sub.status AS subscription_status
       FROM suppliers s
       JOIN users u ON u.user_id = s.user_id
       LEFT JOIN supplier_subscriptions sub ON sub.supplier_id = s.supplier_id
       LEFT JOIN subscription_plans sp ON sp.plan_id = sub.plan_id
       ORDER BY s.approval_status = 'Pending' DESC, s.created_at ASC`
    );

    res.json(rows);
  } catch (error) {
    next(error);
  }
}

export async function approveSupplier(req, res, next) {
  const connection = await db.getConnection();

  try {
    const supplierId = Number(req.params.id);

    if (!Number.isInteger(supplierId)) {
      return res.status(400).json({ message: "Invalid supplier id." });
    }

    await connection.beginTransaction();

    const [supplierRows] = await connection.execute(
      `SELECT user_id FROM suppliers WHERE supplier_id = ? LIMIT 1`,
      [supplierId]
    );
    const supplier = supplierRows[0];
    if (!supplier) {
      await connection.rollback();
      return res.status(404).json({ message: "Supplier not found." });
    }

    const [updateResult] = await connection.execute(
      `UPDATE suppliers
       SET approval_status = 'Approved', approved_at = NOW(), is_verified = 1
       WHERE supplier_id = ? AND approval_status = 'Pending'`,
      [supplierId]
    );
    if (updateResult.affectedRows === 0) {
      await connection.rollback();
      return res
        .status(400)
        .json({ message: "This application is no longer pending." });
    }

    await connection.execute(
      `UPDATE users SET is_approved = 1 WHERE user_id = ?`,
      [supplier.user_id]
    );

    await connection.execute(
      `UPDATE supplier_subscriptions
       SET status = 'Active'
       WHERE supplier_id = ?`,
      [supplierId]
    );

    await connection.commit();

    res.json({ message: "Supplier approved.", supplier_id: supplierId });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
}

export async function rejectSupplier(req, res, next) {
  const connection = await db.getConnection();

  try {
    const supplierId = Number(req.params.id);

    if (!Number.isInteger(supplierId)) {
      return res.status(400).json({ message: "Invalid supplier id." });
    }

    const [updateResult] = await connection.execute(
      `UPDATE suppliers
       SET approval_status = 'Rejected'
       WHERE supplier_id = ? AND approval_status = 'Pending'`,
      [supplierId]
    );

    if (updateResult.affectedRows === 0) {
      return res
        .status(400)
        .json({ message: "This application is no longer pending." });
    }

    res.json({ message: "Supplier application rejected.", supplier_id: supplierId });
  } catch (error) {
    next(error);
  } finally {
    connection.release();
  }
}