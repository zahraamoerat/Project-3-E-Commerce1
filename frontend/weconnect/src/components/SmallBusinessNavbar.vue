<template>
  <aside class="sb_sidebar">
    <div class="sb_sidebar-brand">
      <router-link to="/small-business" aria-label="WeConnect small business home">
        <span class="sb_brand-mark">↗</span>
        <span class="sb_brand-copy"><strong>WeConnect</strong><small>SMALL BUSINESS</small></span>
      </router-link>
    </div>

    <nav class="sb_sidebar-nav" aria-label="Small business navigation">
      <router-link to="/small-business" :class="{ active: route.path === '/small-business' }">
        <span>⌂</span><strong>Home</strong>
      </router-link>
      <router-link to="/small-business/dashboard" :class="{ active: isActive('/small-business/dashboard') }">
        <span>▦</span><strong>Dashboard</strong>
      </router-link>
      <router-link to="/small-business/products" :class="{ active: isActive('/small-business/products') }">
        <span>▣</span><strong>Shop</strong>
      </router-link>
      <router-link to="/small-business/orders" :class="{ active: isActive('/small-business/orders') }">
        <span>▤</span><strong>Orders</strong>
      </router-link>
      <router-link to="/small-business/deliveries" :class="{ active: isActive('/small-business/deliveries') }">
        <span>⌁</span><strong>Deliveries</strong>
      </router-link>
      <router-link to="/small-business/suppliers" :class="{ active: isActive('/small-business/suppliers') }">
        <span>♧</span><strong>Suppliers</strong>
      </router-link>
      <router-link to="/small-business/profile" :class="{ active: isActive('/small-business/profile') }">
        <span>◎</span><strong>Business Profile</strong>
      </router-link>
    </nav>

    <button type="button" class="sb_logout" @click="logout">
      <span>↪</span><strong>Log out</strong>
    </button>
  </aside>

  <header class="sb_topbar">
    <div>
      <span>WeConnect</span>
      <strong>{{ pageTitle }}</strong>
    </div>

    <div class="sb_topbar-actions">
      <button type="button" class="sb_notification" aria-label="Notifications">♧<i></i></button>
      <button type="button" class="sb_profile" @click="goToProfile">
        <span class="sb_avatar">{{ profileInitials }}</span>
        <span class="sb_profile-copy"><strong>{{ profileInitials }}</strong><small>Small Business</small></span>
        <span>⌄</span>
      </button>
      <button type="button" class="sb_menu-button" :aria-expanded="mobileMenuOpen" @click="mobileMenuOpen = !mobileMenuOpen" aria-label="Open navigation">☰</button>
    </div>
  </header>

  <nav v-if="mobileMenuOpen" class="sb_mobile-menu" aria-label="Mobile navigation">
    <router-link to="/small-business" @click="mobileMenuOpen = false">Home</router-link>
    <router-link to="/small-business/dashboard" @click="mobileMenuOpen = false">Dashboard</router-link>
    <router-link to="/small-business/products" @click="mobileMenuOpen = false">Shop</router-link>
    <router-link to="/small-business/orders" @click="mobileMenuOpen = false">Orders</router-link>
    <router-link to="/small-business/deliveries" @click="mobileMenuOpen = false">Deliveries</router-link>
    <router-link to="/small-business/suppliers" @click="mobileMenuOpen = false">Suppliers</router-link>
    <router-link to="/small-business/profile" @click="mobileMenuOpen = false">Business Profile</router-link>
  </nav>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const mobileMenuOpen = ref(false);

const pageTitle = computed(() => {
  const titles = {
    "small-business-landing": "Home",
    "small-business-dashboard": "Dashboard",
    "small-business-orders": "Orders",
    "small-business-products": "Shop",
    "small-business-suppliers": "Suppliers",
    "small-business-deliveries": "Deliveries",
    "small-business-profile": "Business Profile",
  };
  return titles[route.name] || "Small Business";
});

const profileInitials = computed(() => {
  const email = localStorage.getItem("weconnect_email") || "";
  if (!email) return "SB";
  const name = email.split("@")[0].replace(/[._-]+/g, " ").trim();
  return (name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("") || "SB").toUpperCase();
});

function isActive(path) {
  return route.path === path || route.path.startsWith(path + "/");
}

function goToProfile() {
  router.push("/small-business/profile");
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
:global(body) {
  margin: 0;
  padding-left: 238px;
  background: #f5f7fb;
}

.sb_sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  width: 238px;
  z-index: 1100;
  display: flex;
  flex-direction: column;
  padding: 22px 13px 18px;
  box-sizing: border-box;
  background: #fff;
  color: #344054;
  border-right: 1px solid #e7eaf0;
  box-shadow: 4px 0 18px rgba(31,41,55,.05);
}

