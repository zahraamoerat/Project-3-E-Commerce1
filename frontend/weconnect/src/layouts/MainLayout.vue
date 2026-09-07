<script setup>
import Sidebar from "../components/Sidebar.vue";
</script>

<template>
  <div class="main-layout">

    <!-- Sidebar stays visible on every page -->
    <Sidebar />

    <!-- Page content changes depending on the route -->
    <main class="main-content">
      <router-view />
    </main>

  </div>
</template>

<style scoped>
.main-layout {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  min-height: 100vh;
  overflow-y: auto;
}
</style>
