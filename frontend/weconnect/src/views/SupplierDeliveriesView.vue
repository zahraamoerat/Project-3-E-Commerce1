<template>
  <div class="connect-supplier-deliveries-page">

    <!-- Page heading -->
    <header class="connect-supplier-deliveries-header">
      <p class="connect-supplier-deliveries-eyebrow">
        DELIVERY MANAGEMENT
      </p>

      <h1 class="connect-supplier-deliveries-title">
        Supplier Deliveries
      </h1>

      <p class="connect-supplier-deliveries-description">
        Monitor deliveries connected to orders received from small businesses.
      </p>
    </header>

    <!-- Delivery summary -->
    <section class="connect-supplier-deliveries-summary">

      <div class="connect-supplier-deliveries-summary-card">
        <span class="connect-supplier-deliveries-summary-label">
          Total Deliveries
        </span>

        <strong class="connect-supplier-deliveries-summary-value">
          {{ deliveries.length }}
        </strong>

        <span class="connect-supplier-deliveries-summary-note">
          Deliveries to manage
        </span>
      </div>

      <div class="connect-supplier-deliveries-summary-card">
        <span class="connect-supplier-deliveries-summary-label">
          In Progress
        </span>

        <strong class="connect-supplier-deliveries-summary-value">
          {{ activeDeliveries }}
        </strong>

        <span class="connect-supplier-deliveries-summary-note">
          Currently being delivered
        </span>
      </div>

      <div class="connect-supplier-deliveries-summary-card">
        <span class="connect-supplier-deliveries-summary-label">
          Completed
        </span>

        <strong class="connect-supplier-deliveries-summary-value">
          {{ completedDeliveries }}
        </strong>

        <span class="connect-supplier-deliveries-summary-note">
          Successfully delivered
        </span>
      </div>

    </section>

    <!-- Deliveries table -->
    <section class="connect-supplier-deliveries-section">

      <div class="connect-supplier-deliveries-section-header">
        <div>
          <h2 class="connect-supplier-deliveries-section-title">
            Delivery Overview
          </h2>

          <p class="connect-supplier-deliveries-section-description">
            Follow deliveries from your warehouse to the small business.
          </p>
        </div>

        <span class="connect-supplier-deliveries-count">
          {{ deliveries.length }} deliveries
        </span>
      </div>

      <div class="connect-supplier-deliveries-table-wrapper">
        <table class="connect-supplier-deliveries-table">

          <!-- Table headings -->
          <thead>
            <tr>
              <th>Delivery Number</th>
              <th>Order Number</th>
              <th>Small Business</th>
              <th>Delivery Status</th>
              <th>Payment</th>
              <th>Action</th>
            </tr>
          </thead>

          <!-- Delivery information -->
          <tbody>
            <tr
              v-for="delivery in deliveries"
              :key="delivery.deliveryId"
              class="connect-supplier-deliveries-row"
            >

              <td class="connect-supplier-deliveries-id">
                {{ delivery.deliveryId }}
              </td>

              <td class="connect-supplier-deliveries-order">
                {{ delivery.orderNumber }}
              </td>

              <td class="connect-supplier-deliveries-business">
                {{ delivery.business }}
              </td>

              <!-- Delivery status -->
              <td>
                <span
                  class="connect-supplier-deliveries-status"
                  :class="getStatusClass(delivery.deliveryStatus)"
                >
                  <span class="connect-supplier-deliveries-status-dot"></span>
                  {{ delivery.deliveryStatus }}
                </span>
              </td>

              <!-- Payment status -->
              <td>
                <span
                  class="connect-supplier-deliveries-status"
                  :class="getStatusClass(delivery.paymentStatus)"
                >
                  <span class="connect-supplier-deliveries-status-dot"></span>
                  {{ delivery.paymentStatus }}
                </span>
              </td>

              <!-- Delivery tracking action -->
              <td class="connect-supplier-deliveries-action-cell">
                <button
                  class="connect-supplier-deliveries-track-button"
                  type="button"
                  @click="trackDelivery(delivery)"
                >
                  Track Delivery
                </button>
              </td>

            </tr>
          </tbody>

        </table>
      </div>

    </section>

    <!-- Selected delivery details -->
    <Transition name="connect-supplier-deliveries-details">

      <section
        v-if="selectedDelivery"
        class="connect-supplier-deliveries-details"
      >

        <!-- Details header -->
        <div class="connect-supplier-deliveries-details-header">

          <div>
            <p class="connect-supplier-deliveries-details-eyebrow">
              DELIVERY DETAILS
            </p>

            <h2 class="connect-supplier-deliveries-details-title">
              {{ selectedDelivery.deliveryId }}
            </h2>

            <p class="connect-supplier-deliveries-details-subtitle">
              Delivery for {{ selectedDelivery.business }}
            </p>
          </div>

          <!-- Close the details panel -->
          <button
            class="connect-supplier-deliveries-close-button"
            type="button"
            aria-label="Close delivery details"
            @click="selectedDelivery = null"
          >
            ×
          </button>

        </div>

        <!-- Delivery information -->
        <div class="connect-supplier-deliveries-details-grid">

          <div class="connect-supplier-deliveries-detail-item">
            <span>Delivery Number</span>
            <strong>{{ selectedDelivery.deliveryId }}</strong>
          </div>

          <div class="connect-supplier-deliveries-detail-item">
            <span>Order Number</span>
            <strong>{{ selectedDelivery.orderNumber }}</strong>
          </div>

          <div class="connect-supplier-deliveries-detail-item">
            <span>Small Business</span>
            <strong>{{ selectedDelivery.business }}</strong>
          </div>

          <div class="connect-supplier-deliveries-detail-item">
            <span>Delivery Status</span>
            <strong>{{ selectedDelivery.deliveryStatus }}</strong>
          </div>

          <div class="connect-supplier-deliveries-detail-item">
            <span>Payment Status</span>
            <strong>{{ selectedDelivery.paymentStatus }}</strong>
          </div>

        </div>

        <!-- Delivery costs -->
        <div class="connect-supplier-deliveries-cost-section">

          <div class="connect-supplier-deliveries-cost-row">
            <span>Order Total</span>

            <strong>
              R {{ Number(selectedDelivery.total).toFixed(2) }}
            </strong>
          </div>

          <div class="connect-supplier-deliveries-cost-row">
            <span>Delivery Fee</span>

            <strong>
              R {{ Number(selectedDelivery.deliveryFee).toFixed(2) }}
            </strong>
          </div>

        </div>

        <!-- Open the shared live tracking page -->
        <router-link
          to="/tracking"
          class="connect-supplier-deliveries-tracking-link"
        >
          Open Live Tracking
        </router-link>

      </section>

    </Transition>

  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

