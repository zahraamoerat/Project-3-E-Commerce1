<template>
  <div class="connect-sb-deliveries-page">

    <!-- Delivery dashboard header -->
    <header class="connect-sb-deliveries-hero">

      <div class="connect-sb-deliveries-hero-copy">
        <p class="connect-sb-deliveries-eyebrow">
          DELIVERY CENTRE
        </p>

        <h1 class="connect-sb-deliveries-title">
          My Deliveries
        </h1>

        <p class="connect-sb-deliveries-description">
          Stay on top of every shipment and follow your orders as they make their way to your business.
        </p>
      </div>

      <!-- Current delivery indicator -->
      <div class="connect-sb-deliveries-live-indicator">
        <span class="connect-sb-deliveries-live-dot"></span>

        <div>
          <span>DELIVERY STATUS</span>
          <strong>
            {{ activeDeliveries }} active
          </strong>
        </div>
      </div>

    </header>


    <!-- Delivery overview -->
    <section class="connect-sb-deliveries-overview">

      <article
        class="connect-sb-deliveries-overview-card connect-sb-deliveries-overview-main"
      >
        <div class="connect-sb-deliveries-overview-icon">
          <FontAwesomeIcon :icon="faTruckFast" />
        </div>

        <div>
          <span>Total Deliveries</span>

          <strong>
            {{ deliveries.length }}
          </strong>

          <p>
            Shipments connected to your orders
          </p>
        </div>
      </article>


      <article class="connect-sb-deliveries-overview-card">

        <div class="connect-sb-deliveries-overview-top">
          <span>In Progress</span>

          <FontAwesomeIcon :icon="faRoute" />
        </div>

        <strong class="connect-sb-deliveries-overview-number">
          {{ activeDeliveries }}
        </strong>

        <p>
          Currently moving
        </p>

      </article>


      <article class="connect-sb-deliveries-overview-card">

        <div class="connect-sb-deliveries-overview-top">
          <span>Completed</span>

          <FontAwesomeIcon :icon="faCircleCheck" />
        </div>

        <strong class="connect-sb-deliveries-overview-number">
          {{ completedDeliveries }}
        </strong>

        <p>
          Successfully delivered
        </p>

      </article>

    </section>


    <!-- Delivery workspace -->
    <section class="connect-sb-deliveries-workspace">

      <div class="connect-sb-deliveries-workspace-header">

        <div>
          <p class="connect-sb-deliveries-section-eyebrow">
            DELIVERY ACTIVITY
          </p>

          <h2>
            Your shipments
          </h2>

          <p>
            Follow each delivery from supplier collection to your business.
          </p>
        </div>

        <div class="connect-sb-deliveries-count">
          <strong>{{ deliveries.length }}</strong>
          <span>deliveries</span>
        </div>

      </div>


      <!-- Delivery cards -->
      <div class="connect-sb-deliveries-card-grid">

        <article
          v-for="delivery in deliveries"
          :key="delivery.deliveryId"
          class="connect-sb-deliveries-card"
          :class="{
            selected:
              selectedDelivery?.deliveryId === delivery.deliveryId
          }"
        >

          <!-- Delivery card heading -->
          <div class="connect-sb-deliveries-card-heading">

            <div class="connect-sb-deliveries-card-reference">

              <div class="connect-sb-deliveries-card-icon">
                <FontAwesomeIcon :icon="faTruckFast" />
              </div>

              <div>
                <span>
                  DELIVERY
                </span>

                <h3>
                  {{ delivery.deliveryId }}
                </h3>

                <p>
                  Order {{ delivery.orderNumber }}
                </p>
              </div>

            </div>


            <span
              class="connect-sb-deliveries-status"
              :class="getStatusClass(delivery.deliveryStatus)"
            >
              <span class="connect-sb-deliveries-status-dot"></span>
              {{ delivery.deliveryStatus }}
            </span>

          </div>


          <!-- Route visual -->
          <div class="connect-sb-deliveries-route">

            <div class="connect-sb-deliveries-route-point">
              <span class="connect-sb-deliveries-route-marker pickup">
                <FontAwesomeIcon :icon="faWarehouse" />
              </span>

              <div>
                <span>FROM</span>
                <strong>{{ delivery.supplier }}</strong>
              </div>
            </div>


            <div class="connect-sb-deliveries-route-line">

              <span
                class="connect-sb-deliveries-route-progress"
                :class="{
                  complete:
                    delivery.deliveryStatus.toLowerCase() === 'completed'
                }"
              ></span>

              <FontAwesomeIcon :icon="faTruckFast" />

            </div>


            <div class="connect-sb-deliveries-route-point">

              <span class="connect-sb-deliveries-route-marker destination">
                <FontAwesomeIcon :icon="faLocationDot" />
              </span>

              <div>
                <span>TO</span>
                <strong>Your Business</strong>
              </div>

            </div>

          </div>


          <!-- Delivery information -->
          <div class="connect-sb-deliveries-card-info">

            <div>
              <span>ORDER</span>

              <strong>
                {{ delivery.orderNumber }}
              </strong>
            </div>

            <div>
              <span>PAYMENT</span>

              <strong
                :class="getStatusClass(delivery.paymentStatus)"
              >
                {{ delivery.paymentStatus }}
              </strong>
            </div>

            <div>
              <span>DELIVERY FEE</span>

              <strong>
                R {{ Number(delivery.deliveryFee).toFixed(2) }}
              </strong>
            </div>

          </div>


          <!-- Delivery footer -->
          <div class="connect-sb-deliveries-card-footer">

            <div class="connect-sb-deliveries-delivery-value">

              <span>
                ORDER VALUE
              </span>

              <strong>
                R {{ Number(delivery.total).toFixed(2) }}
              </strong>

            </div>


            <button
              type="button"
              class="connect-sb-deliveries-track-button"
              :class="{
                active:
                  selectedDelivery?.deliveryId === delivery.deliveryId
              }"
              @click="trackDelivery(delivery)"
            >

              <span>
                {{
                  selectedDelivery?.deliveryId === delivery.deliveryId
                    ? 'Viewing Delivery'
                    : 'Track Delivery'
                }}
              </span>

              <FontAwesomeIcon :icon="faArrowRight" />

            </button>

          </div>

        </article>


        <!-- Empty state -->
        <div
          v-if="deliveries.length === 0"
          class="connect-sb-deliveries-empty"
        >

          <div class="connect-sb-deliveries-empty-icon">
            <FontAwesomeIcon :icon="faTruckFast" />
          </div>

          <h3>
            No deliveries yet
          </h3>

          <p>
            Deliveries connected to your supplier orders will appear here.
          </p>

        </div>

      </div>

    </section>


    <!-- Selected delivery details -->
    <Transition name="connect-sb-deliveries-details">

      <section
        v-if="selectedDelivery"
        class="connect-sb-deliveries-details"
      >

        <!-- Details heading -->
        <div class="connect-sb-deliveries-details-header">

          <div class="connect-sb-deliveries-details-title">

            <div class="connect-sb-deliveries-details-icon">
              <FontAwesomeIcon :icon="faRoute" />
            </div>

            <div>

              <p>
                DELIVERY TRACKING
              </p>

              <h2>
                {{ selectedDelivery.deliveryId }}
              </h2>

              <span>
                From {{ selectedDelivery.supplier }}
              </span>

            </div>

          </div>


          <button
            type="button"
            class="connect-sb-deliveries-close"
            aria-label="Close delivery details"
            @click="selectedDelivery = null"
          >
            <FontAwesomeIcon :icon="faXmark" />
          </button>

        </div>


        <!-- Current delivery state -->
        <div class="connect-sb-deliveries-current-status">

          <div>

            <span>
              CURRENT STATUS
            </span>

            <strong>
              {{ selectedDelivery.deliveryStatus }}
            </strong>

          </div>


          <span
            class="connect-sb-deliveries-status"
            :class="getStatusClass(selectedDelivery.deliveryStatus)"
          >
            <span class="connect-sb-deliveries-status-dot"></span>

            {{ selectedDelivery.deliveryStatus }}
          </span>

        </div>


        <!-- Delivery journey -->
        <div class="connect-sb-deliveries-journey">

          <div class="connect-sb-deliveries-journey-heading">

            <div>
              <p>
                DELIVERY JOURNEY
              </p>

              <h3>
                From supplier to your business
              </h3>
            </div>

            <span>
              {{ selectedDelivery.orderNumber }}
            </span>

          </div>


          <div class="connect-sb-deliveries-journey-track">

            <!-- Step 1 -->
            <div
              class="connect-sb-deliveries-journey-step complete"
            >

              <div class="connect-sb-deliveries-journey-node">
                <FontAwesomeIcon :icon="faWarehouse" />
              </div>

              <div>
                <strong>
                  Supplier
                </strong>

                <span>
                  {{ selectedDelivery.supplier }}
                </span>
              </div>

            </div>


            <!-- Connector -->
            <div class="connect-sb-deliveries-journey-connector">
              <span
                :class="{
                  active:
                    selectedDelivery.deliveryStatus.toLowerCase() !==
                    'pending'
                }"
              ></span>
            </div>


            <!-- Step 2 -->
            <div
              class="connect-sb-deliveries-journey-step"
              :class="{
                complete:
                  selectedDelivery.deliveryStatus.toLowerCase() ===
                    'in transit' ||
                  selectedDelivery.deliveryStatus.toLowerCase() ===
                    'out for delivery' ||
                  selectedDelivery.deliveryStatus.toLowerCase() ===
                    'completed'
              }"
            >

              <div class="connect-sb-deliveries-journey-node">
                <FontAwesomeIcon :icon="faTruckFast" />
              </div>

              <div>
                <strong>
                  In Transit
                </strong>

                <span>
                  Delivery in progress
                </span>
              </div>

            </div>


            <!-- Connector -->
            <div class="connect-sb-deliveries-journey-connector">

              <span
                :class="{
                  active:
                    selectedDelivery.deliveryStatus.toLowerCase() ===
                      'out for delivery' ||
                    selectedDelivery.deliveryStatus.toLowerCase() ===
                      'completed'
                }"
              ></span>

            </div>


            <!-- Step 3 -->
            <div
              class="connect-sb-deliveries-journey-step"
              :class="{
                complete:
                  selectedDelivery.deliveryStatus.toLowerCase() ===
                  'completed'
              }"
            >

              <div class="connect-sb-deliveries-journey-node">
                <FontAwesomeIcon :icon="faLocationDot" />
              </div>

              <div>
                <strong>
                  Your Business
                </strong>

                <span>
                  Final destination
                </span>
              </div>

            </div>

          </div>

        </div>


        <!-- Delivery information and pricing -->
        <div class="connect-sb-deliveries-details-layout">

          <div class="connect-sb-deliveries-information-panel">

            <div class="connect-sb-deliveries-panel-heading">
              <span>
                DELIVERY INFORMATION
              </span>
            </div>


            <div class="connect-sb-deliveries-detail-grid">

              <div class="connect-sb-deliveries-detail-item">
                <span>Delivery Number</span>
                <strong>
                  {{ selectedDelivery.deliveryId }}
                </strong>
              </div>

              <div class="connect-sb-deliveries-detail-item">
                <span>Order Number</span>
                <strong>
                  {{ selectedDelivery.orderNumber }}
                </strong>
              </div>

              <div class="connect-sb-deliveries-detail-item">
                <span>Supplier</span>
                <strong>
                  {{ selectedDelivery.supplier }}
                </strong>
              </div>

              <div class="connect-sb-deliveries-detail-item">
                <span>Payment Status</span>
                <strong>
                  {{ selectedDelivery.paymentStatus }}
                </strong>
              </div>

            </div>

          </div>


          <!-- Pricing panel -->
          <div class="connect-sb-deliveries-pricing-panel">

            <div class="connect-sb-deliveries-panel-heading">
              <span>
                DELIVERY COST
              </span>
            </div>


            <div class="connect-sb-deliveries-price-row">

              <span>
                Order total
              </span>

              <strong>
                R {{ Number(selectedDelivery.total).toFixed(2) }}
              </strong>

            </div>


            <div class="connect-sb-deliveries-price-row">

              <span>
                Delivery fee
              </span>

              <strong>
                R {{ Number(selectedDelivery.deliveryFee).toFixed(2) }}
              </strong>

            </div>


            <div class="connect-sb-deliveries-price-divider"></div>


            <div class="connect-sb-deliveries-price-row total">

              <span>
                Delivery reference
              </span>

              <strong>
                {{ selectedDelivery.deliveryId }}
              </strong>

            </div>

          </div>

        </div>


        <!-- Live tracking connection -->
        <div class="connect-sb-deliveries-live-banner">

          <div class="connect-sb-deliveries-live-banner-icon">
            <FontAwesomeIcon :icon="faLocationArrow" />
          </div>

          <div class="connect-sb-deliveries-live-banner-content">

            <span>
              LIVE DELIVERY TRACKING
            </span>

            <strong>
              Follow this shipment on the map
            </strong>

            <p>
              View the current delivery route and vehicle location through WeConnect tracking.
            </p>

          </div>


          <router-link
            to="/tracking"
            class="connect-sb-deliveries-open-tracking"
          >
            Open Tracking

            <FontAwesomeIcon :icon="faArrowRight" />
          </router-link>

        </div>

      </section>

    </Transition>

  </div>
