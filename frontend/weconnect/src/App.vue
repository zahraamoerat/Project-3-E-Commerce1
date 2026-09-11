<script setup>
// Import the sidebar so it can appear on every page
import Sidebar from './components/Sidebar.vue'

// RouterView displays whichever page the router is currently showing
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="app-layout">

    <!-- Shared sidebar -->
    <Sidebar />

    <!-- Main page content -->
    <main class="app-content">
      <RouterView />
    </main>

  </div>
</template>

<style scoped>
/* Keep the sidebar and page content next to each other */
.app-layout {
  min-height: 100vh;
  display: flex;
  background: #E8E2DD;
}

/* The current route is displayed in this area */
.app-content {
  flex: 1;
  min-width: 0;
}
</style>