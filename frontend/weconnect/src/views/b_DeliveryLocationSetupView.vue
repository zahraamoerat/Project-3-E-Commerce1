<template>
  <div class="connect-sb-location-setup-page">
    <SmallBusinessNavbar />

    <!-- Page header -->
    <header class="connect-sb-location-setup-hero">

      <div class="connect-sb-location-setup-hero-copy">
        <p class="connect-sb-location-setup-eyebrow">
          ROUTE PREPARATION
        </p>

        <h1 class="connect-sb-location-setup-title">
          Delivery Location Setup
        </h1>

        <p class="connect-sb-location-setup-description">
          Confirm your current location, review the delivery destination, and prepare the route before opening live tracking.
        </p>
      </div>

      <!-- Order reference -->
      <div
        v-if="delivery"
        class="connect-sb-location-setup-order-card"
      >
        <span>ORDER REFERENCE</span>

        <strong>
          {{ delivery.order_number || 'Order' }}
        </strong>

        <em :class="getStatusClass(delivery.current_status)">
          {{ delivery.current_status || 'Pending' }}
        </em>
      </div>

    </header>


    <!-- Loading delivery -->
    <section
      v-if="isLoading"
      class="connect-sb-location-setup-state-card"
    >

      <div class="connect-sb-location-setup-state-icon">
        <span class="connect-sb-location-setup-spinner"></span>
      </div>

      <h2>Loading delivery</h2>

      <p>
        Fetching the journey details for this shipment.
      </p>

    </section>


    <!-- Delivery could not be loaded -->
    <section
      v-else-if="errorMessage"
      class="connect-sb-location-setup-state-card error"
    >

      <div class="connect-sb-location-setup-state-icon">
        <FontAwesomeIcon :icon="faLocationDot" />
      </div>

      <h2>Delivery unavailable</h2>

      <p>
        {{ errorMessage }}
      </p>

      <div class="connect-sb-location-setup-state-actions">

        <button
          v-if="errorCanRetry"
          type="button"
          class="connect-sb-location-setup-retry"
          @click="loadDelivery"
        >
          <FontAwesomeIcon :icon="faRotate" />
          Try again
        </button>

        <router-link
          to="/small-business/deliveries"
          class="connect-sb-location-setup-state-link"
        >
          Back to deliveries
          <FontAwesomeIcon :icon="faArrowRight" />
        </router-link>

      </div>

    </section>


    <!-- Location setup workspace -->
    <template v-else-if="delivery">

      <!-- Journey context -->
      <section class="connect-sb-location-setup-context">

        <!-- Origin to destination -->
        <div class="connect-sb-location-setup-journey">

          <div class="connect-sb-location-setup-journey-point">
            <span class="connect-sb-location-setup-journey-marker origin">
              <FontAwesomeIcon :icon="faWarehouse" />
            </span>

            <div>
              <span>PICKUP (SUPPLIER)</span>
              <strong>{{ delivery.supplier_name || 'Supplier' }}</strong>
              <small>
                {{ supplierAddressLine }}
              </small>
            </div>
          </div>

          <div class="connect-sb-location-setup-journey-line">
            <span></span>
            <em>
              <FontAwesomeIcon :icon="faTruckFast" />
            </em>
          </div>

          <div class="connect-sb-location-setup-journey-point destination">
            <span class="connect-sb-location-setup-journey-marker destination">
              <FontAwesomeIcon :icon="faLocationDot" />
            </span>

            <div>
              <span>DELIVERY DESTINATION</span>
              <strong>{{ delivery.buyer_name || 'Your business' }}</strong>
              <small>
                {{ destinationAddressLine }}
              </small>
            </div>
          </div>

        </div>


        <!-- Shipment details -->
        <div class="connect-sb-location-setup-detail-grid">

          <div class="connect-sb-location-setup-detail-item">
            <span>Delivery</span>
            <strong>{{ delivery.delivery_id }}</strong>
          </div>

          <div class="connect-sb-location-setup-detail-item">
            <span>Order number</span>
            <strong>{{ delivery.order_number || 'Not assigned' }}</strong>
          </div>

          <div class="connect-sb-location-setup-detail-item">
            <span>Status</span>
            <strong>{{ delivery.current_status || 'Pending' }}</strong>
          </div>

          <div class="connect-sb-location-setup-detail-item">
            <span>Courier</span>
            <strong>{{ delivery.courier_name || 'Not assigned' }}</strong>
          </div>

          <div class="connect-sb-location-setup-detail-item">
            <span>Tracking reference</span>
            <strong>{{ delivery.tracking_reference || 'Not assigned' }}</strong>
          </div>

          <div class="connect-sb-location-setup-detail-item">
            <span>Delivery address</span>
            <strong>{{ delivery.buyer_address || delivery.buyer_city || 'Not recorded' }}</strong>
          </div>

        </div>

      </section>


      <!-- Map and preparation panel -->
      <section class="connect-sb-location-setup-workspace">

        <!-- Current location map -->
        <div class="connect-sb-location-setup-map-panel">

          <div class="connect-sb-location-setup-map-header">

            <div>
              <p class="connect-sb-location-setup-section-eyebrow">
                PICKUP & DESTINATION
              </p>

              <h2>
                Preparing the route
              </h2>

              <p>
                Pickup from the supplier and the delivery destination are shown on the map. Your device location is only a shortcut.
              </p>
            </div>

            <!-- Location status badge -->
            <span
              class="connect-sb-location-setup-geo-badge"
              :class="locationState"
            >
              <span class="connect-sb-location-setup-geo-badge-dot"></span>
              {{ locationBadgeLabel }}
            </span>

          </div>


          <!-- Map area -->
          <div class="connect-sb-location-setup-map-shell">

            <div
              ref="mapContainer"
              class="connect-sb-location-setup-map"
            ></div>

            <!-- Recentre control -->
            <button
              v-if="locationState === 'ready'"
              type="button"
              class="connect-sb-location-setup-recenter"
              title="Re-centre on your current location"
              aria-label="Re-centre map on your current location"
              @click="recenterOnLocation"
            >
              <FontAwesomeIcon :icon="faLocationCrosshairs" />
            </button>

            <!-- Map overlay status -->
            <div class="connect-sb-location-setup-map-overlay">

              <strong>
                {{
                  routeStatus === 'ready'
                    ? 'Route ready'
                    : pickupState === 'resolved' && destinationState === 'resolved'
                      ? 'Points ready'
                      : 'Locating pickup & destination'
                }}
              </strong>

              <small>
                {{
                  routeStatus === 'ready'
                    ? 'Route shown between the real points'
                    : pickupState === 'resolved' && destinationState === 'resolved'
                      ? 'Pickup and destination are confirmed'
                      : 'Geocoding the saved addresses...'
                }}
              </small>

            </div>

          </div>


          <!-- Geolocation control -->
          <div class="connect-sb-location-setup-geo-panel">

            <!-- Requesting -->
            <div
              v-if="locationState === 'requesting'"
              class="connect-sb-location-setup-geo-message"
            >
              <span class="connect-sb-location-setup-spinner"></span>

              <div>
                <strong>Finding your current location...</strong>
                <p>Allow location access in your browser when prompted.</p>
              </div>
            </div>

            <!-- Ready -->
            <div
              v-else-if="locationState === 'ready'"
              class="connect-sb-location-setup-geo-message ready"
            >
              <span class="connect-sb-location-setup-geo-icon">
                <FontAwesomeIcon :icon="faCircleCheck" />
              </span>

              <div>
                <strong>Device location ready</strong>
                <p>
                  Use it as the pickup point if your device is at the supplier.
                  <em>
                    {{ coordsLabel }}
                  </em>
                </p>
              </div>

              <button
                type="button"
                class="connect-sb-location-setup-locate"
                @click="useLocationAsPickup"
              >
                <FontAwesomeIcon :icon="faLocationCrosshairs" />
                Use as pickup
              </button>
            </div>

            <!-- Permission denied -->
            <div
              v-else-if="locationState === 'denied'"
              class="connect-sb-location-setup-geo-message error"
            >
              <span class="connect-sb-location-setup-geo-icon">
                <FontAwesomeIcon :icon="faLocationCrosshairs" />
              </span>

              <div>
                <strong>Location access was denied</strong>
                <p>
                  Your browser blocked location access for this page. Allow location permission for WeConnect, then try again.
                </p>
              </div>

              <button
                type="button"
                class="connect-sb-location-setup-retry"
                @click="requestLocation"
              >
                <FontAwesomeIcon :icon="faRotate" />
                Try again
              </button>
            </div>

            <!-- Position unavailable -->
            <div
              v-else-if="locationState === 'unavailable'"
              class="connect-sb-location-setup-geo-message error"
            >
              <span class="connect-sb-location-setup-geo-icon">
                <FontAwesomeIcon :icon="faLocationCrosshairs" />
              </span>

              <div>
                <strong>Position unavailable</strong>
                <p>
                  Your device could not determine its current position. Check your connection or move to an area with a clearer signal.
                </p>
              </div>

              <button
                type="button"
                class="connect-sb-location-setup-retry"
                @click="requestLocation"
              >
                <FontAwesomeIcon :icon="faRotate" />
                Try again
              </button>
            </div>

            <!-- Timeout -->
            <div
              v-else-if="locationState === 'timeout'"
              class="connect-sb-location-setup-geo-message error"
            >
              <span class="connect-sb-location-setup-geo-icon">
                <FontAwesomeIcon :icon="faLocationCrosshairs" />
              </span>

              <div>
                <strong>Location request timed out</strong>
                <p>
                  Finding your location took too long. You can try again.
                </p>
              </div>

              <button
                type="button"
                class="connect-sb-location-setup-retry"
                @click="requestLocation"
              >
                <FontAwesomeIcon :icon="faRotate" />
                Try again
              </button>
            </div>

            <!-- Unsupported browser -->
            <div
              v-else-if="locationState === 'unsupported'"
              class="connect-sb-location-setup-geo-message error"
            >
              <span class="connect-sb-location-setup-geo-icon">
                <FontAwesomeIcon :icon="faLocationCrosshairs" />
              </span>

              <div>
                <strong>Geolocation unsupported</strong>
                <p>
                  This browser does not support the Geolocation API. Try opening this page in a different browser.
                </p>
              </div>
            </div>

            <!-- Idle -->
            <div
              v-else
              class="connect-sb-location-setup-geo-message"
            >
              <span class="connect-sb-location-setup-geo-icon muted">
                <FontAwesomeIcon :icon="faLocationCrosshairs" />
              </span>

              <div>
                <strong>Device location not shared yet</strong>
                <p>
                  WeConnect requests your device location once, only as a shortcut to set the pickup point.
                </p>
              </div>

              <button
                type="button"
                class="connect-sb-location-setup-locate"
                @click="requestLocation"
              >
                <FontAwesomeIcon :icon="faLocationCrosshairs" />
                Find my current location
              </button>
            </div>

          </div>

        </div>


        <!-- Preparation side panel -->
        <aside class="connect-sb-location-setup-side">

          <!-- Readiness -->
          <div class="connect-sb-location-setup-card">

            <div class="connect-sb-location-setup-card-heading">
              <span>ROUTE READINESS</span>
              <FontAwesomeIcon :icon="faRoute" />
            </div>

            <div class="connect-sb-location-setup-readiness-list">

              <div
                class="connect-sb-location-setup-readiness-item"
                :class="{
                  complete: pickupState === 'resolved',
                  blocked: pickupState === 'unavailable' || pickupState === 'error'
                }"
              >
                <span class="connect-sb-location-setup-readiness-dot">
                  <FontAwesomeIcon :icon="faWarehouse" />
                </span>

                <div>
                  <strong>Supplier pickup located</strong>
                  <small>
                    {{
                      pickupState === 'resolved'
                        ? pickup?.name || 'Supplier warehouse address'
                        : pickupState === 'loading'
                          ? 'Locating the supplier warehouse...'
                          : pickupNotice || 'Pickup coordinates not available'
                    }}
                  </small>
                </div>
              </div>


              <div
                class="connect-sb-location-setup-readiness-item"
                :class="{
                  complete: destinationState === 'resolved',
                  blocked: destinationState === 'unavailable' || destinationState === 'error'
                }"
              >
                <span class="connect-sb-location-setup-readiness-dot">
                  <FontAwesomeIcon :icon="faLocationDot" />
                </span>

                <div>
                  <strong>Destination located</strong>
                  <small>
                    {{
                      destinationState === 'resolved'
                        ? 'Located from the saved delivery address'
                        : destinationState === 'loading'
                          ? 'Locating the saved delivery address...'
                          : destinationNotice || 'Coordinates not available'
                    }}
                  </small>
                </div>
              </div>


              <div
                class="connect-sb-location-setup-readiness-item"
                :class="{
                  complete: routeStatus === 'ready',
                  blocked: routeStatus === 'error'
                }"
              >
                <span class="connect-sb-location-setup-readiness-dot">
                  <FontAwesomeIcon :icon="faRoute" />
                </span>

                <div>
                  <strong>Route prepared</strong>
                  <small>
                    {{
                      routeStatus === 'ready'
                        ? `Pickup to delivery — ${routeData.distanceKm} km`
                        : routeStatus === 'loading'
                          ? 'Calculating the route...'
                          : routeStatus === 'error'
                            ? routeNotice || 'Route could not be calculated'
                            : 'Prepare the route once both points are located'
                    }}
                  </small>
                </div>
              </div>


              <div
                class="connect-sb-location-setup-readiness-item"
                :class="{
                  complete: setupConfirmed,
                  blocked: setupError !== ''
                }"
              >
                <span class="connect-sb-location-setup-readiness-dot">
                  <FontAwesomeIcon :icon="faCircleCheck" />
                </span>

                <div>
                  <strong>Route confirmed</strong>
                  <small>
                    {{
                      setupConfirmed
                        ? 'Saved and ready for the courier'
                        : 'Confirm the route to make it part of this delivery'
                    }}
                  </small>
                </div>
              </div>

            </div>

          </div>


          <!-- Destination and route -->
          <div class="connect-sb-location-setup-card">

            <div class="connect-sb-location-setup-card-heading">
              <span>PICKUP & DESTINATION</span>
              <FontAwesomeIcon :icon="faLocationDot" />
            </div>

            <div class="connect-sb-location-setup-destination-info">
              <span class="connect-sb-location-setup-info-tag">
                PICKUP
              </span>

              <strong>
                {{ pickup?.name || delivery.supplier_name || 'Supplier warehouse' }}
              </strong>

              <p>
                {{ pickupAddressLine }}
              </p>
            </div>

            <span
              class="connect-sb-location-setup-destination-status"
              :class="pickupState"
            >
              {{ pickupStatusLabel }}
            </span>

            <p
              v-if="pickupNotice"
              class="connect-sb-location-setup-note"
            >
              {{ pickupNotice }}
            </p>


            <div class="connect-sb-location-setup-destination-info dest-block">
              <span class="connect-sb-location-setup-info-tag">
                DELIVERY DESTINATION
              </span>

              <strong>
                {{ destination?.name || delivery.buyer_name || 'Your business' }}
              </strong>

              <p>
                {{ destinationAddressLine }}
              </p>
            </div>

            <span
              class="connect-sb-location-setup-destination-status"
              :class="destinationState"
            >
              {{ destinationStatusLabel }}
            </span>

            <p
              v-if="destinationNotice"
              class="connect-sb-location-setup-note"
            >
              {{ destinationNotice }}
            </p>


            <!-- Route schematic -->
            <div class="connect-sb-location-setup-summary">

              <div class="connect-sb-location-setup-summary-point">
                <span class="connect-sb-location-setup-summary-marker start"></span>

                <div>
                  <span>PICKUP</span>
                  <strong>
                    {{ pickup?.name || delivery?.supplier_name || 'Supplier warehouse' }}
                  </strong>
                  <small>
                    {{ pickupAddressLine }}
                  </small>
                </div>
              </div>


              <div class="connect-sb-location-setup-summary-connector">
                <span class="connect-sb-location-setup-summary-line"></span>

                <em
                  :class="{
                    ready: routeStatus === 'ready',
                    loading: routeStatus === 'loading'
                  }"
                >
                  {{
                    routeStatus === 'ready'
                      ? `ROUTE • ${routeData.distanceKm} km`
                      : routeStatus === 'loading'
                        ? 'CALCULATING ROUTE'
                        : 'ROUTE NOT CALCULATED'
                  }}
                </em>
              </div>


              <div class="connect-sb-location-setup-summary-point">
                <span class="connect-sb-location-setup-summary-marker end"></span>

                <div>
                  <span>DELIVERY DESTINATION</span>
                  <strong>
                    {{ destination?.name || delivery.buyer_name || 'Your business' }}
                  </strong>
                  <small>
                    {{ destinationAddressLine }}
                  </small>
                </div>
              </div>

            </div>


            <!-- Distance and travel time -->
            <div class="connect-sb-location-setup-metrics">

              <div>
                <span>Distance</span>
                <strong :class="{ ready: routeStatus === 'ready' }">
                  {{
                    routeStatus === 'ready'
                      ? `${routeData.distanceKm} km`
                      : 'Not available'
                  }}
                </strong>
              </div>

              <div>
                <span>Travel time</span>
                <strong :class="{ ready: routeStatus === 'ready' }">
                  {{
                    routeStatus === 'ready'
                      ? `~ ${routeData.durationMin} min`
                      : 'Not available'
                  }}
                </strong>
              </div>

            </div>

            <p
              v-if="routeNotice"
              class="connect-sb-location-setup-note"
            >
              {{ routeNotice }}
            </p>


            <!-- Prepare route -->
            <button
              type="button"
              class="connect-sb-location-setup-prepare"
              :disabled="!canPrepareRoute"
              :class="{ loading: routeStatus === 'loading' }"
              @click="prepareRoute"
            >
              <span>
                {{
                  routeStatus === 'loading'
                    ? 'Calculating route...'
                    : routeStatus === 'ready'
                      ? 'Route ready'
                      : 'Prepare Route'
                }}
              </span>
              <FontAwesomeIcon :icon="faRoute" />
            </button>


            <!-- Confirm and persist the prepared route -->
            <button
              type="button"
              class="connect-sb-location-setup-confirm"
              :disabled="!canConfirmRoute"
              @click="confirmRoute"
            >
              <span>
                {{ setupConfirmed ? 'Re-confirm Route' : 'Confirm Route' }}
              </span>
              <FontAwesomeIcon :icon="faCircleCheck" />
            </button>

            <p
              v-if="savedNotice"
              class="connect-sb-location-setup-saved-note"
            >
              {{ savedNotice }}
            </p>

            <p
              v-if="setupError"
              class="connect-sb-location-setup-note"
            >
              {{ setupError }}
            </p>

          </div>


          <!-- Continue -->
          <div class="connect-sb-location-setup-card continue">

            <button
              type="button"
              class="connect-sb-location-setup-continue"
              :disabled="!canContinue"
              @click="continueToTracking"
            >
              <span>{{ setupConfirmed ? 'Open Live Tracking' : 'Continue to Live Tracking' }}</span>
              <FontAwesomeIcon :icon="faArrowRight" />
            </button>

            <p
              v-if="!canContinue"
              class="connect-sb-location-setup-continue-note"
            >
              {{ continueNote }}
            </p>

            <router-link
              to="/small-business/deliveries"
              class="connect-sb-location-setup-back"
            >
              <FontAwesomeIcon :icon="faArrowRight" class="back-icon" />
              Back to deliveries
            </router-link>

          </div>

        </aside>

      </section>

    </template>

  </div>
