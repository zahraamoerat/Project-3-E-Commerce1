<template>
  <div class="connect-supplier-orders-page">

    <!-- Supplier workspace header -->
    <header class="connect-supplier-orders-hero">

      <div class="connect-supplier-orders-hero-copy">
        <p class="connect-supplier-orders-eyebrow">
          SUPPLIER WORKSPACE
        </p>

        <h1 class="connect-supplier-orders-title">
          Received Orders
        </h1>

        <p class="connect-supplier-orders-description">
          Keep track of incoming orders, customer requests and fulfilment progress from one place.
        </p>
      </div>

      <div class="connect-supplier-orders-hero-status">
        <div class="connect-supplier-orders-status-icon">
          <FontAwesomeIcon :icon="faBoxesStacked" />
        </div>

        <div>
          <span class="connect-supplier-orders-status-label">
            ORDER QUEUE
          </span>

          <strong>
            {{ orders.length }} received
          </strong>
        </div>
      </div>
    </header>

    <!-- Supplier activity overview -->
    <section class="connect-supplier-orders-overview">

      <article class="connect-supplier-orders-overview-card connect-supplier-orders-overview-primary">
        <div class="connect-supplier-orders-overview-top">
          <span class="connect-supplier-orders-overview-label">
            Orders received
          </span>

          <span class="connect-supplier-orders-overview-icon">
            <FontAwesomeIcon :icon="faInbox" />
          </span>
        </div>

        <strong class="connect-supplier-orders-overview-value">
          {{ orders.length }}
        </strong>

        <p>
          Total customer orders
        </p>
      </article>

      <article class="connect-supplier-orders-overview-card">
        <div class="connect-supplier-orders-overview-top">
          <span class="connect-supplier-orders-overview-label">
            Awaiting payment
          </span>

          <span class="connect-supplier-orders-overview-icon">
            <FontAwesomeIcon :icon="faClock" />
          </span>
        </div>

        <strong class="connect-supplier-orders-overview-value">
          {{ unpaidOrders }}
        </strong>

        <p>
          Payment still pending
        </p>
      </article>

      <article class="connect-supplier-orders-overview-card">
        <div class="connect-supplier-orders-overview-top">
          <span class="connect-supplier-orders-overview-label">
            Active deliveries
          </span>

          <span class="connect-supplier-orders-overview-icon">
            <FontAwesomeIcon :icon="faTruckFast" />
          </span>
        </div>

        <strong class="connect-supplier-orders-overview-value">
          {{ activeDeliveries }}
        </strong>

        <p>
          Orders currently moving
        </p>
      </article>
    </section>

    <!-- Order workspace -->
    <section class="connect-supplier-orders-workspace">

      <div class="connect-supplier-orders-workspace-header">

        <div>
          <p class="connect-supplier-orders-section-eyebrow">
            FULFILMENT QUEUE
          </p>

          <h2 class="connect-supplier-orders-section-title">
            Customer Orders
          </h2>

          <p class="connect-supplier-orders-section-description">
            Review incoming orders and monitor their progress.
          </p>
        </div>

        <div class="connect-supplier-orders-queue-count">
          <strong>{{ filteredOrders.length }}</strong>
          <span>orders</span>
        </div>
      </div>

      <!-- Search and filters -->
      <div class="connect-supplier-orders-controls">

        <div class="connect-supplier-orders-search">
          <FontAwesomeIcon
            :icon="faMagnifyingGlass"
            class="connect-supplier-orders-search-icon"
          />

          <input
            v-model="searchQuery"
            type="search"
            placeholder="Search by order or business..."
            aria-label="Search supplier orders"
          />
        </div>

        <div class="connect-supplier-orders-filters">

          <button
            type="button"
            class="connect-supplier-orders-filter"
            :class="{ active: activeFilter === 'all' }"
            @click="activeFilter = 'all'"
          >
            All
          </button>

          <button
            type="button"
            class="connect-supplier-orders-filter"
            :class="{ active: activeFilter === 'pending' }"
            @click="activeFilter = 'pending'"
          >
            Pending
          </button>

          <button
            type="button"
            class="connect-supplier-orders-filter"
            :class="{ active: activeFilter === 'processing' }"
            @click="activeFilter = 'processing'"
          >
            Processing
          </button>

          <button
            type="button"
            class="connect-supplier-orders-filter"
            :class="{ active: activeFilter === 'completed' }"
            @click="activeFilter = 'completed'"
          >
            Completed
          </button>

        </div>
      </div>

      <!-- Supplier order cards -->
      <div class="connect-supplier-orders-card-grid">

        <article
          v-for="order in filteredOrders"
          :key="order.id"
          class="connect-supplier-orders-card"
          :class="{ selected: selectedOrder?.id === order.id }"
        >

          <!-- Card header -->
          <div class="connect-supplier-orders-card-header">

            <div class="connect-supplier-orders-business">

              <div class="connect-supplier-orders-business-avatar">
                {{ getInitials(order.business) }}
              </div>

              <div>
                <span class="connect-supplier-orders-card-label">
                  CUSTOMER
                </span>

                <h3>
                  {{ order.business }}
                </h3>

                <p>
                  {{ order.orderNumber }}
                </p>
              </div>

            </div>

            <span
              class="connect-supplier-orders-status"
              :class="getStatusClass(order.status)"
            >
              <span class="connect-supplier-orders-status-dot"></span>
              {{ order.status }}
            </span>

          </div>

          <!-- Order metadata -->
          <div class="connect-supplier-orders-meta">

            <div class="connect-supplier-orders-meta-item">
              <FontAwesomeIcon :icon="faCalendarDays" />

              <div>
                <span>Order date</span>
                <strong>{{ order.date }}</strong>
              </div>
            </div>

            <div class="connect-supplier-orders-meta-item">
              <FontAwesomeIcon :icon="faCreditCard" />

              <div>
                <span>Payment</span>

                <strong
                  :class="getStatusClass(order.paymentStatus)"
                >
                  {{ order.paymentStatus }}
                </strong>
              </div>
            </div>

            <div class="connect-supplier-orders-meta-item">
              <FontAwesomeIcon :icon="faTruckFast" />

              <div>
                <span>Delivery</span>

                <strong
                  :class="getStatusClass(order.deliveryStatus)"
                >
                  {{ order.deliveryStatus }}
                </strong>
              </div>
            </div>

          </div>

          <!-- Supplier fulfilment area -->
          <div class="connect-supplier-orders-fulfilment">

            <div class="connect-supplier-orders-fulfilment-heading">
              <span>FULFILMENT STATUS</span>

              <span>
                {{ order.deliveryId }}
              </span>
            </div>

            <div class="connect-supplier-orders-progress">

              <div
                class="connect-supplier-orders-progress-step"
                :class="{
                  complete:
                    order.paymentStatus.toLowerCase() === 'paid'
                }"
              >
                <span class="connect-supplier-orders-progress-dot">
                  <FontAwesomeIcon :icon="faCreditCard" />
                </span>

                <span>
                  Paid
                </span>
              </div>

              <div class="connect-supplier-orders-progress-line"></div>

              <div
                class="connect-supplier-orders-progress-step"
                :class="{
                  complete:
                    order.status.toLowerCase() === 'processing' ||
                    order.status.toLowerCase() === 'completed'
                }"
              >
                <span class="connect-supplier-orders-progress-dot">
                  <FontAwesomeIcon :icon="faBoxOpen" />
                </span>

                <span>
                  Processing
                </span>
              </div>

              <div class="connect-supplier-orders-progress-line"></div>

              <div
                class="connect-supplier-orders-progress-step"
                :class="{
                  complete:
                    order.deliveryStatus.toLowerCase() === 'completed'
                }"
              >
                <span class="connect-supplier-orders-progress-dot">
                  <FontAwesomeIcon :icon="faTruckFast" />
                </span>

                <span>
                  Delivered
                </span>
              </div>

            </div>
          </div>

          <!-- Card footer -->
          <div class="connect-supplier-orders-card-footer">

            <div class="connect-supplier-orders-total">
              <span>ORDER VALUE</span>

              <strong>
                R {{ Number(order.total).toFixed(2) }}
              </strong>
            </div>

            <button
              type="button"
              class="connect-supplier-orders-review-button"
              :class="{ active: selectedOrder?.id === order.id }"
              @click="viewOrder(order)"
            >
              <span>
                {{ selectedOrder?.id === order.id ? 'Viewing Order' : 'Review Order' }}
              </span>

              <FontAwesomeIcon :icon="faArrowRight" />
            </button>

          </div>
        </article>

        <!-- Empty state -->
        <div
          v-if="filteredOrders.length === 0"
          class="connect-supplier-orders-empty"
        >
          <div class="connect-supplier-orders-empty-icon">
            <FontAwesomeIcon :icon="faInbox" />
          </div>

          <h3>
            No orders found
          </h3>

          <p>
            Try changing your search or selecting a different order status.
          </p>
        </div>

      </div>
    </section>

    <!-- Selected order details -->
    <Transition name="connect-supplier-orders-details">

      <section
        v-if="selectedOrder"
        class="connect-supplier-orders-details"
      >

        <div class="connect-supplier-orders-details-heading">

          <div class="connect-supplier-orders-details-title-group">

            <span class="connect-supplier-orders-details-icon">
              <FontAwesomeIcon :icon="faBoxOpen" />
            </span>

            <div>
              <p class="connect-supplier-orders-details-eyebrow">
                ORDER REVIEW
              </p>

              <h2>
                {{ selectedOrder.orderNumber }}
              </h2>

              <p>
                Received from {{ selectedOrder.business }}
              </p>
            </div>

          </div>

          <button
            type="button"
            class="connect-supplier-orders-close"
            aria-label="Close order details"
            @click="selectedOrder = null"
          >
            <FontAwesomeIcon :icon="faXmark" />
          </button>

        </div>

        <!-- Current order status -->
        <div class="connect-supplier-orders-current-status">

          <div>
            <span>Current order status</span>

            <strong>
              {{ selectedOrder.status }}
            </strong>
          </div>

          <span
            class="connect-supplier-orders-status"
            :class="getStatusClass(selectedOrder.status)"
          >
            <span class="connect-supplier-orders-status-dot"></span>
            {{ selectedOrder.status }}
          </span>

        </div>

        <!-- Order details -->
        <div class="connect-supplier-orders-details-layout">

          <div class="connect-supplier-orders-details-information">

            <div class="connect-supplier-orders-detail-heading">
              <span>
                ORDER INFORMATION
              </span>
            </div>

            <div class="connect-supplier-orders-detail-grid">

              <div class="connect-supplier-orders-detail-item">
                <span>Small Business</span>
                <strong>{{ selectedOrder.business }}</strong>
              </div>

              <div class="connect-supplier-orders-detail-item">
                <span>Supplier</span>
                <strong>{{ selectedOrder.supplier }}</strong>
              </div>

              <div class="connect-supplier-orders-detail-item">
                <span>Order Date</span>
                <strong>{{ selectedOrder.date }}</strong>
              </div>

              <div class="connect-supplier-orders-detail-item">
                <span>Delivery Reference</span>
                <strong>{{ selectedOrder.deliveryId }}</strong>
              </div>

              <div class="connect-supplier-orders-detail-item">
                <span>Payment Status</span>
                <strong>{{ selectedOrder.paymentStatus }}</strong>
              </div>

              <div class="connect-supplier-orders-detail-item">
                <span>Delivery Status</span>
                <strong>{{ selectedOrder.deliveryStatus }}</strong>
              </div>

            </div>
          </div>

          <!-- Order financial summary -->
          <div class="connect-supplier-orders-financial">

            <div class="connect-supplier-orders-detail-heading">
              <span>
                ORDER VALUE
              </span>
            </div>

            <div class="connect-supplier-orders-cost-row">
              <span>Order subtotal</span>

              <strong>
                R {{ Number(selectedOrder.subtotal).toFixed(2) }}
              </strong>
            </div>

            <div class="connect-supplier-orders-cost-row">
              <span>Delivery fee</span>

              <strong>
                R {{ Number(selectedOrder.deliveryFee).toFixed(2) }}
              </strong>
            </div>

            <div class="connect-supplier-orders-cost-divider"></div>

            <div class="connect-supplier-orders-cost-row total">
              <span>Total</span>

              <strong>
                R {{ Number(selectedOrder.total).toFixed(2) }}
              </strong>
            </div>

          </div>

        </div>

        <!-- Connect this order to the delivery system -->
        <div class="connect-supplier-orders-delivery-banner">

          <div class="connect-supplier-orders-delivery-icon">
            <FontAwesomeIcon :icon="faTruckFast" />
          </div>

          <div>
            <span>DELIVERY CONNECTION</span>

            <strong>
              {{ selectedOrder.deliveryId }}
            </strong>

            <p>
              {{ selectedOrder.deliveryStatus }} · Delivery fee R
              {{ Number(selectedOrder.deliveryFee).toFixed(2) }}
            </p>
          </div>

        </div>

      </section>
    </Transition>

  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import {
  faArrowRight,
  faBoxOpen,
  faBoxesStacked,
  faCalendarDays,
  faClock,
  faCreditCard,
  faInbox,
  faMagnifyingGlass,
  faTruckFast,
  faXmark
} from '@fortawesome/free-solid-svg-icons'

