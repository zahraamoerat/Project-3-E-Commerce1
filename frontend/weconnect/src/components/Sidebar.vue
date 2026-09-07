<template>
  <aside class="sidebar">

    <!-- Logo -->
    <div class="brand">
      <div class="brand-icon">↗</div>

      <div class="brand-text">
        <h2>WeConnect</h2>
        <span>SUPPLIER NETWORK</span>
      </div>
    </div>


    <!-- Navigation -->
    <nav class="navigation">

      <RouterLink to="/dashboard" class="nav-item">
        <span class="nav-icon">▦</span>
        <span>Dashboard</span>
      </RouterLink>


      <RouterLink to="/suppliers" class="nav-item">
        <span class="nav-icon">⌕</span>
        <span>Browse suppliers</span>
      </RouterLink>


      <RouterLink to="/orders" class="nav-item">
        <span class="nav-icon">▤</span>
        <span>My orders</span>
      </RouterLink>


      <RouterLink to="/deliveries" class="nav-item">
        <span class="nav-icon">▱</span>
        <span>Deliveries</span>
      </RouterLink>


      <RouterLink to="/messages" class="nav-item">
        <span class="nav-icon">◯</span>
        <span>Messages</span>
      </RouterLink>


      <RouterLink to="/profile" class="nav-item">
        <span class="nav-icon">▣</span>
        <span>Business profile</span>
      </RouterLink>

    </nav>


    <!-- Logout -->
    <button class="logout" @click="logout">
      <span>↪</span>
      <span>Log out</span>
    </button>

  </aside>
</template>


<script setup>

import { useRouter } from 'vue-router'

const router = useRouter()


function logout() {

  // Remove login information if you are using localStorage
  localStorage.removeItem('token')

  // Send user back to login
  router.push('/login')
}

</script>


<style scoped>
.sidebar {
  width: 230px;
  min-height: 100vh;

  background: #553c35;
  color: #c9b7ae;

  padding: 24px 16px;

  display: flex;
  flex-direction: column;

  flex-shrink: 0;
}


/* =========================
   BRAND
========================= */

.brand {
  display: flex;
  align-items: center;

  gap: 10px;

  margin-bottom: 35px;

  padding-left: 6px;
}

.brand-icon {
  font-size: 28px;
  color: #e9a16c;
}

.brand-text h2 {
  margin: 0;

  color: white;

  font-family: Georgia, serif;

  font-size: 18px;
}

.brand-text span {
  display: block;

  margin-top: 3px;

  font-size: 7px;

  letter-spacing: 1px;
}


/* =========================
   NAVIGATION
========================= */

.navigation {
  display: flex;

  flex-direction: column;

  gap: 5px;
}


.nav-item {
  display: flex;

  align-items: center;

  gap: 11px;

  width: 100%;

  padding: 12px;

  border-radius: 8px;

  text-decoration: none;

  color: #c9b7ae;

  font-size: 13px;

  transition: 0.2s;
}


.nav-item:hover {
  background: rgba(255, 255, 255, 0.08);

  color: white;
}


/* Active page */

.nav-item.router-link-active {
  background: #6a4d45;

  color: white;
}


.nav-icon {
  width: 18px;

  text-align: center;

  font-size: 15px;
}


/* =========================
   LOGOUT
========================= */

.logout {
  margin-top: auto;

  width: 100%;

  padding: 14px 12px;

  border: none;

  border-top: 1px solid rgba(255, 255, 255, 0.1);

  background: transparent;

  color: #c9b7ae;

  text-align: left;

  cursor: pointer;

  display: flex;

  align-items: center;

  gap: 11px;

  font-size: 13px;
}


.logout:hover {
  color: white;
}


/* =========================
   MOBILE
========================= */

@media (max-width: 700px) {

  .sidebar {
    width: 100%;

    min-height: auto;

    padding: 12px;
  }


  .brand {
    margin-bottom: 12px;
  }


  .navigation {
    flex-direction: row;

    overflow-x: auto;

    gap: 5px;
  }


  .nav-item {
    width: auto;

    white-space: nowrap;
  }


  .logout {
    display: none;
  }

}
</style>