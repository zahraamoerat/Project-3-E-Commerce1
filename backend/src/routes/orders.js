const express = require("express");
const router = express.Router();
const pool = require("../db");
const { authenticateToken } = require("../middleware/auth");

// Create an order and its line items in one transaction.
router.post("/", authenticateToken, async (req, res) => {
  const { supplier_id, total_amount, items } = req.body;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const orderNumber = `WC-${Date.now()}`;
    const [orderResult] = await connection.query(
      "INSERT INTO orders (buyer_id, supplier_id, order_number, status, total_amount) VALUES (?, ?, ?, 'Pending', ?)",
      [req.user.buyerId, supplier_id, orderNumber, total_amount],
    );

    const orderId = orderResult.insertId;

    for (const item of items || []) {
      const unitPrice = Number(item.unit_price ?? item.price ?? 0);
      const quantity = Number(item.quantity ?? 1);
      const subtotal = unitPrice * quantity;

      await connection.query(
        "INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES (?, ?, ?, ?, ?)",
        [orderId, item.product_id, quantity, unitPrice, subtotal],
      );
    }

    await connection.commit();
    res.status(201).json({
      order_id: orderId,
      order_number: orderNumber,
      message: "Order placed successfully.",
    });
  } catch (error) {
    await connection.rollback();
    console.error("Create order error:", error);
    res.status(500).json({ message: "Failed to create order." });
  } finally {
    connection.release();
  }
});

// Return orders for either the logged-in buyer or supplier.
router.get("/", authenticateToken, async (req, res) => {
  try {
    let query = "";
    let param = null;

    if (req.user.role === "buyer") {
      query = `SELECT o.*, s.business_name AS supplier_name
               FROM orders o
               JOIN suppliers s ON o.supplier_id = s.supplier_id
               WHERE o.buyer_id = ?
               ORDER BY o.ordered_at DESC`;
      param = req.user.buyerId;
    } else if (req.user.role === "supplier") {
      query = `SELECT o.*, b.business_name AS buyer_name
               FROM orders o
               JOIN buyers b ON o.buyer_id = b.buyer_id
               WHERE o.supplier_id = ?
               ORDER BY o.ordered_at DESC`;
      param = req.user.supplierId;
    } else {
      return res
        .status(403)
        .json({ message: "Unauthorized role for retrieving orders." });
    }

    const [orders] = await pool.query(query, [param]);
    res.json(orders);
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ message: "Failed to fetch orders." });
  }
});

// Update the status of an existing order.
router.patch("/:id/status", authenticateToken, async (req, res) => {
  const { status } = req.body;

  try {
    await pool.query("UPDATE orders SET status = ? WHERE order_id = ?", [
      status,
      req.params.id,
    ]);
    res.json({ message: "Order status updated successfully." });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ message: "Failed to update order status." });
  }
});

module.exports = router;
