<template>
  <div class="connect-tracking-page">

    <!-- Page header -->
    <header class="connect-tracking-header">

      <div>
        <div class="connect-tracking-eyebrow">
          SHIPMENT TRACKING
        </div>

        <h1 class="connect-tracking-title">
          Delivery Tracking
        </h1>

        <p class="connect-tracking-description">
          Follow the shared journey from supplier warehouse to business.
        </p>
      </div>

      <!-- Order reference -->
      <div class="connect-tracking-order-card">
        <div class="connect-tracking-order-label">
          ORDER REFERENCE
        </div>

        <div class="connect-tracking-order-value">
          {{ delivery?.order_number || 'Order' }}
        </div>

        <div
          class="connect-tracking-order-status"
          :class="{ 'status-cancelled': isCancelled() }"
        >
          <span class="connect-tracking-status-dot"></span>
          {{ isCancelled() ? 'Cancelled' : (delivery?.current_status || trackingStatus) }}
        </div>
      </div>

    </header>


    <!-- Shared journey strip -->
    <section class="connect-tracking-journey-strip">

      <div class="connect-tracking-party">

        <div class="connect-tracking-party-icon">
          <font-awesome-icon :icon="faWarehouse" />
        </div>

        <div>
          <span>PICKUP</span>
          <strong>{{ delivery?.supplier_name || 'Supplier' }}</strong>
          <small>{{ delivery?.pickup_label || delivery?.supplier_city || 'Pickup not set up yet' }}</small>
        </div>

      </div>


      <div class="connect-tracking-journey-line">
        <div
          class="connect-tracking-journey-progress"
          :style="{ width: `${journeyProgress}%` }"
        ></div>

        <div
          class="connect-tracking-truck-icon"
          :style="{ left: `${journeyProgress}%` }"
        >
          <font-awesome-icon :icon="faTruckFast" />
        </div>
      </div>


      <div class="connect-tracking-party connect-tracking-party-destination">
        <div class="connect-tracking-party-icon">
          <font-awesome-icon :icon="faLocationDot" />
        </div>

        <div>
          <span>DESTINATION</span>
          <strong>{{ delivery?.buyer_name || 'Small Business' }}</strong>
          <small>{{ delivery?.destination_label || delivery?.buyer_city || 'Destination not set up yet' }}</small>
        </div>
      </div>

    </section>


    <!-- Main tracking workspace -->
    <section class="connect-tracking-workspace">

      <!-- Map section -->
      <div class="connect-tracking-map-panel">

        <div class="connect-tracking-map-header">

          <div>
            <div class="connect-tracking-section-eyebrow">
              COURIER LOCATION
            </div>

            <h2>
              Delivery vehicle
            </h2>

            <p>
              The vehicle position appears once the courier shares a GPS location while in transit.
            </p>
          </div>

          <!-- Live indicator -->
          <div class="connect-tracking-live-badge">
            <span></span>
            {{ hasGps ? 'GPS ACTIVE' : 'WAITING GPS' }}
          </div>

        </div>


        <!-- Map wrapper -->
        <div class="connect-tracking-map-wrapper">

          <TrackingMap
            :gps-location="latestLocation"
            @tracking-update="handleTrackingUpdate"
          />

          <!-- Current delivery overlay -->
          <div class="connect-tracking-map-overlay">

            <div class="connect-tracking-overlay-top">

              <div class="connect-tracking-overlay-icon">
                <font-awesome-icon :icon="faTruckFast" />
              </div>

              <div>
                <strong>{{ trackingStatus }}</strong>
                <span>Delivery vehicle</span>
              </div>

            </div>


            <div class="connect-tracking-overlay-progress">

              <div class="connect-tracking-progress-header">
                <span>Journey progress</span>
                <strong>{{ trackingProgress }}%</strong>
              </div>

              <div class="connect-tracking-progress-track">
                <div
                  class="connect-tracking-progress-fill"
                  :style="{ width: `${trackingProgress}%` }"
                ></div>
              </div>

            </div>

          </div>

        </div>


        <!-- Map footer -->
        <div class="connect-tracking-map-footer">

          <div class="connect-tracking-location-update">
            <font-awesome-icon :icon="faLocationCrosshairs" />

            <span>
              Last updated {{ lastUpdated }}
            </span>
          </div>

          <div class="connect-tracking-map-note">
            {{ latestLocation?.location_description || 'GPS location updating' }}
          </div>

        </div>

      </div>


      <!-- Delivery information panel -->
      <aside class="connect-tracking-side-panel">

        <!-- ETA -->
        <div class="connect-tracking-eta-card">

          <div class="connect-tracking-eta-top">
            <span>ESTIMATED ARRIVAL</span>

            <font-awesome-icon :icon="faClock" />
          </div>

          <strong>
            {{ estimatedArrival }}
          </strong>

          <p>
            Based on the prepared route. An arrival time appears once the courier shares GPS updates.
          </p>

        </div>


        <!-- Delivery status -->
        <div class="connect-tracking-info-card">

          <div class="connect-tracking-card-heading">
            <span>DELIVERY STATUS</span>
            <font-awesome-icon :icon="faRoute" />
          </div>

          <div class="connect-tracking-status-list">

            <div
              class="connect-tracking-status-row"
              :class="{
                active: isCurrentStatus('Confirmed'),
                completed: isStatusReached('Confirmed')
              }"
            >
              <div class="connect-tracking-status-marker">
                <font-awesome-icon :icon="faCircleCheck" />
              </div>

              <div>
                <strong>Order confirmed</strong>
                <span>Shipment accepted</span>
              </div>
            </div>


            <div
              class="connect-tracking-status-row"
              :class="{
                active: isCurrentStatus('Preparing Dispatch'),
                completed: isStatusReached('Preparing Dispatch')
              }"
            >
              <div class="connect-tracking-status-marker">
                <span></span>
              </div>

              <div>
                <strong>Preparing dispatch</strong>
                <span>Pickup and route ready at the supplier</span>
              </div>
            </div>


            <div
              class="connect-tracking-status-row"
              :class="{
                active: isCurrentStatus('Dispatched'),
                completed: isStatusReached('Dispatched')
              }"
            >
              <div class="connect-tracking-status-marker">
                <font-awesome-icon :icon="faCircleCheck" />
              </div>

              <div>
                <strong>Dispatched</strong>
                <span>Supplier has handed over the shipment</span>
              </div>
            </div>


            <div
              class="connect-tracking-status-row"
              :class="{
                active: isCurrentStatus('In Transit'),
                completed: isStatusReached('In Transit')
              }"
            >
              <div class="connect-tracking-status-marker">
                <span></span>
              </div>

              <div>
                <strong>In transit</strong>
                <span>Vehicle travelling towards the destination</span>
              </div>
            </div>


            <div
              class="connect-tracking-status-row"
              :class="{
                active: isCurrentStatus('Out for Delivery'),
                completed: isStatusReached('Out for Delivery')
              }"
            >
              <div class="connect-tracking-status-marker">
                <span></span>
              </div>

              <div>
                <strong>Out for delivery</strong>
                <span>Final leg of the journey</span>
              </div>
            </div>


            <div
              class="connect-tracking-status-row"
              :class="{
                active: isCurrentStatus('Delivered'),
                completed: isStatusReached('Delivered')
              }"
            >
              <div class="connect-tracking-status-marker">
                <span></span>
              </div>

              <div>
                <strong>Delivered</strong>
                <span>Shipment received by the business</span>
              </div>
            </div>

          </div>

        </div>


        <!-- Shipment details -->
        <div class="connect-tracking-info-card">

          <div class="connect-tracking-card-heading">
            <span>SHIPMENT DETAILS</span>
            <font-awesome-icon :icon="faBoxOpen" />
          </div>


          <div class="connect-tracking-detail-row">
            <span>Order</span>
            <strong>{{ delivery?.order_number || 'Order' }}</strong>
          </div>

          <div class="connect-tracking-detail-row">
            <span>Delivery</span>
            <strong>{{ delivery?.delivery_id ?? 'Not assigned' }}</strong>
          </div>

          <div class="connect-tracking-detail-row">
            <span>Delivery method</span>
            <strong>{{ delivery?.delivery_method || 'Self Collection' }}</strong>
          </div>

          <div class="connect-tracking-detail-row">
            <span>Tracking reference</span>
            <strong>{{ delivery?.tracking_reference || 'Not assigned' }}</strong>
          </div>

          <div class="connect-tracking-detail-row">
            <span>From</span>
            <strong>{{ delivery?.pickup_label || delivery?.supplier_name || 'Supplier' }}</strong>
          </div>

          <div class="connect-tracking-detail-row">
            <span>To</span>
            <strong>{{ delivery?.destination_label || delivery?.buyer_name || 'Small Business' }}</strong>
          </div>

          <div v-if="routeSummary" class="connect-tracking-detail-row">
            <span>Route</span>
            <strong>{{ routeSummary }}</strong>
          </div>

        </div>


        <!-- Shared tracking notice -->
        <div class="connect-tracking-shared-card">

          <div class="connect-tracking-shared-icon">
            <font-awesome-icon :icon="faLink" />
          </div>

          <div>
            <strong>Shared delivery tracking</strong>

            <p>
              This shipment can be viewed by both the supplier and the receiving business.
            </p>
          </div>

        </div>

      </aside>

    </section>


    <!-- Bottom route summary -->
    <section class="connect-tracking-bottom-card">

      <div class="connect-tracking-bottom-heading">

        <div>
          <div class="connect-tracking-section-eyebrow">
            DELIVERY JOURNEY
          </div>

          <h2>
            Supplier to business
          </h2>
        </div>

        <div class="connect-tracking-bottom-status">
          <span></span>
          {{ trackingStatus }}
        </div>

      </div>


      <div class="connect-tracking-route">

        <div class="connect-tracking-route-point connect-tracking-route-complete">

          <div class="connect-tracking-route-icon">
            <font-awesome-icon :icon="faWarehouse" />
          </div>

          <div>
            <span>PICKUP</span>
            <strong>{{ delivery?.pickup_label || delivery?.supplier_name || 'Supplier' }}</strong>
            <small>{{ delivery?.supplier_city || 'Pickup not set up yet' }}</small>
          </div>

        </div>


        <div class="connect-tracking-route-middle">

          <div class="connect-tracking-route-line">
            <div
              class="connect-tracking-route-line-fill"
              :style="{ width: `${trackingProgress}%` }"
            ></div>
          </div>

          <div class="connect-tracking-route-truck" :style="{ left: `${trackingProgress}%` }">
            <font-awesome-icon :icon="faTruckFast" />
          </div>

        </div>


        <div class="connect-tracking-route-point">

          <div class="connect-tracking-route-icon destination">
            <font-awesome-icon :icon="faLocationDot" />
          </div>

          <div>
            <span>DESTINATION</span>
            <strong>{{ delivery?.destination_label || delivery?.buyer_name || 'Small Business' }}</strong>
            <small>{{ delivery?.buyer_city || 'Destination not set up yet' }}</small>
          </div>

        </div>

      </div>

    </section>

  </div>
