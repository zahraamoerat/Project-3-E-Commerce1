import {
  getCartItems,
  addCartItem,
  updateCartItem,
  removeCartItem,
  getCartCount
} from '../models/b_cartModel.js';

export async function fetchCart(req, res) {
  try {
    const buyerId = Number(req.query.buyerId || 1);
    const items = await getCartItems(buyerId);

    res.json(items);
  } catch (error) {
    console.error('Error fetching cart:', error.message);

    res.status(500).json({
      message: 'Failed to fetch cart'
    });
  }
}

export async function addItemToCart(req, res) {
  try {
    const buyerId = Number(req.body.buyerId || 1);
    const productId = Number(req.body.productId);
    const quantity = Math.max(1, Number(req.body.quantity || 1));

    if (!productId) {
      return res.status(400).json({
        message: 'Product ID is required'
      });
    }

    const item = await addCartItem(buyerId, productId, quantity);

    res.status(201).json(item);
  } catch (error) {
    console.error('Error adding to cart:', error.message);

    res.status(500).json({
      message: 'Failed to add item to cart'
    });
  }
}

export async function editCartItem(req, res) {
  try {
    const cartItemId = Number(req.params.cartItemId);
    const quantity = Math.max(1, Number(req.body.quantity || 1));

    if (!cartItemId) {
      return res.status(400).json({
        message: 'Cart item ID is required'
      });
    }

    await updateCartItem(cartItemId, quantity);

    res.json({ message: 'Cart item updated successfully' });
  } catch (error) {
    console.error('Error updating cart item:', error.message);

    res.status(500).json({
      message: 'Failed to update cart item'
    });
  }
}

export async function deleteCartItem(req, res) {
  try {
    const cartItemId = Number(req.params.cartItemId);

    if (!cartItemId) {
      return res.status(400).json({
        message: 'Cart item ID is required'
      });
    }

    await removeCartItem(cartItemId);

    res.json({ message: 'Cart item removed successfully' });
  } catch (error) {
    console.error('Error removing cart item:', error.message);

    res.status(500).json({
      message: 'Failed to remove cart item'
    });
  }
}

export async function fetchCartCount(req, res) {
  try {
    const buyerId = Number(req.query.buyerId || 1);
    const count = await getCartCount(buyerId);

    res.json({ count });
  } catch (error) {
    console.error('Error fetching cart count:', error.message);

    res.status(500).json({
      message: 'Failed to fetch cart count'
    });
  }
}