</template>


<script setup>
import { computed, onMounted, ref } from 'vue'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faArrowRight,
  faCircleCheck,
  faLocationArrow,
  faLocationDot,
  faRoute,
  faTruckFast,
  faWarehouse,
  faXmark
} from '@fortawesome/free-solid-svg-icons'

// Store deliveries returned by the backend.
const deliveries = ref([])

// Store the delivery currently being viewed.
const selectedDelivery = ref(null)

// Load deliveries from the WeConnect backend.
async function loadDeliveries() {
  try {
    const response = await fetch('http://localhost:3000/api/deliveries')

    if (!response.ok) {
      throw new Error('Failed to load deliveries')
    }

    const data = await response.json()

    // Convert database fields into the names used by this page.
    deliveries.value = data.map(delivery => ({
      deliveryId: delivery.delivery_id,
      orderId: delivery.order_id,
      orderNumber: delivery.order_number,
      buyer: delivery.buyer_name,
      supplier: delivery.supplier_name,
      courier: delivery.courier_name,
      trackingReference: delivery.tracking_reference,
      deliveryStatus: delivery.current_status || 'Pending',
      paymentStatus: delivery.payment_status || 'Pending',
      deliveryFee: 0,
      total: Number(delivery.total_amount || 0),
      estimatedArrival: delivery.estimated_arrival
    }))
  } catch (error) {
    console.error('Error loading deliveries:', error)

    deliveries.value = []
  }
}

