import db from "../config/db.js";
import { getProducts } from "../models/productModel.js";

const supplierId = () => Number(process.env.SUPPLIER_ID || 1);
const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || ""));

export async function getSupplierOverview(req, res, next) {
  try {
    const id = supplierId(req);
    const products = await getProducts(id);
    const [orders] = await db.execute(`
      SELECT o.order_number AS id, b.business_name AS buyer,
        DATE_FORMAT(o.ordered_at, '%d %b %Y') AS date,
        o.total_amount AS total, o.order_status AS status,
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
  const connection = await db.getConnection();
  try {
    const allowed = ["Pending", "Confirmed", "Processing", "Dispatched", "Out for delivery", "Shipped", "Delivered", "Cancelled"];
    if (!allowed.includes(req.body.status)) return res.status(400).json({ message: "Invalid order status." });
    const id = supplierId();
    await connection.beginTransaction();
    const [[order]] = await connection.execute("SELECT order_id, order_status FROM orders WHERE order_number = ? AND supplier_id = ? FOR UPDATE", [req.params.id, id]);
    if (!order) { await connection.rollback(); return res.status(404).json({ message: "Order not found." }); }
    const wasProcessing = order.order_status === "Processing";
    const willProcess = req.body.status === "Processing";
    if (!wasProcessing && willProcess) {
      const [items] = await connection.execute("SELECT product_id, quantity FROM order_items WHERE order_id = ?", [order.order_id]);
      for (const item of items) {
        const [[stock]] = await connection.execute("SELECT i.quantity FROM inventory i JOIN products p ON p.product_id=i.product_id WHERE i.product_id=? AND p.supplier_id=? FOR UPDATE", [item.product_id, id]);
        if (!stock || Number(stock.quantity) < Number(item.quantity)) {
          await connection.rollback();
          return res.status(409).json({ message: "Order cannot be moved to Processing because one or more products do not have enough stock." });
        }
        const previous = Number(stock.quantity), next = previous - Number(item.quantity);
        await connection.execute("UPDATE inventory SET quantity=? WHERE product_id=?", [next, item.product_id]);
        await connection.execute("INSERT INTO stock_history(product_id,supplier_id,previous_quantity,new_quantity,change_quantity,reason) VALUES(?,?,?,?,?,?)", [item.product_id,id,previous,next,-Number(item.quantity),"Order fulfilled"]);
      }
    }
    await connection.execute("UPDATE orders SET order_status = ? WHERE order_id = ?", [req.body.status, order.order_id]);
    await connection.commit();
    res.json({ message: willProcess && !wasProcessing ? "Order updated and stock deducted." : "Order updated." });
  } catch (error) { try { await connection.rollback(); } catch {} next(error); } finally { connection.release(); }
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
    const reply = String(req.body.reply_text || "").trim();
    if (reply.length < 2 || reply.length > 1000) return res.status(400).json({ message: "Reply must be between 2 and 1000 characters." });
    const [result] = await db.execute("INSERT INTO review_replies (review_id, supplier_id, reply_text) VALUES (?, ?, ?)", [req.params.id, supplierId(), reply]);
    res.status(201).json({ message: "Reply saved.", reply_id: result.insertId });
  } catch (error) { next(error); }
}

export async function updateProfile(req, res, next) {
  try {
    const allowed = ["businessName", "email", "phone", "location", "description"];
    const fields = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
    const [supplier] = await db.execute("SELECT business_name, email, phone, city, province FROM suppliers WHERE supplier_id = ? LIMIT 1", [supplierId()]);
    if (!supplier[0]) return res.status(404).json({ message: "Supplier not found." });
    if (fields.email !== undefined && !validEmail(fields.email)) return res.status(400).json({ message: "Please enter a valid email address." });
    if (fields.businessName !== undefined && String(fields.businessName).trim().length < 2) return res.status(400).json({ message: "Business name must be at least 2 characters." });
    const [city = "", province = ""] = String(fields.location ?? `${supplier[0].city || ""}, ${supplier[0].province || ""}`).split(",").map((value) => value.trim());
    await db.execute("UPDATE suppliers SET business_name = ?, email = ?, phone = ?, city = ?, province = ? WHERE supplier_id = ?", [fields.businessName || supplier[0].business_name, fields.email || supplier[0].email, fields.phone || supplier[0].phone, city, province, supplierId()]);
    res.json({ ...fields, location: [city, province].filter(Boolean).join(", ") });
  } catch (error) { next(error); }
}