// Import the shared order data
import { orders } from '../data/orders'

// Turn the shared orders into delivery information
const deliveries = orders.map(order => ({
  deliveryId: order.deliveryId,
  orderNumber: order.orderNumber,
  business: order.business,
  deliveryStatus: order.deliveryStatus,
  paymentStatus: order.paymentStatus,
  deliveryFee: order.deliveryFee,
  total: order.total
}))

// Store the delivery currently being viewed
const selectedDelivery = ref(null)

// Count deliveries that are still active
const activeDeliveries = computed(() => {
  return deliveries.filter(delivery => {
    return delivery.deliveryStatus.toLowerCase() !== 'completed'
  }).length
})

// Count completed deliveries
const completedDeliveries = computed(() => {
  return deliveries.filter(delivery => {
    return delivery.deliveryStatus.toLowerCase() === 'completed'
  }).length
})

// Show the selected delivery
function trackDelivery(delivery) {
  selectedDelivery.value = delivery
}

// Convert a status into a class name
function getStatusClass(status) {
  return status.toLowerCase().replace(/\s+/g, '-')
}
</script>

<style scoped>
/* Main page */
.connect-supplier-deliveries-page {
  min-height: 100vh;
  padding: 32px;
  box-sizing: border-box;
  background: #E8E2DD;
  color: #5C3D24;
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

/* Page heading */
.connect-supplier-deliveries-header {
  margin-bottom: 28px;
}

.connect-supplier-deliveries-eyebrow {
  margin: 0 0 8px;
  color: #D17A4A;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.8px;
}

.connect-supplier-deliveries-title {
  margin: 0 0 8px;
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 38px;
  font-weight: 600;
  line-height: 1.1;
}

.connect-supplier-deliveries-description {
  max-width: 650px;
  margin: 0;
  color: #7A665B;
  font-size: 15px;
  line-height: 1.6;
}

/* Summary cards */
.connect-supplier-deliveries-summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 28px;
}

