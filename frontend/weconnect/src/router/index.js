import { createRouter, createWebHistory } from "vue-router";

import MainLayout from "../layouts/MainLayout.vue";

import Dashboard from "../views/Dashboard.vue";
import BrowseSuppliers from "../views/BrowseSuppliers.vue";
import MyOrders from "../views/MyOrders.vue";
import Deliveries from "../views/Deliveries.vue";
import Messages from "../views/Messages.vue";
import BusinessProfile from "../views/BusinessProfile.vue";

const routes = [
  {
    path: "/",
    component: MainLayout,

    children: [
      {
        path: "",
        redirect: "/dashboard",
      },

      {
        path: "/dashboard",
        name: "Dashboard",
        component: Dashboard,
      },

      {
        path: "/suppliers",
        name: "BrowseSuppliers",
        component: BrowseSuppliers,
      },

      {
        path: "/orders",
        name: "MyOrders",
        component: MyOrders,
      },

      {
        path: "/deliveries",
        name: "Deliveries",
        component: Deliveries,
      },

      {
        path: "/messages",
        name: "Messages",
        component: Messages,
      },

      {
        path: "/profile",
        name: "BusinessProfile",
        component: BusinessProfile,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),

  routes,
});

export default router;