// Count deliveries that are still active.
const activeDeliveries = computed(() => {
  return deliveries.value.filter(delivery => {
    const status = delivery.deliveryStatus.toLowerCase()

    return status !== 'completed' &&
      status !== 'delivered'
  }).length
})

// Count completed deliveries.
const completedDeliveries = computed(() => {
  return deliveries.value.filter(delivery => {
    const status = delivery.deliveryStatus.toLowerCase()

    return status === 'completed' ||
      status === 'delivered'
  }).length
})

// Open the selected delivery.
function trackDelivery(delivery) {
  selectedDelivery.value = delivery
}

// Turn status text into a CSS class.
function getStatusClass(status) {
  if (!status) {
    return 'pending'
  }

  return status.toLowerCase().replace(/\s+/g, '-')
}

// Load real deliveries when the page opens.
onMounted(() => {
  loadDeliveries()
})
</script>

<style scoped>

/* Main delivery page */
.connect-sb-deliveries-page {
  min-height: 100vh;
  padding: 34px;
  box-sizing: border-box;
  background: #E8E2DD;
  color: #5C3D24;
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}


/* Delivery dashboard header */
.connect-sb-deliveries-hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 30px;
  margin-bottom: 27px;
}

.connect-sb-deliveries-hero-copy {
  max-width: 690px;
}

