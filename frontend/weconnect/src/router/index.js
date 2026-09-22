import { createRouter, createWebHistory } from "vue-router";

import LandingPage from "../views/LandingPage.vue";
import LoginPage from "../views/LoginPage.vue";
import SignUpPage from "../views/SignUpPage.vue";
import CartView from "../views/CartView.vue";
import MarketplaceView from "../views/MarketplaceView.vue";

// Pages available to users before authentication and after login.
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
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  // Use normal browser URLs while Vite handles the app fallback.
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
