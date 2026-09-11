<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-mark">WE</div>
        <div>
          <div class="brand-name">WeConnect</div>
          <div class="brand-sub">Small Business</div>
        </div>
      </div>

      <nav class="nav">
        <router-link to="/dashboard" class="nav-item">Dashboard</router-link>
        <router-link to="/browse-suppliers" class="nav-item">Browse suppliers</router-link>
        <router-link to="/orders" class="nav-item">My orders</router-link>
        <router-link to="/deliveries" class="nav-item">Deliveries</router-link>
        <router-link to="/messages" class="nav-item">Messages</router-link>
        <router-link to="/business-profile" class="nav-item">Business profile</router-link>
      </nav>

      <button class="logout-btn">Log out</button>
    </aside>

    <router-view />
  </div>
</template>

<script setup>
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
  color: white;
  font-weight: 700;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
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
  color: var(--color-text-on-dark-muted);
  text-decoration: none;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  font-size: 14px;
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
  background: none;
  border: 1px solid #3A3542;
  color: var(--color-text-on-dark-muted);
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  text-align: left;
}
.logout-btn:hover {
  color: var(--color-text-on-dark);
  border-color: #4A4552;
}
</style>