</template>


<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import SmallBusinessNavbar from '../components/SmallBusinessNavbar.vue'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faArrowRight,
  faCircleCheck,
  faLocationCrosshairs,
  faLocationDot,
  faRotate,
  faRoute,
  faTruckFast,
  faWarehouse
} from '@fortawesome/free-solid-svg-icons'

const route = useRoute()
const router = useRouter()

// Delivery information returned by the backend.
const delivery = ref(null)

// Delivery loading and error states.
const isLoading = ref(true)
const errorMessage = ref('')
const errorCanRetry = ref(true)

// Browser device location states:
// idle, requesting, ready, denied, unavailable, timeout, unsupported.
// The device location is only a short-cut to set the pickup point.
const locationState = ref('idle')

// Coordinates captured once from the browser Geolocation API.
const userCoords = ref(null)

// Pickup context returned by the pickup endpoint.
// state: loading | resolved | unavailable | error
const pickup = ref(null)
const pickupState = ref('loading')
const pickupNotice = ref('')
const pickupCoords = ref(null)

// Destination context returned by the destination endpoint.
// state: loading | resolved | unavailable | error
const destination = ref(null)
const destinationState = ref('loading')
const destinationNotice = ref('')
const destinationCoords = ref(null)

// Route preparation states.
// status: idle | loading | ready | error
const routeStatus = ref('idle')
const routeData = ref(null)
const routeNotice = ref('')