// Use the same shared order data as the other order pages
import { orders } from '../data/orders'

// Store the order currently being reviewed
const selectedOrder = ref(null)

// Search field
const searchQuery = ref('')

// Current order filter
const activeFilter = ref('all')

// Count orders that have not been paid yet
const unpaidOrders = computed(() => {
  return orders.filter(order => {
    return order.paymentStatus.toLowerCase() !== 'paid'
  }).length
})

// Count deliveries that are still active
const activeDeliveries = computed(() => {
  return orders.filter(order => {
    return order.deliveryStatus.toLowerCase() !== 'completed'
  }).length
})

// Apply the search and status filters
const filteredOrders = computed(() => {
  const search = searchQuery.value.trim().toLowerCase()

  return orders.filter(order => {
    const matchesSearch =
      !search ||
      order.orderNumber.toLowerCase().includes(search) ||
      order.business.toLowerCase().includes(search)

    const status = order.status.toLowerCase()

    let matchesFilter = true

    if (activeFilter.value === 'pending') {
      matchesFilter = status.includes('pending')
    }

    if (activeFilter.value === 'processing') {
      matchesFilter =
        status.includes('processing') ||
        status.includes('in-progress')
    }

    if (activeFilter.value === 'completed') {
      matchesFilter = status.includes('completed')
    }

    return matchesSearch && matchesFilter
  })
})

