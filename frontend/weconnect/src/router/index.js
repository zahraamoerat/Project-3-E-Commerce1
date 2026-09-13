import { createRouter, createWebHistory } from "vue-router";

import MainLayout from "../layouts/MainLayout.vue";
import Products from "../views/Products.vue";
import Reviews from "../views/Reviews.vue";
import StockManagement from "../views/StockManagement.vue";
import AddProducts from "../views/AddProducts.vue";
import EditProduct from "../views/EditProduct.vue";

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
        path: "products/add",
        name: "AddProducts",
        component: AddProducts,
      },
      {
        path: "products",
        name: "Products",
        component: Products,
      },
      {
        path: "products/edit/:id",
        name: "EditProduct",
        component: EditProduct,
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