// Confirmed setup state persisted on the delivery.
const setupConfirmed = ref(false)
const savingSetup = ref(false)
const savedNotice = ref('')
const setupError = ref('')

// HTML element used by Leaflet.
const mapContainer = ref(null)

// Leaflet map instance.
let map = null

// Leaflet layers.
let pickupMarker = null
let destinationMarker = null
let accuracyCircle = null
let routeLine = null

// Turn address parts into a single readable line.
function formatAddress({ address, city, province, postalCode }) {
  const parts = [address, city, province, postalCode].filter(Boolean)

  return parts.length > 0 ? parts.join(', ') : 'Address not recorded'
}

// Pickup address shown across the page.
const pickupAddressLine = computed(() => {
  if (pickup.value) {
    return formatAddress({
      address: pickup.value.address,
      city: pickup.value.city,
      province: pickup.value.province,
      postalCode: pickup.value.postal_code
    })
  }

  return formatAddress({
    address: delivery.value?.supplier_address,
    city: delivery.value?.supplier_city,
    province: delivery.value?.supplier_province,
    postalCode: delivery.value?.supplier_postal_code
  })
})

// Supplier address shown in the journey strip.
const supplierAddressLine = computed(() => {
  return formatAddress({
    address: delivery.value?.supplier_address,
    city: delivery.value?.supplier_city,
    province: delivery.value?.supplier_province,
    postalCode: delivery.value?.supplier_postal_code
  })
})

// Destination address shown across the page.
const destinationAddressLine = computed(() => {
  if (destination.value) {
    return formatAddress({
      address: destination.value.address,
      city: destination.value.city,
      province: destination.value.province,
      postalCode: destination.value.postal_code
    })
  }

  return formatAddress({
    address: delivery.value?.buyer_address,
    city: delivery.value?.buyer_city,
    province: delivery.value?.buyer_province,
    postalCode: delivery.value?.buyer_postal_code
  })
})

// Load the selected delivery from the existing delivery API.
async function loadDelivery() {
  isLoading.value = true
  errorMessage.value = ''
  errorCanRetry.value = true

  try {
    const deliveryId = Number(route.params.deliveryId)

    if (!Number.isInteger(deliveryId) || deliveryId <= 0) {
      errorCanRetry.value = false
      errorMessage.value =
        'The delivery reference in the address is not valid.'
      return
    }

    const response = await fetch('/api/deliveries?buyerId=1')

    if (!response.ok) {
      throw new Error('Failed to load deliveries')
    }

    const deliveries = await response.json()

    const selectedDelivery = deliveries.find(
      item => Number(item.delivery_id) === deliveryId
    )

    if (!selectedDelivery) {
      errorMessage.value =
        'We could not find this delivery. It may have been removed, or the link may be out of date.'
      return
    }

    delivery.value = selectedDelivery

    await loadSetup(deliveryId)
  } catch (error) {
    console.error('Error loading delivery:', error)

    errorMessage.value =
      'We could not load this delivery right now. Please try again.'
  } finally {
    isLoading.value = false

    // The map container only mounts once the workspace section is visible.
    // Initialise Leaflet after that section has actually rendered.
    nextTick(() => {
      initMap()
      renderUserPosition()
      renderPickupMarker()
      renderDestinationMarker()
    })
  }
}

