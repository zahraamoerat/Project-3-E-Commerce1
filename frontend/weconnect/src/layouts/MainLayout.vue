<script setup>
import Sidebar from "../components/Sidebar.vue";
</script>

<template>
  <div class="sidebar_main-layout">
    <Sidebar />

    <main class="sidebar_main-content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
:global(html),
:global(body),
:global(#app) {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100%;
}

.sidebar_main-layout {
  display: flex;
  gap: 0;
  width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  background: #f7f5f2;
}

.sidebar_main-content {
  flex: 1;
  min-width: 0;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

@media (max-width: 700px) {
  .sidebar_main-layout {
    flex-direction: column;
  }
}
</style>