.connect-sb-deliveries-eyebrow {
  margin: 0 0 8px;
  color: #D17A4A;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.9px;
}

.connect-sb-deliveries-title {
  margin: 0 0 9px;
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 42px;
  font-weight: 600;
  line-height: 1.05;
}

.connect-sb-deliveries-description {
  max-width: 620px;
  margin: 0;
  color: #7A665B;
  font-size: 14px;
  line-height: 1.65;
}


/* Live delivery indicator */
.connect-sb-deliveries-live-indicator {
  display: flex;
  align-items: center;
  gap: 11px;
  min-width: 165px;
  padding: 13px 16px;
  box-sizing: border-box;
  border: 1px solid rgba(78, 52, 46, 0.06);
  border-radius: 12px;
  background: #FFFEFC;
  box-shadow: 0 5px 18px rgba(78, 52, 46, 0.06);
}

.connect-sb-deliveries-live-dot {
  width: 9px;
  height: 9px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #5C8B62;
  box-shadow: 0 0 0 5px rgba(92, 139, 98, 0.1);
  animation: connect-sb-deliveries-pulse 2s infinite;
}

.connect-sb-deliveries-live-indicator span:not(.connect-sb-deliveries-live-dot) {
  display: block;
  margin-bottom: 3px;
  color: #9A887D;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1.1px;
}

.connect-sb-deliveries-live-indicator strong {
  color: #4E342E;
  font-size: 13px;
}

@keyframes connect-sb-deliveries-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 5px rgba(92, 139, 98, 0.1);
  }

  50% {
    box-shadow: 0 0 0 8px rgba(92, 139, 98, 0.04);
  }
}


/* Delivery overview cards */
.connect-sb-deliveries-overview {
  display: grid;
  grid-template-columns: 1.35fr 1fr 1fr;
  gap: 15px;
  margin-bottom: 25px;
}

.connect-sb-deliveries-overview-card {
  min-height: 125px;
  padding: 18px 20px;
  box-sizing: border-box;
  border: 1px solid rgba(78, 52, 46, 0.05);
  border-radius: 15px;
  background: #FFFEFC;
  box-shadow: 0 4px 18px rgba(78, 52, 46, 0.055);
  transition:
    transform 180ms ease,
    box-shadow 180ms ease;
}

.connect-sb-deliveries-overview-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(78, 52, 46, 0.09);
}

.connect-sb-deliveries-overview-main {
  display: flex;
  align-items: center;
  gap: 15px;
  border-top: 3px solid #D17A4A;
}

