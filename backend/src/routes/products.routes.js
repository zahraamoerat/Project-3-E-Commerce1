const express = require("express");
const db = require("../config/db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const [products] = await db.query(`
      SELECT
        p.product_id,
        p.product_name,
        p.description,
        p.unit_price,
        p.stock_quantity,
        p.low_stock_threshold,
        p.status,
        p.image_url,
        p.supplier_id,
        s.business_name AS supplier_name,
        c.category_id,
        c.category_name
      FROM products p
      INNER JOIN suppliers s ON s.supplier_id = p.supplier_id
      LEFT JOIN categories c ON c.category_id = p.category_id
      WHERE p.status = 'Active'
        AND s.approval_status = 'Approved'
      ORDER BY p.created_at DESC
    `);
    res.json(products);
  } catch (error) {
    next(error);
  }
});

router.get("/:productId", async (req, res, next) => {
  const productId = Number(req.params.productId);
  if (!Number.isInteger(productId) || productId < 1) {
    return res.status(400).json({ message: "Invalid product ID." });
  }

  try {
    const [products] = await db.query(`
      SELECT
        p.product_id,
        p.product_name,
        p.description,
        p.unit_price,
        p.stock_quantity,
        p.low_stock_threshold,
        p.status,
        p.image_url,
        p.supplier_id,
        s.business_name AS supplier_name,
        c.category_id,
        c.category_name
      FROM products p
      INNER JOIN suppliers s ON s.supplier_id = p.supplier_id
      LEFT JOIN categories c ON c.category_id = p.category_id
      WHERE p.product_id = ?
        AND p.status = 'Active'
        AND s.approval_status = 'Approved'
    `, [productId]);

    if (!products.length) return res.status(404).json({ message: "Product not found." });
    res.json(products[0]);
  } catch (error) {
    next(error);
  }
});

router.post("/", requireAuth, async (req, res, next) => {
  if (req.user.role !== "supplier" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Supplier access required." });
  }

  const { product_name, description, unit_price, stock_quantity, low_stock_threshold, category_id, image_url } = req.body;
  const price = Number(unit_price);
  const stock = Number(stock_quantity || 0);

  if (!product_name || !Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0) {
    return res.status(400).json({ message: "Product name, valid price and stock quantity are required." });
  }

  try {
    let supplierId = req.user.supplierId;
    if (req.user.role === "admin" && req.body.supplier_id) supplierId = Number(req.body.supplier_id);

    if (!supplierId) return res.status(400).json({ message: "Supplier profile not found." });

    const [result] = await db.query(
      `INSERT INTO products
        (supplier_id, category_id, product_name, description, unit_price, stock_quantity, low_stock_threshold, status, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'Active', ?)`,
      [supplierId, category_id || null, product_name, description || null, price, stock, low_stock_threshold || 20, image_url || null]
    );

    res.status(201).json({ productId: result.insertId, message: "Product created successfully." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