</template>


<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import TrackingMap from '../components/tracking/TrackingMap.vue'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import {
  faBoxOpen,
  faCircleCheck,
  faClock,
  faLink,
  faLocationCrosshairs,
  faLocationDot,
  faRoute,
  faTruckFast,
  faWarehouse
} from '@fortawesome/free-solid-svg-icons'

// Read the delivery ID from the tracking URL.
const route = useRoute()

// Store the delivery information returned by the backend.
const delivery = ref(null)

// Store the latest GPS location for this delivery.
const latestLocation = ref(null)

// Store loading and error states.
const isLoading = ref(true)
const errorMessage = ref('')

// Refresh the GPS position while this tracking page is open.
let locationTimer = null

// Tracking values shown by the page.
const trackingProgress = ref(0)
const trackingStatus = ref('Loading')
const estimatedArrival = ref('Not available')
const lastUpdated = ref('Waiting for GPS update')

// Load the delivery connected to the current tracking page.
async function loadDelivery() {
  try {
    const deliveryId = Number(route.params.deliveryId)

    if (!deliveryId) {
      throw new Error('Invalid delivery ID')
    }

    // Load the delivery and its related order information.
    const response = await fetch(
      '/api/deliveries?buyerId=1'
    )

    if (!response.ok) {
      throw new Error('Failed to load delivery')
    }

    const deliveries = await response.json()

    const selectedDelivery = deliveries.find(
      item => Number(item.delivery_id) === deliveryId
    )

    if (!selectedDelivery) {
      throw new Error('Delivery not found')
    }

    delivery.value = selectedDelivery

    // Use the real delivery status from the database.
    trackingStatus.value =
      selectedDelivery.current_status || 'Pending'

    // Use the real estimated arrival when available.
    estimatedArrival.value =
      selectedDelivery.estimated_arrival || 'Not available'

    // Load the latest GPS location for this delivery.
    await loadLatestLocation(deliveryId)

    // Continue checking for new GPS positions.
    startLocationPolling(deliveryId)
  } catch (error) {
    console.error('Error loading delivery:', error)

    errorMessage.value =
      'Unable to load the selected delivery.'
  } finally {
    isLoading.value = false
  }
}

