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
      component: () => import('../views/TrackingView.vue'),
    },

    // Shared dashboard page with the GPS preview.
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/Dashboard.vue'),
    },

    // Add the Small Business Orders page
    {
      path: '/small-business/orders',
      name: 'small-business-orders',
      component: () => import('../views/SmallBusinessOrdersView.vue'),
    },

    {
      path: '/small-business/products',
      name: 'small-business-products',
      component: () => import('../views/SmallBusinessProductsView.vue'),
    },

    {
      path: '/small-business/products/:productId',
      name: 'small-business-product',
      component: () => import('../views/SmallBusinessProductsView.vue'),
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
import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "../layouts/MainLayout.vue";
import Products from "../views/S_Products.vue";
import Reviews from "../views/Reviews.vue";
import StockManagement from "../views/StockManagement.vue";
import AddProducts from "../views/AddProducts.vue";
import EditProduct from "../views/EditProduct.vue";
import ViewProduct from "../views/ViewProduct.vue";
import Dashboard from "../views/S_Dashboard.vue";
import Orders from "../views/Orders.vue";
import Deliveries from "../views/Deliveries.vue";
import Profile from "../views/Profile.vue";
import RestockPage from "../views/RestockPage.vue";
const routes = [
  {
    path: "/",
    component: MainLayout,
    children: [
      { path: "", redirect: "/products" },
      { path: "products/add", name: "AddProducts", component: AddProducts },
      { path: "dashboard", name: "S_Dashboard", component: Dashboard },
      { path: "products", name: "S_Products", component: Products },
      {
        path: "products/edit/:id",
        name: "EditProduct",
        component: EditProduct,
      },
      {
        path: "products/view/:id",
        name: "ViewProduct",
        component: ViewProduct,
      },
      { path: "reviews", name: "Reviews", component: Reviews },
      {
        path: "stockmanagement",
        name: "StockManagement",
        component: StockManagement,
      },
      {
        path: "stockmanagement/restock/:id",
        name: "RestockPage",
        component: RestockPage,
      },
      { path: "orders", name: "Orders", component: Orders },
      { path: "deliveries", name: "Deliveries", component: Deliveries },
      { path: "profile", name: "Profile", component: Profile },
    ],
  },
  { path: "/:pathMatch(.*)*", redirect: "/products" },
];
const router = createRouter({ history: createWebHistory(), routes });
export default router;
