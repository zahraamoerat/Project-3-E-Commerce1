<template>
  <aside class="sidebar" :class="{ 'sidebar--collapsed': collapsed }">
    <div class="sidebar_brand">
      <button class="sidebar_toggle" type="button" @click="toggleSidebar"
        :aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        :title="collapsed ? 'Expand sidebar' : 'Collapse sidebar'">
        <span>{{ collapsed ? "›" : "‹" }}</span>
      </button>

      <div class="sidebar_brand-icon">
        <img :src="logo" alt="WeConnect logo" class="sidebar_brand-logo" />
      </div>

      <div class="sidebar_brand-text">
        <h2>WeConnect</h2>
        <span>SUPPLIER NETWORK</span>
      </div>
    </div>

    <nav class="sidebar_navigation" aria-label="Supplier navigation">
      <RouterLink to="/dashboard" class="sidebar_nav-item" exact-active-class="sidebar_nav-item--active">
        <span class="sidebar_nav-icon"><FontAwesomeIcon :icon="faChartLine" /></span>
        <span class="sidebar_nav-label">Dashboard</span>
        <span class="sidebar_notification-dot"></span>
      </RouterLink>

      <RouterLink to="/products" class="sidebar_nav-item" exact-active-class="sidebar_nav-item--active">
        <span class="sidebar_nav-icon"><FontAwesomeIcon :icon="faShoppingBag" /></span>
        <span class="sidebar_nav-label">Products</span>
        <span class="sidebar_notification-dot"></span>
      </RouterLink>

      <RouterLink to="/orders" class="sidebar_nav-item" exact-active-class="sidebar_nav-item--active">
        <span class="sidebar_nav-icon"><FontAwesomeIcon :icon="faList" /></span>
        <span class="sidebar_nav-label">Orders</span>
        <span class="sidebar_notification-dot"></span>
      </RouterLink>

      <RouterLink to="/stockmanagement" class="sidebar_nav-item" exact-active-class="sidebar_nav-item--active">
        <span class="sidebar_nav-icon"><FontAwesomeIcon :icon="faWarehouse" /></span>
        <span class="sidebar_nav-label">Stock Management</span>
        <span class="sidebar_notification-dot"></span>
      </RouterLink>

      <RouterLink to="/deliveries" class="sidebar_nav-item" exact-active-class="sidebar_nav-item--active">
        <span class="sidebar_nav-icon"><FontAwesomeIcon :icon="faTruck" /></span>
        <span class="sidebar_nav-label">Deliveries</span>
        <span class="sidebar_notification-dot"></span>
      </RouterLink>

      <RouterLink to="/reviews" class="sidebar_nav-item" exact-active-class="sidebar_nav-item--active">
        <span class="sidebar_nav-icon"><FontAwesomeIcon :icon="faStar" /></span>
        <span class="sidebar_nav-label">Reviews</span>
        <span class="sidebar_notification-dot"></span>
      </RouterLink>

      <RouterLink to="/profile" class="sidebar_nav-item" exact-active-class="sidebar_nav-item--active">
        <span class="sidebar_nav-icon"><FontAwesomeIcon :icon="faAddressCard" /></span>
        <span class="sidebar_nav-label">Business Profile</span>
        <span class="sidebar_notification-dot"></span>
      </RouterLink>
    </nav>

    <button class="sidebar_logout" type="button" @click="logout">
      <span class="sidebar_logout-icon"><FontAwesomeIcon :icon="faUser" /></span>
      <span class="sidebar_nav-label">Log out</span>
    </button>
  </aside>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import logo from "../assets/link-icon-white.png";
import { faChartLine, faShoppingBag, faList, faWarehouse, faTruck, faStar, faUser, faAddressCard } from "@fortawesome/free-solid-svg-icons";

const router = useRouter();
const collapsed = ref(localStorage.getItem("weconnect_sidebar_collapsed") === "true");

function toggleSidebar() {
  collapsed.value = !collapsed.value;
  localStorage.setItem("weconnect_sidebar_collapsed", String(collapsed.value));
}

function logout() {
  [
    "weconnect_token",
    "weconnect_role",
    "weconnect_user_id",
    "weconnect_buyer_id",
    "weconnect_supplier_id",
    "weconnect_email",
  ].forEach((key) => localStorage.removeItem(key));

  router.push("/login");
}
</script>

<style scoped>
.sidebar {
  --sidebar-bg: #ffffff;
  --sidebar-text: #344054;
  --sidebar-muted: #667085;
  --sidebar-active: #4169e1;
  --sidebar-active-soft: #eef3ff;
  --sidebar-border: #e7eaf0;

  position: sticky;
  top: 0;
  width: 238px;
  height: 100vh;
  min-height: 620px;
  flex-shrink: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  padding: 22px 13px 18px;
  box-sizing: border-box;
  overflow: visible;
  color: var(--sidebar-text);
  background: var(--sidebar-bg);
  border-right: 1px solid var(--sidebar-border);
  box-shadow: 4px 0 18px rgba(31, 41, 55, .05);
  transition: width .25s ease, padding .25s ease;
}

.sidebar_brand {
  position: relative;
  display: flex;
  align-items: center;
  gap: 11px;
  min-height: 50px;
  margin: 0 7px 32px;
  padding: 0 4px;
}

.sidebar_brand-icon {
  width: 39px;
  height: 39px;
  flex: 0 0 39px;
  display: grid;
  place-items: center;
  border-radius: 11px;
  background: #4169e1;
  overflow: hidden;
}

