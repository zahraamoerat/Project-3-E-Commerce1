import db from "../config/db.js";

export async function listSuppliers(req, res, next) {
  try {
    const [rows] = await db.execute(`
      SELECT
        s.supplier_id AS supplierId,
        s.business_name AS businessName,
        s.email,
        s.phone,
        s.city,
        s.province,
        s.logo_url AS logoUrl,
        s.is_verified AS isVerified,
        s.is_featured AS isFeatured,
        s.quick_delivery AS quickDelivery,
        s.min_order_value AS minOrderValue,
        s.lead_time_days AS leadTimeDays,
        COUNT(DISTINCT p.product_id) AS productCount
      FROM suppliers s
      LEFT JOIN products p ON p.supplier_id = s.supplier_id
      WHERE COALESCE(s.approval_status, 'Approved') = 'Approved'
      GROUP BY
        s.supplier_id, s.business_name, s.email, s.phone, s.city, s.province,
        s.logo_url, s.is_verified, s.is_featured, s.quick_delivery,
        s.min_order_value, s.lead_time_days
      ORDER BY s.is_featured DESC, s.is_verified DESC, s.business_name ASC
    `);

    res.json(rows.map((supplier) => ({
      ...supplier,
      supplierId: Number(supplier.supplierId),
      isVerified: Boolean(supplier.isVerified),
      isFeatured: Boolean(supplier.isFeatured),
      quickDelivery: Boolean(supplier.quickDelivery),
      minOrderValue: Number(supplier.minOrderValue || 0),
      leadTimeDays: Number(supplier.leadTimeDays || 1),
      productCount: Number(supplier.productCount || 0)
    })));
  } catch (error) {
    next(error);
  }
}
