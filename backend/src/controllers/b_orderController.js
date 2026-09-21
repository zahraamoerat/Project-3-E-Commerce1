import {
  getAllOrders,
  getOrderById
} from '../models/b_orderModel.js';

// Return all orders to the frontend.
export async function fetchOrders(req, res) {
  try {
    const buyerId = req.query.buyerId ? Number(req.query.buyerId) : null;\n    const orders = await getAllOrders(buyerId);

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error.message);

    res.status(500).json({
      message: 'Failed to fetch orders'
    });
  }
}

// Return one order to the frontend.
export async function fetchOrderById(req, res) {
  try {
    const { orderId } = req.params;

    const buyerId = req.query.buyerId ? Number(req.query.buyerId) : null;\n    const order = await getOrderById(orderId, buyerId);

    if (!order) {
      return res.status(404).json({
        message: 'Order not found'
      });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error.message);

    res.status(500).json({
      message: 'Failed to fetch order'
    });
  }
}
