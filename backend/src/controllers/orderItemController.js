import { getOrderItems } from '../models/orderItemModel.js';

// Return all items for one order.
export async function fetchOrderItems(req, res) {
  try {
    const { orderId } = req.params;

    const items = await getOrderItems(orderId);

    res.json(items);
  } catch (error) {
    console.error('Error fetching order items:', error.message);

    res.status(500).json({
      message: 'Failed to fetch order items'
    });
  }
}