.sb_sidebar-brand { margin: 0 7px 30px; }

.sb_sidebar-brand a {
  display: flex;
  align-items: center;
  gap: 11px;
  color: inherit;
  text-decoration: none;
}

.sb_brand-mark {
  display: grid;
  place-items: center;
  width: 39px;
  height: 39px;
  border-radius: 11px;
  background: #4169e1;
  color: #fff;
  font-size: 19px;
  font-weight: 800;
}

.sb_brand-copy { display: grid; line-height: 1.05; }
.sb_brand-copy strong { font-size: 16px; }
.sb_brand-copy small { margin-top: 4px; color: #98a2b3; font-size: 8px; font-weight: 800; letter-spacing: 1.2px; }

.sb_sidebar-nav {
  display: grid;
  gap: 5px;
}

.sb_sidebar-nav a {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 42px;
  padding: 0 12px;
  border-radius: 9px;
  color: #667085;
  text-decoration: none;
  font-size: 12px;
  font-weight: 650;
}

.sb_sidebar-nav a > span {
  width: 20px;
  text-align: center;
  color: #98a2b3;
  font-size: 15px;
}

.sb_sidebar-nav a:hover { background: #f5f7fb; color: #344054; }
.sb_sidebar-nav a.active { background: #eef3ff; color: #4169e1; font-weight: 750; }
.sb_sidebar-nav a.active > span { color: #4169e1; }

.sb_logout {
  margin-top: auto;
  min-height: 42px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 0;
  border-top: 1px solid #e7eaf0;
  background: transparent;
  color: #667085;
  text-align: left;
  font-size: 12px;
  cursor: pointer;
}

.sb_logout:hover { background: #f5f7fb; color: #344054; }

.sb_topbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  min-height: 64px;
  box-sizing: border-box;
  padding: 0 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  background: rgba(255,255,255,.96);
  border-bottom: 1px solid #e7eaf0;
  backdrop-filter: blur(12px);
}

.sb_topbar > div:first-child {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.sb_topbar > div:first-child span { color: #98a2b3; font-size: 11px; font-weight: 700; }
.sb_topbar > div:first-child strong { color: #344054; font-size: 13px; }

.sb_topbar-actions { display: flex; align-items: center; gap: 9px; }

.sb_notification {
  position: relative;
  width: 35px;
  height: 35px;
  border: 1px solid #e1e6ef;
  border-radius: 50%;
  background: #fff;
  color: #667085;
  cursor: pointer;
}

.sb_notification i {
  position: absolute;
  top: 7px;
  right: 8px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #e85d5d;
}

.sb_profile {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 0;
  background: transparent;
  color: #344054;
  cursor: pointer;
}

.sb_avatar {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #4169e1;
  color: #fff;
  font-size: 10px;
  font-weight: 800;
}

.sb_profile-copy { display: grid; text-align: left; }
.sb_profile-copy strong { font-size: 11px; }
.sb_profile-copy small { color: #98a2b3; font-size: 9px; }

.sb_menu-button { display: none; }

.sb_mobile-menu { display: none; }

@media (max-width: 700px) {
  :global(body) { padding-left: 0; }

  .sb_sidebar { display: none; }

  .sb_topbar {
    min-height: 58px;
    padding: 0 14px;
  }

  .sb_topbar > div:first-child span,
  .sb_profile-copy {
    display: none;
  }

  .sb_menu-button {
    display: grid;
    place-items: center;
    width: 35px;
    height: 35px;
    border: 1px solid #e1e6ef;
    border-radius: 8px;
    background: #fff;
    color: #667085;
  }

  .sb_mobile-menu {
    position: fixed;
    top: 58px;
    left: 0;
    right: 0;
    z-index: 1200;
    display: grid;
    gap: 4px;
    padding: 10px 14px;
    background: #fff;
    border-bottom: 1px solid #e7eaf0;
    box-shadow: 0 8px 20px rgba(31,41,55,.1);
  }

  .sb_mobile-menu a {
    padding: 10px;
    border-radius: 8px;
    color: #667085;
    text-decoration: none;
    font-size: 12px;
    font-weight: 650;
  }

  .sb_mobile-menu a.router-link-active { background: #eef3ff; color: #4169e1; }
}

@media (max-width: 480px) {
  .sb_topbar > div:first-child strong { font-size: 12px; }
}
</style>