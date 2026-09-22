<template>
  <div class="connect-supplier-deliveries-page">

    <!-- Supplier delivery dashboard header -->
    <header class="connect-supplier-deliveries-hero">

      <div class="connect-supplier-deliveries-hero-copy">
        <p class="connect-supplier-deliveries-eyebrow">
          LOGISTICS CENTRE
        </p>

        <h1 class="connect-supplier-deliveries-title">
          Supplier Deliveries
        </h1>

        <p class="connect-supplier-deliveries-description">
          Manage outgoing shipments and follow every delivery from your warehouse to the businesses you supply.
        </p>
      </div>

      <!-- Supplier dispatch status -->
      <div class="connect-supplier-deliveries-dispatch-status">

        <div class="connect-supplier-deliveries-dispatch-icon">
          <FontAwesomeIcon :icon="faTruckFast" />
        </div>

        <div>
          <span>SHIPMENT QUEUE</span>

          <strong>
            {{ activeDeliveries }} active
          </strong>
        </div>

      </div>

    </header>


    <!-- Delivery overview -->
    <section class="connect-supplier-deliveries-overview">

      <article
        class="connect-supplier-deliveries-overview-card connect-supplier-deliveries-overview-primary"
      >

        <div class="connect-supplier-deliveries-overview-top">

          <span>
            Shipments dispatched
          </span>

          <span class="connect-supplier-deliveries-overview-icon">
            <FontAwesomeIcon :icon="faBoxesStacked" />
          </span>

        </div>

        <strong class="connect-supplier-deliveries-overview-number">
          {{ deliveries.length }}
        </strong>

        <p>
          Deliveries connected to customer orders
        </p>

      </article>


      <article class="connect-supplier-deliveries-overview-card">

        <div class="connect-supplier-deliveries-overview-top">

          <span>
            In progress
          </span>

          <span class="connect-supplier-deliveries-overview-icon">
            <FontAwesomeIcon :icon="faRoute" />
          </span>

        </div>

        <strong class="connect-supplier-deliveries-overview-number">
          {{ activeDeliveries }}
        </strong>

        <p>
          Currently moving to customers
        </p>

      </article>


      <article class="connect-supplier-deliveries-overview-card">

        <div class="connect-supplier-deliveries-overview-top">

          <span>
            Completed
          </span>

          <span class="connect-supplier-deliveries-overview-icon">
            <FontAwesomeIcon :icon="faCircleCheck" />
          </span>

        </div>

        <strong class="connect-supplier-deliveries-overview-number">
          {{ completedDeliveries }}
        </strong>

        <p>
          Successfully handed over
        </p>

      </article>

    </section>


    <!-- Supplier shipment workspace -->
    <section class="connect-supplier-deliveries-workspace">

      <div class="connect-supplier-deliveries-workspace-header">

        <div>
          <p class="connect-supplier-deliveries-section-eyebrow">
            OUTGOING SHIPMENTS
          </p>

          <h2>
            Delivery Operations
          </h2>

          <p>
            Monitor shipments travelling from your supplier operation to customer businesses.
          </p>
        </div>

        <div class="connect-supplier-deliveries-queue-count">

          <strong>
            {{ deliveries.length }}
          </strong>

          <span>
            shipments
          </span>

        </div>

      </div>


      <!-- Supplier delivery cards -->
      <div class="connect-supplier-deliveries-card-grid">

        <article
          v-for="delivery in deliveries"
          :key="delivery.deliveryId"
          class="connect-supplier-deliveries-card"
          :class="{
            selected:
              selectedDelivery?.deliveryId === delivery.deliveryId
          }"
        >

          <!-- Shipment identity -->
          <div class="connect-supplier-deliveries-card-header">

            <div class="connect-supplier-deliveries-shipment">

              <div class="connect-supplier-deliveries-shipment-icon">
                <FontAwesomeIcon :icon="faBoxOpen" />
              </div>

              <div>

                <span>
                  SHIPMENT
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
              class="connect-supplier-deliveries-status"
              :class="getStatusClass(delivery.deliveryStatus)"
            >
              <span class="connect-supplier-deliveries-status-dot"></span>
              {{ delivery.deliveryStatus }}
            </span>

          </div>


          <!-- Recipient section -->
          <div class="connect-supplier-deliveries-recipient">

            <div class="connect-supplier-deliveries-recipient-marker">
              <FontAwesomeIcon :icon="faLocationDot" />
            </div>

            <div>

              <span>
                DELIVERY TO
              </span>

              <strong>
                {{ delivery.buyer }}
              </strong>

              <p>
                Small business customer
              </p>

            </div>

          </div>


          <!-- Shipment journey -->
          <div class="connect-supplier-deliveries-journey">

            <div class="connect-supplier-deliveries-journey-heading">
              <span>
                DELIVERY JOURNEY
              </span>

              <strong>
                {{ getJourneyLabel(delivery.deliveryStatus) }}
              </strong>
            </div>


            <div class="connect-supplier-deliveries-progress">

              <!-- Dispatch -->
              <div
                class="connect-supplier-deliveries-progress-step complete"
              >
                <span class="connect-supplier-deliveries-progress-node">
                  <FontAwesomeIcon :icon="faWarehouse" />
                </span>

                <span>
                  Dispatched
                </span>
              </div>


              <div class="connect-supplier-deliveries-progress-line">
                <span
                  :class="{
                    active: isInTransit(delivery.deliveryStatus)
                  }"
                ></span>
              </div>


              <!-- Transit -->
              <div
                class="connect-supplier-deliveries-progress-step"
                :class="{
                  complete: isInTransit(delivery.deliveryStatus)
                }"
              >
                <span class="connect-supplier-deliveries-progress-node">
                  <FontAwesomeIcon :icon="faTruckFast" />
                </span>

                <span>
                  In Transit
                </span>
              </div>


              <div class="connect-supplier-deliveries-progress-line">
                <span
                  :class="{
                    active:
                      delivery.deliveryStatus.toLowerCase().includes('out for delivery') ||
                      delivery.deliveryStatus.toLowerCase().includes('completed')
                  }"
                ></span>
              </div>


              <!-- Customer -->
              <div
                class="connect-supplier-deliveries-progress-step"
                :class="{
                  complete:
                    delivery.deliveryStatus.toLowerCase() === 'completed'
                }"
              >
                <span class="connect-supplier-deliveries-progress-node">
                  <FontAwesomeIcon :icon="faLocationDot" />
                </span>

                <span>
                  Delivered
                </span>
              </div>

            </div>

          </div>


          <!-- Shipment information -->
          <div class="connect-supplier-deliveries-card-info">

            <div>

              <span>
                CUSTOMER
              </span>

              <strong>
                {{ delivery.buyer }}
              </strong>

            </div>


            <div>

              <span>
                PAYMENT
              </span>

              <strong
                :class="getStatusClass(delivery.paymentStatus)"
              >
                {{ delivery.paymentStatus }}
              </strong>

            </div>


            <div>

              <span>
                DELIVERY FEE
              </span>

              <strong>
                R {{ Number(delivery.deliveryFee).toFixed(2) }}
              </strong>

            </div>

          </div>


          <!-- Shipment footer -->
          <div class="connect-supplier-deliveries-card-footer">

            <div class="connect-supplier-deliveries-shipment-value">

              <span>
                ORDER VALUE
              </span>

              <strong>
                R {{ Number(delivery.total).toFixed(2) }}
              </strong>

            </div>


            <button
              type="button"
              class="connect-supplier-deliveries-track-button"
              :class="{
                active:
                  selectedDelivery?.deliveryId === delivery.deliveryId
              }"
              @click="trackDelivery(delivery)"
            >

              <span>
                {{
                  selectedDelivery?.deliveryId === delivery.deliveryId
                    ? 'Viewing Shipment'
                    : 'Manage Shipment'
                }}
              </span>

              <FontAwesomeIcon :icon="faArrowRight" />

            </button>

            <!-- Open the shared tracking page for this delivery. -->
            <router-link
              v-if="delivery.deliveryId"
              :to="`/tracking/${delivery.deliveryId}`"
              class="connect-supplier-deliveries-track-button"
            >
              <FontAwesomeIcon :icon="faLocationDot" />
              Track Delivery
            </router-link>

          </div>

        </article>


        <!-- Empty state -->
        <div
          v-if="deliveries.length === 0"
          class="connect-supplier-deliveries-empty"
        >

          <div class="connect-supplier-deliveries-empty-icon">
            <FontAwesomeIcon :icon="faTruckFast" />
          </div>

          <h3>
            No shipments yet
          </h3>

          <p>
            Deliveries connected to customer orders will appear here.
          </p>

        </div>

      </div>

    </section>


    <!-- Selected shipment details -->
    <Transition name="connect-supplier-deliveries-details">

      <section
        v-if="selectedDelivery"
        class="connect-supplier-deliveries-details"
      >

        <!-- Shipment details header -->
        <div class="connect-supplier-deliveries-details-header">

          <div class="connect-supplier-deliveries-details-title-group">

            <div class="connect-supplier-deliveries-details-icon">
              <FontAwesomeIcon :icon="faBoxOpen" />
            </div>

            <div>

              <p>
                SHIPMENT MANAGEMENT
              </p>

              <h2>
                {{ selectedDelivery.deliveryId }}
              </h2>

              <span>
                Delivering to {{ selectedDelivery.buyer }}
              </span>

            </div>

          </div>


          <button
            type="button"
            class="connect-supplier-deliveries-close"
            aria-label="Close shipment details"
            @click="selectedDelivery = null"
          >
            <FontAwesomeIcon :icon="faXmark" />
          </button>

        </div>


        <!-- Current shipment status -->
        <div class="connect-supplier-deliveries-current-status">

          <div>

            <span>
              CURRENT DELIVERY STATUS
            </span>

            <strong>
              {{ selectedDelivery.deliveryStatus }}
            </strong>

          </div>


          <span
            class="connect-supplier-deliveries-status"
            :class="getStatusClass(selectedDelivery.deliveryStatus)"
          >
            <span class="connect-supplier-deliveries-status-dot"></span>

            {{ selectedDelivery.deliveryStatus }}
          </span>

        </div>


        <!-- Shipment journey -->
        <div class="connect-supplier-deliveries-journey-panel">

          <div class="connect-supplier-deliveries-journey-panel-heading">

            <div>

              <p>
                SHIPMENT JOURNEY
              </p>

              <h3>
                From your warehouse to the customer
              </h3>

            </div>

            <span>
              {{ selectedDelivery.orderNumber }}
            </span>

          </div>


          <div class="connect-supplier-deliveries-journey-track">

            <!-- Supplier warehouse -->
            <div class="connect-supplier-deliveries-journey-step complete">

              <div class="connect-supplier-deliveries-journey-node">
                <FontAwesomeIcon :icon="faWarehouse" />
              </div>

              <div>
                <strong>
                  Your Warehouse
                </strong>

                <span>
                  Shipment dispatched
                </span>
              </div>

            </div>


            <div class="connect-supplier-deliveries-journey-connector">

              <span
                :class="{
                  active: isInTransit(
                    selectedDelivery.deliveryStatus
                  )
                }"
              ></span>

            </div>


            <!-- Delivery -->
            <div
              class="connect-supplier-deliveries-journey-step"
              :class="{
                complete: isInTransit(
                  selectedDelivery.deliveryStatus
                )
              }"
            >

              <div class="connect-supplier-deliveries-journey-node">
                <FontAwesomeIcon :icon="faTruckFast" />
              </div>

              <div>
                <strong>
                  In Transit
                </strong>

                <span>
                  Shipment on the road
                </span>
              </div>

            </div>


            <div class="connect-supplier-deliveries-journey-connector">

              <span
                :class="{
                  active:
                    selectedDelivery.deliveryStatus
                      .toLowerCase()
                      .includes('out for delivery') ||
                    selectedDelivery.deliveryStatus
                      .toLowerCase()
                      .includes('completed')
                }"
              ></span>

            </div>


            <!-- Customer -->
            <div
              class="connect-supplier-deliveries-journey-step"
              :class="{
                complete:
                  selectedDelivery.deliveryStatus.toLowerCase() ===
                  'completed'
              }"
            >

              <div class="connect-supplier-deliveries-journey-node">
                <FontAwesomeIcon :icon="faLocationDot" />
              </div>

              <div>
                <strong>
                  Customer
                </strong>

                <span>
                  {{ selectedDelivery.buyer }}
                </span>
              </div>

            </div>

          </div>

        </div>


        <!-- Shipment information and financial summary -->
        <div class="connect-supplier-deliveries-details-layout">

          <div class="connect-supplier-deliveries-information-panel">

            <div class="connect-supplier-deliveries-panel-heading">
              <span>
                SHIPMENT INFORMATION
              </span>
            </div>


            <div class="connect-supplier-deliveries-detail-grid">

              <div class="connect-supplier-deliveries-detail-item">

                <span>
                  Delivery Number
                </span>

                <strong>
                  {{ selectedDelivery.deliveryId }}
                </strong>

              </div>


              <div class="connect-supplier-deliveries-detail-item">

                <span>
                  Order Number
                </span>

                <strong>
                  {{ selectedDelivery.orderNumber }}
                </strong>

              </div>


              <div class="connect-supplier-deliveries-detail-item">

                <span>
                  Customer Business
                </span>

                <strong>
                  {{ selectedDelivery.buyer }}
                </strong>

              </div>


              <div class="connect-supplier-deliveries-detail-item">

                <span>
                  Payment Status
                </span>

                <strong>
                  {{ selectedDelivery.paymentStatus }}
                </strong>

              </div>

            </div>

          </div>


          <!-- Financial summary -->
          <div class="connect-supplier-deliveries-financial-panel">

            <div class="connect-supplier-deliveries-panel-heading">
              <span>
                SHIPMENT VALUE
              </span>
            </div>


            <div class="connect-supplier-deliveries-cost-row">

              <span>
                Order total
              </span>

              <strong>
                R {{ Number(selectedDelivery.total).toFixed(2) }}
              </strong>

            </div>


            <div class="connect-supplier-deliveries-cost-row">

              <span>
                Delivery fee
              </span>

              <strong>
                R {{ Number(selectedDelivery.deliveryFee).toFixed(2) }}
              </strong>

            </div>


            <div class="connect-supplier-deliveries-cost-divider"></div>


            <div class="connect-supplier-deliveries-cost-row total">

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
        <div class="connect-supplier-deliveries-tracking-banner">

          <div class="connect-supplier-deliveries-tracking-icon">
            <FontAwesomeIcon :icon="faLocationArrow" />
          </div>


          <div class="connect-supplier-deliveries-tracking-copy">

            <span>
              LIVE DELIVERY TRACKING
            </span>

            <strong>
              Monitor this shipment on the map
            </strong>

            <p>
              Follow the vehicle and delivery route through the shared WeConnect tracking system.
            </p>

          </div>


          <router-link
            :to="`/tracking/${selectedDelivery.deliveryId}`"
            class="connect-supplier-deliveries-open-tracking"
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
  faBoxOpen,
  faBoxesStacked,
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

