const express = require("express");
const db = require("../config/db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

const getBuyerId = (request) => {
  const authenticatedId = Number(request.user?.buyerId);
  if (Number.isInteger(authenticatedId) && authenticatedId > 0) return authenticatedId;
  const buyerId = Number(request.body.buyerId ?? request.query.buyerId);
  return Number.isInteger(buyerId) && buyerId > 0 ? buyerId : null;
};

router.get("/", requireAuth, async (request, response, next) => {
  const buyerId = getBuyerId(request);

  if (!buyerId) {
    return response
      .status(400)
      .json({ message: "A valid buyerId is required." });
  }

  try {
    const [items] = await db.query(
      `
        SELECT
          ci.cart_item_id,
          ci.quantity,
          p.product_id,
          p.product_name,
          p.unit_price,
          p.image_url,
          s.supplier_id,
          s.business_name AS supplier_name
        FROM cart_items ci
        INNER JOIN products p ON p.product_id = ci.product_id
        INNER JOIN suppliers s ON s.supplier_id = p.supplier_id
        WHERE ci.buyer_id = ?
        ORDER BY ci.created_at DESC
      `,
      [buyerId],
    );

    response.json(items);
  } catch (error) {
    next(error);
  }
});

router.post("/", requireAuth, async (request, response, next) => {
  const buyerId = getBuyerId(request);
  const productId = Number(request.body.productId);
  const quantity = Number(request.body.quantity ?? 1);

  if (
    !buyerId ||
    !Number.isInteger(productId) ||
    productId < 1 ||
    !Number.isInteger(quantity) ||
    quantity < 1
  ) {
    return response.status(400).json({
      message:
        "buyerId, productId, and a positive integer quantity are required.",
    });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [existingItems] = await connection.query(
      "SELECT cart_item_id FROM cart_items WHERE buyer_id = ? AND product_id = ? FOR UPDATE",
      [buyerId, productId],
    );

    if (existingItems.length > 0) {
      await connection.query(
        "UPDATE cart_items SET quantity = quantity + ? WHERE cart_item_id = ?",
        [quantity, existingItems[0].cart_item_id],
      );
    } else {
      await connection.query(
        "INSERT INTO cart_items (buyer_id, product_id, quantity) VALUES (?, ?, ?)",
        [buyerId, productId, quantity],
      );
    }

    await connection.commit();

    response.status(201).json({ message: "Item added to cart." });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
});

router.patch("/:cartItemId", requireAuth, async (request, response, next) => {
  const buyerId = getBuyerId(request);
  const cartItemId = Number(request.params.cartItemId);
  const quantity = Number(request.body.quantity);

  if (
    !buyerId ||
    !Number.isInteger(cartItemId) ||
    cartItemId < 1 ||
    !Number.isInteger(quantity) ||
    quantity < 1
  ) {
    return response.status(400).json({
      message:
        "buyerId, cartItemId, and a positive integer quantity are required.",
    });
  }

  try {
    const [result] = await db.query(
      "UPDATE cart_items SET quantity = ? WHERE cart_item_id = ? AND buyer_id = ?",
      [quantity, cartItemId, buyerId],
    );

    if (result.affectedRows === 0) {
      return response.status(404).json({ message: "Cart item not found." });
    }

    response.json({ message: "Cart item updated." });
  } catch (error) {
    next(error);
  }
});

router.delete("/:cartItemId", requireAuth, async (request, response, next) => {
  const buyerId = Number(request.query.buyerId);
  const cartItemId = Number(request.params.cartItemId);

  if (
    !Number.isInteger(buyerId) ||
    buyerId < 1 ||
    !Number.isInteger(cartItemId) ||
    cartItemId < 1
  ) {
    return response
      .status(400)
      .json({ message: "Valid buyerId and cartItemId are required." });
  }

  try {
    const [result] = await db.query(
      "DELETE FROM cart_items WHERE cart_item_id = ? AND buyer_id = ?",
      [cartItemId, buyerId],
    );

    if (result.affectedRows === 0) {
      return response.status(404).json({ message: "Cart item not found." });
    }

    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