.connect-sb-deliveries-overview-icon {
  display: grid;
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 12px;
  background: #F3E7D9;
  color: #D17A4A;
  font-size: 16px;
}

.connect-sb-deliveries-overview-main > div:last-child > span,
.connect-sb-deliveries-overview-top span {
  color: #7A665B;
  font-size: 11px;
  font-weight: 650;
}

.connect-sb-deliveries-overview-main strong {
  display: block;
  margin-top: 6px;
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 30px;
  font-weight: 600;
  line-height: 1;
}

.connect-sb-deliveries-overview-main p,
.connect-sb-deliveries-overview-card p {
  margin: 6px 0 0;
  color: #9A887D;
  font-size: 10px;
}

.connect-sb-deliveries-overview-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.connect-sb-deliveries-overview-top svg {
  color: #D17A4A;
  font-size: 12px;
}

.connect-sb-deliveries-overview-number {
  display: block;
  margin-top: 15px;
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 29px;
  font-weight: 600;
  line-height: 1;
}


/* Main delivery workspace */
.connect-sb-deliveries-workspace {
  overflow: hidden;
  border-radius: 17px;
  background: #FFFEFC;
  box-shadow: 0 5px 22px rgba(78, 52, 46, 0.08);
}

.connect-sb-deliveries-workspace-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  padding: 25px 25px 20px;
  border-bottom: 1px solid #E8E2DD;
}

.connect-sb-deliveries-section-eyebrow {
  margin: 0 0 5px;
  color: #D17A4A;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.6px;
}

.connect-sb-deliveries-workspace-header h2 {
  margin: 0 0 4px;
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 25px;
  font-weight: 600;
}

.connect-sb-deliveries-workspace-header p:last-child {
  margin: 0;
  color: #8A776C;
  font-size: 12px;
}

.connect-sb-deliveries-count {
  display: flex;
  align-items: baseline;
  gap: 5px;
  color: #9A887D;
  font-size: 11px;
}

.connect-sb-deliveries-count strong {
  color: #4E342E;
  font-size: 18px;
}


/* Delivery cards */
.connect-sb-deliveries-card-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 17px;
  padding: 22px 25px 25px;
}

.connect-sb-deliveries-card {
  display: flex;
  min-width: 0;
  flex-direction: column;
  padding: 18px;
  border: 1px solid #E6DDD7;
  border-radius: 15px;
  background: #FFFEFC;
  box-shadow: 0 3px 12px rgba(78, 52, 46, 0.045);
  transition:
    transform 180ms ease,
    border-color 180ms ease,
    box-shadow 180ms ease;
}

.connect-sb-deliveries-card:hover {
  transform: translateY(-3px);
  border-color: #D8C8BE;
  box-shadow: 0 9px 24px rgba(78, 52, 46, 0.09);
}

.connect-sb-deliveries-card.selected {
  border-color: #D17A4A;
  box-shadow:
    0 0 0 2px rgba(209, 122, 74, 0.11),
    0 9px 24px rgba(78, 52, 46, 0.09);
}


/* Delivery card heading */
.connect-sb-deliveries-card-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 16px;
}

.connect-sb-deliveries-card-reference {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 11px;
}

.connect-sb-deliveries-card-icon {
  display: grid;
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 12px;
  background: #F3E7D9;
  color: #D17A4A;
  font-size: 13px;
}

.connect-sb-deliveries-card-reference > div:last-child {
  min-width: 0;
}

.connect-sb-deliveries-card-reference span {
  display: block;
  margin-bottom: 3px;
  color: #9A887D;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1px;
}

.connect-sb-deliveries-card-reference h3 {
  overflow: hidden;
  margin: 0 0 3px;
  color: #4E342E;
  font-size: 13px;
  font-weight: 750;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.connect-sb-deliveries-card-reference p {
  margin: 0;
  color: #9A887D;
  font-size: 10px;
}


/* Status badges */
.connect-sb-deliveries-status {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 5px;
  padding: 5px 8px;
  border-radius: 999px;
  font-size: 9px;
  font-weight: 750;
  white-space: nowrap;
}

.connect-sb-deliveries-status-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
}

.connect-sb-deliveries-status.completed,
.connect-sb-deliveries-status.paid {
  background: #E6F0E8;
  color: #3F6847;
}

.connect-sb-deliveries-status.processing,
.connect-sb-deliveries-status.pending,
.connect-sb-deliveries-status.in-progress,
.connect-sb-deliveries-status.in-transit,
.connect-sb-deliveries-status.out-for-delivery {
  background: #F3E7D9;
  color: #8A5A32;
}