// Load the latest GPS coordinate for the delivery.
async function loadLatestLocation(deliveryId) {
  try {
    const response = await fetch(
      `/api/deliveries/${deliveryId}/location`
    )

    if (response.status === 404) {
      // A delivery can exist before its first GPS update.
      latestLocation.value = null
      lastUpdated.value = 'No GPS update yet'
      return
    }

    if (!response.ok) {
      throw new Error('Failed to load GPS location')
    }

    const location = await response.json()

    latestLocation.value = location

    // Show when the GPS position was recorded.
    if (location.recorded_at) {
      lastUpdated.value = new Date(
        location.recorded_at
      ).toLocaleString('en-ZA')
    }
  } catch (error) {
    console.error('Error loading GPS location:', error)

    latestLocation.value = null
    lastUpdated.value = 'GPS unavailable'
  }
}

// Keep checking for GPS while the delivery is still active.
function startLocationPolling(deliveryId) {
  locationTimer = setInterval(() => {
    const status = delivery.value?.current_status

    if (
      status === 'Delivered' ||
      status === 'Cancelled'
    ) {
      clearInterval(locationTimer)
      locationTimer = null
      return
    }

    loadLatestLocation(deliveryId)
  }, 5000)
}

// Check whether a delivery has reached a particular stage.
function isStatusReached(status) {
  const currentStatus = delivery.value?.current_status

  const statusOrder = [
    'Pending',
    'Confirmed',
    'Processing',
    'Preparing Dispatch',
    'Dispatched',
    'In Transit',
    'Out for Delivery',
    'Delivered'
  ]

  const currentIndex = statusOrder.indexOf(currentStatus)
  const statusIndex = statusOrder.indexOf(status)

  if (currentIndex === -1 || statusIndex === -1) {
    return false
  }

  return currentIndex >= statusIndex
}