// Store the shipment currently being reviewed
const selectedDelivery = ref(null)

// Count deliveries that are still active
const activeDeliveries = computed(() => {
  return deliveries.value.filter(delivery => {
    return delivery.deliveryStatus.toLowerCase() !== 'completed'
  }).length
})

// Count completed deliveries
const completedDeliveries = computed(() => {
  return deliveries.value.filter(delivery => {
    return delivery.deliveryStatus.toLowerCase() === 'completed'
  }).length
})

// Open the selected shipment
function trackDelivery(delivery) {
  selectedDelivery.value = delivery
}

// Convert status text into a CSS class
function getStatusClass(status) {
  return status.toLowerCase().replace(/\s+/g, '-')
}

// Load deliveries and their related order information.
async function loadDeliveries() {
  try {
    const response = await fetch('http://localhost:3000/api/deliveries')

    if (!response.ok) {
      throw new Error('Failed to load deliveries')
    }

    const data = await response.json()

    deliveries.value = data.map(delivery => ({
      deliveryId: delivery.delivery_id,
      orderId: delivery.order_id,
      orderNumber: delivery.order_number || 'N/A',
      supplier: delivery.supplier_name || 'Supplier',
      buyer: delivery.buyer_name || 'Buyer',
      trackingReference: delivery.tracking_reference || null,
      deliveryStatus: delivery.current_status || 'Not assigned',
      estimatedArrival: delivery.estimated_arrival || null,
      paymentStatus: delivery.payment_status || 'Pending',
      deliveryFee: 0,
      total: Number(delivery.total_amount || 0)
    }))
  } catch (error) {
    console.error('Error loading supplier deliveries:', error)
    deliveries.value = []
  }
}