.connect-sb-deliveries-status.unpaid {
  background: #F8E2DD;
  color: #9A4938;
}


/* Route section */
.connect-sb-deliveries-route {
  padding: 14px 12px;
  border-radius: 11px;
  background: #FBF7F3;
}

.connect-sb-deliveries-route-point {
  display: flex;
  align-items: center;
  gap: 9px;
}

.connect-sb-deliveries-route-marker {
  display: grid;
  width: 25px;
  height: 25px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 50%;
  font-size: 9px;
}

.connect-sb-deliveries-route-marker.pickup {
  background: #E9DDD3;
  color: #6C4A39;
}

.connect-sb-deliveries-route-marker.destination {
  background: #F3E7D9;
  color: #D17A4A;
}

.connect-sb-deliveries-route-point span:not(.connect-sb-deliveries-route-marker) {
  display: block;
  margin-bottom: 2px;
  color: #9A887D;
  font-size: 7px;
  font-weight: 800;
  letter-spacing: 0.9px;
}

.connect-sb-deliveries-route-point strong {
  display: block;
  overflow: hidden;
  color: #5C3D24;
  font-size: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.connect-sb-deliveries-route-line {
  position: relative;
  display: flex;
  align-items: center;
  height: 22px;
  margin-left: 12px;
  padding-left: 12px;
  border-left: 1px dashed #CFC2BA;
  color: #D17A4A;
  font-size: 9px;
}

.connect-sb-deliveries-route-progress {
  position: absolute;
  top: 0;
  bottom: 50%;
  left: -1px;
  width: 1px;
  background: #D17A4A;
}

.connect-sb-deliveries-route-progress.complete {
  bottom: 0;
}


/* Card information */
.connect-sb-deliveries-card-info {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 7px;
  padding: 15px 0;
  border-bottom: 1px solid #E8E2DD;
}

.connect-sb-deliveries-card-info div {
  min-width: 0;
}

.connect-sb-deliveries-card-info span {
  display: block;
  margin-bottom: 4px;
  color: #9A887D;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.connect-sb-deliveries-card-info strong {
  display: block;
  overflow: hidden;
  color: #5C3D24;
  font-size: 9px;
  font-weight: 750;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.connect-sb-deliveries-card-info strong.paid,
.connect-sb-deliveries-card-info strong.completed {
  color: #3F6847;
}

.connect-sb-deliveries-card-info strong.unpaid {
  color: #9A4938;
}


/* Card footer */
.connect-sb-deliveries-card-footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-top: auto;
  padding-top: 16px;
}

.connect-sb-deliveries-delivery-value span {
  display: block;
  margin-bottom: 4px;
  color: #9A887D;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.7px;
}

.connect-sb-deliveries-delivery-value strong {
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 18px;
  font-weight: 600;
}

.connect-sb-deliveries-track-button {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 12px;
  border: 1px solid #D17A4A;
  border-radius: 8px;
  background: #D17A4A;
  color: #FFFEFC;
  font-family: inherit;
  font-size: 9px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(209, 122, 74, 0.14);
  transition:
    transform 180ms ease,
    background 180ms ease,
    box-shadow 180ms ease;
}

.connect-sb-deliveries-track-button svg {
  font-size: 8px;
  transition: transform 180ms ease;
}

.connect-sb-deliveries-track-button:hover {
  transform: translateY(-1px);
  background: #BF683A;
  box-shadow: 0 6px 14px rgba(209, 122, 74, 0.22);
}

.connect-sb-deliveries-track-button:hover svg {
  transform: translateX(2px);
}

.connect-sb-deliveries-track-button.active {
  background: #4E342E;
  border-color: #4E342E;
}


/* Empty state */
.connect-sb-deliveries-empty {
  grid-column: 1 / -1;
  padding: 55px 25px;
  text-align: center;
}

.connect-sb-deliveries-empty-icon {
  display: grid;
  width: 48px;
  height: 48px;
  margin: 0 auto 13px;
  place-items: center;
  border-radius: 14px;
  background: #F3E7D9;
  color: #D17A4A;
}

.connect-sb-deliveries-empty h3 {
  margin: 0 0 6px;
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 20px;
}

.connect-sb-deliveries-empty p {
  margin: 0;
  color: #8A776C;
  font-size: 12px;
}


/* Selected delivery details */
.connect-sb-deliveries-details {
  margin-top: 24px;
  padding: 26px;
  border-radius: 17px;
  background: #FFFEFC;
  box-shadow: 0 5px 22px rgba(78, 52, 46, 0.08);
}

.connect-sb-deliveries-details-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #E8E2DD;
}

.connect-sb-deliveries-details-title {
  display: flex;
  align-items: center;
  gap: 13px;
}