// Whether a real courier GPS position is available yet.
const hasGps = computed(() => {
  return Boolean(
    latestLocation.value?.latitude &&
    latestLocation.value?.longitude
  )
})

// Honest journey progress: nothing is filled until the shipment is
// actually delivered, and no percentage is invented in between.
const journeyProgress = computed(() => {
  if (
    delivery.value &&
    isStatusReached('Delivered')
  ) {
    return 100
  }

  return 0
})

// Human-readable summary of the prepared route, if one exists.
const routeSummary = computed(() => {
  const deliveryData = delivery.value

  if (!deliveryData) {
    return ''
  }

  if (
    !deliveryData.route_distance_m &&
    !deliveryData.route_duration_s
  ) {
    return ''
  }

  const parts = []

  if (deliveryData.route_distance_m) {
    parts.push(`${(deliveryData.route_distance_m / 1000).toFixed(1)} km`)
  }

  if (deliveryData.route_duration_s) {
    parts.push(`${Math.round(deliveryData.route_duration_s / 60)} min`)
  }

  return parts.join(' · ')
})

// Check whether the delivery has been cancelled.
function isCancelled() {
  return delivery.value?.current_status === 'Cancelled'
}

// Check whether this is the current delivery stage.
function isCurrentStatus(status) {
  return delivery.value?.current_status === status
}

