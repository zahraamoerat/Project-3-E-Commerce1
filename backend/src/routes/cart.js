const express = require("express");
const router = express.Router();
const pool = require("../db");
const { authenticateToken } = require("../middleware/auth");

// Read the current buyer cart.
router.get("/", authenticateToken, async (req, res) => {
  const buyerId = req.query.buyerId || req.user.buyerId;

  try {
    const [items] = await pool.query(
      `SELECT
         ci.cart_item_id,
         ci.product_id,
         ci.quantity,
         p.product_name,
         p.price AS unit_price,
         p.product_image AS image_url,
         s.supplier_id,
         s.business_name AS supplier_name
       FROM cart_items ci
       JOIN products p ON p.product_id = ci.product_id
       JOIN suppliers s ON s.supplier_id = p.supplier_id
       WHERE ci.buyer_id = ?
       ORDER BY ci.created_at DESC`,
      [buyerId],
    );

    res.json(items);
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ message: "Failed to fetch cart." });
  }
});

// Add a new item or increase the quantity of an existing item.
router.post("/", authenticateToken, async (req, res) => {
  const { buyerId, productId, quantity = 1 } = req.body;
  const targetBuyerId = buyerId || req.user.buyerId;

  if (!targetBuyerId || !productId) {
    return res
      .status(400)
      .json({ message: "buyerId and productId are required." });
  }

  try {
    const [existing] = await pool.query(
      "SELECT cart_item_id, quantity FROM cart_items WHERE buyer_id = ? AND product_id = ? LIMIT 1",
      [targetBuyerId, productId],
    );

    if (existing.length > 0) {
      const newQty = Number(existing[0].quantity) + Number(quantity);
      await pool.query(
        "UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?",
        [newQty, existing[0].cart_item_id],
      );

      return res.json({
        message: "Cart updated successfully.",
        cart_item_id: existing[0].cart_item_id,
        quantity: newQty,
      });
    }

    const [result] = await pool.query(
      "INSERT INTO cart_items (buyer_id, product_id, quantity) VALUES (?, ?, ?)",
      [targetBuyerId, productId, quantity],
    );

    res
      .status(201)
      .json({ cart_item_id: result.insertId, message: "Item added to cart." });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: "Failed to add item to cart." });
  }
});

// Update one cart item quantity.
router.patch("/:id", authenticateToken, async (req, res) => {
  const { buyerId, quantity } = req.body;
  const targetBuyerId = buyerId || req.user.buyerId;

  try {
    const [rows] = await pool.query(
      "SELECT cart_item_id FROM cart_items WHERE cart_item_id = ? AND buyer_id = ? LIMIT 1",
      [req.params.id, targetBuyerId],
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Cart item not found." });
    }

    await pool.query(
      "UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?",
      [quantity, req.params.id],
    );

    res.json({ message: "Cart item updated." });
  } catch (error) {
    console.error("Update cart item error:", error);
    res.status(500).json({ message: "Failed to update cart item." });
  }
});

// Remove one cart item.
router.delete("/:id", authenticateToken, async (req, res) => {
  const buyerId = req.query.buyerId || req.user.buyerId;

  try {
    const [rows] = await pool.query(
      "DELETE FROM cart_items WHERE cart_item_id = ? AND buyer_id = ?",
      [req.params.id, buyerId],
    );

    if (rows.affectedRows === 0) {
      return res.status(404).json({ message: "Cart item not found." });
    }

    res.json({ message: "Cart item removed." });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({ message: "Failed to remove cart item." });
  }
});

module.exports = router;