.sidebar_brand-logo {
  width: 25px;
  height: 25px;
  object-fit: contain;
}

.sidebar_brand-text {
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  white-space: nowrap;
  transition: opacity .18s ease, width .25s ease;
}

.sidebar_brand-text h2 {
  margin: 0;
  color: #1f2937;
  font: 750 16px/1.2 Inter, ui-sans-serif, system-ui, sans-serif;
  letter-spacing: -.2px;
}

.sidebar_brand-text span {
  margin-top: 4px;
  color: #98a2b3;
  font: 700 8px/1 Inter, ui-sans-serif, system-ui, sans-serif;
  letter-spacing: 1.2px;
}

.sidebar_toggle {
  position: absolute;
  top: 7px;
  right: -28px;
  width: 25px;
  height: 25px;
  z-index: 5;
  display: grid;
  place-items: center;
  border: 1px solid #dfe4ec;
  border-radius: 50%;
  background: #fff;
  color: #667085;
  box-shadow: 0 3px 10px rgba(31, 41, 55, .12);
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
}

.sidebar_toggle:hover {
  color: var(--sidebar-active);
  border-color: #b8c7f5;
}

.sidebar_navigation {
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
  min-height: 0;
}

.sidebar_nav-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 42px;
  padding: 0 12px;
  box-sizing: border-box;
  border-radius: 9px;
  color: var(--sidebar-muted);
  text-decoration: none;
  font: 600 12px/1.2 Inter, ui-sans-serif, system-ui, sans-serif;
  transition: background .18s ease, color .18s ease, transform .18s ease;
}

.sidebar_nav-item:hover {
  color: #344054;
  background: #f5f7fb;
  transform: translateX(1px);
}

.sidebar_nav-item--active {
  color: var(--sidebar-active);
  background: var(--sidebar-active-soft);
  font-weight: 750;
}

.sidebar_nav-item--active:hover {
  color: var(--sidebar-active);
  background: var(--sidebar-active-soft);
  transform: none;
}

.sidebar_nav-icon {
  width: 20px;
  flex: 0 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #98a2b3;
  font-size: 14px;
}

.sidebar_nav-item--active .sidebar_nav-icon {
  color: var(--sidebar-active);
}

.sidebar_notification-dot {
  display: none;
  width: 5px;
  height: 5px;
  margin-left: auto;
  flex: 0 0 5px;
  border-radius: 50%;
  background: var(--sidebar-active);
}

.sidebar_nav-item--active .sidebar_notification-dot {
  display: block;
}

.sidebar_logout {
  width: 100%;
  min-height: 42px;
  margin-top: auto;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 0;
  border-top: 1px solid var(--sidebar-border);
  background: transparent;
  color: var(--sidebar-muted);
  font: 600 12px/1.2 Inter, ui-sans-serif, system-ui, sans-serif;
  cursor: pointer;
}

.sidebar_logout:hover {
  color: #344054;
  background: #f5f7fb;
}

.sidebar_logout-icon {
  width: 20px;
  flex: 0 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar_nav-label {
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  transition: opacity .16s ease, width .25s ease;
}

.sidebar--collapsed {
  width: 72px;
  padding-left: 10px;
  padding-right: 10px;
}

.sidebar--collapsed .sidebar_brand {
  justify-content: center;
  margin-left: 0;
  margin-right: 0;
  padding-left: 0;
  padding-right: 0;
  gap: 0;
}

.sidebar--collapsed .sidebar_brand-text,
.sidebar--collapsed .sidebar_nav-label {
  width: 0;
  opacity: 0;
  pointer-events: none;
}

.sidebar--collapsed .sidebar_nav-item {
  justify-content: center;
  gap: 0;
  padding-left: 0;
  padding-right: 0;
}

.sidebar--collapsed .sidebar_nav-icon {
  width: 24px;
  flex-basis: 24px;
  font-size: 15px;
}

.sidebar--collapsed .sidebar_notification-dot {
  position: absolute;
  top: 7px;
  right: 9px;
  margin: 0;
}

.sidebar--collapsed .sidebar_logout {
  justify-content: center;
  gap: 0;
  padding-left: 0;
  padding-right: 0;
}

.sidebar--collapsed .sidebar_logout-icon {
  width: 24px;
  flex-basis: 24px;
}

@media (max-width: 900px) and (min-width: 701px) {
  .sidebar { width: 210px; }
  .sidebar--collapsed { width: 68px; }
}

@media (max-width: 700px) {
  .sidebar {
    position: relative;
    width: 100%;
    height: auto;
    min-height: 0;
    padding: 12px 14px;
    overflow: hidden;
    border-right: 0;
    border-bottom: 1px solid var(--sidebar-border);
  }

  .sidebar_brand { margin-bottom: 14px; }
  .sidebar_toggle { top: 7px; right: 7px; }

  .sidebar_navigation {
    flex-direction: row;
    overflow-x: auto;
    gap: 6px;
    padding-bottom: 2px;
    flex: none;
    scrollbar-width: none;
  }

  .sidebar_navigation::-webkit-scrollbar { display: none; }

  .sidebar_nav-item {
    width: auto;
    min-width: max-content;
    min-height: 38px;
    padding: 0 11px;
  }

  .sidebar_logout { display: none; }
  .sidebar--collapsed { width: 100%; }
  .sidebar--collapsed .sidebar_brand { justify-content: flex-start; }
  .sidebar--collapsed .sidebar_navigation { justify-content: flex-start; }
}
</style>