// Open the selected order
function viewOrder(order) {
  selectedOrder.value = order
}

// Create initials for the business avatar
function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase()
}

// Convert a status into a CSS class
function getStatusClass(status) {
  return status.toLowerCase().replace(/\s+/g, '-')
}
</script>

<style scoped>

/* Main supplier page */
.connect-supplier-orders-page {
  min-height: 100vh;
  padding: 34px;
  box-sizing: border-box;
  background: #E8E2DD;
  color: #5C3D24;
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

/* Supplier-focused page header */
.connect-supplier-orders-hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 32px;
  margin-bottom: 28px;
}

.connect-supplier-orders-hero-copy {
  max-width: 680px;
}

.connect-supplier-orders-eyebrow {
  margin: 0 0 8px;
  color: #D17A4A;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.9px;
}

.connect-supplier-orders-title {
  margin: 0 0 9px;
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 42px;
  font-weight: 600;
  line-height: 1.05;
}

.connect-supplier-orders-description {
  max-width: 600px;
  margin: 0;
  color: #7A665B;
  font-size: 14px;
  line-height: 1.65;
}

.connect-supplier-orders-hero-status {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 185px;
  padding: 13px 16px;
  background: #FFFEFC;
  border: 1px solid rgba(78, 52, 46, 0.06);
  border-radius: 12px;
  box-shadow: 0 5px 18px rgba(78, 52, 46, 0.06);
}