// Load any already-confirmed setup for this delivery.
async function loadSetup(deliveryId) {
  try {
    const response = await fetch(`/api/deliveries/${deliveryId}/setup`)

    if (!response.ok) {
      throw new Error('Failed to load setup')
    }

    const data = await response.json()
    const hasPickup = data.pickup && Number.isFinite(data.pickup.latitude)
    const hasDestination = data.destination_set && Number.isFinite(data.destination_set.latitude)

    if (data.setup_confirmed_at && hasPickup && hasDestination) {
      pickup.value = {
        name: data.supplier.name,
        address: data.pickup.label,
        city: null,
        province: null,
        postal_code: null
      }
      pickupCoords.value = {
        latitude: data.pickup.latitude,
        longitude: data.pickup.longitude
      }
      pickupState.value = 'resolved'
      pickupNotice.value = 'Pickup coordinates were saved earlier.'

      destination.value = {
        name: data.buyer.name,
        address: data.destination_set.label,
        city: data.buyer.city,
        province: data.buyer.province,
        postal_code: data.buyer.postal_code
      }
      destinationCoords.value = {
        latitude: data.destination_set.latitude,
        longitude: data.destination_set.longitude
      }
      destinationState.value = 'resolved'
      destinationNotice.value = 'Destination coordinates were saved earlier.'

      routeData.value = {
        distanceKm: data.route ? (Number(data.route.distance_m) / 1000).toFixed(1) : null,
        durationMin: data.route ? Math.round(Number(data.route.duration_s) / 60) || 1 : null
      }
      routeStatus.value = 'ready'
      routeNotice.value = ''

      setupConfirmed.value = true
      savedNotice.value =
        'This route was confirmed earlier and is part of this delivery.'

      nextTick(() => {
        renderPickupMarker()
        renderDestinationMarker()
      })
      return
    }

    loadPickup(deliveryId)
    loadDestination(deliveryId)
  } catch (error) {
    console.error('Error loading delivery setup:', error)

    loadPickup(deliveryId)
    loadDestination(deliveryId)
  }
}

// Resolve the supplier pickup from its saved address.
async function loadPickup(deliveryId) {
  pickupState.value = 'loading'
  pickupNotice.value = ''

  try {
    const response = await fetch(`/api/deliveries/${deliveryId}/pickup`)

    if (response.status === 404) {
      pickupState.value = 'unavailable'
      pickupNotice.value =
        'No pickup information is recorded for this delivery.'
      return
    }

    if (!response.ok) {
      throw new Error('Failed to load pickup')
    }

    const data = await response.json()

    pickup.value = data.pickup || null

    if (
      data.status === 'resolved' &&
      data.coordinates &&
      Number.isFinite(data.coordinates.latitude) &&
      Number.isFinite(data.coordinates.longitude)
    ) {
      pickupCoords.value = data.coordinates
      pickupState.value = 'resolved'
      pickupNotice.value = data.notice || ''
    } else {
      pickupState.value = 'unavailable'
      pickupNotice.value =
        data.notice || 'The supplier pickup has no locatable coordinates.'
    }

    nextTick(() => renderPickupMarker())
  } catch (error) {
    console.error('Error loading pickup:', error)

    pickupState.value = 'error'
    pickupNotice.value =
      'We could not reach the location service right now.'
  }
}

// Resolve the delivery destination from its saved address.
async function loadDestination(deliveryId) {
  destinationState.value = 'loading'
  destinationNotice.value = ''

  try {
    const response = await fetch(
      `/api/deliveries/${deliveryId}/destination`
    )

    if (response.status === 404) {
      destinationState.value = 'unavailable'
      destinationNotice.value =
        'No destination information is recorded for this delivery.'
      return
    }

    if (!response.ok) {
      throw new Error('Failed to load destination')
    }

    const data = await response.json()

    destination.value = data.destination || null

    if (
      data.status === 'resolved' &&
      data.coordinates &&
      Number.isFinite(data.coordinates.latitude) &&
      Number.isFinite(data.coordinates.longitude)
    ) {
      destinationCoords.value = data.coordinates
      destinationState.value = 'resolved'
      destinationNotice.value = data.notice || ''
    } else {
      destinationState.value = 'unavailable'
      destinationNotice.value =
        data.notice || 'The delivery destination has no locatable coordinates.'
    }

    nextTick(() => renderDestinationMarker())
  } catch (error) {
    console.error('Error loading destination:', error)

    destinationState.value = 'error'
    destinationNotice.value =
      'We could not reach the location service right now.'
  }
}

// Request the user's device location once.
function requestLocation() {
  if (!('geolocation' in navigator)) {
    locationState.value = 'unsupported'
    return
  }

  locationState.value = 'requesting'

  navigator.geolocation.getCurrentPosition(
    position => {
      userCoords.value = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy
      }

      locationState.value = 'ready'

      nextTick(() => {
        renderUserPosition()
      })
    },
    error => {
      if (error.code === error.PERMISSION_DENIED) {
        locationState.value = 'denied'
      } else if (error.code === error.TIMEOUT) {
        locationState.value = 'timeout'
      } else {
        locationState.value = 'unavailable'
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  )
}

// Use the shared device location as the pickup point.
function useLocationAsPickup() {
  if (!userCoords.value) {
    return
  }

  pickupCoords.value = {
    latitude: userCoords.value.latitude,
    longitude: userCoords.value.longitude
  }

  pickupState.value = 'resolved'
  pickupNotice.value =
    'Pickup set to your current device location. Re-prepare the route with this point.'

  routeStatus.value = 'idle'
  routeData.value = null
  routeNotice.value = ''
  setupConfirmed.value = false
  savedNotice.value = ''
  setupError.value = ''
  clearRouteLine()

  nextTick(() => renderPickupMarker())
}

// Human readable coordinates for detail areas.
const coordsLabel = computed(() => {
  if (!userCoords.value) {
    return ''
  }

  const lat = userCoords.value.latitude.toFixed(5)
  const lng = userCoords.value.longitude.toFixed(5)
  const accuracy = Math.round(userCoords.value.accuracy || 0)

  return `${lat}, ${lng} (±${accuracy} m)`
})

// Short label for the map status badge.
const locationBadgeLabel = computed(() => {
  const labels = {
    idle: 'DEVICE LOCATION NOT SHARED',
    requesting: 'FINDING DEVICE LOCATION',
    ready: 'DEVICE LOCATION READY',
    denied: 'PERMISSION DENIED',
    unavailable: 'POSITION UNAVAILABLE',
    timeout: 'REQUEST TIMED OUT',
    unsupported: 'UNSUPPORTED BROWSER'
  }

  return labels[locationState.value] || labels.idle
})

// Destination status badge text.
const destinationStatusLabel = computed(() => {
  const labels = {
    loading: 'LOCATING ADDRESS',
    resolved: 'DESTINATION LOCATED',
    unavailable: 'COORDINATES UNAVAILABLE',
    error: 'LOCATION SERVICE ERROR'
  }

  return labels[destinationState.value] || 'CHECKING ADDRESS'
})

// Pickup status badge text.
const pickupStatusLabel = computed(() => {
  const labels = {
    loading: 'LOCATING PICKUP',
    resolved: 'PICKUP LOCATED',
    unavailable: 'COORDINATES UNAVAILABLE',
    error: 'LOCATION SERVICE ERROR'
  }

  return labels[pickupState.value] || 'CHECKING PICKUP'
})

// Both real points must be ready before a route can be prepared.
const canPrepareRoute = computed(() => {
  return (
    pickupState.value === 'resolved' &&
    Boolean(pickupCoords.value) &&
    destinationState.value === 'resolved' &&
    Boolean(destinationCoords.value) &&
    routeStatus.value !== 'loading'
  )
})

// The route must be prepared before it can be confirmed and saved.
const canConfirmRoute = computed(() => {
  return (
    routeStatus.value === 'ready' &&
    Boolean(pickupCoords.value) &&
    Boolean(destinationCoords.value) &&
    !savingSetup.value
  )
})

// Continue is only available once the route has been confirmed.
const canContinue = computed(() => {
  return (
    Boolean(delivery.value) &&
    setupConfirmed.value &&
    routeStatus.value === 'ready'
  )
})

// Explain why the continue action is still locked.
const continueNote = computed(() => {
  if (!setupConfirmed.value) {
    return 'Confirm the prepared route before opening live tracking.'
  }

  return ''
})

// Calculate the real driving route from the pickup to the destination.
async function prepareRoute() {
  if (!canPrepareRoute.value) {
    return
  }

  routeStatus.value = 'loading'
  routeNotice.value = ''
  routeData.value = null
  setupConfirmed.value = false
  savedNotice.value = ''
  setupError.value = ''

  const params = new URLSearchParams({
    pickupLat: pickupCoords.value.latitude,
    pickupLng: pickupCoords.value.longitude,
    destinationLat: destinationCoords.value.latitude,
    destinationLng: destinationCoords.value.longitude
  })

  try {
    const response = await fetch(
      `/api/deliveries/${delivery.value.delivery_id}/route?${params}`
    )

    if (!response.ok) {
      throw new Error('Failed to calculate route')
    }

    const data = await response.json()

    if (
      data.status !== 'ready' ||
      !data.geometry ||
      !Number.isFinite(data.distance_m) ||
      !Number.isFinite(data.duration_s)
    ) {
      routeStatus.value = 'error'
      routeNotice.value =
        data.notice || 'The route could not be calculated at this time.'
      clearRouteLine()
      return
    }

    routeData.value = {
      distanceKm: (data.distance_m / 1000).toFixed(1),
      durationMin: Math.round(data.duration_s / 60) || 1
    }

    routeStatus.value = 'ready'
    routeNotice.value = ''

    renderRouteLine(data.geometry)
  } catch (error) {
    console.error('Error preparing route:', error)

    routeStatus.value = 'error'
    routeNotice.value =
      'The route service could not be reached right now. Please try again.'
    clearRouteLine()
  }
}

// Persist the confirmed pickup, destination, and route snapshot.
async function confirmRoute() {
  if (!canConfirmRoute.value) {
    return
  }

  savingSetup.value = true
  setupError.value = ''
  savedNotice.value = ''

  const deliveryId = delivery.value.delivery_id

  const body = {
    pickup: {
      label: (pickup?.value?.name || pickupAddressLine.value).slice(0, 150),
      latitude: pickupCoords.value.latitude,
      longitude: pickupCoords.value.longitude
    },
    destination: {
      label: (destination?.value?.name || destinationAddressLine.value).slice(0, 150),
      latitude: destinationCoords.value.latitude,
      longitude: destinationCoords.value.longitude
    },
    route: {
      distance_m: Number(routeData.value.distanceKm) * 1000,
      duration_s: Number(routeData.value.durationMin) * 60
    }
  }

  try {
    const response = await fetch(
      `/api/deliveries/${deliveryId}/setup`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }
    )

    const data = await response.json()

    if (!response.ok) {
      setupError.value =
        data.message || 'The route could not be confirmed right now.'
      return
    }

    setupConfirmed.value = true
    savedNotice.value =
      'Route confirmed and saved. Live tracking is now available for the prepared journey.'
  } catch (error) {
    console.error('Error confirming route:', error)

    setupError.value = 'Could not reach the server. Please try again.'
  } finally {
    savingSetup.value = false
  }
}

