const express = require("express");
const router = express.Router();
const pool = require("../db");
const { authenticateToken, requireRole } = require("../middleware/auth");

// Public product catalogue routes.
router.get("/", async (req, res) => {
  try {
    const [products] = await pool.query(
      `SELECT
         p.product_id,
         p.product_name,
         p.description,
         p.price AS unit_price,
         p.compare_price,
         p.product_image AS image_url,
         p.is_active AS status,
         c.category_name,
         s.business_name AS supplier_name,
         COALESCE(i.quantity, 0) AS stock_quantity
       FROM products p
       JOIN suppliers s ON p.supplier_id = s.supplier_id
       LEFT JOIN categories c ON p.category_id = c.category_id
       LEFT JOIN inventory i ON i.product_id = p.product_id
       WHERE p.is_active = TRUE`,
    );

    res.json(products);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Failed to retrieve products." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [products] = await pool.query(
      `SELECT
         p.*,
         s.business_name AS supplier_name,
         c.category_name,
         COALESCE(i.quantity, 0) AS stock_quantity
       FROM products p
       JOIN suppliers s ON p.supplier_id = s.supplier_id
       LEFT JOIN categories c ON p.category_id = c.category_id
       LEFT JOIN inventory i ON i.product_id = p.product_id
       WHERE p.product_id = ?`,
      [req.params.id],
    );

    if (products.length === 0) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.json(products[0]);
  } catch (error) {
    console.error("Get product by id error:", error);
    res.status(500).json({ message: "Failed to retrieve product details." });
  }
});

// Suppliers can create products after authentication.
router.post(
  "/",
  authenticateToken,
  requireRole("supplier"),
  async (req, res) => {
    const { product_name, description, price, category_id, stock_quantity } =
      req.body;

    try {
      const [result] = await pool.query(
        `INSERT INTO products (
         supplier_id, category_id, product_name, description, price, is_active
       ) VALUES (?, ?, ?, ?, ?, TRUE)`,
        [
          req.user.supplierId,
          category_id || null,
          product_name,
          description || null,
          price,
        ],
      );

      if (stock_quantity !== undefined && stock_quantity !== null) {
        await pool.query(
          `INSERT INTO inventory (product_id, quantity, low_stock_threshold)
         VALUES (?, ?, 10)
         ON DUPLICATE KEY UPDATE quantity = VALUES(quantity)`,
          [result.insertId, stock_quantity],
        );
      }

      res.status(201).json({
        product_id: result.insertId,
        message: "Product created successfully.",
      });
    } catch (error) {
      console.error("Create product error:", error);
      res.status(500).json({ message: "Failed to create product." });
    }
  },
);

module.exports = router;