// Check whether the shipment has moved beyond the warehouse
function isInTransit(status) {
  const normalizedStatus = status.toLowerCase()

  return (
    normalizedStatus.includes('processing') ||
    normalizedStatus.includes('in-progress') ||
    normalizedStatus.includes('in transit') ||
    normalizedStatus.includes('out for delivery') ||
    normalizedStatus.includes('completed')
  )
}

// Give the shipment journey a short supplier-friendly description
function getJourneyLabel(status) {
  const normalizedStatus = status.toLowerCase()

  if (normalizedStatus.includes('completed')) {
    return 'Delivered'
  }

  if (
    normalizedStatus.includes('out for delivery')
  ) {
    return 'Final delivery'
  }

  if (
    normalizedStatus.includes('in transit') ||
    normalizedStatus.includes('in-progress')
  ) {
    return 'On the road'
  }

  if (
    normalizedStatus.includes('processing') ||
    normalizedStatus.includes('pending')
  ) {
    return 'Preparing'
  }

  return status
}

onMounted(() => {
  loadDeliveries()
})
</script>


<style scoped>

/* Main supplier delivery page */
.connect-supplier-deliveries-page {
  min-height: 100vh;
  padding: 34px;
  box-sizing: border-box;
  background: #E8E2DD;
  color: #5C3D24;
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}


