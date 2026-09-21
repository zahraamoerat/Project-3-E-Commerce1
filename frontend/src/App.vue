<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-mark">
          <img src="./assets/logo.png" alt="WeConnect logo" class="brand-logo" />
        </div>
        <div>
          <div class="brand-name">WeConnect</div>
          <div class="brand-sub">Small Business</div>
        </div>
      </div>

      <nav class="nav">
        <router-link to="/dashboard" class="nav-item">
          <FontAwesomeIcon :icon="faChartLine" class="nav-icon" />
          <span>Dashboard</span>
        </router-link>
        <router-link to="/browse-suppliers" class="nav-item">
          <FontAwesomeIcon :icon="faStore" class="nav-icon" />
          <span>Browse Suppliers</span>
        </router-link>
        <router-link to="/orders" class="nav-item">
          <FontAwesomeIcon :icon="faList" class="nav-icon" />
          <span>My orders</span>
        </router-link>
        <router-link to="/deliveries" class="nav-item">
          <FontAwesomeIcon :icon="faTruck" class="nav-icon" />
          <span>Deliveries</span>
        </router-link>
        <router-link to="/messages" class="nav-item">
          <FontAwesomeIcon :icon="faComments" class="nav-icon" />
          <span>Messages</span>
        </router-link>
        <router-link to="/reviews" class="nav-item">
          <FontAwesomeIcon :icon="faStar" class="nav-icon" />
          <span>Reviews</span>
        </router-link>
        <router-link to="/business-profile" class="nav-item">
          <FontAwesomeIcon :icon="faAddressCard" class="nav-icon" />
          <span>Business profile</span>
        </router-link>
      </nav>

      <button class="logout-btn" @click="logout">
        <FontAwesomeIcon :icon="faRightFromBracket" class="logout-icon" />
        <span>Log out</span>
      </button>
    </aside>

    <router-view />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faChartLine,
  faStore,
  faList,
  faTruck,
  faComments,
  faStar,
  faAddressCard,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

const router = useRouter();
const isLoggedIn = computed(() => !!localStorage.getItem("token"));

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  router.push("/login");
}
</script>

<style scoped>
.sidebar {
  width: 240px;
  background: var(--color-sidebar);
  color: var(--color-text-on-dark);
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 8px;
}

.brand-mark {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--color-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}

.brand-logo {
  width: 70%;
  height: 70%;
  object-fit: contain;
}

.brand-name {
  font-weight: 700;
  font-size: 15px;
}

.brand-sub {
  font-size: 11px;
  color: var(--color-text-on-dark-muted);
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  color: var(--color-text-on-dark-muted);
  text-decoration: none;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  font-size: 14px;
}

.nav-icon {
  width: 16px;
  margin-right: 10px;
  flex-shrink: 0;
}

.nav-item:hover {
  background: var(--color-sidebar-active);
  color: var(--color-text-on-dark);
}

.router-link-active {
  background: var(--color-sidebar-active);
  color: var(--color-text-on-dark);
  font-weight: 600;
}

.logout-btn {
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 10px;
  background: none;
  border: 1px solid #3A3542;
  color: var(--color-text-on-dark-muted);
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  text-align: left;
  cursor: pointer;
}

.logout-icon {
  width: 16px;
  flex-shrink: 0;
}

.logout-btn:hover {
  color: var(--color-text-on-dark);
  border-color: #4A4552;
  background: rgba(255, 255, 255, 0.05);
}
</style>