.connect-supplier-deliveries-summary-card {
  padding: 20px;
  background: #FFFEFC;
  border: 1px solid rgba(78, 52, 46, 0.05);
  border-radius: 14px;
  box-shadow: 0 4px 18px rgba(78, 52, 46, 0.06);
  transition:
    transform 180ms ease,
    box-shadow 180ms ease;
}

.connect-supplier-deliveries-summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(78, 52, 46, 0.1);
}

.connect-supplier-deliveries-summary-label {
  display: block;
  margin-bottom: 7px;
  color: #7A665B;
  font-size: 12px;
  font-weight: 600;
}

.connect-supplier-deliveries-summary-value {
  display: block;
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 30px;
  line-height: 1;
}

.connect-supplier-deliveries-summary-note {
  display: block;
  margin-top: 8px;
  color: #9A887D;
  font-size: 12px;
}

/* Deliveries section */
.connect-supplier-deliveries-section {
  overflow: hidden;
  background: #FFFEFC;
  border-radius: 16px;
  box-shadow: 0 4px 18px rgba(78, 52, 46, 0.08);
}

.connect-supplier-deliveries-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 22px 24px;
  border-bottom: 1px solid #E8E2DD;
}

.connect-supplier-deliveries-section-title {
  margin: 0 0 4px;
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 23px;
  font-weight: 600;
}

.connect-supplier-deliveries-section-description {
  margin: 0;
  color: #8A776C;
  font-size: 13px;
}

.connect-supplier-deliveries-count {
  flex-shrink: 0;
  padding: 7px 11px;
  border-radius: 999px;
  background: #F3E7D9;
  color: #8A5A32;
  font-size: 12px;
  font-weight: 700;
}

/* Table */
.connect-supplier-deliveries-table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.connect-supplier-deliveries-table {
  width: 100%;
  min-width: 850px;
  border-collapse: collapse;
}

.connect-supplier-deliveries-table th {
  padding: 14px 16px;
  background: #4E342E;
  color: #FFFEFC;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.2px;
}

.connect-supplier-deliveries-table td {
  padding: 16px;
  border-bottom: 1px solid #E8E2DD;
  font-size: 13px;
}

.connect-supplier-deliveries-row:last-child td {
  border-bottom: none;
}

.connect-supplier-deliveries-row {
  transition: background 160ms ease;
}

.connect-supplier-deliveries-row:hover {
  background: #FCF9F6;
}

.connect-supplier-deliveries-id {
  color: #4E342E;
  font-weight: 700;
}

.connect-supplier-deliveries-order {
  color: #5C3D24;
  font-weight: 600;
}

.connect-supplier-deliveries-business {
  color: #5C3D24;
}

/* Status badges */
.connect-supplier-deliveries-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
}

.connect-supplier-deliveries-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

/* Completed and paid */
.connect-supplier-deliveries-status.completed,
.connect-supplier-deliveries-status.paid {
  background: #E6F0E8;
  color: #3F6847;
}

/* Active delivery statuses */
.connect-supplier-deliveries-status.pending,
.connect-supplier-deliveries-status.processing,
.connect-supplier-deliveries-status.in-progress,
.connect-supplier-deliveries-status.in-transit,
.connect-supplier-deliveries-status.out-for-delivery {
  background: #F3E7D9;
  color: #8A5A32;
}

/* Unpaid status */
.connect-supplier-deliveries-status.unpaid {
  background: #F8E2DD;
  color: #9A4938;
}

/* Track button */
.connect-supplier-deliveries-action-cell {
  white-space: nowrap;
}

