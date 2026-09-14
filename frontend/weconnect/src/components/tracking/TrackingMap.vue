<template>
  <div class="connect-tracking-map-shell">

    <!-- Leaflet map -->
    <div
      ref="mapContainer"
      class="connect-tracking-map"
    ></div>

    <!-- Map information badge -->
    <div class="connect-tracking-map-location-badge">
      <span class="connect-tracking-map-signal"></span>

      <div>
        <strong>GPS ACTIVE</strong>
        <small>Vehicle location updating</small>
      </div>
    </div>

  </div>
</template>


<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Font Awesome icon used inside the vehicle marker.
import { faTruckFast } from '@fortawesome/free-solid-svg-icons'


// TrackingView listens for this event and updates the page information.
const emit = defineEmits(['tracking-update'])


// HTML element used by Leaflet.
const mapContainer = ref(null)


// Leaflet map instance.
let map = null

// Moving vehicle marker.
let deliveryMarker = null

// Simulated GPS timer.
let trackingTimer = null


// ---------------------------------------------------------
// DELIVERY ROUTE
// ---------------------------------------------------------

// Supplier warehouse.
const pickupLocation = [-29.8587, 31.0218]

// Points between the supplier and business.
// More points make the simulated vehicle movement smoother.
const routePoints = [
  pickupLocation,
  [-29.8610, 31.0228],
  [-29.8640, 31.0240],
  [-29.8670, 31.0250],
  [-29.8700, 31.0265],
  [-29.8730, 31.0280],
  [-29.8755, 31.0290],
  [-29.8780, 31.0300]
]

// Small business destination.
const destinationLocation = routePoints[routePoints.length - 1]


// Start the vehicle partway through the journey.
// This makes the prototype open looking like an active delivery.
let currentRouteIndex = 4


// ---------------------------------------------------------
// VEHICLE ICON
// ---------------------------------------------------------

// Simple truck icon for the Leaflet marker.
// Keeping the marker HTML simple prevents Leaflet from
// depending on the Font Awesome rendering system.
const truckIcon = '🚚'

// ---------------------------------------------------------
// CREATE MAP
// ---------------------------------------------------------