.connect-supplier-orders-status-icon {
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border-radius: 10px;
  background: #F3E7D9;
  color: #D17A4A;
}

.connect-supplier-orders-status-label {
  display: block;
  margin-bottom: 3px;
  color: #9A887D;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.2px;
}

.connect-supplier-orders-hero-status strong {
  color: #4E342E;
  font-size: 13px;
}

/* Summary cards */
.connect-supplier-orders-overview {
  display: grid;
  grid-template-columns: 1.25fr 1fr 1fr;
  gap: 15px;
  margin-bottom: 26px;
}

.connect-supplier-orders-overview-card {
  min-height: 132px;
  padding: 19px 20px;
  box-sizing: border-box;
  background: #FFFEFC;
  border: 1px solid rgba(78, 52, 46, 0.05);
  border-radius: 14px;
  box-shadow: 0 4px 18px rgba(78, 52, 46, 0.06);
  transition:
    transform 180ms ease,
    box-shadow 180ms ease;
}

.connect-supplier-orders-overview-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(78, 52, 46, 0.1);
}

.connect-supplier-orders-overview-primary {
  border-top: 3px solid #D17A4A;
}

.connect-supplier-orders-overview-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.connect-supplier-orders-overview-label {
  color: #7A665B;
  font-size: 12px;
  font-weight: 600;
}