.connect-supplier-deliveries-track-button {
  padding: 8px 13px;
  border: none;
  border-radius: 8px;
  background: #D17A4A;
  color: #FFFEFC;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition:
    background 180ms ease,
    transform 180ms ease,
    box-shadow 180ms ease;
}

.connect-supplier-deliveries-track-button:hover {
  background: #C46C3E;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(209, 122, 74, 0.22);
}

.connect-supplier-deliveries-track-button:active {
  transform: translateY(0);
}

/* Details card */
.connect-supplier-deliveries-details {
  margin-top: 24px;
  padding: 26px;
  background: #FFFEFC;
  border-radius: 16px;
  box-shadow: 0 4px 18px rgba(78, 52, 46, 0.08);
}

.connect-supplier-deliveries-details-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
}

.connect-supplier-deliveries-details-eyebrow {
  margin: 0 0 6px;
  color: #D17A4A;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.6px;
}

.connect-supplier-deliveries-details-title {
  margin: 0 0 5px;
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 25px;
  font-weight: 600;
}

.connect-supplier-deliveries-details-subtitle {
  margin: 0;
  color: #8A776C;
  font-size: 13px;
}

/* Close button */
.connect-supplier-deliveries-close-button {
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border: 1px solid #D8CCC4;
  border-radius: 50%;
  background: #FFFEFC;
  color: #5C3D24;
  font-size: 21px;
  line-height: 1;
  cursor: pointer;
  transition:
    background 180ms ease,
    border-color 180ms ease,
    transform 180ms ease;
}

.connect-supplier-deliveries-close-button:hover {
  background: #F3E7D9;
  border-color: #D17A4A;
  transform: rotate(4deg);
}

/* Details information */
.connect-supplier-deliveries-details-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  overflow: hidden;
  border: 1px solid #E8E2DD;
  border-radius: 12px;
  background: #E8E2DD;
}

.connect-supplier-deliveries-detail-item {
  padding: 15px;
  background: #FFFEFC;
}

.connect-supplier-deliveries-detail-item span {
  display: block;
  margin-bottom: 5px;
  color: #9A887D;
  font-size: 11px;
  font-weight: 600;
}

.connect-supplier-deliveries-detail-item strong {
  color: #5C3D24;
  font-size: 13px;
}

/* Cost section */
.connect-supplier-deliveries-cost-section {
  margin-top: 20px;
  padding-top: 18px;
  border-top: 1px solid #E8E2DD;
}

.connect-supplier-deliveries-cost-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 8px 0;
  color: #7A665B;
  font-size: 13px;
}

.connect-supplier-deliveries-cost-row strong {
  color: #5C3D24;
}

/* Tracking link */
.connect-supplier-deliveries-tracking-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  padding: 11px 18px;
  border-radius: 9px;
  background: #4E342E;
  color: #FFFEFC;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  transition:
    background 180ms ease,
    transform 180ms ease,
    box-shadow 180ms ease;
}

.connect-supplier-deliveries-tracking-link:hover {
  background: #5C3D24;
  transform: translateY(-1px);
  box-shadow: 0 5px 14px rgba(78, 52, 46, 0.16);
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
@media (max-width: 900px) {
  .connect-supplier-deliveries-page {
    padding: 24px;
  }

  .connect-supplier-deliveries-summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .connect-supplier-deliveries-details-grid {
    grid-template-columns: 1fr;
  }
}

/* Mobile */
@media (max-width: 640px) {
  .connect-supplier-deliveries-page {
    padding: 20px 16px;
  }

  .connect-supplier-deliveries-title {
    font-size: 31px;
  }

  .connect-supplier-deliveries-summary {
    grid-template-columns: 1fr;
  }

  .connect-supplier-deliveries-section-header {
    align-items: flex-start;
    flex-direction: column;
    padding: 20px;
  }

  .connect-supplier-deliveries-count {
    align-self: flex-start;
  }

  .connect-supplier-deliveries-details {
    padding: 20px;
  }

  .connect-supplier-deliveries-details-title {
    font-size: 22px;
  }

  .connect-supplier-deliveries-tracking-link {
    width: 100%;
    box-sizing: border-box;
  }
}
</style>