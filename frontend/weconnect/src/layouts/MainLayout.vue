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
.sidebar_main-layout {
  display: flex;
  min-height: 100vh;
  background: #f7f5f2;
}

.sidebar_main-content {
  flex: 1;
  min-width: 0;
  min-height: 100vh;
  overflow-x: hidden;
}

@media (max-width: 700px) {
  .sidebar_main-layout {
    flex-direction: column;
  }
}
</style>