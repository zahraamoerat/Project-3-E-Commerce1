import { createRouter, createWebHistory } from "vue-router";

import MainLayout from "../layouts/MainLayout.vue";

// Supplier pages
import SupplierProducts from "../views/S_Products.vue";
import Reviews from "../views/Reviews.vue";
import StockManagement from "../views/StockManagement.vue";
import AddProducts from "../views/AddProducts.vue";
import EditProduct from "../views/EditProduct.vue";
import ViewProduct from "../views/ViewProduct.vue";
import SupplierDashboard from "../views/SupplierDashboard.vue";
import SupplierOrders from "../views/Orders.vue";
import SupplierDeliveries from "../views/Deliveries.vue";
import Profile from "../views/Profile.vue";
import RestockPage from "../views/RestockPage.vue";

const routes = [
  // ============================================================
  // SUPPLIER ROUTES
  // ============================================================
  {
    path: "/",
    component: MainLayout,
    children: [
      {
        path: "",
        redirect: "/landing",
      },

      {
        path: "dashboard",
        name: "SupplierDashboard",
        component: SupplierDashboard,
      },

      {
        path: "products",
        name: "S_Products",
        component: SupplierProducts,
      },

      {
        path: "products/add",
        name: "AddProducts",
        component: AddProducts,
      },

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

      {
        path: "reviews",
        name: "Reviews",
        component: Reviews,
      },

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

      {
        path: "orders",
        name: "Orders",
        component: SupplierOrders,
      },

      {
        path: "deliveries",
        name: "Deliveries",
        component: SupplierDeliveries,
      },

      {
        path: "profile",
        name: "Profile",
        component: Profile,
      },
    ],
  },

  // ============================================================
  // ZAHRAA1 / BUYER ROUTES
  // Added without replacing the existing development routes.
  // ============================================================

  {
    path: "/landing",
    name: "LandingPage",
    component: () => import("../views/landingpage/LandingPage.vue"),
  },

  {
    path: "/login",
    name: "LoginPage",
    component: () => import("../views/loginpage/LoginPage.vue"),
  },

  {
    path: "/change-password",
    name: "ChangePasswordPage",
    component: () => import("../views/ChangePassword.vue"),
  },

  {
    path: "/signup",
    name: "SignUpPage",
    component: () => import("../views/signuppage/SignUpPage.vue"),
  },

  {
    path: "/marketplace",
    name: "Marketplace",
    component: () => import("../views/buyersviews/MarketplaceView.vue"),
  },

  {
    path: "/small-business/cart",
    name: "small-business-cart",
    component: () => import("../views/buyersviews/CartView.vue"),
  },

  // Backwards-compatible alias for existing cart links.
  {
    path: "/cart",
    redirect: "/small-business/cart",
  },

  {
    path: "/buyer/product/:id",
    name: "BuyerViewProduct",
    component: () => import("../views/buyersviews/ViewProduct.vue"),
  },

  // Zahraa1 supplier-page aliases. The existing /products routes remain unchanged.
  {
    path: "/supplier/products",
    name: "SupplierProductsAlias",
    redirect: "/products",
  },

  {
    path: "/supplier/products/add",
    name: "SupplierAddProductZahraa1",
    component: () => import("../views/suppliersviews/AddProducts.vue"),
  },

  {
    path: "/supplier/products/edit/:id",
    name: "SupplierEditProductZahraa1",
    component: () => import("../views/suppliersviews/EditProduct.vue"),
  },

  {
    path: "/supplier/products/view/:id",
    name: "SupplierViewProductZahraa1",
    component: () => import("../views/buyersviews/ViewProduct.vue"),
  },

  // LoginPage.vue uses /supplier-dashboard for supplier login.
  // Keep the existing /dashboard route intact and provide an alias.
  {
    path: "/supplier-dashboard",
    name: "SupplierDashboardAlias",
    redirect: "/dashboard",
  },

  // ============================================================
  // SMALL BUSINESS ROUTES
  // ============================================================

  {
    path: "/tracking/:deliveryId",
    name: "tracking",
    component: () => import("../views/b_TrackingView.vue"),
  },

  {
    path: "/small-business",
    name: "small-business-landing",
    component: () => import("../views/b_SmallBusinessLanding.vue"),
  },

  {
    path: "/small-business/profile",
    name: "small-business-profile",
    component: () => import("../views/b_SmallBusinessProfile.vue"),
  },

  {
    path: "/small-business/dashboard",
    name: "small-business-dashboard",
    component: () => import("../views/b_SmallBusinessDashboard.vue"),
  },

  {
    path: "/small-business/orders",
    name: "small-business-orders",
    component: () => import("../views/b_SmallBusinessOrdersView.vue"),
  },

  {
    path: "/small-business/products",
    name: "small-business-products",
    component: () => import("../views/b_SmallBusinessProductsView.vue"),
  },

  {
    path: "/small-business/suppliers",
    name: "small-business-suppliers",
    component: () => import("../views/b_ViewSuppliersView.vue"),
  },

  {
    path: "/small-business/products/:productId",
    name: "small-business-product",
    component: () => import("../views/b_SmallBusinessProductsView.vue"),
  },

  {
    path: "/supplier/orders",
    name: "supplier-orders",
    component: () => import("../views/b_SupplierOrdersView.vue"),
  },

  {
    path: "/small-business/deliveries",
    name: "small-business-deliveries",
    component: () =>
      import("../views/b_SmallBusinessDeliveriesView.vue"),
  },

  {
    path: "/small-business/deliveries/location/:deliveryId",
    name: "small-business-delivery-location-setup",
    component: () =>
      import("../views/b_DeliveryLocationSetupView.vue"),
  },

  {
    path: "/supplier/deliveries",
    name: "supplier-deliveries",
    component: () => import("../views/b_SupplierDeliveriesView.vue"),
  },

  {
    path: "/payment/:orderId",
    name: "payment",
    component: () => import("../views/b_PaymentsView.vue"),
  },

  // ============================================================
  // FALLBACK
  // ============================================================

  {
    path: "/:pathMatch(.*)*",
    redirect: "/landing",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;