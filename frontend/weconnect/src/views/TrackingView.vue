<template>
  <!-- Main tracking page -->
  <div class="tracking-page">

    <h1>Delivery Tracking</h1>

    <p>
      Track the current delivery location using the map below.
    </p>

    <!-- Display the tracking map -->
    <TrackingMap />

  </div>
</template>

<script setup>
// Import the tracking map component
import TrackingMap from '../components/tracking/TrackingMap.vue'
</script>

<style scoped>
/* Add basic spacing around the page */
.tracking-page {
  padding: 20px;
}

h1 {
  margin-bottom: 10px;
}

p {
  margin-bottom: 20px;
}
</style>