/* Supplier logistics header */
.connect-supplier-deliveries-hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 30px;
  margin-bottom: 27px;
}

.connect-supplier-deliveries-hero-copy {
  max-width: 700px;
}

.connect-supplier-deliveries-eyebrow {
  margin: 0 0 8px;
  color: #D17A4A;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.9px;
}

.connect-supplier-deliveries-title {
  margin: 0 0 9px;
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 42px;
  font-weight: 600;
  line-height: 1.05;
}

.connect-supplier-deliveries-description {
  max-width: 640px;
  margin: 0;
  color: #7A665B;
  font-size: 14px;
  line-height: 1.65;
}


/* Shipment queue indicator */
.connect-supplier-deliveries-dispatch-status {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 180px;
  padding: 13px 16px;
  box-sizing: border-box;
  border: 1px solid rgba(78, 52, 46, 0.06);
  border-radius: 12px;
  background: #FFFEFC;
  box-shadow: 0 5px 18px rgba(78, 52, 46, 0.06);
}

.connect-supplier-deliveries-dispatch-icon {
  display: grid;
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 10px;
  background: #F3E7D9;
  color: #D17A4A;
}

.connect-supplier-deliveries-dispatch-status span {
  display: block;
  margin-bottom: 3px;
  color: #9A887D;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1.1px;
}