.connect-supplier-orders-overview-icon {
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  border-radius: 9px;
  background: #F6EEE8;
  color: #8A5A32;
  font-size: 12px;
}

.connect-supplier-orders-overview-value {
  display: block;
  margin-top: 13px;
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 30px;
  font-weight: 600;
  line-height: 1;
}

.connect-supplier-orders-overview-card p {
  margin: 7px 0 0;
  color: #9A887D;
  font-size: 11px;
}

/* Main card workspace */
.connect-supplier-orders-workspace {
  overflow: hidden;
  background: #FFFEFC;
  border-radius: 17px;
  box-shadow: 0 5px 22px rgba(78, 52, 46, 0.08);
}

.connect-supplier-orders-workspace-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  padding: 25px 25px 20px;
}

.connect-supplier-orders-section-eyebrow {
  margin: 0 0 5px;
  color: #D17A4A;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.6px;
}

.connect-supplier-orders-section-title {
  margin: 0 0 4px;
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 25px;
  font-weight: 600;
}

.connect-supplier-orders-section-description {
  margin: 0;
  color: #8A776C;
  font-size: 12px;
}

.connect-supplier-orders-queue-count {
  display: flex;
  align-items: baseline;
  gap: 5px;
  color: #9A887D;
  font-size: 11px;
}

.connect-supplier-orders-queue-count strong {
  color: #4E342E;
  font-size: 18px;
}

/* Search and filter controls */
.connect-supplier-orders-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 0 25px 18px;
  border-bottom: 1px solid #E8E2DD;
}

.connect-supplier-orders-search {
  position: relative;
  width: min(340px, 100%);
}

.connect-supplier-orders-search-icon {
  position: absolute;
  top: 50%;
  left: 13px;
  color: #9A887D;
  font-size: 12px;
  transform: translateY(-50%);
}

.connect-supplier-orders-search input {
  width: 100%;
  height: 38px;
  box-sizing: border-box;
  padding: 0 13px 0 35px;
  border: 1px solid #DED3CC;
  border-radius: 9px;
  outline: none;
  background: #FCF9F6;
  color: #5C3D24;
  font: inherit;
  font-size: 12px;
  transition:
    border-color 180ms ease,
    box-shadow 180ms ease,
    background 180ms ease;
}

.connect-supplier-orders-search input::placeholder {
  color: #AA9B92;
}

.connect-supplier-orders-search input:focus {
  background: #FFFEFC;
  border-color: #D17A4A;
  box-shadow: 0 0 0 3px rgba(209, 122, 74, 0.1);
}

.connect-supplier-orders-filters {
  display: flex;
  align-items: center;
  gap: 6px;
}

.connect-supplier-orders-filter {
  padding: 7px 12px;
  border: 1px solid transparent;
  border-radius: 999px;
  background: transparent;
  color: #8A776C;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition:
    background 180ms ease,
    color 180ms ease,
    border-color 180ms ease;
}

.connect-supplier-orders-filter:hover {
  color: #5C3D24;
  background: #F6EEE8;
}

.connect-supplier-orders-filter.active {
  border-color: #E6D3C5;
  background: #F3E7D9;
  color: #8A5A32;
}

/* Three-column supplier order cards */
.connect-supplier-orders-card-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 17px;
  padding: 22px 25px 25px;
}

/* Individual order card */
.connect-supplier-orders-card {
  display: flex;
  min-width: 0;
  flex-direction: column;
  padding: 18px;
  background: #FFFEFC;
  border: 1px solid #E6DDD7;
  border-radius: 15px;
  box-shadow: 0 3px 12px rgba(78, 52, 46, 0.045);
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    border-color 180ms ease;
}

.connect-supplier-orders-card:hover {
  transform: translateY(-3px);
  border-color: #D8C8BE;
  box-shadow: 0 9px 24px rgba(78, 52, 46, 0.09);
}

.connect-supplier-orders-card.selected {
  border-color: #D17A4A;
  box-shadow:
    0 0 0 2px rgba(209, 122, 74, 0.12),
    0 9px 24px rgba(78, 52, 46, 0.09);
}