.connect-sb-deliveries-details-icon {
  display: grid;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 12px;
  background: #F3E7D9;
  color: #D17A4A;
}

.connect-sb-deliveries-details-title p {
  margin: 0 0 4px;
  color: #D17A4A;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.connect-sb-deliveries-details-title h2 {
  margin: 0 0 3px;
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 25px;
  font-weight: 600;
}

.connect-sb-deliveries-details-title span {
  color: #8A776C;
  font-size: 12px;
}

.connect-sb-deliveries-close {
  display: grid;
  width: 33px;
  height: 33px;
  flex-shrink: 0;
  place-items: center;
  border: 1px solid #D8CCC4;
  border-radius: 50%;
  background: #FFFEFC;
  color: #5C3D24;
  cursor: pointer;
  transition:
    transform 180ms ease,
    background 180ms ease,
    border-color 180ms ease;
}

.connect-sb-deliveries-close:hover {
  transform: rotate(5deg);
  border-color: #D17A4A;
  background: #F3E7D9;
}


/* Current delivery status */
.connect-sb-deliveries-current-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin: 20px 0;
  padding: 14px 16px;
  border: 1px solid #E8DDD5;
  border-radius: 11px;
  background: #FBF7F3;
}

.connect-sb-deliveries-current-status > div span {
  display: block;
  margin-bottom: 4px;
  color: #9A887D;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.8px;
}

.connect-sb-deliveries-current-status > div strong {
  color: #4E342E;
  font-size: 13px;
}


/* Delivery journey */
.connect-sb-deliveries-journey {
  margin-bottom: 20px;
  padding: 20px;
  border-radius: 13px;
  background: #FBF7F3;
}

.connect-sb-deliveries-journey-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 22px;
}

.connect-sb-deliveries-journey-heading p {
  margin: 0 0 4px;
  color: #D17A4A;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1.2px;
}

.connect-sb-deliveries-journey-heading h3 {
  margin: 0;
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 19px;
  font-weight: 600;
}

.connect-sb-deliveries-journey-heading > span {
  color: #9A887D;
  font-size: 10px;
}

.connect-sb-deliveries-journey-track {
  display: grid;
  grid-template-columns: 1fr 0.45fr 1fr 0.45fr 1fr;
  align-items: center;
  gap: 8px;
}

.connect-sb-deliveries-journey-step {
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 0;
  opacity: 0.48;
}

.connect-sb-deliveries-journey-step.complete {
  opacity: 1;
}

.connect-sb-deliveries-journey-node {
  display: grid;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  place-items: center;
  border: 1px solid #D8CCC4;
  border-radius: 50%;
  background: #FFFEFC;
  color: #A99A91;
  font-size: 10px;
}

.connect-sb-deliveries-journey-step.complete .connect-sb-deliveries-journey-node {
  border-color: #D17A4A;
  background: #D17A4A;
  color: #FFFEFC;
}

.connect-sb-deliveries-journey-step strong {
  display: block;
  margin-bottom: 2px;
  color: #5C3D24;
  font-size: 10px;
}

.connect-sb-deliveries-journey-step span:last-child {
  display: block;
  overflow: hidden;
  color: #9A887D;
  font-size: 8px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.connect-sb-deliveries-journey-connector {
  height: 1px;
  background: #D8CCC4;
}

.connect-sb-deliveries-journey-connector span {
  display: block;
  width: 0;
  height: 1px;
  background: #D17A4A;
  transition: width 300ms ease;
}

.connect-sb-deliveries-journey-connector span.active {
  width: 100%;
}


/* Details panels */
.connect-sb-deliveries-details-layout {
  display: grid;
  grid-template-columns: 1.4fr 0.8fr;
  gap: 18px;
}

.connect-sb-deliveries-information-panel,
.connect-sb-deliveries-pricing-panel {
  overflow: hidden;
  border: 1px solid #E8E2DD;
  border-radius: 12px;
}

.connect-sb-deliveries-panel-heading {
  padding: 12px 15px;
  border-bottom: 1px solid #E8E2DD;
  background: #F8F3EF;
}

.connect-sb-deliveries-panel-heading span {
  color: #8A776C;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1px;
}

.connect-sb-deliveries-detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  background: #E8E2DD;
}

.connect-sb-deliveries-detail-item {
  min-height: 65px;
  padding: 13px 15px;
  box-sizing: border-box;
  background: #FFFEFC;
}

.connect-sb-deliveries-detail-item span {
  display: block;
  margin-bottom: 5px;
  color: #9A887D;
  font-size: 10px;
}

.connect-sb-deliveries-detail-item strong {
  color: #5C3D24;
  font-size: 12px;
}


/* Delivery pricing */
.connect-sb-deliveries-pricing-panel {
  padding-bottom: 8px;
}