.connect-supplier-deliveries-dispatch-status strong {
  color: #4E342E;
  font-size: 13px;
}


/* Overview cards */
.connect-supplier-deliveries-overview {
  display: grid;
  grid-template-columns: 1.3fr 1fr 1fr;
  gap: 15px;
  margin-bottom: 25px;
}

.connect-supplier-deliveries-overview-card {
  min-height: 126px;
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

.connect-supplier-deliveries-overview-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(78, 52, 46, 0.09);
}

.connect-supplier-deliveries-overview-primary {
  border-top: 3px solid #D17A4A;
}

.connect-supplier-deliveries-overview-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.connect-supplier-deliveries-overview-top > span:first-child {
  color: #7A665B;
  font-size: 11px;
  font-weight: 650;
}

.connect-supplier-deliveries-overview-icon {
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  border-radius: 9px;
  background: #F6EEE8;
  color: #D17A4A;
  font-size: 12px;
}

.connect-supplier-deliveries-overview-number {
  display: block;
  margin-top: 14px;
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 30px;
  font-weight: 600;
  line-height: 1;
}

.connect-supplier-deliveries-overview-card p {
  margin: 7px 0 0;
  color: #9A887D;
  font-size: 10px;
}


/* Main shipment workspace */
.connect-supplier-deliveries-workspace {
  overflow: hidden;
  border-radius: 17px;
  background: #FFFEFC;
  box-shadow: 0 5px 22px rgba(78, 52, 46, 0.08);
}

.connect-supplier-deliveries-workspace-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  padding: 25px 25px 20px;
  border-bottom: 1px solid #E8E2DD;
}

.connect-supplier-deliveries-section-eyebrow {
  margin: 0 0 5px;
  color: #D17A4A;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.6px;
}

.connect-supplier-deliveries-workspace-header h2 {
  margin: 0 0 4px;
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 25px;
  font-weight: 600;
}

.connect-supplier-deliveries-workspace-header p:last-child {
  margin: 0;
  color: #8A776C;
  font-size: 12px;
}

.connect-supplier-deliveries-queue-count {
  display: flex;
  align-items: baseline;
  gap: 5px;
  color: #9A887D;
  font-size: 11px;
}

.connect-supplier-deliveries-queue-count strong {
  color: #4E342E;
  font-size: 18px;
}


/* Shipment cards */
.connect-supplier-deliveries-card-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 17px;
  padding: 22px 25px 25px;
}

.connect-supplier-deliveries-card {
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

.connect-supplier-deliveries-card:hover {
  transform: translateY(-3px);
  border-color: #D8C8BE;
  box-shadow: 0 9px 24px rgba(78, 52, 46, 0.09);
}

.connect-supplier-deliveries-card.selected {
  border-color: #D17A4A;
  box-shadow:
    0 0 0 2px rgba(209, 122, 74, 0.11),
    0 9px 24px rgba(78, 52, 46, 0.09);
}


/* Shipment identity */
.connect-supplier-deliveries-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 15px;
}

.connect-supplier-deliveries-shipment {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 11px;
}

