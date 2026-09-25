// Store shared order information
// Both business types use the same order data
export const orders = [
  {
    id: 1,
    orderNumber: 'ORD-1001',
    business: 'Small Business A',
    supplier: 'Supplier Z',
    date: '2026-09-01',
    status: 'Confirmed',

    // Connect this order to its delivery
    deliveryId: 'DEL-5001',
    deliveryStatus: 'In Transit',

    // Store the financial information for the order
    subtotal: 1250.00,
    deliveryFee: 150.00,
    total: 1400.00,

    // Store the current payment state
    paymentStatus: 'Unpaid',
    paymentId: null
  },

  {
    id: 2,
    orderNumber: 'ORD-1002',
    business: 'Green Market Supplies',
    supplier: 'ABC Wholesale',
    date: '2026-09-02',
    status: 'Processing',

    // Connect this order to its delivery
    deliveryId: 'DEL-5002',
    deliveryStatus: 'Preparing',

    // Store the financial information for the order
    subtotal: 850.00,
    deliveryFee: 100.00,
    total: 950.00,

    // This order has not been paid yet
    paymentStatus: 'Unpaid',
    paymentId: null
  },

  {
    id: 3,
    orderNumber: 'ORD-1003',
    business: 'Durban Fresh Foods',
    supplier: 'Metro Supplies',
    date: '2026-09-03',
    status: 'Completed',

    // Connect this order to its delivery
    deliveryId: 'DEL-5003',
    deliveryStatus: 'Delivered',

    // Store the financial information for the order
    subtotal: 2100.00,
    deliveryFee: 200.00,
    total: 2300.00,

    // This order has already been paid
    paymentStatus: 'Paid',
    paymentId: 'PAY-3003'
  }
]