// Receive tracking information from TrackingMap.vue.
function handleTrackingUpdate(data) {
  trackingProgress.value = data.progress

  // Keep the real delivery status from the backend.
  if (delivery.value?.current_status) {
    trackingStatus.value = delivery.value.current_status
  }

  if (data.eta && data.eta !== 'Not available') {
    estimatedArrival.value = data.eta
  }

  if (!latestLocation.value?.recorded_at) {
    lastUpdated.value = 'just now'
  }
}

// Load the delivery when the tracking page opens.
onMounted(() => {
  loadDelivery()
})

// Stop GPS polling when the user leaves the page.
onBeforeUnmount(() => {
  if (locationTimer) {
    clearInterval(locationTimer)
    locationTimer = null
  }
})
</script>

<style scoped>

/* Main page */
.connect-tracking-page {
  min-height: 100vh;
  padding: 34px;
  box-sizing: border-box;
  background: #E8E2DD;
  color: #5C3D24;
}


/* Header */
.connect-tracking-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 28px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.connect-tracking-eyebrow,
.connect-tracking-section-eyebrow {
  color: #D17A4A;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 2px;
}

.connect-tracking-title {
  margin: 7px 0 0;
  color: #4E342E;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 42px;
  line-height: 1.05;
  font-weight: 600;
}

.connect-tracking-description {
  margin: 10px 0 0;
  color: #7A6A61;
  font-size: 14px;
  line-height: 1.5;
}

.connect-tracking-order-card {
  min-width: 190px;
  padding: 14px 16px;
  background: #FFFEFC;
  border: 1px solid rgba(92, 61, 36, 0.08);
  border-radius: 14px;
  box-shadow: 0 5px 18px rgba(78, 52, 46, 0.06);
}

.connect-tracking-order-label {
  color: #9A8B82;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.connect-tracking-order-value {
  margin-top: 4px;
  color: #4E342E;
  font-size: 17px;
  font-weight: 800;
}

.connect-tracking-order-status {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 7px;
  color: #47704A;
  font-size: 11px;
  font-weight: 700;
}

.connect-tracking-status-dot,
.connect-tracking-live-badge span,
.connect-tracking-bottom-status span {
  width: 7px;
  height: 7px;
  display: inline-block;
  border-radius: 50%;
  background: #5C8A60;
}

.connect-tracking-order-status.status-cancelled {
  color: #A94442;
}

.connect-tracking-order-status.status-cancelled .connect-tracking-status-dot {
  background: #A94442;
}


/* Shared journey */
.connect-tracking-journey-strip {
  display: grid;
  grid-template-columns: 1fr minmax(120px, 0.6fr) 1fr;
  align-items: center;
  gap: 18px;
  margin-bottom: 18px;
  padding: 16px 20px;
  background: rgba(255, 254, 252, 0.65);
  border: 1px solid rgba(92, 61, 36, 0.07);
  border-radius: 16px;
}

