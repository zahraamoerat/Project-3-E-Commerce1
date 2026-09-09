<template>
  <!-- Square map container keeps the tracking view compact and balanced -->
  <div
    ref="mapContainer"
    class="connect-tracking-map"
    style="
      width: min(100%, 560px);
      aspect-ratio: 1 / 1;
      margin: 0 auto;
      background: #E8E2DD;
    "
  ></div>
</template>

<script setup>
// Vue functions used to create and clean up the map.
import { onMounted, onBeforeUnmount, ref } from 'vue'

// Leaflet handles the interactive map, markers and route.
import L from 'leaflet'

// Leaflet's CSS is required for the map controls and tiles.
import 'leaflet/dist/leaflet.css'


// Reference to the HTML element where Leaflet creates the map.
const mapContainer = ref(null)

// Store the Leaflet map instance.
let map = null

// Store the moving delivery marker.
let deliveryMarker = null

// Store the timer used for simulated GPS movement.
let trackingTimer = null


// ---------------------------------------------------------
// MOCK DELIVERY LOCATIONS
// ---------------------------------------------------------

// Starting position of the delivery vehicle.
// These are temporary Durban coordinates for the prototype.
let latitude = -29.8587
let longitude = 31.0218

// Supplier warehouse / pickup point.
const pickupLocation = [-29.8587, 31.0218]

// Small business / destination point.
const destinationLocation = [-29.8780, 31.0300]


// ---------------------------------------------------------
// CREATE MAP
// ---------------------------------------------------------

onMounted(() => {

  // Create the Leaflet map using the delivery's starting position.
  map = L.map(mapContainer.value, {
    zoomControl: true
  }).setView(
    [latitude, longitude],
    13
  )


  // Add OpenStreetMap as the map background.
  L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution: '&copy; OpenStreetMap contributors'
    }
  ).addTo(map)


  // -------------------------------------------------------
  // DELIVERY ROUTE
  // -------------------------------------------------------

  // These points create a simple visual route between
  // the supplier and the business.
  const routePoints = [
    pickupLocation,
    [-29.8650, 31.0240],
    [-29.8710, 31.0270],
    destinationLocation
  ]

  // Draw the delivery route on the map.
  L.polyline(
    routePoints,
    {
      color: '#D17A4A',
      weight: 5,
      opacity: 0.85,
      lineCap: 'round',
      lineJoin: 'round'
    }
  ).addTo(map)


  // -------------------------------------------------------
  // PICKUP MARKER
  // -------------------------------------------------------

  // Create a simple circular icon for the supplier.
  const pickupIcon = L.divIcon({
    className: 'connect-pickup-marker',
    html: '<div class="connect-pickup-dot"></div>',
    iconSize: [26, 26],
    iconAnchor: [13, 13]
  })

  // Add the supplier marker to the map.
  L.marker(
    pickupLocation,
    {
      icon: pickupIcon
    }
  )
    .addTo(map)
    .bindPopup(
      '<strong>Supplier Warehouse</strong><br>Pickup location'
    )


  // -------------------------------------------------------
  // DESTINATION MARKER
  // -------------------------------------------------------

  // Create a terracotta icon for the destination.
  const destinationIcon = L.divIcon({
    className: 'connect-destination-marker',
    html: '<div class="connect-destination-dot"></div>',
    iconSize: [26, 26],
    iconAnchor: [13, 13]
  })

  // Add the destination marker.
  L.marker(
    destinationLocation,
    {
      icon: destinationIcon
    }
  )
    .addTo(map)
    .bindPopup(
      '<strong>Your Business</strong><br>Delivery destination'
    )


  // -------------------------------------------------------
  // DELIVERY VEHICLE
  // -------------------------------------------------------

  // Create a custom vehicle icon.
  // Using a simple text character keeps this independent
  // from external icon libraries.
  const deliveryIcon = L.divIcon({
    className: 'connect-delivery-marker',
    html: '<div class="connect-delivery-circle">🚚</div>',
    iconSize: [52, 52],
    iconAnchor: [26, 26]
  })

  // Add the moving vehicle marker.
  deliveryMarker = L.marker(
    [latitude, longitude],
    {
      icon: deliveryIcon
    }
  )
    .addTo(map)
    .bindPopup(
      '<strong>Delivery vehicle</strong><br>Currently in transit'
    )

  // Open the vehicle popup when the map loads.
  deliveryMarker.openPopup()


  // -------------------------------------------------------
  // FIT ROUTE INTO MAP
  // -------------------------------------------------------

  // Make sure the complete delivery route is visible.
  const routeBounds = L.latLngBounds(routePoints)

  map.fitBounds(
    routeBounds,
    {
      padding: [55, 55]
    }
  )


  // -------------------------------------------------------
  // SIMULATED GPS
  // -------------------------------------------------------

  // The backend is not providing live coordinates yet.
  // This simulates a delivery vehicle moving every 3 seconds.
  trackingTimer = setInterval(() => {

    // Move the vehicle toward the destination.
    latitude += 0.00065
    longitude += 0.00030


    // Stop latitude from moving beyond the destination.
    if (latitude >= destinationLocation[0]) {
      latitude = destinationLocation[0]
    }

    // Stop longitude from moving beyond the destination.
    if (longitude >= destinationLocation[1]) {
      longitude = destinationLocation[1]
    }


    // Update the vehicle marker's position.
    deliveryMarker.setLatLng([
      latitude,
      longitude
    ])


    // Keep the map following the delivery vehicle.
    map.panTo(
      [latitude, longitude],
      {
        animate: true,
        duration: 1
      }
    )


    // Stop the simulation once the vehicle reaches
    // the destination.
    if (
      latitude === destinationLocation[0] &&
      longitude === destinationLocation[1]
    ) {
      clearInterval(trackingTimer)
      trackingTimer = null
    }

  }, 3000)
})


// ---------------------------------------------------------
// CLEANUP
// ---------------------------------------------------------

onBeforeUnmount(() => {

  // Stop the simulated GPS timer.
  if (trackingTimer) {
    clearInterval(trackingTimer)
    trackingTimer = null
  }

  // Remove the Leaflet map when leaving the page.
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<style>
/*
  These three tiny Leaflet marker styles are kept here because
  Leaflet's custom div icons need CSS to control their appearance.
  They are uniquely named for the WeConnect tracking component.
*/

.connect-pickup-marker,
.connect-destination-marker,
.connect-delivery-marker {
  background: transparent;
  border: none;
}

.connect-pickup-dot {
  width: 18px;
  height: 18px;
  background: #4E342E;
  border: 4px solid #FFFEFC;
  border-radius: 50%;
  box-shadow: 0 3px 10px rgba(78, 52, 46, 0.35);
}

.connect-destination-dot {
  width: 18px;
  height: 18px;
  background: #D17A4A;
  border: 4px solid #FFFEFC;
  border-radius: 50%;
  box-shadow: 0 3px 10px rgba(78, 52, 46, 0.35);
}

.connect-delivery-circle {
  width: 42px;
  height: 42px;
  background: #FFFEFC;
  border: 3px solid #D17A4A;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: 0 5px 16px rgba(78, 52, 46, 0.30);
}
</style>