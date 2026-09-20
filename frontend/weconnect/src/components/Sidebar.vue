<template>
  <aside class="sidebar" :class="{ 'sidebar--collapsed': collapsed }"> <!-- ========================= LOGO / BRAND ========================== -->
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
.sidebar {
  --sidebar-bg: #fbf9ff;
  --sidebar-text: #514b60;
  --sidebar-muted: #9891a5;
  --sidebar-active: #8067ed;
  --sidebar-active-soft: #eee9ff;
  --sidebar-border: #e9e5f2;
  position: sticky;
  top: 0;
  width: 248px;
  height: 100vh;
  min-height: 620px;
  flex-shrink: 0;
  z-index: 1000;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 22px 14px 18px;
  overflow: visible;
  color: var(--sidebar-text);
  background: var(--sidebar-bg);
  border-right: 1px solid var(--sidebar-border);
  box-shadow: 6px 0 24px rgba(84, 70, 120, .05);
  transition: width .25s ease, padding .25s ease, box-shadow .25s ease;
}

.sidebar::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, #9b85f5 0%, #8067ed 50%, #b7a6ff 100%);
  opacity: .8;
}

.sidebar_brand {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 48px;
  margin: 0 6px 34px;
  padding: 0 4px;
}

.sidebar_brand-icon {
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  display: grid;
  place-items: center;
  border-radius: 13px;
  background: #f0ecff;
  border: 1px solid #e4defa;
  box-shadow: 0 5px 14px rgba(100, 81, 170, .08);
  overflow: hidden;
}

.sidebar_brand-logo {
  width: 28px;
  height: 28px;
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
  color: #302b3d;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 16px;
  font-weight: 750;
  letter-spacing: -.25px;
  line-height: 1.2;
}

.sidebar_brand-text span {
  margin-top: 4px;
  color: #9a92a9;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 1.35px;
}

.sidebar_toggle {
  position: absolute;
  top: 8px;
  right: -29px;
  width: 25px;
  height: 25px;
  z-index: 5;
  display: grid;
  place-items: center;
  border: 1px solid #e4deef;
  border-radius: 50%;
  background: #fff;
  color: #71677f;
  box-shadow: 0 4px 13px rgba(65, 53, 95, .14);
  font-size: 17px;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  transition: transform .2s ease, color .2s ease, box-shadow .2s ease;
}

.sidebar_toggle:hover {
  transform: scale(1.08);
  color: var(--sidebar-active);
  box-shadow: 0 6px 18px rgba(86, 68, 145, .18);
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
  gap: 13px;
  width: 100%;
  min-height: 43px;
  padding: 0 13px;
  box-sizing: border-box;
  border-radius: 11px;
  color: var(--sidebar-muted);
  text-decoration: none;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 12.5px;
  font-weight: 600;
  transition: background .18s ease, color .18s ease, transform .18s ease;
}

.sidebar_nav-item:hover {
  color: #5d536d;
  background: #f4f1fa;
  transform: translateX(2px);
}

.sidebar_nav-item--active {
  color: #fff;
  background: linear-gradient(135deg, #8871ee 0%, #7b61e7 100%);
  box-shadow: 0 7px 16px rgba(114, 91, 205, .19);
}

.sidebar_nav-item--active:hover {
  color: #fff;
  background: linear-gradient(135deg, #8871ee 0%, #7b61e7 100%);
  transform: none;
}

.sidebar_nav-icon {
  width: 20px;
  flex: 0 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #837a91;
  font-size: 15px;
  transition: color .18s ease;
}

.sidebar_nav-item--active .sidebar_nav-icon {
  color: #fff;
}

.sidebar_notification-dot {
  display: none;
  width: 6px;
  height: 6px;
  margin-left: auto;
  flex: 0 0 6px;
  border-radius: 50%;
  background: #fff;
}

.sidebar_nav-item--active .sidebar_notification-dot {
  display: block;
}

.sidebar_logout {
  width: 100%;
  min-height: 43px;
  margin-top: auto;
  padding: 12px 13px;
  display: flex;
  align-items: center;
  gap: 13px;
  border: 0;
  border-top: 1px solid var(--sidebar-border);
  background: transparent;
  color: var(--sidebar-muted);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: color .18s ease, background .18s ease;
}

.sidebar_logout:hover {
  color: #5d536d;
  background: #f4f1fa;
}

.sidebar_logout-icon {
  width: 20px;
  flex: 0 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
}

.sidebar_nav-label {
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  transition: opacity .16s ease, width .25s ease;
}

.sidebar--collapsed {
  width: 76px;
  padding-left: 10px;
  padding-right: 10px;
}

.sidebar--collapsed .sidebar_brand {
  justify-content: center;
  margin-left: 0;
  margin-right: 0;
  padding-left: 0;
  padding-right: 0;
}

.sidebar--collapsed .sidebar_brand-text,
.sidebar--collapsed .sidebar_nav-label {
  width: 0;
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
  flex-basis: 24px;
  font-size: 16px;
}

.sidebar--collapsed .sidebar_notification-dot {
  position: absolute;
  top: 8px;
  right: 11px;
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

.sidebar--collapsed .sidebar_toggle {
  right: -29px;
}

@media (max-width: 900px) and (min-width: 701px) {
  .sidebar {
    width: 220px;
  }

  .sidebar--collapsed {
    width: 70px;
  }
}

@media (max-width: 700px) {
  .sidebar {
    position: relative;
    width: 100%;
    height: auto;
    min-height: 0;
    padding: 14px 16px;
    overflow: hidden;
    border-right: 0;
    border-bottom: 1px solid var(--sidebar-border);
  }

  .sidebar::before {
    width: 100%;
    height: 3px;
    bottom: auto;
  }

  .sidebar_brand {
    margin-bottom: 16px;
  }

  .sidebar_toggle {
    top: 8px;
    right: 8px;
  }

  .sidebar_navigation {
    flex-direction: row;
    overflow-x: auto;
    gap: 7px;
    padding-bottom: 3px;
    flex: none;
    scrollbar-width: none;
  }

  .sidebar_navigation::-webkit-scrollbar {
    display: none;
  }

  .sidebar_nav-item {
    width: auto;
    min-width: max-content;
    min-height: 40px;
    padding: 0 12px;
  }

  .sidebar_logout {
    display: none;
  }

  .sidebar--collapsed {
    width: 100%;
  }

  .sidebar--collapsed .sidebar_brand {
    justify-content: flex-start;
  }

  .sidebar--collapsed .sidebar_navigation {
    justify-content: flex-start;
  }

  .sidebar--collapsed .sidebar_nav-item {
    width: 42px;
    min-width: 42px;
    padding: 0;
  }
}

@media (max-width: 450px) {
  .sidebar {
    padding: 12px;
  }

  .sidebar_brand-text h2 {
    font-size: 15px;
  }

  .sidebar_nav-item {
    min-height: 38px;
  }
}
</style>