/* Business/customer identity */
.connect-supplier-orders-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 15px;
}

.connect-supplier-orders-business {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 11px;
}

.connect-supplier-orders-business-avatar {
  display: grid;
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 12px;
  background: #E9DDD3;
  color: #6C4A39;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 12px;
  font-weight: 700;
}

.connect-supplier-orders-business > div:last-child {
  min-width: 0;
}

.connect-supplier-orders-card-label {
  display: block;
  margin-bottom: 3px;
  color: #9A887D;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1px;
}

.connect-supplier-orders-business h3 {
  overflow: hidden;
  margin: 0 0 3px;
  color: #4E342E;
  font-size: 13px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.connect-supplier-orders-business p {
  margin: 0;
  color: #9A887D;
  font-size: 10px;
}

/* Status badges */
.connect-supplier-orders-status {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 5px;
  padding: 5px 8px;
  border-radius: 999px;
  font-size: 9px;
  font-weight: 700;
  white-space: nowrap;
}

.connect-supplier-orders-status-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
}

.connect-supplier-orders-status.completed,
.connect-supplier-orders-status.paid {
  background: #E6F0E8;
  color: #3F6847;
}

.connect-supplier-orders-status.pending,
.connect-supplier-orders-status.processing,
.connect-supplier-orders-status.in-progress,
.connect-supplier-orders-status.in-transit,
.connect-supplier-orders-status.out-for-delivery {
  background: #F3E7D9;
  color: #8A5A32;
}

.connect-supplier-orders-status.unpaid {
  background: #F8E2DD;
  color: #9A4938;
}

/* Small order information row */
.connect-supplier-orders-meta {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 7px;
  padding: 14px 0;
  border-top: 1px solid #E8E2DD;
  border-bottom: 1px solid #E8E2DD;
}

.connect-supplier-orders-meta-item {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  min-width: 0;
}

.connect-supplier-orders-meta-item > svg {
  margin-top: 2px;
  color: #D17A4A;
  font-size: 10px;
}

.connect-supplier-orders-meta-item > div {
  min-width: 0;
}

.connect-supplier-orders-meta-item span {
  display: block;
  margin-bottom: 3px;
  color: #9A887D;
  font-size: 8px;
  white-space: nowrap;
}

.connect-supplier-orders-meta-item strong {
  display: block;
  overflow: hidden;
  color: #5C3D24;
  font-size: 9px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.connect-supplier-orders-meta-item strong.paid,
.connect-supplier-orders-meta-item strong.completed {
  color: #3F6847;
}

.connect-supplier-orders-meta-item strong.pending,
.connect-supplier-orders-meta-item strong.processing,
.connect-supplier-orders-meta-item strong.in-progress,
.connect-supplier-orders-meta-item strong.in-transit,
.connect-supplier-orders-meta-item strong.out-for-delivery {
  color: #8A5A32;
}

.connect-supplier-orders-meta-item strong.unpaid {
  color: #9A4938;
}

/* Supplier fulfilment progress */
.connect-supplier-orders-fulfilment {
  margin-top: 15px;
  padding: 12px;
  border-radius: 10px;
  background: #FBF7F3;
}

.connect-supplier-orders-fulfilment-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 11px;
}

.connect-supplier-orders-fulfilment-heading span:first-child {
  color: #8A776C;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.9px;
}

.connect-supplier-orders-fulfilment-heading span:last-child {
  overflow: hidden;
  color: #9A887D;
  font-size: 8px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.connect-supplier-orders-progress {
  display: flex;
  align-items: center;
  width: 100%;
}

.connect-supplier-orders-progress-step {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #A99A91;
  font-size: 8px;
  white-space: nowrap;
}

.connect-supplier-orders-progress-dot {
  display: grid;
  width: 21px;
  height: 21px;
  place-items: center;
  border: 1px solid #D8CCC4;
  border-radius: 50%;
  background: #FFFEFC;
  color: #A99A91;
  font-size: 8px;
}

.connect-supplier-orders-progress-step.complete {
  color: #5C3D24;
}

.connect-supplier-orders-progress-step.complete .connect-supplier-orders-progress-dot {
  border-color: #D17A4A;
  background: #D17A4A;
  color: #FFFEFC;
}

.connect-supplier-orders-progress-line {
  flex: 1;
  height: 1px;
  margin: 0 5px;
  background: #D8CCC4;
}

/* Card footer */
.connect-supplier-orders-card-footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-top: auto;
  padding-top: 17px;
}

