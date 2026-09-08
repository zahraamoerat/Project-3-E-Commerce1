import { createRouter, createWebHistory } from "vue-router";

import MainLayout from "../layouts/MainLayout.vue";
import Products from "../views/Products.vue";
import Reviews from "../views/Reviews.vue";
import StockManagement from "../views/StockManagement.vue";

const routes = [
  {
    path: "/",
    component: MainLayout,
    children: [
      {
        path: "",
        redirect: "/products",
      },
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
        component: StockManagement,
      },
    ],
  },

  {
    path: "/:pathMatch(.*)*",
    redirect: "/products",
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});