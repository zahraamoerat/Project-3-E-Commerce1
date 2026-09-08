import { createRouter, createWebHistory } from "vue-router";

import MainLayout from "../layouts/MainLayout.vue";

import Products from "../views/Products.vue";
import Reviews from "../views/Reviews.vue";

const routes = [
  {
    path: "/",
    component: MainLayout,
    children: [
      {
        path: "products",
        name: "Products",
        component: Products,
      },
      {
        path: "reviews",
        name: "Reviews",
        component: Reviews,
      },
      {
        path: "stockmanagement",
        name: "StockManagement",
        component: () => import("../views/StockManagement.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