// Move on to the existing live tracking page.
function continueToTracking() {
  if (!canContinue.value) {
    return
  }

  router.push(`/tracking/${delivery.value.delivery_id}`)
}

// Turn status text into a CSS class.
function getStatusClass(status) {
  if (!status) {
    return 'pending'
  }

  return status.toLowerCase().replace(/\s+/g, '-')
}

// Re-centre the map on the pickup point (or the shared device location).
function recenterOnLocation() {
  const target = pickupCoords.value || userCoords.value

  if (map && target) {
    map.setView(
      [target.latitude, target.longitude],
      13,
      { animate: true }
    )
  }
}

// Create the marker icon for the supplier pickup.
function createPickupIcon() {
  return L.divIcon({
    className: 'connect-sb-location-setup-pin',
    html: `
      <div class="connect-sb-location-setup-pin-body">
        <span></span>
      </div>
    `,
    iconSize: [30, 38],
    iconAnchor: [15, 36]
  })
}

// Create the marker icon for the delivery destination.
function createDestinationIcon() {
  return L.divIcon({
    className: 'connect-sb-location-setup-pin-destination',
    html: `
      <div class="connect-sb-location-setup-pin-destination-body">
        <span></span>
      </div>
    `,
    iconSize: [26, 34],
    iconAnchor: [13, 32]
  })
}

// Build the Leaflet map once the workspace is on screen.
function initMap() {
  if (map || !mapContainer.value) {
    return
  }

  map = L.map(mapContainer.value, {
    zoomControl: false,
    scrollWheelZoom: false,
    attributionControl: true
  })

  L.control.zoom({
    position: 'topright'
  }).addTo(map)

  L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }
  ).addTo(map)

  // Neutral view until the real points arrive.
  map.setView([0, 0], 2)

  setTimeout(() => {
    if (map) {
      map.invalidateSize()
    }
  }, 250)

  renderUserPosition()
  renderPickupMarker()
  renderDestinationMarker()
  if (routeLine) {
    renderRouteLine()
  }
}

// Place or move the accuracy circle for the shared device location.
function renderUserPosition() {
  if (!map || !userCoords.value) {
    return
  }

  const coordinates = [
    userCoords.value.latitude,
    userCoords.value.longitude
  ]

  if (!accuracyCircle) {
    accuracyCircle = L.circle(coordinates, {
      radius: userCoords.value.accuracy || 50,
      color: '#D17A4A',
      fillColor: '#D17A4A',
      fillOpacity: 0.08,
      weight: 1,
      opacity: 0.5
    }).addTo(map)
  } else {
    accuracyCircle.setLatLng(coordinates)
    accuracyCircle.setRadius(userCoords.value.accuracy || 50)
  }
}

// Place the supplier pickup marker from its real coordinates.
function renderPickupMarker() {
  if (!map || !pickupCoords.value) {
    return
  }

  const coordinates = [
    pickupCoords.value.latitude,
    pickupCoords.value.longitude
  ]

  if (!pickupMarker) {
    pickupMarker = L.marker(coordinates, {
      icon: createPickupIcon()
    })
      .addTo(map)
      .bindPopup(`
        <strong>Supplier pickup</strong>
        <br>
        ${pickupAddressLine.value}
      `)
  } else {
    pickupMarker.setLatLng(coordinates)
  }

  map.setView(coordinates, 13, {
    animate: true
  })
}

// Place the delivery destination marker from its real coordinates.
function renderDestinationMarker() {
  if (!map || !destinationCoords.value) {
    return
  }

  const coordinates = [
    destinationCoords.value.latitude,
    destinationCoords.value.longitude
  ]

  if (!destinationMarker) {
    destinationMarker = L.marker(coordinates, {
      icon: createDestinationIcon()
    })
      .addTo(map)
      .bindPopup(`
        <strong>Delivery destination</strong>
        <br>
        ${destinationAddressLine.value}
      `)
  } else {
    destinationMarker.setLatLng(coordinates)
  }
}

// Draw the real route returned by the routing service.
function renderRouteLine(geometry) {
  if (!map || !geometry) {
    return
  }

  if (routeLine) {
    map.removeLayer(routeLine)
    routeLine = null
  }

  const latLngs = geometry.coordinates.map(
    point => [point[1], point[0]]
  )

  routeLine = L.polyline(latLngs, {
    color: '#4E342E',
    weight: 4,
    opacity: 0.8
  }).addTo(map)

  // Fit the map to the prepared route between both real points.
  const bounds = L.latLngBounds(latLngs)

  map.fitBounds(bounds.pad(0.12), {
    animate: true
  })

  setTimeout(() => {
    if (map) {
      map.invalidateSize()
    }
  }, 250)
}

// Remove the drawn route layer.
function clearRouteLine() {
  if (routeLine) {
    map?.removeLayer(routeLine)
    routeLine = null
  }
}

// Build the map as soon as the workspace renders.
watch(delivery, async value => {
  if (value) {
    await nextTick()
    initMap()
  }
})

onMounted(() => {
  loadDelivery()
})

onBeforeUnmount(() => {
  if (map) {
    map.remove()
    map = null
  }

  pickupMarker = null
  destinationMarker = null
  accuracyCircle = null
  routeLine = null
})
</script>

<style scoped>

