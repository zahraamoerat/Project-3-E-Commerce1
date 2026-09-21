import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
        redirect: '/small-business/orders',
    },
    // Delivery tracking page for a specific delivery.
    {
      path: '/tracking/:deliveryId',
      name: 'tracking',
      component: () => import('../views/b_TrackingView.vue'),
    },

    // Shared dashboard page with the GPS preview.
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/b_Dashboard.vue'),
    },

    // Add the Small Business Orders page
    {
      path: '/small-business/orders',
      name: 'small-business-orders',
      component: () => import('../views/b_SmallBusinessOrdersView.vue'),
    },

    {
      path: '/small-business/products',
      name: 'small-business-products',
      component: () => import('../views/b_SmallBusinessProductsView.vue'),
    },

    {
      path: '/small-business/products/:productId',
      name: 'small-business-product',
      component: () => import('../views/b_SmallBusinessProductsView.vue'),
    },

    // Add the Supplier Orders page
    {
      path: '/supplier/orders',
      name: 'supplier-orders',
      component: () => import('../views/b_SupplierOrdersView.vue'),
    },

    // Add the Small Business Deliveries page
    {
      path: '/small-business/deliveries',
      name: 'small-business-deliveries',
      component: () => import('../views/b_SmallBusinessDeliveriesView.vue'),
    },

    // Add the Supplier Deliveries page
    {
      path: '/supplier/deliveries',
      name: 'supplier-deliveries',
      component: () => import('../views/b_SupplierDeliveriesView.vue'),
    },

    // Add the payment page
    {
      path: '/payment/:orderId',
      name: 'payment',
      component: () => import('../views/b_PaymentsView.vue'),
    },
  ],
})

export default router