.connect-sb-deliveries-price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 10px 15px;
  color: #7A665B;
  font-size: 12px;
}

.connect-sb-deliveries-price-row strong {
  color: #5C3D24;
}

.connect-sb-deliveries-price-divider {
  height: 1px;
  margin: 6px 15px;
  background: #E8E2DD;
}

.connect-sb-deliveries-price-row.total {
  color: #4E342E;
  font-size: 10px;
  font-weight: 700;
}

.connect-sb-deliveries-price-row.total strong {
  color: #D17A4A;
  font-size: 12px;
}


/* Live tracking banner */
.connect-sb-deliveries-live-banner {
  display: flex;
  align-items: center;
  gap: 13px;
  margin-top: 18px;
  padding: 15px 17px;
  border-radius: 12px;
  background: #4E342E;
  color: #FFFEFC;
}

.connect-sb-deliveries-live-banner-icon {
  display: grid;
  width: 39px;
  height: 39px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 10px;
  background: rgba(255, 254, 252, 0.11);
  color: #D17A4A;
}

.connect-sb-deliveries-live-banner-content {
  flex: 1;
}

.connect-sb-deliveries-live-banner-content > span {
  display: block;
  margin-bottom: 3px;
  color: #D7C8BF;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1.1px;
}

.connect-sb-deliveries-live-banner-content strong {
  display: block;
  font-size: 12px;
}

.connect-sb-deliveries-live-banner-content p {
  margin: 3px 0 0;
  color: #C9BBB3;
  font-size: 10px;
}

.connect-sb-deliveries-open-tracking {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 12px;
  border: 1px solid rgba(255, 254, 252, 0.2);
  border-radius: 8px;
  background: #FFFEFC;
  color: #4E342E;
  font-size: 9px;
  font-weight: 800;
  text-decoration: none;
  white-space: nowrap;
  transition:
    transform 180ms ease,
    background 180ms ease;
}

.connect-sb-deliveries-open-tracking:hover {
  transform: translateY(-1px);
  background: #F3E7D9;
}


/* Details animation */
.connect-sb-deliveries-details-enter-active,
.connect-sb-deliveries-details-leave-active {
  transition:
    opacity 220ms ease,
    transform 220ms ease;
}

.connect-sb-deliveries-details-enter-from,
.connect-sb-deliveries-details-leave-to {
  opacity: 0;
  transform: translateY(8px);
}


/* Tablet */
@media (max-width: 1100px) {
  .connect-sb-deliveries-card-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}


@media (max-width: 900px) {
  .connect-sb-deliveries-page {
    padding: 25px;
  }

  .connect-sb-deliveries-hero {
    align-items: flex-start;
    flex-direction: column;
  }

  .connect-sb-deliveries-live-indicator {
    width: 100%;
  }

  .connect-sb-deliveries-overview {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .connect-sb-deliveries-details-layout {
    grid-template-columns: 1fr;
  }

  .connect-sb-deliveries-journey-track {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .connect-sb-deliveries-journey-connector {
    width: 1px;
    height: 25px;
    margin-left: 15px;
  }

  .connect-sb-deliveries-journey-connector span {
    width: 1px;
    height: 0;
  }

  .connect-sb-deliveries-journey-connector span.active {
    width: 1px;
    height: 100%;
  }
}


/* Mobile */
@media (max-width: 700px) {
  .connect-sb-deliveries-card-grid {
    grid-template-columns: 1fr;
  }
}


@media (max-width: 640px) {
  .connect-sb-deliveries-page {
    padding: 20px 16px;
  }

  .connect-sb-deliveries-title {
    font-size: 33px;
  }

  .connect-sb-deliveries-overview {
    grid-template-columns: 1fr;
  }

  .connect-sb-deliveries-workspace-header {
    align-items: flex-start;
    padding: 20px;
  }

  .connect-sb-deliveries-card-grid {
    padding: 18px 20px 20px;
  }

  .connect-sb-deliveries-card-heading {
    align-items: flex-start;
  }

  .connect-sb-deliveries-card-info {
    gap: 5px;
  }

  .connect-sb-deliveries-details {
    padding: 20px;
  }

  .connect-sb-deliveries-details-title {
    align-items: flex-start;
  }

  .connect-sb-deliveries-details-title h2 {
    font-size: 22px;
  }

  .connect-sb-deliveries-current-status {
    align-items: flex-start;
    flex-direction: column;
  }

  .connect-sb-deliveries-detail-grid {
    grid-template-columns: 1fr;
  }

  .connect-sb-deliveries-live-banner {
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .connect-sb-deliveries-open-tracking {
    width: 100%;
    justify-content: center;
  }
}

</style>