/* Main location setup page */
.connect-sb-location-setup-page {
  min-height: 100vh;
  padding: 34px;
  box-sizing: border-box;
  background: #E8E2DD;
  color: #5C3D24;
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}


/* Page header */
.connect-sb-location-setup-hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 28px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.connect-sb-location-setup-hero-copy {
  max-width: 690px;
}

.connect-sb-location-setup-eyebrow,
.connect-sb-location-setup-section-eyebrow {
  margin: 0 0 8px;
  color: #D17A4A;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.9px;
}

.connect-sb-location-setup-title {
  margin: 0 0 9px;
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 42px;
  font-weight: 600;
  line-height: 1.05;
}

.connect-sb-location-setup-description {
  max-width: 620px;
  margin: 0;
  color: #7A665B;
  font-size: 14px;
  line-height: 1.65;
}


/* Order reference card */
.connect-sb-location-setup-order-card {
  min-width: 190px;
  padding: 14px 16px;
  box-sizing: border-box;
  border: 1px solid rgba(78, 52, 46, 0.08);
  border-radius: 14px;
  background: #FFFEFC;
  box-shadow: 0 5px 18px rgba(78, 52, 46, 0.06);
}

.connect-sb-location-setup-order-card span {
  display: block;
  color: #9A887D;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.connect-sb-location-setup-order-card strong {
  display: block;
  margin-top: 4px;
  color: #4E342E;
  font-size: 17px;
  font-weight: 800;
}

.connect-sb-location-setup-order-card em {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 7px;
  padding: 4px 9px;
  border-radius: 999px;
  background: #F3E7D9;
  color: #8A5A32;
  font-size: 10px;
  font-style: normal;
  font-weight: 750;
}

.connect-sb-location-setup-order-card em.completed,
.connect-sb-location-setup-order-card em.delivered,
.connect-sb-location-setup-order-card em.paid {
  background: #E6F0E8;
  color: #3F6847;
}

.connect-sb-location-setup-order-card em.cancelled {
  background: #F8E2DD;
  color: #9A4938;
}


/* Loading and error states */
.connect-sb-location-setup-state-card {
  max-width: 560px;
  margin: 40px auto;
  padding: 40px 30px;
  box-sizing: border-box;
  border: 1px solid rgba(92, 61, 36, 0.08);
  border-radius: 18px;
  background: #FFFEFC;
  box-shadow: 0 8px 28px rgba(78, 52, 46, 0.06);
  text-align: center;
}

.connect-sb-location-setup-state-icon {
  display: grid;
  width: 52px;
  height: 52px;
  margin: 0 auto 16px;
  place-items: center;
  border-radius: 14px;
  background: #F3E7D9;
  color: #D17A4A;
  font-size: 19px;
}

.connect-sb-location-setup-state-card h2 {
  margin: 0 0 8px;
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 24px;
  font-weight: 600;
}

.connect-sb-location-setup-state-card p {
  margin: 0;
  color: #8A776C;
  font-size: 13px;
  line-height: 1.6;
}

.connect-sb-location-setup-state-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.connect-sb-location-setup-state-link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 13px;
  border: 1px solid #D8CCC4;
  border-radius: 8px;
  background: #FFFEFC;
  color: #5C3D24;
  font-size: 10px;
  font-weight: 800;
  text-decoration: none;
  transition:
    border-color 180ms ease,
    background 180ms ease;
}

.connect-sb-location-setup-state-link svg {
  font-size: 8px;
}

.connect-sb-location-setup-state-link:hover {
  border-color: #D17A4A;
  background: #F3E7D9;
}


/* Spinner */
.connect-sb-location-setup-spinner {
  display: inline-block;
  width: 22px;
  height: 22px;
  border: 3px solid rgba(209, 122, 74, 0.25);
  border-top-color: #D17A4A;
  border-radius: 50%;
  animation: connect-sb-location-setup-spin 0.8s linear infinite;
}

@keyframes connect-sb-location-setup-spin {
  to {
    transform: rotate(360deg);
  }
}


/* Journey context */
.connect-sb-location-setup-context {
  overflow: hidden;
  margin-bottom: 18px;
  border: 1px solid rgba(92, 61, 36, 0.08);
  border-radius: 17px;
  background: #FFFEFC;
  box-shadow: 0 5px 22px rgba(78, 52, 46, 0.07);
}

.connect-sb-location-setup-journey {
  display: grid;
  grid-template-columns: 1fr minmax(120px, 0.55fr) 1fr;
  align-items: center;
  gap: 18px;
  padding: 18px 22px;
  border-bottom: 1px solid #E8E2DD;
  background: #FBF7F3;
}

.connect-sb-location-setup-journey-point {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.connect-sb-location-setup-journey-point.destination {
  justify-content: flex-end;
  text-align: right;
}

.connect-sb-location-setup-journey-marker {
  display: grid;
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 11px;
  background: #E9DDD3;
  color: #6C4A39;
  font-size: 13px;
}

.connect-sb-location-setup-journey-marker.destination {
  background: #F3E7D9;
  color: #D17A4A;
}

.connect-sb-location-setup-journey-point div > span {
  display: block;
  color: #9A887D;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1px;
}

.connect-sb-location-setup-journey-point strong {
  display: block;
  overflow: hidden;
  margin: 3px 0;
  color: #4E342E;
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.connect-sb-location-setup-journey-point small {
  display: block;
  overflow: hidden;
  color: #9A887D;
  font-size: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.connect-sb-location-setup-journey-line {
  position: relative;
  height: 2px;
  background: repeating-linear-gradient(
    to right,
    #CFC2BA 0,
    #CFC2BA 6px,
    transparent 6px,
    transparent 12px
  );
}

.connect-sb-location-setup-journey-line em {
  position: absolute;
  top: 50%;
  left: 50%;
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  transform: translate(-50%, -50%);
  border: 2px solid #D17A4A;
  border-radius: 50%;
  background: #FFFEFC;
  color: #D17A4A;
  font-size: 11px;
  font-style: normal;
  box-shadow: 0 4px 12px rgba(78, 52, 46, 0.14);
}


/* Shipment detail strip */
.connect-sb-location-setup-detail-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 1px;
  background: #E8E2DD;
}

.connect-sb-location-setup-detail-item {
  min-width: 0;
  padding: 13px 16px;
  box-sizing: border-box;
  background: #FFFEFC;
}

.connect-sb-location-setup-detail-item span {
  display: block;
  margin-bottom: 5px;
  color: #9A887D;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.connect-sb-location-setup-detail-item strong {
  display: block;
  overflow: hidden;
  color: #5C3D24;
  font-size: 11px;
  font-weight: 750;
  text-overflow: ellipsis;
  white-space: nowrap;
}


/* Main workspace */
.connect-sb-location-setup-workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 330px;
  gap: 18px;
  align-items: start;
}


/* Map panel */
.connect-sb-location-setup-map-panel,
.connect-sb-location-setup-card {
  border: 1px solid rgba(92, 61, 36, 0.08);
  background: #FFFEFC;
  box-shadow: 0 8px 28px rgba(78, 52, 46, 0.06);
}

.connect-sb-location-setup-map-panel {
  overflow: hidden;
  border-radius: 18px;
}

.connect-sb-location-setup-map-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 20px 22px;
  border-bottom: 1px solid rgba(92, 61, 36, 0.08);
}

.connect-sb-location-setup-map-header .connect-sb-location-setup-section-eyebrow {
  margin: 0;
}

.connect-sb-location-setup-map-header h2 {
  margin: 5px 0 0;
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 20px;
  font-weight: 600;
}

.connect-sb-location-setup-map-header p:last-child {
  margin: 4px 0 0;
  color: #9A887D;
  font-size: 12px;
}


/* Location status badge */
.connect-sb-location-setup-geo-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 12px;
  border-radius: 999px;
  background: #F3E7D9;
  color: #8A5A32;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1px;
  white-space: nowrap;
}

.connect-sb-location-setup-geo-badge-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
}

.connect-sb-location-setup-geo-badge.ready {
  background: #E6F0E8;
  color: #3F6847;
}

.connect-sb-location-setup-geo-badge.requesting {
  background: #F3E7D9;
  color: #8A5A32;
}