.connect-tracking-party {
  display: flex;
  align-items: center;
  gap: 12px;
}

.connect-tracking-party-destination {
  justify-content: flex-end;
  text-align: right;
}

.connect-tracking-party-icon {
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F3EAE4;
  border-radius: 11px;
  color: #D17A4A;
}

.connect-tracking-party span,
.connect-tracking-party small {
  display: block;
  color: #9A8B82;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1px;
}

.connect-tracking-party strong {
  display: block;
  margin: 3px 0;
  color: #4E342E;
  font-size: 13px;
}

.connect-tracking-journey-line {
  position: relative;
  height: 2px;
  background: #D8CEC7;
}

.connect-tracking-journey-progress {
  width: 0;
  height: 100%;
  background: #D17A4A;
}

.connect-tracking-truck-icon {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translate(-50%, -50%);
  width: 31px;
  height: 31px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FFFEFC;
  border: 2px solid #D17A4A;
  border-radius: 50%;
  color: #D17A4A;
  font-size: 12px;
  box-shadow: 0 4px 12px rgba(78, 52, 46, 0.14);
}


/* Main workspace */
.connect-tracking-workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 18px;
  align-items: start;
}

.connect-tracking-map-panel,
.connect-tracking-info-card,
.connect-tracking-bottom-card {
  background: #FFFEFC;
  border: 1px solid rgba(92, 61, 36, 0.08);
  box-shadow: 0 8px 28px rgba(78, 52, 46, 0.06);
}

.connect-tracking-map-panel {
  overflow: hidden;
  border-radius: 18px;
}

.connect-tracking-map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  padding: 20px 22px;
  border-bottom: 1px solid rgba(92, 61, 36, 0.08);
}

.connect-tracking-map-header h2 {
  margin: 5px 0 0;
  color: #4E342E;
  font-size: 17px;
}

.connect-tracking-map-header p {
  margin: 4px 0 0;
  color: #9A8B82;
  font-size: 12px;
}

.connect-tracking-live-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 12px;
  border-radius: 999px;
  background: #F1F6F1;
  color: #47704A;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
}


/* Map area */
.connect-tracking-map-wrapper {
  position: relative;
  padding: 18px;
  background: #E8E2DD;
}

.connect-tracking-map-overlay {
  position: absolute;
  z-index: 500;
  top: 30px;
  left: 30px;
  width: 225px;
  padding: 14px;
  box-sizing: border-box;
  background: rgba(255, 254, 252, 0.96);
  border: 1px solid rgba(255, 255, 255, 0.85);
  border-radius: 14px;
  box-shadow: 0 9px 24px rgba(78, 52, 46, 0.15);
  backdrop-filter: blur(8px);
}

.connect-tracking-overlay-top {
  display: flex;
  align-items: center;
  gap: 10px;
}

.connect-tracking-overlay-icon {
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: #D17A4A;
  color: #FFFEFC;
}

.connect-tracking-overlay-top strong,
.connect-tracking-overlay-top span {
  display: block;
}

.connect-tracking-overlay-top strong {
  color: #4E342E;
  font-size: 12px;
}

.connect-tracking-overlay-top span {
  margin-top: 2px;
  color: #9A8B82;
  font-size: 10px;
}

.connect-tracking-overlay-progress {
  margin-top: 14px;
}

.connect-tracking-progress-header {
  display: flex;
  justify-content: space-between;
  color: #9A8B82;
  font-size: 10px;
  font-weight: 700;
}

.connect-tracking-progress-header strong {
  color: #4E342E;
}

.connect-tracking-progress-track {
  height: 5px;
  margin-top: 6px;
  overflow: hidden;
  background: #E8E2DD;
  border-radius: 999px;
}

