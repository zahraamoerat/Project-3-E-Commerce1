import { createRouter, createWebHistory } from "vue-router";
import LandingPage from "../views/LandingPage.vue";
import LoginPage from "../views/LoginPage.vue";
import SignUpPage from "../views/SignUpPage.vue";
import CartView from "../views/CartView.vue";
import MarketplaceView from "../views/MarketplaceView.vue";
import SupplierDashboard from "../views/SupplierDashboard.vue";
import SupplierProducts from "../views/S_Products.vue";
import AddProducts from "../views/AddProducts.vue";
import EditProduct from "../views/EditProduct.vue";
import ViewProduct from "../views/ViewProduct.vue";
import Reviews from "../views/Reviews.vue";
import StockManagement from "../views/StockManagement.vue";
import RestockPage from "../views/RestockPage.vue";
import SupplierOrders from "../views/Orders.vue";
import SupplierDeliveries from "../views/Deliveries.vue";
import Profile from "../views/Profile.vue";

// Public, buyer, and supplier pages used by the application.
const routes = [
  {
    path: "/",
    name: "Landing",
    component: LandingPage,
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
  },
  {
    path: "/signup",
    name: "SignUp",
    component: SignUpPage,
  },
  // {
  //   path: "/products",
  //   name: "Products",
  //   component: ProductsView,
  // },
  {
    path: "/marketplace",
    name: "Marketplace",
    component: MarketplaceView,
  },
  {
    path: "/cart",
    name: "Cart",
    component: CartView,
    meta: { requiresAuth: true, role: "buyer" },
  },
  {
    path: "/supplier-dashboard",
    name: "SupplierDashboard",
    component: SupplierDashboard,
    meta: { requiresAuth: true, role: "supplier" },
  },
  {
    path: "/supplier/products",
    name: "SupplierProducts",
    component: SupplierProducts,
    meta: { requiresAuth: true, role: "supplier" },
  },
  {
    path: "/supplier/products/add",
    name: "AddProducts",
    component: AddProducts,
    meta: { requiresAuth: true, role: "supplier" },
  },
  {
    path: "/supplier/products/edit/:id",
    name: "EditProduct",
    component: EditProduct,
    meta: { requiresAuth: true, role: "supplier" },
  },
  {
    path: "/supplier/products/view/:id",
    name: "ViewProduct",
    component: ViewProduct,
    meta: { requiresAuth: true, role: "supplier" },
  },
  {
    path: "/supplier/reviews",
    name: "Reviews",
    component: Reviews,
    meta: { requiresAuth: true, role: "supplier" },
  },
  {
    path: "/supplier/stockmanagement",
    name: "StockManagement",
    component: StockManagement,
    meta: { requiresAuth: true, role: "supplier" },
  },
  {
    path: "/supplier/stockmanagement/restock/:id",
    name: "RestockPage",
    component: RestockPage,
    meta: { requiresAuth: true, role: "supplier" },
  },
  {
    path: "/supplier/orders",
    name: "SupplierOrders",
    component: SupplierOrders,
    meta: { requiresAuth: true, role: "supplier" },
  },
  {
    path: "/supplier/deliveries",
    name: "SupplierDeliveries",
    component: SupplierDeliveries,
    meta: { requiresAuth: true, role: "supplier" },
  },
  {
    path: "/supplier/profile",
    name: "Profile",
    component: Profile,
    meta: { requiresAuth: true, role: "supplier" },
  },
  {
    path: "/tracking/:deliveryId",
    name: "Tracking",
    component: () => import("../views/b_TrackingView.vue"),
    meta: { requiresAuth: true, role: "buyer" },
  },
  {
    path: "/small-business/dashboard",
    name: "SmallBusinessDashboard",
    component: () => import("../views/b_SmallBusinessDashboard.vue"),
    meta: { requiresAuth: true, role: "buyer" },
  },
  {
    path: "/small-business/orders",
    name: "SmallBusinessOrders",
    component: () => import("../views/b_SmallBusinessOrdersView.vue"),
    meta: { requiresAuth: true, role: "buyer" },
  },
  {
    path: "/small-business/products",
    name: "SmallBusinessProducts",
    component: () => import("../views/b_SmallBusinessProductsView.vue"),
    meta: { requiresAuth: true, role: "buyer" },
  },
  {
    path: "/small-business/deliveries",
    name: "SmallBusinessDeliveries",
    component: () => import("../views/b_SmallBusinessDeliveriesView.vue"),
    meta: { requiresAuth: true, role: "buyer" },
  },
  {
    path: "/payment/:orderId",
    name: "Payment",
    component: () => import("../views/b_PaymentsView.vue"),
    meta: { requiresAuth: true, role: "buyer" },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach((to) => {
  if (!to.meta.requiresAuth) return true;

  const token = localStorage.getItem("weconnect_token");
  const role = localStorage.getItem("weconnect_role");

  if (!token) return "/login";
  if (to.meta.role && to.meta.role !== role) {
    return role === "supplier" ? "/supplier-dashboard" : "/marketplace";
  }

  return true;
});

export default router;