.connect-sb-location-setup-geo-badge.denied,
.connect-sb-location-setup-geo-badge.unavailable,
.connect-sb-location-setup-geo-badge.timeout,
.connect-sb-location-setup-geo-badge.unsupported {
  background: #F8E2DD;
  color: #9A4938;
}


/* Map area */
.connect-sb-location-setup-map-shell {
  position: relative;
  padding: 18px;
  background: #E8E2DD;
}

.connect-sb-location-setup-map {
  width: 100%;
  height: 380px;
  min-height: 320px;
  border-radius: 14px;
  overflow: hidden;
}

.connect-sb-location-setup-recenter {
  position: absolute;
  z-index: 500;
  top: 96px;
  right: 30px;
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border: none;
  border-radius: 8px;
  background: #FFFEFC;
  color: #4E342E;
  cursor: pointer;
  font-size: 12px;
  box-shadow: 0 5px 15px rgba(78, 52, 46, 0.18);
  transition:
    color 180ms ease,
    transform 180ms ease;
}

.connect-sb-location-setup-recenter:hover {
  color: #D17A4A;
  transform: translateY(-1px);
}

.connect-sb-location-setup-map-overlay {
  position: absolute;
  z-index: 500;
  top: 30px;
  left: 30px;
  max-width: 235px;
  padding: 13px 14px;
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.85);
  border-radius: 13px;
  background: rgba(255, 254, 252, 0.96);
  box-shadow: 0 9px 24px rgba(78, 52, 46, 0.15);
  backdrop-filter: blur(8px);
}

.connect-sb-location-setup-map-overlay strong {
  display: block;
  color: #4E342E;
  font-size: 12px;
}

.connect-sb-location-setup-map-overlay small {
  display: block;
  margin-top: 3px;
  color: #9A887D;
  font-size: 10px;
  line-height: 1.45;
}


/* Geolocation control */
.connect-sb-location-setup-geo-panel {
  padding: 16px 22px 20px;
}

.connect-sb-location-setup-geo-message {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 15px;
  border: 1px solid #E8DDD5;
  border-radius: 12px;
  background: #FBF7F3;
}

.connect-sb-location-setup-geo-message > div {
  flex: 1;
  min-width: 0;
}

.connect-sb-location-setup-geo-message strong {
  display: block;
  color: #4E342E;
  font-size: 12px;
}

.connect-sb-location-setup-geo-message p {
  margin: 3px 0 0;
  color: #8A776C;
  font-size: 11px;
  line-height: 1.5;
}

.connect-sb-location-setup-geo-message p em {
  display: block;
  margin-top: 3px;
  color: #9A887D;
  font-size: 10px;
  font-style: normal;
}

.connect-sb-location-setup-geo-message.ready {
  border-color: #D7E5D9;
  background: #F4F9F4;
}

.connect-sb-location-setup-geo-message.error {
  border-color: #EED9D3;
  background: #FCF4F1;
}

.connect-sb-location-setup-geo-icon {
  display: grid;
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 10px;
  background: #F3E7D9;
  color: #D17A4A;
  font-size: 13px;
}

.connect-sb-location-setup-geo-icon.muted {
  background: #EFE8E3;
  color: #9A887D;
}

.connect-sb-location-setup-geo-message.ready .connect-sb-location-setup-geo-icon {
  background: #E6F0E8;
  color: #3F6847;
}

.connect-sb-location-setup-geo-message.error .connect-sb-location-setup-geo-icon {
  background: #F8E2DD;
  color: #9A4938;
}


/* Geolocation actions */
.connect-sb-location-setup-locate,
.connect-sb-location-setup-retry,
.connect-sb-location-setup-prepare {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 9px 13px;
  border: 1px solid #D17A4A;
  border-radius: 8px;
  background: #D17A4A;
  color: #FFFEFC;
  font-family: inherit;
  font-size: 10px;
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 4px 10px rgba(209, 122, 74, 0.14);
  transition:
    transform 180ms ease,
    background 180ms ease;
}

.connect-sb-location-setup-retry {
  padding: 7px 11px;
  border-color: #9A4938;
  background: #9A4938;
  box-shadow: 0 4px 10px rgba(154, 73, 56, 0.14);
}

.connect-sb-location-setup-locate:hover,
.connect-sb-location-setup-retry:hover,
.connect-sb-location-setup-prepare:hover:not(:disabled) {
  transform: translateY(-1px);
}

.connect-sb-location-setup-locate:hover {
  background: #BF683A;
}


/* Side panel */
.connect-sb-location-setup-side {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.connect-sb-location-setup-card {
  padding: 17px;
  border-radius: 16px;
}

.connect-sb-location-setup-card-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  color: #9A887D;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.4px;
}

.connect-sb-location-setup-card-heading svg {
  color: #D17A4A;
  font-size: 13px;
}


/* Readiness checklist */
.connect-sb-location-setup-readiness-list {
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.connect-sb-location-setup-readiness-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  opacity: 0.55;
}

.connect-sb-location-setup-readiness-item.complete {
  opacity: 1;
}

.connect-sb-location-setup-readiness-item.blocked {
  opacity: 1;
}

.connect-sb-location-setup-readiness-dot {
  display: grid;
  width: 21px;
  height: 21px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 50%;
  background: #EFE8E3;
  color: #A99A91;
  font-size: 10px;
}

.connect-sb-location-setup-readiness-item.complete .connect-sb-location-setup-readiness-dot {
  background: #E6F0E8;
  color: #3F6847;
}

.connect-sb-location-setup-readiness-item.blocked .connect-sb-location-setup-readiness-dot {
  background: #F8E2DD;
  color: #9A4938;
}

.connect-sb-location-setup-readiness-item strong {
  display: block;
  color: #4E342E;
  font-size: 11px;
}

.connect-sb-location-setup-readiness-item small {
  display: block;
  margin-top: 2px;
  color: #9A887D;
  font-size: 9px;
  line-height: 1.45;
}


/* Destination details */
.connect-sb-location-setup-destination-info {
  padding: 11px 13px;
  border: 1px solid #E8E2DD;
  border-radius: 11px;
  background: #FBF7F3;
}

.connect-sb-location-setup-destination-info strong {
  display: block;
  color: #4E342E;
  font-size: 12px;
}

.connect-sb-location-setup-destination-info p {
  margin: 3px 0 0;
  color: #8A776C;
  font-size: 10px;
  line-height: 1.5;
}

.connect-sb-location-setup-destination-status {
  display: inline-flex;
  align-items: center;
  margin-top: 10px;
  padding: 5px 9px;
  border-radius: 999px;
  background: #F3E7D9;
  color: #8A5A32;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.9px;
}

.connect-sb-location-setup-destination-status.resolved {
  background: #E6F0E8;
  color: #3F6847;
}

.connect-sb-location-setup-destination-status.unavailable,
.connect-sb-location-setup-destination-status.error {
  background: #F8E2DD;
  color: #9A4938;
}

.connect-sb-location-setup-note {
  margin: 9px 0 0;
  color: #9A4938;
  font-size: 9px;
  line-height: 1.55;
}


/* Route summary */
.connect-sb-location-setup-summary {
  margin-top: 15px;
}

.connect-sb-location-setup-summary-point {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.connect-sb-location-setup-summary-marker {
  width: 13px;
  height: 13px;
  flex-shrink: 0;
  margin-top: 3px;
  border: 3px solid #FFFEFC;
  border-radius: 50%;
  box-shadow: 0 0 0 2px #4E342E;
  background: #4E342E;
}

.connect-sb-location-setup-summary-marker.end {
  box-shadow: 0 0 0 2px #D17A4A;
  background: #D17A4A;
}

.connect-sb-location-setup-summary-point div > span {
  display: block;
  color: #9A887D;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1px;
}

.connect-sb-location-setup-summary-point strong {
  display: block;
  margin: 3px 0;
  color: #4E342E;
  font-size: 11px;
}

.connect-sb-location-setup-summary-point small {
  display: block;
  color: #9A887D;
  font-size: 9px;
  line-height: 1.45;
}

.connect-sb-location-setup-summary-connector {
  position: relative;
  min-height: 46px;
  margin-left: 6px;
  padding-left: 16px;
}

.connect-sb-location-setup-summary-line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 0;
  border-left: 2px dashed #CFC2BA;
}