.connect-tracking-progress-fill {
  height: 100%;
  background: #D17A4A;
  border-radius: inherit;
  transition: width 0.7s ease;
}

.connect-tracking-map-footer {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 11px 18px;
  color: #8D7D74;
  font-size: 10px;
}

.connect-tracking-location-update,
.connect-tracking-map-note {
  display: flex;
  align-items: center;
  gap: 6px;
}

.connect-tracking-location-update svg {
  color: #D17A4A;
}


/* Side panel */
.connect-tracking-side-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.connect-tracking-eta-card {
  padding: 18px;
  background: #4E342E;
  border-radius: 16px;
  color: #FFFEFC;
  box-shadow: 0 8px 24px rgba(78, 52, 46, 0.14);
}

.connect-tracking-eta-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: rgba(255, 254, 252, 0.62);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.connect-tracking-eta-top svg {
  color: #D17A4A;
  font-size: 14px;
}

.connect-tracking-eta-card > strong {
  display: block;
  margin-top: 7px;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 30px;
  font-weight: 500;
}

.connect-tracking-eta-card p {
  margin: 4px 0 0;
  color: rgba(255, 254, 252, 0.62);
  font-size: 10px;
  line-height: 1.5;
}


/* Information cards */
.connect-tracking-info-card {
  padding: 17px;
  border-radius: 16px;
}

.connect-tracking-card-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  color: #9A8B82;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.4px;
}

.connect-tracking-card-heading svg {
  color: #D17A4A;
  font-size: 13px;
}

.connect-tracking-status-list {
  display: flex;
  flex-direction: column;
}

.connect-tracking-status-row {
  position: relative;
  display: flex;
  gap: 10px;
  padding-bottom: 16px;
}

.connect-tracking-status-row:last-child {
  padding-bottom: 0;
}

.connect-tracking-status-marker {
  position: relative;
  width: 21px;
  height: 21px;
  flex: 0 0 21px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #C9BCB5;
  font-size: 13px;
}

.connect-tracking-status-row:not(:last-child) .connect-tracking-status-marker::after {
  content: '';
  position: absolute;
  top: 21px;
  left: 10px;
  width: 1px;
  height: 25px;
  background: #E1D8D2;
}

.connect-tracking-status-complete .connect-tracking-status-marker {
  color: #5C8A60;
}

.connect-tracking-status-active .connect-tracking-status-marker {
  color: #D17A4A;
}

.connect-tracking-status-active .connect-tracking-status-marker span {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #D17A4A;
  box-shadow: 0 0 0 5px rgba(209, 122, 74, 0.13);
}

.connect-tracking-status-row strong,
.connect-tracking-status-row span {
  display: block;
}

.connect-tracking-status-row strong {
  color: #4E342E;
  font-size: 11px;
}

.connect-tracking-status-row > div:last-child span {
  margin-top: 3px;
  color: #9A8B82;
  font-size: 9px;
  line-height: 1.4;
}

.connect-tracking-detail-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 9px 0;
  border-bottom: 1px solid rgba(92, 61, 36, 0.06);
}

.connect-tracking-detail-row:last-child {
  border-bottom: 0;
}

.connect-tracking-detail-row span {
  color: #9A8B82;
  font-size: 10px;
}

.connect-tracking-detail-row strong {
  color: #4E342E;
  font-size: 10px;
  text-align: right;
}


/* Shared tracking */
.connect-tracking-shared-card {
  display: flex;
  gap: 10px;
  padding: 14px;
  background: #F3EAE4;
  border-radius: 14px;
}

.connect-tracking-shared-icon {
  width: 30px;
  height: 30px;
  flex: 0 0 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #D17A4A;
  border-radius: 9px;
  color: #FFFEFC;
  font-size: 11px;
}

.connect-tracking-shared-card strong {
  color: #4E342E;
  font-size: 11px;
}

