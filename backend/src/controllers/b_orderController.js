import {
  getAllOrders,
  getOrderById
} from '../models/b_orderModel.js';

// Return all orders to the frontend.
export async function fetchOrders(req, res) {
  try {
    const orders = await getAllOrders();

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

    const order = await getOrderById(orderId);

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
