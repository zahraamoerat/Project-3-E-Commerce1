import db from "../config/db.js";
import { getProducts } from "../models/productModel.js";

const supplierId = () => Number(process.env.SUPPLIER_ID || 1);

export async function getSupplierOverview(req, res, next) {
  try {
    const id = supplierId();
    const products = await getProducts();
    const [orders] = await db.execute(`
      SELECT o.order_number AS id, b.business_name AS buyer,
        DATE_FORMAT(o.ordered_at, '%d %b %Y') AS date,
        o.total_amount AS total, o.status,
        GROUP_CONCAT(DISTINCT p.product_name ORDER BY p.product_name SEPARATOR ', ') AS items
      FROM orders o
      JOIN buyers b ON b.buyer_id = o.buyer_id
      LEFT JOIN order_items oi ON oi.order_id = o.order_id
      LEFT JOIN products p ON p.product_id = oi.product_id
      WHERE o.supplier_id = ?
      GROUP BY o.order_id
      ORDER BY o.ordered_at DESC`, [id]);
    const [deliveries] = await db.execute(`
      SELECT d.delivery_id AS id, o.order_number AS \`order\`, b.business_name AS destination,
        d.estimated_arrival AS eta, d.current_status AS status,
        COALESCE(d.courier_name, d.delivery_method) AS carrier
      FROM deliveries d
      JOIN orders o ON o.order_id = d.order_id
      JOIN buyers b ON b.buyer_id = o.buyer_id
      WHERE o.supplier_id = ? ORDER BY d.created_at DESC`, [id]);
    const [reviews] = await db.execute(`
      SELECT r.review_id AS id, b.business_name AS buyer, r.rating,
        CONCAT('Review for ', p.product_name) AS title, r.review_text AS text,
        DATE_FORMAT(r.review_date, '%d %b %Y') AS date,
        EXISTS(SELECT 1 FROM review_replies rr WHERE rr.review_id = r.review_id AND rr.supplier_id = ?) AS replied
      FROM reviews r JOIN buyers b ON b.buyer_id = r.buyer_id JOIN products p ON p.product_id = r.product_id
      WHERE p.supplier_id = ? AND r.status = 'Published' ORDER BY r.review_date DESC`, [id, id]);
    const [supplierRows] = await db.execute(`
      SELECT business_name AS businessName, email, phone,
        CONCAT_WS(', ', city, province) AS location,
        business_name AS owner, '' AS description
      FROM suppliers WHERE supplier_id = ? LIMIT 1`, [id]);
    const orderStatus = (status) => status === "Shipped" ? "Ready to ship" : status;
    const deliveryStatus = (status) => status === "Preparing Dispatch" ? "Ready for pickup" : status === "In Transit" ? "In transit" : status;
    res.json({
      products,
      orders: orders.map((order) => ({ ...order, total: Number(order.total), status: orderStatus(order.status) })),
      deliveries: deliveries.map((delivery) => ({ ...delivery, status: deliveryStatus(delivery.status) })),
      reviews: reviews.map((review) => ({ ...review, rating: Number(review.rating), replied: Boolean(review.replied) })),
      profile: supplierRows[0] || null,
    });
  } catch (error) { next(error); }
}

export async function updateOrder(req, res, next) {
  try {
    const allowed = ["Pending", "Processing", "Shipped", "Out for delivery", "Delivered", "Cancelled"];
    if (!allowed.includes(req.body.status)) return res.status(400).json({ message: "Invalid order status." });
    const [result] = await db.execute("UPDATE orders SET status = ? WHERE order_number = ? AND supplier_id = ?", [req.body.status, req.params.id, supplierId()]);
    if (!result.affectedRows) return res.status(404).json({ message: "Order not found." });
    res.json({ message: "Order updated." });
  } catch (error) { next(error); }
}

export async function updateDelivery(req, res, next) {
  try {
    const statusMap = { "Ready for pickup": "Preparing Dispatch", "In transit": "In Transit", Delivered: "Delivered" };
    const status = statusMap[req.body.status] || req.body.status;
    const [result] = await db.execute(`UPDATE deliveries d JOIN orders o ON o.order_id = d.order_id SET d.current_status = ? WHERE d.delivery_id = ? AND o.supplier_id = ?`, [status, req.params.id, supplierId()]);
    if (!result.affectedRows) return res.status(404).json({ message: "Delivery not found." });
    res.json({ message: "Delivery updated." });
  } catch (error) { next(error); }
}

export async function replyToReview(req, res, next) {
  try {
    const [result] = await db.execute("INSERT INTO review_replies (review_id, supplier_id, reply_text) VALUES (?, ?, ?)", [req.params.id, supplierId(), req.body.reply_text || "Thank you for your feedback."]);
    res.status(201).json({ message: "Reply saved.", reply_id: result.insertId });
  } catch (error) { next(error); }
}

export async function updateProfile(req, res, next) {
  try {
    const allowed = ["businessName", "email", "phone", "location", "description"];
    const fields = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
    const [supplier] = await db.execute("SELECT business_name, email, phone, city, province FROM suppliers WHERE supplier_id = ? LIMIT 1", [supplierId()]);
    if (!supplier[0]) return res.status(404).json({ message: "Supplier not found." });
    const [city = "", province = ""] = String(fields.location ?? `${supplier[0].city || ""}, ${supplier[0].province || ""}`).split(",").map((value) => value.trim());
    await db.execute("UPDATE suppliers SET business_name = ?, email = ?, phone = ?, city = ?, province = ? WHERE supplier_id = ?", [fields.businessName || supplier[0].business_name, fields.email || supplier[0].email, fields.phone || supplier[0].phone, city, province, supplierId()]);
    res.json({ ...fields, location: [city, province].filter(Boolean).join(", ") });
  } catch (error) { next(error); }
}
