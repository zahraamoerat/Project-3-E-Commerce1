<template>
  <aside class="sidebar" :class="{ "sidebar--collapsed": collapsed }"> <!-- ========================= LOGO / BRAND ========================== -->
    <div class="sidebar_brand">
      <button class="sidebar_toggle" type="button" @click="toggleSidebar" :aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'" :title="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"><span>{{ collapsed ? "›" : "‹" }}</span></button>
      <div class="sidebar_brand-icon"> <img :src="logo" alt="WeConnect logo" class="sidebar_brand-logo" /> </div>
      <div class="sidebar_brand-text">
        <h2>WeConnect</h2> <span>SUPPLIER NETWORK</span>
      </div>
    </div> <!-- ========================= NAVIGATION ========================== -->
    <nav class="sidebar_navigation"> <!-- Dashboard -->
      <RouterLink to="/dashboard" class="sidebar_nav-item" exact-active-class="sidebar_nav-item--active"> <span
          class="sidebar_nav-icon">
          <FontAwesomeIcon :icon="faChartLine" />
        </span> <span class="sidebar_nav-label">Dashboard</span> <span class="sidebar_notification-dot"></span> </RouterLink> <!-- Products -->
      <RouterLink to="/products" class="sidebar_nav-item" exact-active-class="sidebar_nav-item--active"> <span
          class="sidebar_nav-icon">
          <FontAwesomeIcon :icon="faShoppingBag" />
        </span> <span class="sidebar_nav-label">Products</span> <span class="sidebar_notification-dot"></span> </RouterLink> <!-- Orders -->
      <RouterLink to="/orders" class="sidebar_nav-item" exact-active-class="sidebar_nav-item--active"> <span
          class="sidebar_nav-icon">
          <FontAwesomeIcon :icon="faList" />
        </span> <span class="sidebar_nav-label">Orders</span> <span class="sidebar_notification-dot"></span> </RouterLink>
      <!-- Stock Management -->
      <RouterLink to="/stockmanagement" class="sidebar_nav-item" exact-active-class="sidebar_nav-item--active"> <span
          class="sidebar_nav-icon">
          <FontAwesomeIcon :icon="faWarehouse" />
        </span> <span class="sidebar_nav-label">Stock Management</span> <span class="sidebar_notification-dot"></span> </RouterLink>
      <!-- Deliveries -->
      <RouterLink to="/deliveries" class="sidebar_nav-item" exact-active-class="sidebar_nav-item--active"> <span
          class="sidebar_nav-icon">
          <FontAwesomeIcon :icon="faTruck" />
        </span> <span class="sidebar_nav-label">Deliveries</span> <span class="sidebar_notification-dot"></span> </RouterLink> <!-- Reviews -->
      <RouterLink to="/reviews" class="sidebar_nav-item" exact-active-class="sidebar_nav-item--active"> <span
          class="sidebar_nav-icon">
          <FontAwesomeIcon :icon="faStar" />
        </span> <span class="sidebar_nav-label">Reviews</span> <span class="sidebar_notification-dot"></span> </RouterLink>
      <!-- Business Profile -->
      <RouterLink to="/profile" class="sidebar_nav-item" exact-active-class="sidebar_nav-item--active"> <span
          class="sidebar_nav-icon">
          <FontAwesomeIcon :icon="faAddressCard" />
        </span> <span class="sidebar_nav-label">Business Profile</span> <span class="sidebar_notification-dot"></span> </RouterLink>
    </nav> <!-- ========================= LOGOUT ========================== --> <button class="sidebar_logout"
      @click="logout"> <span class="sidebar_logout-icon">
        <FontAwesomeIcon :icon="faUser" />
      </span> <span class="sidebar_nav-label">Log out</span> </button>
  </aside>
</template>
<script setup>
import logo from "../assets/link-icon-white.png"
import { ref } from "vue"
import { useRouter } from "vue-router"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import { faChartLine } from "@fortawesome/free-solid-svg-icons"
import { faShoppingBag } from "@fortawesome/free-solid-svg-icons"
import { faList } from "@fortawesome/free-solid-svg-icons"
import { faWarehouse } from "@fortawesome/free-solid-svg-icons"
import { faTruck } from "@fortawesome/free-solid-svg-icons"
import { faStar } from "@fortawesome/free-solid-svg-icons"
import { faUser } from "@fortawesome/free-solid-svg-icons"
import { faAddressCard } from "@fortawesome/free-solid-svg-icons"
/* ========================= ROUTER ========================= */
const router = useRouter()
const collapsed = ref(localStorage.getItem("weconnect_sidebar_collapsed") === "true")