onMounted(() => {

  // Create the Leaflet map.
  map = L.map(mapContainer.value, {
    zoomControl: false,
    scrollWheelZoom: false,
    attributionControl: true
  })

  // Keep the zoom controls clear of the journey progress overlay.
  L.control.zoom({
    position: 'topright'
  }).addTo(map)


  // OpenStreetMap tiles.
  L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }
  ).addTo(map)


  // -------------------------------------------------------
  // DELIVERY ROUTE
  // -------------------------------------------------------

  // Draw a softer line underneath the route.
  L.polyline(
    routePoints,
    {
      color: '#FFFEFC',
      weight: 9,
      opacity: 0.85,
      lineCap: 'round',
      lineJoin: 'round'
    }
  ).addTo(map)


  // Draw the colored route last so it stays visible above the underlay.
  L.polyline(
    routePoints,
    {
      color: '#D17A4A',
      weight: 5,
      opacity: 0.82,
      lineCap: 'round',
      lineJoin: 'round'
    }
  ).addTo(map)


  // -------------------------------------------------------
  // PICKUP MARKER
  // -------------------------------------------------------

  const pickupIcon = L.divIcon({
    className: 'connect-tracking-pickup-marker',
    html: `
      <div class="connect-tracking-location-marker connect-tracking-pickup-dot">
        <span></span>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  })


  L.marker(
    pickupLocation,
    {
      icon: pickupIcon
    }
  )
    .addTo(map)
    .bindPopup(
      `
        <strong>Supplier Warehouse</strong>
        <br>
        Shipment origin
      `
    )


  // -------------------------------------------------------
  // DESTINATION MARKER
  // -------------------------------------------------------

  const destinationIcon = L.divIcon({
    className: 'connect-tracking-destination-marker',
    html: `
      <div class="connect-tracking-location-marker connect-tracking-destination-dot">
        <span></span>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  })


  L.marker(
    destinationLocation,
    {
      icon: destinationIcon
    }
  )
    .addTo(map)
    .bindPopup(
      `
        <strong>Small Business</strong>
        <br>
        Delivery destination
      `
    )


  // -------------------------------------------------------
  // DELIVERY VEHICLE
  // -------------------------------------------------------

  const deliveryIcon = L.divIcon({
    className: 'connect-tracking-vehicle-marker',
    html: `
      <div class="connect-tracking-vehicle">
        <div class="connect-tracking-vehicle-pulse"></div>
        <div class="connect-tracking-vehicle-circle">
          ${truckIcon}
        </div>
      </div>
    `,
    iconSize: [64, 64],
    iconAnchor: [32, 32]
  })


  // Current simulated vehicle location.
  const startingPoint = routePoints[currentRouteIndex]


  deliveryMarker = L.marker(
    startingPoint,
    {
      icon: deliveryIcon,
      zIndexOffset: 1000
    }
  )
    .addTo(map)
    .bindPopup(
      `
        <strong>Delivery vehicle</strong>
        <br>
        Currently in transit
      `
    )


  // -------------------------------------------------------
  // FIT ROUTE INTO MAP
  // -------------------------------------------------------

  const routeBounds = L.latLngBounds(routePoints)

  map.fitBounds(
    routeBounds,
    {
      padding: [55, 55]
    }
  )


  // Give Leaflet a moment to calculate its final size.
  setTimeout(() => {
    if (map) {
      map.invalidateSize()
    }
  }, 250)


  // -------------------------------------------------------
  // INITIAL TRACKING UPDATE
  // -------------------------------------------------------

  emitTrackingUpdate()


  // -------------------------------------------------------
  // SIMULATED GPS
  // -------------------------------------------------------

  trackingTimer = setInterval(() => {

    // Move toward the next route point.
    currentRouteIndex += 1


    // Stop at the destination.
    if (currentRouteIndex >= routePoints.length) {
      currentRouteIndex = routePoints.length - 1
    }


    const currentLocation = routePoints[currentRouteIndex]


    // Update the vehicle marker.
    deliveryMarker.setLatLng(currentLocation)


    // Keep the vehicle visible without constantly changing
    // the user's zoom level.
    map.panTo(
      currentLocation,
      {
        animate: true,
        duration: 0.8
      }
    )


    // Send the new tracking information to the parent page.
    emitTrackingUpdate()


    // Stop once the destination has been reached.
    if (
      currentRouteIndex === routePoints.length - 1
    ) {
      clearInterval(trackingTimer)
      trackingTimer = null
    }

  }, 3500)
})


// ---------------------------------------------------------
// TRACKING INFORMATION
// ---------------------------------------------------------

function emitTrackingUpdate() {

  const progress = Math.round(
    (currentRouteIndex / (routePoints.length - 1)) * 100
  )


  let status = 'In Transit'
  let eta = '25 min'


  if (progress >= 90) {
    status = 'Arriving Soon'
    eta = '5 min'
  } else if (progress >= 75) {
    status = 'In Transit'
    eta = '12 min'
  } else if (progress >= 50) {
    status = 'In Transit'
    eta = '18 min'
  }


  if (progress === 100) {
    status = 'Delivered'
    eta = 'Arrived'
  }


  emit(
    'tracking-update',
    {
      progress,
      status,
      eta
    }
  )
}


// ---------------------------------------------------------
// CLEANUP
// ---------------------------------------------------------

onBeforeUnmount(() => {

  // Stop simulated GPS movement.
  if (trackingTimer) {
    clearInterval(trackingTimer)
    trackingTimer = null
  }


  // Remove the Leaflet map.
  if (map) {
    map.remove()
    map = null
  }
})
</script>


<style>

.connect-tracking-map-shell {
  position: relative;
  width: min(100%, 560px);
  height: min(100vw, 560px);
  min-height: 320px;
  margin: 0 auto;
  overflow: hidden;
  background: #E8E2DD;
  border-radius: 14px;
}