.connect-tracking-shared-card p {
  margin: 4px 0 0;
  color: #806F65;
  font-size: 9px;
  line-height: 1.5;
}


/* Bottom route card */
.connect-tracking-bottom-card {
  margin-top: 18px;
  padding: 20px;
  border-radius: 18px;
}

.connect-tracking-bottom-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 22px;
}

.connect-tracking-bottom-heading h2 {
  margin: 5px 0 0;
  color: #4E342E;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 20px;
  font-weight: 600;
}

.connect-tracking-bottom-status {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #47704A;
  font-size: 10px;
  font-weight: 800;
}

.connect-tracking-route {
  display: grid;
  grid-template-columns: 1fr minmax(100px, 0.8fr) 1fr;
  align-items: center;
  gap: 18px;
}

.connect-tracking-route-point {
  display: flex;
  align-items: center;
  gap: 10px;
}

.connect-tracking-route-point:last-child {
  justify-content: flex-end;
  text-align: right;
}

.connect-tracking-route-icon {
  width: 36px;
  height: 36px;
  flex: 0 0 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 11px;
  background: #F3EAE4;
  color: #D17A4A;
}

.connect-tracking-route-icon.destination {
  background: #F1F6F1;
  color: #5C8A60;
}

.connect-tracking-route-point span,
.connect-tracking-route-point small {
  display: block;
  color: #9A8B82;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1px;
}

.connect-tracking-route-point strong {
  display: block;
  margin: 3px 0;
  color: #4E342E;
  font-size: 11px;
}

.connect-tracking-route-middle {
  position: relative;
}

.connect-tracking-route-line {
  height: 2px;
  background: #DDD3CD;
}

.connect-tracking-route-line-fill {
  height: 100%;
  background: #D17A4A;
  transition: width 0.7s ease;
}

.connect-tracking-route-truck {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translate(-50%, -50%);
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FFFEFC;
  border: 2px solid #D17A4A;
  border-radius: 50%;
  color: #D17A4A;
  font-size: 10px;
  box-shadow: 0 3px 10px rgba(78, 52, 46, 0.12);
  transition: left 0.7s ease;
}


/* Tablet */
@media (max-width: 1100px) {

  .connect-tracking-workspace {
    grid-template-columns: 1fr;
  }

  .connect-tracking-side-panel {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }

  .connect-tracking-eta-card {
    grid-column: span 2;
  }

  .connect-tracking-shared-card {
    grid-column: span 2;
  }
}


/* Smaller tablet */
@media (max-width: 760px) {

  .connect-tracking-page {
    padding: 22px 16px;
  }

  .connect-tracking-title {
    font-size: 34px;
  }

  .connect-tracking-journey-strip {
    grid-template-columns: 1fr;
  }

  .connect-tracking-party-destination {
    justify-content: flex-start;
    text-align: left;
  }

  .connect-tracking-journey-line {
    display: none;
  }

  .connect-tracking-side-panel {
    grid-template-columns: 1fr;
  }

  .connect-tracking-eta-card,
  .connect-tracking-shared-card {
    grid-column: span 1;
  }

  .connect-tracking-route {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .connect-tracking-route-point,
  .connect-tracking-route-point:last-child {
    justify-content: flex-start;
    text-align: left;
  }

  .connect-tracking-route-middle {
    display: none;
  }
}


/* Mobile */
@media (max-width: 560px) {

  .connect-tracking-page {
    padding: 18px 12px;
  }

  .connect-tracking-title {
    font-size: 31px;
  }

  .connect-tracking-order-card {
    width: 100%;
    box-sizing: border-box;
  }

  .connect-tracking-map-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .connect-tracking-map-overlay {
    top: 28px;
    left: 28px;
    width: calc(100% - 56px);
  }

  .connect-tracking-map-footer {
    flex-direction: column;
  }

  .connect-tracking-bottom-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .connect-tracking-party {
    align-items: flex-start;
  }
}

</style>