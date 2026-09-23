<template>
  <header class="sb-navbar">
    <div class="sb-navbar-inner">
      <router-link to="/small-business/dashboard" class="sb-brand" aria-label="WeConnect small business dashboard">
        <span class="sb-brand-mark">↗</span>
        <span class="sb-brand-copy">
          <strong>WeConnect</strong>
          <small>SMALL BUSINESS</small>
        </span>
      </router-link>

      <nav class="sb-nav-links" aria-label="Small business navigation">
        <router-link to="/small-business/dashboard" :class="{ active: isActive('/small-business/dashboard') }">
          Home
        </router-link>
        <router-link to="/small-business/products" :class="{ active: isActive('/small-business/products') }">
          Shop
        </router-link>
        <router-link to="/small-business/orders" :class="{ active: isActive('/small-business/orders') }">
          Orders
        </router-link>
        <router-link to="/small-business/deliveries" :class="{ active: isActive('/small-business/deliveries') }">
          Deliveries
        </router-link>
      </nav>

      <div class="sb-nav-actions">
        <button type="button" aria-label="View cart" @click="goToCart">🛒</button>
        <button type="button" aria-label="Profile" @click="goToProfile">♙</button>
        <button type="button" class="sb-menu-button" :aria-expanded="mobileMenuOpen" aria-label="Open navigation menu" @click="mobileMenuOpen = !mobileMenuOpen">☰</button>
      </div>
    </div>

    <nav v-if="mobileMenuOpen" class="sb-mobile-menu" aria-label="Mobile navigation">
      <router-link to="/small-business/dashboard" :class="{ active: isActive('/small-business/dashboard') }" @click="mobileMenuOpen = false">Home</router-link>
      <router-link to="/small-business/products" :class="{ active: isActive('/small-business/products') }" @click="mobileMenuOpen = false">Shop</router-link>
      <router-link to="/small-business/orders" :class="{ active: isActive('/small-business/orders') }" @click="mobileMenuOpen = false">Orders</router-link>
      <router-link to="/small-business/deliveries" :class="{ active: isActive('/small-business/deliveries') }" @click="mobileMenuOpen = false">Deliveries</router-link>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const mobileMenuOpen = ref(false)

function isActive(path) {
  return route.path === path || route.path.startsWith(path + '/')
}

function goToOrders() {
  router.push('/small-business/orders')
}

function goToCart() {
  router.push('/small-business/cart')
}

function goToProfile() {
  router.push('/profile')
}
</script>

<style scoped>
.sb-navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  background: #5c3d24;
  color: #fff;
  border-bottom: 1px solid rgba(255,255,255,.12);
  box-shadow: 0 4px 18px rgba(62, 43, 29, .16);
}

.sb-navbar-inner {
  width: min(1280px, 94%);
  min-height: 72px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 34px;
}

.sb-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 205px;
  color: #fff;
  text-decoration: none;
}

.sb-brand-mark {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #f1d2b3;
  color: #5c3d24;
  font-size: 18px;
  font-weight: 800;
}

.sb-brand-copy {
  display: grid;
  line-height: 1.05;
}

.sb-brand-copy strong {
  font-family: Georgia, serif;
  font-size: 18px;
  letter-spacing: .2px;
}

.sb-brand-copy small {
  margin-top: 4px;
  color: #e9d6c4;
  font-size: 7px;
  font-weight: 800;
  letter-spacing: 1.3px;
}

.sb-nav-links {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(20px, 3vw, 38px);
}

.sb-nav-links a {
  position: relative;
  padding: 27px 2px 24px;
  color: #f4ebe4;
  text-decoration: none;
  font-size: 11px;
  font-weight: 600;
  transition: color .2s ease;
}

.sb-nav-links a:hover,
.sb-nav-links a.active {
  color: #fff;
}

.sb-nav-links a.active::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 17px;
  height: 2px;
  border-radius: 2px;
  background: #e0a56f;
}

.sb-nav-actions {
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 80px;
  justify-content: flex-end;
}

.sb-nav-actions button {
  width: 32px;
  height: 32px;
  border: 1px solid rgba(255,255,255,.22);
  border-radius: 50%;
  background: rgba(255,255,255,.07);
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  transition: background .2s ease, transform .2s ease;
}

.sb-nav-actions button:hover {
  background: #755036;
  transform: translateY(-1px);
}

.sb-menu-button { display: none; }

.sb-mobile-menu {
  display: none;
  width: min(1280px, 94%);
  margin: 0 auto;
  padding: 8px 0 12px;
  border-top: 1px solid rgba(255,255,255,.12);
}

.sb-mobile-menu a {
  display: block;
  padding: 11px 8px;
  border-radius: 6px;
  color: #f4ebe4;
  text-decoration: none;
  font-size: 11px;
}

.sb-mobile-menu a.active,
.sb-mobile-menu a:hover {
  background: rgba(255,255,255,.08);
  color: #fff;
}

@media (max-width: 760px) {
  .sb-navbar-inner {
    min-height: 64px;
    width: calc(100% - 24px);
    gap: 12px;
  }

  .sb-brand {
    min-width: auto;
  }

  .sb-brand-copy small {
    display: none;
  }

  .sb-nav-links {
    justify-content: flex-start;
    gap: 17px;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .sb-nav-links::-webkit-scrollbar {
    display: none;
  }

  .sb-nav-links a {
    padding: 24px 0 21px;
    white-space: nowrap;
    font-size: 10px;
  }

  .sb-nav-links a.active::after {
    bottom: 14px;
  }

  .sb-nav-actions {
    min-width: auto;
  }
}

@media (max-width: 520px) {
  .sb-menu-button { display: inline-grid !important; place-items: center; }
  .sb-mobile-menu { display: block; }
  .sb-brand-copy strong {
    font-size: 15px;
  }

  .sb-brand-mark {
    width: 30px;
    height: 30px;
  }

  .sb-nav-links {
    display: none;
  }

  .sb-nav-actions {
    margin-left: auto;
  }
}
</style>