.connect-sb-location-setup-summary-connector em {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  padding: 4px 8px;
  border: 1px dashed #D8CCC4;
  border-radius: 999px;
  background: #FBF7F3;
  color: #9A4938;
  font-size: 8px;
  font-style: normal;
  font-weight: 800;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  white-space: nowrap;
}

.connect-sb-location-setup-summary-connector em.ready {
  border-color: #C9DDCC;
  background: #F4F9F4;
  color: #3F6847;
}

.connect-sb-location-setup-summary-connector em.loading {
  color: #8A5A32;
}


/* Distance and time */
.connect-sb-location-setup-metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 15px;
}

.connect-sb-location-setup-metrics div {
  padding: 10px 12px;
  border: 1px solid #E8E2DD;
  border-radius: 10px;
  background: #FBF7F3;
}

.connect-sb-location-setup-metrics span {
  display: block;
  margin-bottom: 4px;
  color: #9A887D;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.8px;
}

.connect-sb-location-setup-metrics strong {
  color: #9A4938;
  font-size: 11px;
}

.connect-sb-location-setup-metrics strong.ready {
  color: #3F6847;
}


/* Prepare route button */
.connect-sb-location-setup-prepare {
  width: 100%;
  margin-top: 14px;
}

.connect-sb-location-setup-prepare:disabled {
  border-color: #D8CCC4;
  background: #EFE8E3;
  color: #A99A91;
  cursor: not-allowed;
  box-shadow: none;
}

.connect-sb-location-setup-prepare.loading {
  opacity: 0.75;
  cursor: wait;
}


/* Continue actions */
.connect-sb-location-setup-card.continue {
  background: #4E342E;
  border-color: rgba(78, 52, 46, 0.4);
}

.connect-sb-location-setup-continue {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  padding: 13px 15px;
  border: 1px solid #D17A4A;
  border-radius: 10px;
  background: #D17A4A;
  color: #FFFEFC;
  font-family: inherit;
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 5px 14px rgba(209, 122, 74, 0.25);
  transition:
    transform 180ms ease,
    background 180ms ease;
}

.connect-sb-location-setup-continue svg {
  font-size: 9px;
  transition: transform 180ms ease;
}

.connect-sb-location-setup-continue:hover:not(:disabled) {
  transform: translateY(-1px);
  background: #BF683A;
}

.connect-sb-location-setup-continue:hover:not(:disabled) svg {
  transform: translateX(2px);
}

.connect-sb-location-setup-continue:disabled {
  border-color: rgba(255, 254, 252, 0.16);
  background: rgba(255, 254, 252, 0.08);
  color: rgba(255, 254, 252, 0.45);
  cursor: not-allowed;
  box-shadow: none;
}

.connect-sb-location-setup-continue-note {
  margin: 9px 0 0;
  color: #C9BBB3;
  font-size: 10px;
  text-align: center;
}

.connect-sb-location-setup-back {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  margin-top: 13px;
  padding-top: 13px;
  border-top: 1px solid rgba(255, 254, 252, 0.12);
  color: #D7C8BF;
  font-size: 10px;
  font-weight: 750;
  text-decoration: none;
  transition: color 180ms ease;
}

.connect-sb-location-setup-back:hover {
  color: #FFFEFC;
}

.connect-sb-location-setup-back .back-icon {
  transform: rotate(180deg);
  font-size: 8px;
}


/* Confirm route button */
.connect-sb-location-setup-confirm {
  width: 100%;
  margin-top: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 10px 13px;
  border: 1px solid #5C3D24;
  border-radius: 8px;
  background: #5C3D24;
  color: #FFFEFC;
  font-family: inherit;
  font-size: 10px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(92, 61, 36, 0.16);
  transition:
    transform 180ms ease,
    background 180ms ease;
}

.connect-sb-location-setup-confirm:hover:not(:disabled) {
  transform: translateY(-1px);
  background: #4E342E;
}

.connect-sb-location-setup-confirm:disabled {
  border-color: #D8CCC4;
  background: #EFE8E3;
  color: #A99A91;
  cursor: not-allowed;
  box-shadow: none;
}

.connect-sb-location-setup-saved-note {
  margin: 9px 0 0;
  color: #3F6847;
  font-size: 9px;
  line-height: 1.55;
}

/* Pickup and destination tags */
.connect-sb-location-setup-info-tag {
  display: block;
  margin-bottom: 6px;
  color: #9A887D;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1px;
}

.connect-sb-location-setup-destination-info.dest-block {
  margin-top: 13px;
}


/* Tablet */
@media (max-width: 1100px) {
  .connect-sb-location-setup-workspace {
    grid-template-columns: 1fr;
  }

  .connect-sb-location-setup-side {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .connect-sb-location-setup-card.continue {
    grid-column: span 2;
  }

  .connect-sb-location-setup-detail-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}


/* Smaller tablet */
@media (max-width: 760px) {
  .connect-sb-location-setup-page {
    padding: 22px 16px;
  }

  .connect-sb-location-setup-title {
    font-size: 34px;
  }

  .connect-sb-location-setup-journey {
    grid-template-columns: 1fr;
  }

  .connect-sb-location-setup-journey-point.destination {
    justify-content: flex-start;
    text-align: left;
  }

  .connect-sb-location-setup-journey-line {
    display: none;
  }

  .connect-sb-location-setup-map-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .connect-sb-location-setup-side {
    grid-template-columns: 1fr;
  }

  .connect-sb-location-setup-card.continue {
    grid-column: span 1;
  }

  .connect-sb-location-setup-detail-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}


/* Mobile */
@media (max-width: 560px) {
  .connect-sb-location-setup-page {
    padding: 18px 12px;
  }

  .connect-sb-location-setup-title {
    font-size: 31px;
  }

  .connect-sb-location-setup-order-card {
    width: 100%;
  }

  .connect-sb-location-setup-map {
    height: 300px;
    min-height: 280px;
  }

  .connect-sb-location-setup-map-overlay {
    top: 28px;
    left: 28px;
    max-width: calc(100% - 56px);
  }

  .connect-sb-location-setup-recenter {
    top: 96px;
    right: 30px;
  }

  .connect-sb-location-setup-geo-panel {
    padding: 14px 16px 18px;
  }

  .connect-sb-location-setup-geo-message {
    flex-wrap: wrap;
  }

  .connect-sb-location-setup-locate,
  .connect-sb-location-setup-retry {
    width: 100%;
    justify-content: center;
  }

  .connect-sb-location-setup-detail-grid {
    grid-template-columns: 1fr;
  }

  .connect-sb-location-setup-metrics {
    grid-template-columns: 1fr;
  }
}

</style>

<style>
/* Leaflet marker styles live outside Vue's scope tree */
.connect-sb-location-setup-pin {
  background: transparent;
  border: none;
}

.connect-sb-location-setup-pin-body {
  position: relative;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid #FFFEFC;
  border-radius: 50% 50% 50% 0;
  background: #4E342E;
  transform: rotate(-45deg);
  box-shadow: 0 4px 14px rgba(78, 52, 46, 0.32);
}

.connect-sb-location-setup-pin-body span {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #D17A4A;
}

.connect-sb-location-setup-pin-destination {
  background: transparent;
  border: none;
}

.connect-sb-location-setup-pin-destination-body {
  position: relative;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid #FFFEFC;
  border-radius: 50% 50% 50% 0;
  background: #D17A4A;
  transform: rotate(-45deg);
  box-shadow: 0 4px 14px rgba(209, 122, 74, 0.34);
}

.connect-sb-location-setup-pin-destination-body span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #FFFEFC;
}

.connect-sb-location-setup-map-shell .leaflet-control-zoom {
  border: none !important;
  box-shadow: 0 5px 15px rgba(78, 52, 46, 0.16) !important;
}

.connect-sb-location-setup-map-shell .leaflet-control-zoom a {
  width: 30px;
  height: 30px;
  line-height: 30px;
  color: #4E342E;
  background: #FFFEFC;
  border: none;
}

.connect-sb-location-setup-map-shell .leaflet-control-zoom a:hover {
  color: #D17A4A;
  background: #FFFEFC;
}

.connect-sb-location-setup-map-shell .leaflet-control-attribution {
  font-size: 8px;
  background: rgba(255, 254, 252, 0.8);
}
</style>