.connect-supplier-deliveries-shipment-icon {
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

.connect-supplier-deliveries-shipment > div:last-child {
  min-width: 0;
}

.connect-supplier-deliveries-shipment span {
  display: block;
  margin-bottom: 3px;
  color: #9A887D;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1px;
}

.connect-supplier-deliveries-shipment h3 {
  overflow: hidden;
  margin: 0 0 3px;
  color: #4E342E;
  font-size: 13px;
  font-weight: 750;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.connect-supplier-deliveries-shipment p {
  margin: 0;
  color: #9A887D;
  font-size: 10px;
}


/* Status badges */
.connect-supplier-deliveries-status {
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

.connect-supplier-deliveries-status-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
}

.connect-supplier-deliveries-status.completed,
.connect-supplier-deliveries-status.paid {
  background: #E6F0E8;
  color: #3F6847;
}

.connect-supplier-deliveries-status.pending,
.connect-supplier-deliveries-status.processing,
.connect-supplier-deliveries-status.in-progress,
.connect-supplier-deliveries-status.in-transit,
.connect-supplier-deliveries-status.out-for-delivery {
  background: #F3E7D9;
  color: #8A5A32;
}

.connect-supplier-deliveries-status.unpaid {
  background: #F8E2DD;
  color: #9A4938;
}


/* Customer recipient */
.connect-supplier-deliveries-recipient {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 13px;
  padding: 12px;
  border-radius: 10px;
  background: #FBF7F3;
}

.connect-supplier-deliveries-recipient-marker {
  display: grid;
  width: 29px;
  height: 29px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 9px;
  background: #E9DDD3;
  color: #8A5A32;
  font-size: 10px;
}

.connect-supplier-deliveries-recipient > div:last-child {
  min-width: 0;
}

.connect-supplier-deliveries-recipient span {
  display: block;
  margin-bottom: 2px;
  color: #9A887D;
  font-size: 7px;
  font-weight: 800;
  letter-spacing: 0.9px;
}

.connect-supplier-deliveries-recipient strong {
  display: block;
  overflow: hidden;
  color: #5C3D24;
  font-size: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.connect-supplier-deliveries-recipient p {
  margin: 2px 0 0;
  color: #A99A91;
  font-size: 8px;
}


/* Shipment journey */
.connect-supplier-deliveries-journey {
  padding: 13px 12px;
  border-radius: 10px;
  background: #FCF8F4;
}

.connect-supplier-deliveries-journey-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 11px;
}

.connect-supplier-deliveries-journey-heading span {
  color: #8A776C;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.9px;
}

.connect-supplier-deliveries-journey-heading strong {
  color: #D17A4A;
  font-size: 8px;
}

.connect-supplier-deliveries-progress {
  display: flex;
  align-items: center;
  width: 100%;
}

.connect-supplier-deliveries-progress-step {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #A99A91;
  font-size: 8px;
  white-space: nowrap;
}

.connect-supplier-deliveries-progress-step.complete {
  color: #5C3D24;
}

.connect-supplier-deliveries-progress-node {
  display: grid;
  width: 21px;
  height: 21px;
  flex-shrink: 0;
  place-items: center;
  border: 1px solid #D8CCC4;
  border-radius: 50%;
  background: #FFFEFC;
  color: #A99A91;
  font-size: 8px;
}

.connect-supplier-deliveries-progress-step.complete
.connect-supplier-deliveries-progress-node {
  border-color: #D17A4A;
  background: #D17A4A;
  color: #FFFEFC;
}

.connect-supplier-deliveries-progress-line {
  flex: 1;
  height: 1px;
  margin: 0 5px;
  background: #D8CCC4;
}

.connect-supplier-deliveries-progress-line span {
  display: block;
  width: 0;
  height: 1px;
  background: #D17A4A;
  transition: width 280ms ease;
}

.connect-supplier-deliveries-progress-line span.active {
  width: 100%;
}


/* Shipment information */
.connect-supplier-deliveries-card-info {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 7px;
  padding: 14px 0;
  border-bottom: 1px solid #E8E2DD;
}

.connect-supplier-deliveries-card-info div {
  min-width: 0;
}

.connect-supplier-deliveries-card-info span {
  display: block;
  margin-bottom: 4px;
  color: #9A887D;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.connect-supplier-deliveries-card-info strong {
  display: block;
  overflow: hidden;
  color: #5C3D24;
  font-size: 9px;
  font-weight: 750;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.connect-supplier-deliveries-card-info strong.paid,
.connect-supplier-deliveries-card-info strong.completed {
  color: #3F6847;
}

.connect-supplier-deliveries-card-info strong.unpaid {
  color: #9A4938;
}


/* Shipment footer */
.connect-supplier-deliveries-card-footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-top: auto;
  padding-top: 16px;
}

.connect-supplier-deliveries-shipment-value span {
  display: block;
  margin-bottom: 4px;
  color: #9A887D;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.7px;
}

.connect-supplier-deliveries-shipment-value strong {
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 18px;
  font-weight: 600;
}

.connect-supplier-deliveries-track-button {
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

.connect-supplier-deliveries-track-button svg {
  font-size: 8px;
  transition: transform 180ms ease;
}

.connect-supplier-deliveries-track-button:hover {
  transform: translateY(-1px);
  background: #BF683A;
  box-shadow: 0 6px 14px rgba(209, 122, 74, 0.22);
}

.connect-supplier-deliveries-track-button:hover svg {
  transform: translateX(2px);
}

.connect-supplier-deliveries-track-button.active {
  border-color: #4E342E;
  background: #4E342E;
}


/* Empty state */
.connect-supplier-deliveries-empty {
  grid-column: 1 / -1;
  padding: 55px 25px;
  text-align: center;
}

.connect-supplier-deliveries-empty-icon {
  display: grid;
  width: 48px;
  height: 48px;
  margin: 0 auto 13px;
  place-items: center;
  border-radius: 14px;
  background: #F3E7D9;
  color: #D17A4A;
}

.connect-supplier-deliveries-empty h3 {
  margin: 0 0 6px;
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 20px;
}

.connect-supplier-deliveries-empty p {
  margin: 0;
  color: #8A776C;
  font-size: 12px;
}


/* Selected shipment details */
.connect-supplier-deliveries-details {
  margin-top: 24px;
  padding: 26px;
  border-radius: 17px;
  background: #FFFEFC;
  box-shadow: 0 5px 22px rgba(78, 52, 46, 0.08);
}

.connect-supplier-deliveries-details-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #E8E2DD;
}

.connect-supplier-deliveries-details-title-group {
  display: flex;
  align-items: center;
  gap: 13px;
}

.connect-supplier-deliveries-details-icon {
  display: grid;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 12px;
  background: #F3E7D9;
  color: #D17A4A;
}

.connect-supplier-deliveries-details-title-group p {
  margin: 0 0 4px;
  color: #D17A4A;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.connect-supplier-deliveries-details-title-group h2 {
  margin: 0 0 3px;
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 25px;
  font-weight: 600;
}

.connect-supplier-deliveries-details-title-group span {
  color: #8A776C;
  font-size: 12px;
}

.connect-supplier-deliveries-close {
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
    background 180ms ease,
    border-color 180ms ease,
    transform 180ms ease;
}

.connect-supplier-deliveries-close:hover {
  transform: rotate(5deg);
  border-color: #D17A4A;
  background: #F3E7D9;
}


/* Current shipment status */
.connect-supplier-deliveries-current-status {
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

.connect-supplier-deliveries-current-status > div span {
  display: block;
  margin-bottom: 4px;
  color: #9A887D;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.8px;
}

.connect-supplier-deliveries-current-status > div strong {
  color: #4E342E;
  font-size: 13px;
}


/* Shipment journey panel */
.connect-supplier-deliveries-journey-panel {
  margin-bottom: 20px;
  padding: 20px;
  border-radius: 13px;
  background: #FBF7F3;
}

.connect-supplier-deliveries-journey-panel-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 22px;
}

.connect-supplier-deliveries-journey-panel-heading p {
  margin: 0 0 4px;
  color: #D17A4A;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1.2px;
}

.connect-supplier-deliveries-journey-panel-heading h3 {
  margin: 0;
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 19px;
  font-weight: 600;
}

.connect-supplier-deliveries-journey-panel-heading > span {
  color: #9A887D;
  font-size: 10px;
}

.connect-supplier-deliveries-journey-track {
  display: grid;
  grid-template-columns: 1fr 0.45fr 1fr 0.45fr 1fr;
  align-items: center;
  gap: 8px;
}

.connect-supplier-deliveries-journey-step {
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 0;
  opacity: 0.45;
}

.connect-supplier-deliveries-journey-step.complete {
  opacity: 1;
}

.connect-supplier-deliveries-journey-node {
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

.connect-supplier-deliveries-journey-step.complete
.connect-supplier-deliveries-journey-node {
  border-color: #D17A4A;
  background: #D17A4A;
  color: #FFFEFC;
}

.connect-supplier-deliveries-journey-step strong {
  display: block;
  margin-bottom: 2px;
  color: #5C3D24;
  font-size: 10px;
}

.connect-supplier-deliveries-journey-step span:last-child {
  display: block;
  overflow: hidden;
  color: #9A887D;
  font-size: 8px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.connect-supplier-deliveries-journey-connector {
  height: 1px;
  background: #D8CCC4;
}

.connect-supplier-deliveries-journey-connector span {
  display: block;
  width: 0;
  height: 1px;
  background: #D17A4A;
  transition: width 300ms ease;
}

.connect-supplier-deliveries-journey-connector span.active {
  width: 100%;
}


/* Shipment details panels */
.connect-supplier-deliveries-details-layout {
  display: grid;
  grid-template-columns: 1.4fr 0.8fr;
  gap: 18px;
}

.connect-supplier-deliveries-information-panel,
.connect-supplier-deliveries-financial-panel {
  overflow: hidden;
  border: 1px solid #E8E2DD;
  border-radius: 12px;
}

.connect-supplier-deliveries-panel-heading {
  padding: 12px 15px;
  border-bottom: 1px solid #E8E2DD;
  background: #F8F3EF;
}

.connect-supplier-deliveries-panel-heading span {
  color: #8A776C;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1px;
}

.connect-supplier-deliveries-detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  background: #E8E2DD;
}

.connect-supplier-deliveries-detail-item {
  min-height: 65px;
  padding: 13px 15px;
  box-sizing: border-box;
  background: #FFFEFC;
}

.connect-supplier-deliveries-detail-item span {
  display: block;
  margin-bottom: 5px;
  color: #9A887D;
  font-size: 10px;
}

.connect-supplier-deliveries-detail-item strong {
  color: #5C3D24;
  font-size: 12px;
}


/* Shipment financial summary */
.connect-supplier-deliveries-financial-panel {
  padding-bottom: 8px;
}

.connect-supplier-deliveries-cost-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 10px 15px;
  color: #7A665B;
  font-size: 12px;
}

.connect-supplier-deliveries-cost-row strong {
  color: #5C3D24;
}

.connect-supplier-deliveries-cost-divider {
  height: 1px;
  margin: 6px 15px;
  background: #E8E2DD;
}

.connect-supplier-deliveries-cost-row.total {
  color: #4E342E;
  font-size: 10px;
  font-weight: 700;
}

.connect-supplier-deliveries-cost-row.total strong {
  color: #D17A4A;
  font-size: 12px;
}


/* Live tracking banner */
.connect-supplier-deliveries-tracking-banner {
  display: flex;
  align-items: center;
  gap: 13px;
  margin-top: 18px;
  padding: 15px 17px;
  border-radius: 12px;
  background: #4E342E;
  color: #FFFEFC;
}

.connect-supplier-deliveries-tracking-icon {
  display: grid;
  width: 39px;
  height: 39px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 10px;
  background: rgba(255, 254, 252, 0.11);
  color: #D17A4A;
}

.connect-supplier-deliveries-tracking-copy {
  flex: 1;
}

.connect-supplier-deliveries-tracking-copy > span {
  display: block;
  margin-bottom: 3px;
  color: #D7C8BF;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1.1px;
}

.connect-supplier-deliveries-tracking-copy strong {
  display: block;
  font-size: 12px;
}

.connect-supplier-deliveries-tracking-copy p {
  margin: 3px 0 0;
  color: #C9BBB3;
  font-size: 10px;
}

.connect-supplier-deliveries-open-tracking {
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

.connect-supplier-deliveries-open-tracking:hover {
  transform: translateY(-1px);
  background: #F3E7D9;
}


/* Details animation */
.connect-supplier-deliveries-details-enter-active,
.connect-supplier-deliveries-details-leave-active {
  transition:
    opacity 220ms ease,
    transform 220ms ease;
}

.connect-supplier-deliveries-details-enter-from,
.connect-supplier-deliveries-details-leave-to {
  opacity: 0;
  transform: translateY(8px);
}


/* Tablet */
@media (max-width: 1100px) {
  .connect-supplier-deliveries-card-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}


@media (max-width: 900px) {
  .connect-supplier-deliveries-page {
    padding: 25px;
  }

  .connect-supplier-deliveries-hero {
    align-items: flex-start;
    flex-direction: column;
  }

  .connect-supplier-deliveries-dispatch-status {
    width: 100%;
  }

  .connect-supplier-deliveries-overview {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .connect-supplier-deliveries-details-layout {
    grid-template-columns: 1fr;
  }

  .connect-supplier-deliveries-journey-track {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .connect-supplier-deliveries-journey-connector {
    width: 1px;
    height: 25px;
    margin-left: 15px;
  }

  .connect-supplier-deliveries-journey-connector span {
    width: 1px;
    height: 0;
  }

  .connect-supplier-deliveries-journey-connector span.active {
    width: 1px;
    height: 100%;
  }
}


/* Smaller screens */
@media (max-width: 700px) {
  .connect-supplier-deliveries-card-grid {
    grid-template-columns: 1fr;
  }
}


/* Mobile */
@media (max-width: 640px) {
  .connect-supplier-deliveries-page {
    padding: 20px 16px;
  }

  .connect-supplier-deliveries-title {
    font-size: 33px;
  }

  .connect-supplier-deliveries-overview {
    grid-template-columns: 1fr;
  }

  .connect-supplier-deliveries-workspace-header {
    align-items: flex-start;
    padding: 20px;
  }

  .connect-supplier-deliveries-card-grid {
    padding: 18px 20px 20px;
  }

  .connect-supplier-deliveries-card-header {
    align-items: flex-start;
  }

  .connect-supplier-deliveries-card-info {
    gap: 5px;
  }

  .connect-supplier-deliveries-details {
    padding: 20px;
  }

  .connect-supplier-deliveries-details-title-group {
    align-items: flex-start;
  }

  .connect-supplier-deliveries-details-title-group h2 {
    font-size: 22px;
  }

  .connect-supplier-deliveries-current-status {
    align-items: flex-start;
    flex-direction: column;
  }

  .connect-supplier-deliveries-detail-grid {
    grid-template-columns: 1fr;
  }

  .connect-supplier-deliveries-tracking-banner {
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .connect-supplier-deliveries-open-tracking {
    width: 100%;
    justify-content: center;
  }
}

</style>
