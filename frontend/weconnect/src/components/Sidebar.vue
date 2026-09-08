<template>
  <aside class="sidebar">
    <!-- =========================
         LOGO / BRAND
    ========================== -->
    <div class="brand">
      <div class="brand-icon">
        <img src="https://i.ibb.co/6cPQyP4c/link-icon-white.png" alt="link icon white" border="0" class="brand-logo">
      </div>

      <div class="brand-text">
        <h2>WeConnect</h2>
        <span>SUPPLIER NETWORK</span>
      </div>
    </div>

    <!-- =========================
         NAVIGATION
    ========================== -->
    <nav class="navigation">

      <RouterLink to="/dashboard" class="nav-item">
        <span class="nav-icon">
          <FontAwesomeIcon :icon="faChartLine" />
        </span>
        <span>Dashboard</span>
      </RouterLink>

      <RouterLink to="/products" class="nav-item">
        <span class="nav-icon">
          <FontAwesomeIcon :icon="faShoppingBag" />
        </span>
        <span>Products</span>
      </RouterLink>

      <RouterLink to="/orders" class="nav-item">
        <span class="nav-icon">
          <FontAwesomeIcon :icon="faList" />
        </span>
        <span>Orders</span>
      </RouterLink>

      <RouterLink to="/stockmanagement" class="nav-item">
        <span class="nav-icon">
          <FontAwesomeIcon :icon="faWarehouse" />
        </span>
        <span>Stock Management</span>
      </RouterLink>

      <RouterLink to="/deliveries" class="nav-item">
        <span class="nav-icon">
          <FontAwesomeIcon :icon="faTruck" />
        </span>
        <span>Deliveries</span>

        <!-- Notification dot -->
        <span class="notification-dot"></span>
      </RouterLink>

      <RouterLink to="/reviews" class="nav-item">
        <span class="nav-icon">
          <FontAwesomeIcon :icon="faStar" />
        </span>
        <span>Reviews</span>
      </RouterLink>

      <RouterLink to="/profile" class="nav-item">
        <span class="nav-icon">
          <FontAwesomeIcon :icon="faUser" />
        </span>
        <span>Business Profile</span>
      </RouterLink>

    </nav>

    <!-- =========================
         LOGOUT
    ========================== -->
    <button class="logout" @click="logout">
      <span class="logout-icon">
        <FontAwesomeIcon :icon="faUser" />
      </span>
      <span>Log out</span>
    </button>
  </aside>
</template>

<script setup>
import logo from "../assets/link-icon-white.png";
import { useRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import { faList } from "@fortawesome/free-solid-svg-icons";
import { faWarehouse } from "@fortawesome/free-solid-svg-icons";
import { faTruck } from "@fortawesome/free-solid-svg-icons";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const router = useRouter()

function logout() {
  // Remove login information
  localStorage.removeItem('token')

  // Remove additional login data if needed
  localStorage.removeItem('user')

  // Redirect to login
  router.push('/login')
}
</script>

<style scoped>
/* =========================
   SIDEBAR
========================= */

.sidebar {
  width: 250px;
  min-height: 100vh;
  background: #523a33;
  color: #c9b7ae;
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  box-sizing: border-box;
}


/* =========================
   BRAND
========================= */

.brand {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 6px 10px;
  margin-bottom: 42px;
}

.brand-icon {
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
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.brand-text h2 {
  margin: 0;

  color: #ffffff;

  font-family: Georgia, serif;
  font-size: 21px;
  font-weight: 600;

  line-height: 1.1;
}

.brand-text span {
  margin-top: 6px;

  color: #bdaaa1;

  font-size: 8px;
  font-weight: 600;

  letter-spacing: 1.4px;
}


/* =========================
   NAVIGATION
========================= */

.navigation {
  display: flex;
  flex-direction: column;
  gap: 7px;
}


/* =========================
   NAVIGATION ITEMS
========================= */

.nav-item {
  position: relative;

  display: flex;
  align-items: center;

  gap: 15px;

  width: 100%;
  min-height: 48px;

  padding: 0 15px;

  box-sizing: border-box;

  border-radius: 10px;

  color: #c9b7ae;

  text-decoration: none;

  font-size: 14px;
  font-weight: 500;

  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}


/* =========================
   HOVER
========================= */

.nav-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;

  transform: translateX(2px);
}


/* =========================
   ACTIVE PAGE
========================= */

.nav-item.router-link-active {
  background: #684d45;
  color: #ffffff;

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}


/* =========================
   NAVIGATION ICONS
========================= */

.nav-icon {
  width: 22px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #bba99f;

  font-size: 18px;

  flex-shrink: 0;
}

.nav-item.router-link-active .nav-icon {
  color: #ffffff;
}


/* =========================
   NOTIFICATION DOT
========================= */

.notification-dot {
  width: 7px;
  height: 7px;

  margin-left: auto;

  border-radius: 50%;

  background: #e79b63;
}


/* =========================
   LOGOUT
========================= */

.logout {
  margin-top: auto;

  width: 100%;

  min-height: 52px;

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

  transition:
    color 0.2s ease,
    background 0.2s ease;
}

.logout:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.05);
}

.logout-icon {
  width: 22px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 19px;
}


/* =========================
   TABLET
========================= */

@media (max-width: 900px) {
  .sidebar {
    width: 220px;
    padding: 22px 16px;
  }

  .brand-text h2 {
    font-size: 19px;
  }

  .nav-item {
    min-height: 46px;
    font-size: 13px;
  }
}


/* =========================
   MOBILE
========================= */

@media (max-width: 700px) {
  .sidebar {
    width: 100%;
    min-height: auto;

    padding: 14px 16px;

    position: relative;
  }

  .brand {
    margin-bottom: 18px;
  }

  .brand-icon {
    width: 34px;
    height: 34px;
    font-size: 19px;
  }

  .brand-text h2 {
    font-size: 19px;
  }

  .navigation {
    flex-direction: row;

    overflow-x: auto;

    gap: 8px;

    padding-bottom: 5px;

    scrollbar-width: none;
  }

  .navigation::-webkit-scrollbar {
    display: none;
  }

  .nav-item {
    width: auto;

    min-width: max-content;
    min-height: 44px;

    padding: 0 14px;

    gap: 9px;

    font-size: 13px;
  }

  .nav-icon {
    width: 19px;
    font-size: 16px;
  }

  .logout {
    display: none;
  }
}


/* =========================
   SMALL MOBILE
========================= */

@media (max-width: 450px) {
  .sidebar {
    padding: 12px;
  }

  .brand {
    padding: 4px;
  }

  .navigation {
    gap: 6px;
  }

  .nav-item {
    padding: 0 12px;
    min-height: 42px;
  }
}
</style>