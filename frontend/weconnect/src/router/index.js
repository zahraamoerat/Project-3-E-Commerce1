import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
        redirect: '/tracking',
    },
    // Added for the delivery tracking page
    {
      path: '/tracking',
      name: 'tracking',
      component: () => import('../views/TrackingView.vue'),
    },

    // Add the Small Business Orders page
    {
      path: '/small-business/orders',
      name: 'small-business-orders',
      component: () => import('../views/SmallBusinessOrdersView.vue'),
    },

    // Add the Supplier Orders page
    {
      path: '/supplier/orders',
      name: 'supplier-orders',
      component: () => import('../views/SupplierOrdersView.vue'),
    },

    // Add the Small Business Deliveries page
    {
      path: '/small-business/deliveries',
      name: 'small-business-deliveries',
      component: () => import('../views/SmallBusinessDeliveriesView.vue'),
    },

    // Add the Supplier Deliveries page
    {
      path: '/supplier/deliveries',
      name: 'supplier-deliveries',
      component: () => import('../views/SupplierDeliveriesView.vue'),
    },

    // Add the payment page
    {
      path: '/payment/:orderId',
      name: 'payment',
      component: () => import('../views/PaymentsView.vue'),
    },
  ],
})

export default router
