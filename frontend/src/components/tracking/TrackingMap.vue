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
        <strong>{{ gpsLocation ? 'GPS ACTIVE' : 'GPS WAITING' }}</strong>
        <small>
          {{ gpsLocation
            ? 'Vehicle location updating'
            : 'Waiting for GPS position' }}
        </small>
      </div>
    </div>

  </div>
</template>


<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// TrackingView listens for this event and updates the page information.
const emit = defineEmits(['tracking-update'])

// Receive the latest GPS location from the backend.
const props = defineProps({
  gpsLocation: {
    type: Object,
    default: null
  }
})

// HTML element used by Leaflet.
const mapContainer = ref(null)

// Leaflet map instance.
let map = null

// Moving vehicle marker.
let deliveryMarker = null

// Vehicle icon used by the map.
const truckIcon = '🚚'

// Create the vehicle marker icon.
function createVehicleIcon() {
  return L.divIcon({
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
}

// Update the vehicle marker using the real GPS location.
function updateVehicleLocation(location) {
  if (!map || !location) {
    return
  }

  const latitude = Number(location.latitude)
  const longitude = Number(location.longitude)

  // Ignore invalid GPS coordinates.
  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    return
  }

  const coordinates = [latitude, longitude]

  // Create the vehicle marker the first time GPS data arrives.
  if (!deliveryMarker) {
    deliveryMarker = L.marker(
      coordinates,
      {
        icon: createVehicleIcon(),
        zIndexOffset: 1000
      }
    )
      .addTo(map)
      .bindPopup(`
        <strong>Delivery vehicle</strong>
        <br>
        Current GPS location
      `)
  } else {
    // Move the existing vehicle marker to the latest position.
    deliveryMarker.setLatLng(coordinates)
  }

  // Centre the map on the current vehicle position.
  map.setView(
    coordinates,
    15,
    {
      animate: true
    }
  )

  // Tell the parent page that a real GPS position is available.
  emit('tracking-update', {
    progress: 0,
    status: 'GPS Updated',
    eta: 'Not available'
  })
}

// Create the Leaflet map.
onMounted(() => {
  map = L.map(mapContainer.value, {
    zoomControl: false,
    scrollWheelZoom: false,
    attributionControl: true
  })

  // Keep the zoom controls clear of the tracking overlay.
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

  // If GPS data was already loaded before the map mounted,
  // display it immediately.
  if (props.gpsLocation) {
    updateVehicleLocation(props.gpsLocation)
  } else {
    // Start with a neutral world view until a real GPS position is available.
    map.setView(
      [0, 0],
      2
    )
  }

  // Give Leaflet a moment to calculate its final size.
  setTimeout(() => {
    if (map) {
      map.invalidateSize()
    }
  }, 250)
})

// Watch for a new GPS position from TrackingView.
watch(
  () => props.gpsLocation,
  (newLocation) => {
    if (newLocation) {
      updateVehicleLocation(newLocation)
    }
  },
  {
    deep: true
  }
)

// Clean up the Leaflet map.
onBeforeUnmount(() => {
  if (map) {
    map.remove()
    map = null
  }

  deliveryMarker = null
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