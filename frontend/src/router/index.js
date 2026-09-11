import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import BusinessProfile from "../views/BusinessProfile.vue";
import BrowseSuppliers from "../views/BrowseSuppliers.vue";
import Messages from "../views/Messages.vue";
import ComingSoon from "../views/ComingSoon.vue";

const routes = [
  { path: "/", redirect: "/dashboard" },
  { path: "/dashboard", name: "dashboard", component: Dashboard },
  { path: "/business-profile", name: "business-profile", component: BusinessProfile },
  { path: "/browse-suppliers", name: "browse-suppliers", component: BrowseSuppliers },
  { path: "/messages", name: "messages", component: Messages },
  { path: "/orders", name: "orders", component: ComingSoon, meta: { label: "My orders" } },
  { path: "/deliveries", name: "deliveries", component: ComingSoon, meta: { label: "Deliveries" } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;