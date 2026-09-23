import {
  getAllOrders,
  getOrderById,
  getOrderWithDelivery,
  setOrderDeliveryMethod,
  createDeliveryForOrder,
  cancelDeliveryForOrder
} from '../models/b_orderModel.js';

const DELIVERY_LOCKED_STATUSES = [
  'Dispatched',
  'In Transit',
  'Out for Delivery',
  'Delayed',
  'Delivered'
];

// Return all orders to the frontend.
export async function fetchOrders(req, res) {
  try {
    const buyerId = req.query.buyerId ? Number(req.query.buyerId) : null;
    const orders = await getAllOrders(buyerId);

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

    const buyerId = req.query.buyerId ? Number(req.query.buyerId) : null;  const order = await getOrderById(orderId, buyerId);

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

// Let the buyer choose how this order will be fulfilled. Self collection
// keeps the order free of an active WeConnect delivery. WeConnect delivery
// creates the delivery record in "Preparing Dispatch", never "In Transit".
export async function chooseDeliveryMethod(req, res) {
  const orderId = Number(req.params.orderId);
  const buyerId = req.query.buyerId ? Number(req.query.buyerId) : null;
  const method = req.body?.method;

  try {
    if (!Number.isInteger(orderId) || orderId <= 0) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    if (!['Self Collection', 'WeConnect Delivery'].includes(method)) {
      return res.status(400).json({ message: 'Invalid delivery method.' });
    }

    const order = await getOrderWithDelivery(orderId, buyerId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (method === 'WeConnect Delivery') {
      const deliveryId = await createDeliveryForOrder(orderId);
      await setOrderDeliveryMethod(orderId, method);

      return res.json({
        order_id: orderId,
        delivery_method: method,
        delivery_id: deliveryId,
        delivery_status: 'Preparing Dispatch',
        message:
          'WeConnect delivery requested. Set up the pickup and destination next.'
      });
    }

    const status = order.delivery_status;

    if (status && DELIVERY_LOCKED_STATUSES.includes(status)) {
      return res.status(409).json({
        order_id: orderId,
        delivery_method: 'WeConnect Delivery',
        delivery_id: order.delivery_id,
        delivery_status: status,
        message:
          'This delivery has already started and can no longer be changed to self collection.'
      });
    }

    if (status && status !== 'Cancelled') {
      await cancelDeliveryForOrder(orderId);
    }

    await setOrderDeliveryMethod(orderId, method);

    return res.json({
      order_id: orderId,
      delivery_method: method,
      delivery_id: order.delivery_id,
      delivery_status: status && status !== 'Cancelled' ? 'Cancelled' : status,
      message:
        'Delivery method set to self collection. No WeConnect delivery will be dispatched.'
    });
  } catch (error) {
    console.error('Error choosing delivery method:', error.message);

    res.status(500).json({
      message: 'Failed to update the delivery method'
    });
  }
}