.connect-supplier-orders-total span {
  display: block;
  margin-bottom: 4px;
  color: #9A887D;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.7px;
}

.connect-supplier-orders-total strong {
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 18px;
  font-weight: 600;
}

.connect-supplier-orders-review-button {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 12px;
  border: 1px solid #D8CCC4;
  border-radius: 8px;
  background: #FFFEFC;
  color: #5C3D24;
  font-size: 9px;
  font-weight: 800;
  cursor: pointer;
  transition:
    background 180ms ease,
    border-color 180ms ease,
    color 180ms ease,
    transform 180ms ease;
}

.connect-supplier-orders-review-button svg {
  font-size: 8px;
  transition: transform 180ms ease;
}

.connect-supplier-orders-review-button:hover {
  border-color: #D17A4A;
  background: #F3E7D9;
  color: #8A5A32;
  transform: translateY(-1px);
}

.connect-supplier-orders-review-button:hover svg {
  transform: translateX(2px);
}

.connect-supplier-orders-review-button.active {
  border-color: #D17A4A;
  background: #D17A4A;
  color: #FFFEFC;
}

/* Empty state */
.connect-supplier-orders-empty {
  grid-column: 1 / -1;
  padding: 55px 25px;
  text-align: center;
}

.connect-supplier-orders-empty-icon {
  display: grid;
  width: 48px;
  height: 48px;
  margin: 0 auto 13px;
  place-items: center;
  border-radius: 14px;
  background: #F3E7D9;
  color: #D17A4A;
}

.connect-supplier-orders-empty h3 {
  margin: 0 0 6px;
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 20px;
}

.connect-supplier-orders-empty p {
  margin: 0;
  color: #8A776C;
  font-size: 12px;
}

/* Selected order details */
.connect-supplier-orders-details {
  margin-top: 24px;
  padding: 26px;
  background: #FFFEFC;
  border-radius: 17px;
  box-shadow: 0 5px 22px rgba(78, 52, 46, 0.08);
}

.connect-supplier-orders-details-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #E8E2DD;
}

.connect-supplier-orders-details-title-group {
  display: flex;
  align-items: center;
  gap: 13px;
}

.connect-supplier-orders-details-icon {
  display: grid;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 12px;
  background: #F3E7D9;
  color: #D17A4A;
}

.connect-supplier-orders-details-eyebrow {
  margin: 0 0 4px;
  color: #D17A4A;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.5px;
}

.connect-supplier-orders-details-heading h2 {
  margin: 0 0 3px;
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 25px;
  font-weight: 600;
}

.connect-supplier-orders-details-heading p {
  margin: 0;
  color: #8A776C;
  font-size: 12px;
}

.connect-supplier-orders-close {
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

.connect-supplier-orders-close:hover {
  border-color: #D17A4A;
  background: #F3E7D9;
  transform: rotate(5deg);
}

/* Current order status */
.connect-supplier-orders-current-status {
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

.connect-supplier-orders-current-status > div span {
  display: block;
  margin-bottom: 4px;
  color: #9A887D;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.6px;
  text-transform: uppercase;
}

.connect-supplier-orders-current-status > div strong {
  color: #4E342E;
  font-size: 13px;
}

/* Details information */
.connect-supplier-orders-details-layout {
  display: grid;
  grid-template-columns: 1.5fr 0.8fr;
  gap: 20px;
}

.connect-supplier-orders-details-information,
.connect-supplier-orders-financial {
  overflow: hidden;
  border: 1px solid #E8E2DD;
  border-radius: 12px;
}

.connect-supplier-orders-detail-heading {
  padding: 12px 15px;
  background: #F8F3EF;
  border-bottom: 1px solid #E8E2DD;
}

.connect-supplier-orders-detail-heading span {
  color: #8A776C;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1px;
}

.connect-supplier-orders-detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  background: #E8E2DD;
}

.connect-supplier-orders-detail-item {
  min-height: 67px;
  padding: 13px 15px;
  box-sizing: border-box;
  background: #FFFEFC;
}

.connect-supplier-orders-detail-item span {
  display: block;
  margin-bottom: 5px;
  color: #9A887D;
  font-size: 10px;
  font-weight: 600;
}

.connect-supplier-orders-detail-item strong {
  color: #5C3D24;
  font-size: 12px;
}

/* Pricing */
.connect-supplier-orders-financial {
  padding-bottom: 8px;
}

.connect-supplier-orders-financial .connect-supplier-orders-detail-heading {
  margin-bottom: 5px;
}

.connect-supplier-orders-cost-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 9px 15px;
  color: #7A665B;
  font-size: 12px;
}