function toggleSidebar() {
  collapsed.value = !collapsed.value
  localStorage.setItem("weconnect_sidebar_collapsed", String(collapsed.value))
}
/* ========================= LOGOUT ========================= */
function logout() {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  router.push("/products")
}

</script>
<style scoped>
/* ========================================================= SIDEBAR ========================================================= */
.sidebar {
  width: 248px;
  height: 100vh;
  position: sticky;
  top: 0;
  left: 0;
  background: linear-gradient(180deg,#4d3731 0%,#3e2d29 100%);
  color: #c9b7ae;
  padding: 24px 14px 18px; box-shadow: 8px 0 30px rgba(63,43,35,.10);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  z-index: 1000;
  overflow-y: auto;
  overflow-x: hidden;
  flex-shrink: 0;
}

/* ========================================================= BRAND ========================================================= */
.sidebar_brand {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 6px 10px;
  margin-bottom: 34px;
  flex-shrink: 0;
}

.sidebar_brand-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  font-size: 21px;
  line-height: 1;
  flex-shrink: 0;
}

.sidebar_brand-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.sidebar_brand-text {
  display: flex;
  flex-direction: column;
}

.sidebar_brand-text h2 {
  margin: 0;
  color: #ffffff;
  font-family: Georgia, serif;
  font-size: 21px;
  font-weight: 600;
  line-height: 1.1;
}

.sidebar_brand-text span {
  margin-top: 6px;
  color: #bdaaa1;
  font-family: figtree;
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 1.4px;
}

/* ========================================================= NAVIGATION ========================================================= */
.sidebar_navigation {

  display: flex;
  flex-direction: column;
  gap: 7px;
  flex: 1;
}

/* ========================================================= NAVIGATION ITEMS ========================================================= */
.sidebar_nav-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 15px;
  width: 100%;
  min-height: 48px;
  padding: 0 15px;
  box-sizing: border-box;
  border-radius: 12px;
  color: #c9b7ae;
  text-decoration: none;
  font-family: figtree;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

/* ========================================================= HOVER ========================================================= */
.sidebar_nav-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  transform: translateX(2px);
}

/* ========================================================= EXACT ACTIVE PAGE ========================================================= */
/* IMPORTANT: We use the custom exact-active-class: sidebar_nav-item--active instead of router-link-active. This prevents a parent route such as: /products from remaining active when the user is on: /products/add /products/edit /products/details Only the exact route receives the active styling. */
.sidebar_nav-item--active {
  background: linear-gradient(135deg,#79594e,#684b42);
  color: #ffffff;
  box-shadow: 0 8px 22px rgba(0,0,0,.13),inset 0 1px 0 rgba(255,255,255,.06);
}

/* ========================================================= ACTIVE ICON ========================================================= */
.sidebar_nav-item--active .sidebar_nav-icon {
  color: #ffffff;
}

/* ========================================================= NAVIGATION ICON ========================================================= */
.sidebar_nav-icon {
  width: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bba99f;
  font-size: 18px;
  flex-shrink: 0;
}

/* ========================================================= NOTIFICATION DOT ========================================================= */
/* Hidden by default. */
.sidebar_notification-dot {
  display: none;
  width: 7px;
  height: 7px;
  margin-left: auto;
  border-radius: 50%;
  background: #e79b63;
  flex-shrink: 0;
}

/* Show the dot ONLY on the EXACT active route. */
.sidebar_nav-item--active .sidebar_notification-dot {
  display: block;
}

/* ========================================================= LOGOUT ========================================================= */
.sidebar_logout {
  margin-top: auto;
  width: 100%;
  min-height: 48px;
  padding: 14px 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  background: transparent;
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #c9b7ae;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s ease, background 0.2s ease;
  flex-shrink: 0;
}

.sidebar_logout:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.05);
}

.sidebar_logout-icon {
  width: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 19px;
}

/* ========================================================= TABLET ========================================================= */
@media (max-width: 900px) {
  .sidebar {
    width: 220px;
    padding: 22px 16px;
  }

  .sidebar_brand-text h2 {
    font-size: 19px;
  }

  .sidebar_nav-item {
    min-height: 46px;
    font-size: 13px;
  }

  .sidebar_nav-icon {
    font-size: 17px;
  }
}

