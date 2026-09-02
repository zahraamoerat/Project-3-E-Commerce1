<template>
  <!-- This is where the map will appear -->
  <div ref="mapContainer" class="tracking-map"></div>
</template>

<script setup>
// Import the Vue functions needed for the map and GPS updates
import { onMounted, onBeforeUnmount, ref } from 'vue'

// Import Leaflet to create and control the map
import L from 'leaflet'

// Import Leaflet's map styling
import 'leaflet/dist/leaflet.css'

// Store a reference to the div where the map will appear
const mapContainer = ref(null)

// Store the Leaflet map
let map = null

// Store the delivery marker
let deliveryMarker = null

// Store the timer used to simulate GPS updates
let trackingTimer = null

// Store the starting GPS latitude
let latitude = -29.8587

// Store the starting GPS longitude
let longitude = 31.0218

// Run this when the page has loaded
onMounted(() => {
  // Create the map using the current GPS coordinates
  map = L.map(mapContainer.value).setView(
    [latitude, longitude],
    12
  )

  // Add OpenStreetMap streets and locations to the map
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)

  // Add the delivery marker using the current GPS coordinates
  deliveryMarker = L.marker([latitude, longitude])
    .addTo(map)
    .bindPopup('Current delivery location')

  // Open the delivery marker popup
  deliveryMarker.openPopup()

  // Start simulating GPS movement
  trackingTimer = setInterval(() => {

    // Change the GPS position slightly
    latitude += 0.001
    longitude += 0.001

    // Move the delivery marker to the new GPS position
    deliveryMarker.setLatLng([latitude, longitude])

    // Move the map view to follow the delivery
    map.setView([latitude, longitude])
  }, 3000)
})

// Remove the map and tracking timer when leaving the page
onBeforeUnmount(() => {

  // Stop the simulated GPS updates
  if (trackingTimer) {
    clearInterval(trackingTimer)
    trackingTimer = null
  }

  // Remove the map
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<style scoped>
/* Set the size of the map */
.tracking-map {
  width: 100%;
  height: 600px;
}
</style>