.connect-supplier-orders-cost-row strong {
  color: #5C3D24;
}

.connect-supplier-orders-cost-divider {
  height: 1px;
  margin: 6px 15px;
  background: #E8E2DD;
}

.connect-supplier-orders-cost-row.total {
  padding-top: 12px;
  color: #4E342E;
  font-size: 13px;
}

.connect-supplier-orders-cost-row.total strong {
  color: #4E342E;
  font-size: 17px;
}

/* Delivery connection */
.connect-supplier-orders-delivery-banner {
  display: flex;
  align-items: center;
  gap: 13px;
  margin-top: 18px;
  padding: 14px 16px;
  border-radius: 11px;
  background: #4E342E;
  color: #FFFEFC;
}

.connect-supplier-orders-delivery-icon {
  display: grid;
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 10px;
  background: rgba(255, 254, 252, 0.12);
  color: #D17A4A;
}

.connect-supplier-orders-delivery-banner span {
  display: block;
  margin-bottom: 3px;
  color: #D7C8BF;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1.1px;
}

.connect-supplier-orders-delivery-banner strong {
  display: block;
  font-size: 12px;
}

.connect-supplier-orders-delivery-banner p {
  margin: 3px 0 0;
  color: #C9BBB3;
  font-size: 10px;
}

/* Details animation */
.connect-supplier-orders-details-enter-active,
.connect-supplier-orders-details-leave-active {
  transition:
    opacity 220ms ease,
    transform 220ms ease;
}

.connect-supplier-orders-details-enter-from,
.connect-supplier-orders-details-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

/* Tablet */
@media (max-width: 1100px) {
  .connect-supplier-orders-card-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .connect-supplier-orders-page {
    padding: 25px;
  }

  .connect-supplier-orders-hero {
    align-items: flex-start;
    flex-direction: column;
  }

  .connect-supplier-orders-hero-status {
    width: 100%;
    box-sizing: border-box;
  }

  .connect-supplier-orders-overview {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .connect-supplier-orders-controls {
    align-items: stretch;
    flex-direction: column;
  }

  .connect-supplier-orders-search {
    width: 100%;
  }

  .connect-supplier-orders-filters {
    overflow-x: auto;
    padding-bottom: 2px;
  }

  .connect-supplier-orders-details-layout {
    grid-template-columns: 1fr;
  }
}

/* Mobile */
@media (max-width: 700px) {
  .connect-supplier-orders-card-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .connect-supplier-orders-page {
    padding: 20px 16px;
  }

  .connect-supplier-orders-title {
    font-size: 33px;
  }

  .connect-supplier-orders-overview {
    grid-template-columns: 1fr;
  }

  .connect-supplier-orders-workspace-header {
    align-items: flex-start;
    padding: 20px;
  }

  .connect-supplier-orders-controls {
    padding: 0 20px 16px;
  }

  .connect-supplier-orders-card-grid {
    padding: 18px 20px 20px;
  }

  .connect-supplier-orders-card-header {
    align-items: flex-start;
  }

  .connect-supplier-orders-meta {
    gap: 5px;
  }

  .connect-supplier-orders-progress-step {
    font-size: 7px;
  }

  .connect-supplier-orders-progress-step span:last-child {
    display: none;
  }

  .connect-supplier-orders-card-footer {
    align-items: center;
  }

  .connect-supplier-orders-details {
    padding: 20px;
  }

  .connect-supplier-orders-details-title-group {
    align-items: flex-start;
  }

  .connect-supplier-orders-details-heading h2 {
    font-size: 22px;
  }

  .connect-supplier-orders-detail-grid {
    grid-template-columns: 1fr;
  }

  .connect-supplier-orders-current-status {
    align-items: flex-start;
    flex-direction: column;
  }

  .connect-supplier-orders-delivery-banner {
    align-items: flex-start;
  }
}

</style>