.connect-tracking-map {
  width: 100%;
  height: 100%;
  min-height: 320px;
}


/* Actual map */
.connect-tracking-map {
  width: 100%;
  height: 100%;
}


/* Small GPS badge */
.connect-tracking-map-location-badge {
  position: absolute;
  z-index: 500;
  right: 14px;
  bottom: 14px;

  display: flex;
  align-items: center;
  gap: 8px;

  padding: 8px 10px;

  background: rgba(255, 254, 252, 0.94);
  border: 1px solid rgba(255, 255, 255, 0.85);
  border-radius: 10px;

  box-shadow: 0 5px 16px rgba(78, 52, 46, 0.13);

  backdrop-filter: blur(7px);
}


.connect-tracking-map-location-badge strong,
.connect-tracking-map-location-badge small {
  display: block;
}


.connect-tracking-map-location-badge strong {
  color: #4E342E;
  font-size: 8px;
  letter-spacing: 1px;
}


.connect-tracking-map-location-badge small {
  margin-top: 2px;
  color: #9A8B82;
  font-size: 8px;
}


.connect-tracking-map-signal {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #5C8A60;
  box-shadow: 0 0 0 4px rgba(92, 138, 96, 0.13);
}


/* Pickup and destination markers */
.connect-tracking-pickup-marker,
.connect-tracking-destination-marker,
.connect-tracking-vehicle-marker {
  background: transparent;
  border: none;
}


.connect-tracking-location-marker {
  width: 24px;
  height: 24px;
  box-sizing: border-box;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 4px solid #FFFEFC;
  border-radius: 50%;

  box-shadow: 0 3px 12px rgba(78, 52, 46, 0.28);
}


.connect-tracking-location-marker span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}


.connect-tracking-pickup-dot {
  background: #4E342E;
}


.connect-tracking-pickup-dot span {
  background: #FFFEFC;
}


.connect-tracking-destination-dot {
  background: #D17A4A;
}


.connect-tracking-destination-dot span {
  background: #FFFEFC;
}


/* Delivery vehicle marker */
.connect-tracking-vehicle {
  position: relative;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
}


.connect-tracking-vehicle-pulse {
  position: absolute;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba(209, 122, 74, 0.16);
  animation: connect-tracking-pulse 2s ease-out infinite;
}


.connect-tracking-vehicle-circle {
  position: relative;
  z-index: 2;

  width: 42px;
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #FFFEFC;
  border: 3px solid #D17A4A;
  border-radius: 50%;

  color: #D17A4A;

  box-shadow:
    0 5px 16px rgba(78, 52, 46, 0.28);
}


@keyframes connect-tracking-pulse {

  0% {
    transform: scale(0.65);
    opacity: 0.8;
  }

  70% {
    transform: scale(1.15);
    opacity: 0;
  }

  100% {
    transform: scale(1.15);
    opacity: 0;
  }
}


/* Keep Leaflet controls consistent with the page */
.connect-tracking-map-shell .leaflet-control-zoom {
  border: none !important;
  box-shadow: 0 5px 15px rgba(78, 52, 46, 0.16) !important;
}


.connect-tracking-map-shell .leaflet-control-zoom a {
  width: 30px;
  height: 30px;
  line-height: 30px;
  color: #4E342E;
  background: #FFFEFC;
  border: none;
}


.connect-tracking-map-shell .leaflet-control-zoom a:hover {
  color: #D17A4A;
  background: #FFFEFC;
}


.connect-tracking-map-shell .leaflet-control-attribution {
  font-size: 8px;
  background: rgba(255, 254, 252, 0.8);
}


/* Smaller screens */
@media (max-width: 560px) {

  .connect-tracking-map-shell {
    width: 100%;
    height: calc(100vw - 56px);
    min-height: 300px;
    max-height: 500px;
  }

  .connect-tracking-map-location-badge {
    right: 10px;
    bottom: 10px;
  }
}

</style>