/* ========================================================= MOBILE ========================================================= */
@media (max-width: 700px) {
  .sidebar {
    position: relative;
    top: auto;
    left: auto;
    width: 100%;
    height: auto;
    min-height: auto;
    padding: 14px 16px;
    overflow-y: visible;
    overflow-x: hidden;
  }

  .sidebar_brand {
    margin-bottom: 18px;
  }

  .sidebar_brand-icon {
    width: 34px;
    height: 34px;
    font-size: 19px;
  }

  .sidebar_brand-logo {
    width: 34px;
    height: 34px;
  }

  .sidebar_brand-text h2 {
    font-size: 19px;
  }

  .sidebar_navigation {
    flex-direction: row;
    overflow-x: auto;
    gap: 8px;
    padding-bottom: 5px;
    flex: none;
    scrollbar-width: none;
  }

  .sidebar_navigation::-webkit-scrollbar {
    display: none;
  }

  .sidebar_nav-item {
    width: auto;
    min-width: max-content;
    min-height: 44px;
    padding: 0 14px;
    gap: 9px;
    font-size: 13px;
  }

  .sidebar_nav-icon {
    width: 19px;
    font-size: 16px;
  }

  .sidebar_logout {
    display: none;
  }
}

/* ========================================================= SMALL MOBILE ========================================================= */
@media (max-width: 450px) {
  .sidebar {
    padding: 12px;
  }

  .sidebar_brand {
    padding: 4px;
  }

  .sidebar_navigation {
    gap: 6px;
  }

  .sidebar_nav-item {
    padding: 0 12px;
    min-height: 42px;
  }
}

/* ========================================================= COLLAPSIBLE SIDEBAR ========================================================= */
.sidebar {
  width: 248px;
  transition: width .25s ease, padding .25s ease, box-shadow .25s ease;
}

.sidebar_toggle {
  position: absolute;
  top: 24px;
  right: -12px;
  z-index: 2;
  width: 25px;
  height: 25px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255,255,255,.16);
  border-radius: 50%;
  background: #fff;
  color: #5b443c;
  box-shadow: 0 4px 14px rgba(35,25,20,.18);
  font-size: 19px;
  line-height: 1;
  cursor: pointer;
  transition: transform .2s ease, background .2s ease, color .2s ease;
}

.sidebar_toggle:hover {
  transform: scale(1.08);
  background: #f8f3ef;
  color: #d2763d;
}

.sidebar_brand {
  position: relative;
  min-height: 40px;
}

.sidebar_nav-label,
.sidebar_brand-text {
  overflow: hidden;
  white-space: nowrap;
  transition: opacity .16s ease, width .25s ease, max-width .25s ease;
}

.sidebar_nav-label {
  max-width: 180px;
}

.sidebar--collapsed {
  width: 78px;
  padding-left: 10px;
  padding-right: 10px;
}

.sidebar--collapsed .sidebar_brand {
  justify-content: center;
  padding-left: 0;
  padding-right: 0;
}

.sidebar--collapsed .sidebar_brand-text,
.sidebar--collapsed .sidebar_nav-label {
  width: 0;
  max-width: 0;
  opacity: 0;
  pointer-events: none;
}

.sidebar--collapsed .sidebar_brand {
  gap: 0;
}

.sidebar--collapsed .sidebar_nav-item {
  justify-content: center;
  gap: 0;
  padding-left: 0;
  padding-right: 0;
}

.sidebar--collapsed .sidebar_nav-icon {
  width: 24px;
  font-size: 17px;
}

.sidebar--collapsed .sidebar_notification-dot {
  position: absolute;
  top: 9px;
  right: 12px;
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
}

.sidebar--collapsed .sidebar_toggle {
  right: -12px;
}

@media (max-width: 900px) and (min-width: 701px) {
  .sidebar--collapsed {
    width: 72px;
  }
}

@media (max-width: 700px) {
  .sidebar_toggle {
    top: 18px;
    right: 12px;
  }

  .sidebar--collapsed {
    width: 100%;
    padding-left: 12px;
    padding-right: 12px;
  }

  .sidebar--collapsed .sidebar_brand-text {
    width: 0;
  }

  .sidebar--collapsed .sidebar_navigation {
    justify-content: flex-start;
  }

  .sidebar--collapsed .sidebar_nav-item {
    width: 44px;
    min-width: 44px;
    justify-content: center;
    padding: 0;
  }
}
</style>
