```vue
<template>
  <div class="connect-supplier-orders-page">

    <!-- Page heading -->
    <header class="connect-supplier-orders-header">
      <p class="connect-supplier-orders-eyebrow">
        ORDER MANAGEMENT
      </p>

      <h1 class="connect-supplier-orders-title">
        Received Orders
      </h1>

      <p class="connect-supplier-orders-description">
        View and manage orders received from small businesses.
      </p>
    </header>

    <!-- Quick order summary -->
    <section class="connect-supplier-orders-summary">

      <div class="connect-supplier-orders-summary-card">
        <span class="connect-supplier-orders-summary-label">
          Total Orders
        </span>

        <strong class="connect-supplier-orders-summary-value">
          {{ orders.length }}
        </strong>

        <span class="connect-supplier-orders-summary-note">
          Orders received
        </span>
      </div>

      <div class="connect-supplier-orders-summary-card">
        <span class="connect-supplier-orders-summary-label">
          Awaiting Payment
        </span>

        <strong class="connect-supplier-orders-summary-value">
          {{ unpaidOrders }}
        </strong>

        <span class="connect-supplier-orders-summary-note">
          Payment still pending
        </span>
      </div>

      <div class="connect-supplier-orders-summary-card">
        <span class="connect-supplier-orders-summary-label">
          Active Deliveries
        </span>

        <strong class="connect-supplier-orders-summary-value">
          {{ activeDeliveries }}
        </strong>

        <span class="connect-supplier-orders-summary-note">
          Currently in progress
        </span>
      </div>

    </section>

    <!-- Orders table section -->
    <section class="connect-supplier-orders-section">

      <div class="connect-supplier-orders-section-header">
        <div>
          <h2 class="connect-supplier-orders-section-title">
            Received Orders
          </h2>

          <p class="connect-supplier-orders-section-description">
            Orders placed by your business customers.
          </p>
        </div>

        <span class="connect-supplier-orders-count">
          {{ orders.length }} orders
        </span>
      </div>

      <div class="connect-supplier-orders-table-wrapper">
        <table class="connect-supplier-orders-table">

          <!-- Table headings -->
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Small Business</th>
              <th>Order Date</th>
              <th>Order Status</th>
              <th>Delivery Status</th>
              <th>Payment</th>
              <th>Action</th>
            </tr>
          </thead>

          <!-- Order information -->
          <tbody>
            <tr
              v-for="order in orders"
              :key="order.id"
              class="connect-supplier-orders-row"
            >

              <td class="connect-supplier-orders-order-number">
                {{ order.orderNumber }}
              </td>

              <td class="connect-supplier-orders-business">
                {{ order.business }}
              </td>

              <td class="connect-supplier-orders-date">
                {{ order.date }}
              </td>

              <!-- Order status -->
              <td>
                <span
                  class="connect-supplier-orders-status"
                  :class="getStatusClass(order.status)"
                >
                  <span class="connect-supplier-orders-status-dot"></span>
                  {{ order.status }}
                </span>
              </td>

              <!-- Delivery status -->
              <td>
                <span
                  class="connect-supplier-orders-status"
                  :class="getStatusClass(order.deliveryStatus)"
                >
                  <span class="connect-supplier-orders-status-dot"></span>
                  {{ order.deliveryStatus }}
                </span>
              </td>

              <!-- Payment status -->
              <td>
                <span
                  class="connect-supplier-orders-status"
                  :class="getStatusClass(order.paymentStatus)"
                >
                  <span class="connect-supplier-orders-status-dot"></span>
                  {{ order.paymentStatus }}
                </span>
              </td>

              <!-- View order -->
              <td class="connect-supplier-orders-action-cell">
                <button
                  class="connect-supplier-orders-view-button"
                  type="button"
                  @click="viewOrder(order)"
                >
                  View Order
                </button>
              </td>

            </tr>
          </tbody>

        </table>
      </div>

    </section>

    <!-- Selected order details -->
    <Transition name="connect-supplier-orders-details">

      <section
        v-if="selectedOrder"
        class="connect-supplier-orders-details"
      >

        <!-- Details header -->
        <div class="connect-supplier-orders-details-header">

          <div>
            <p class="connect-supplier-orders-details-eyebrow">
              ORDER DETAILS
            </p>

            <h2 class="connect-supplier-orders-details-title">
              {{ selectedOrder.orderNumber }}
            </h2>

            <p class="connect-supplier-orders-details-subtitle">
              Order received from {{ selectedOrder.business }}
            </p>
          </div>

          <!-- Close the details panel -->
          <button
            class="connect-supplier-orders-close-button"
            type="button"
            aria-label="Close order details"
            @click="selectedOrder = null"
          >
            ×
          </button>

        </div>

        <!-- Order information -->
        <div class="connect-supplier-orders-details-grid">

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
            <span>Order Status</span>
            <strong>{{ selectedOrder.status }}</strong>
          </div>

          <div class="connect-supplier-orders-detail-item">
            <span>Delivery</span>
            <strong>{{ selectedOrder.deliveryId }}</strong>
          </div>

          <div class="connect-supplier-orders-detail-item">
            <span>Delivery Status</span>
            <strong>{{ selectedOrder.deliveryStatus }}</strong>
          </div>

          <div class="connect-supplier-orders-detail-item">
            <span>Payment Status</span>
            <strong>{{ selectedOrder.paymentStatus }}</strong>
          </div>

        </div>

        <!-- Order totals -->
        <div class="connect-supplier-orders-cost-section">

          <div class="connect-supplier-orders-cost-row">
            <span>Order Subtotal</span>
            <strong>
              R {{ Number(selectedOrder.subtotal).toFixed(2) }}
            </strong>
          </div>

          <div class="connect-supplier-orders-cost-row">
            <span>Delivery Fee</span>
            <strong>
              R {{ Number(selectedOrder.deliveryFee).toFixed(2) }}
            </strong>
          </div>

          <div class="connect-supplier-orders-cost-row connect-supplier-orders-total-row">
            <span>Total</span>
            <strong>
              R {{ Number(selectedOrder.total).toFixed(2) }}
            </strong>
          </div>

        </div>

      </section>

    </Transition>

  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

// Import the shared order data
import { orders } from '../data/orders'

// Store the order currently being viewed
const selectedOrder = ref(null)

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

// Show the selected order
function viewOrder(order) {
  selectedOrder.value = order
}

// Convert a status into a class name
function getStatusClass(status) {
  return status.toLowerCase().replace(/\s+/g, '-')
}
</script>

<style scoped>
/* Main page */
.connect-supplier-orders-page {
  min-height: 100vh;
  padding: 32px;
  box-sizing: border-box;
  background: #E8E2DD;
  color: #5C3D24;
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

/* Page heading */
.connect-supplier-orders-header {
  margin-bottom: 28px;
}

.connect-supplier-orders-eyebrow {
  margin: 0 0 8px;
  color: #D17A4A;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.8px;
}

.connect-supplier-orders-title {
  margin: 0 0 8px;
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 38px;
  font-weight: 600;
  line-height: 1.1;
}

.connect-supplier-orders-description {
  max-width: 620px;
  margin: 0;
  color: #7A665B;
  font-size: 15px;
  line-height: 1.6;
}

/* Summary cards */
.connect-supplier-orders-summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 28px;
}

.connect-supplier-orders-summary-card {
  padding: 20px;
  background: #FFFEFC;
  border: 1px solid rgba(78, 52, 46, 0.05);
  border-radius: 14px;
  box-shadow: 0 4px 18px rgba(78, 52, 46, 0.06);
  transition:
    transform 180ms ease,
    box-shadow 180ms ease;
}

.connect-supplier-orders-summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(78, 52, 46, 0.1);
}

.connect-supplier-orders-summary-label {
  display: block;
  margin-bottom: 7px;
  color: #7A665B;
  font-size: 12px;
  font-weight: 600;
}

.connect-supplier-orders-summary-value {
  display: block;
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 30px;
  line-height: 1;
}

.connect-supplier-orders-summary-note {
  display: block;
  margin-top: 8px;
  color: #9A887D;
  font-size: 12px;
}

/* Orders section */
.connect-supplier-orders-section {
  overflow: hidden;
  background: #FFFEFC;
  border-radius: 16px;
  box-shadow: 0 4px 18px rgba(78, 52, 46, 0.08);
}

.connect-supplier-orders-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 22px 24px;
  border-bottom: 1px solid #E8E2DD;
}

.connect-supplier-orders-section-title {
  margin: 0 0 4px;
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 23px;
  font-weight: 600;
}

.connect-supplier-orders-section-description {
  margin: 0;
  color: #8A776C;
  font-size: 13px;
}

.connect-supplier-orders-count {
  flex-shrink: 0;
  padding: 7px 11px;
  border-radius: 999px;
  background: #F3E7D9;
  color: #8A5A32;
  font-size: 12px;
  font-weight: 700;
}

/* Table */
.connect-supplier-orders-table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.connect-supplier-orders-table {
  width: 100%;
  min-width: 900px;
  border-collapse: collapse;
}

.connect-supplier-orders-table th {
  padding: 14px 16px;
  background: #4E342E;
  color: #FFFEFC;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.2px;
}

.connect-supplier-orders-table td {
  padding: 16px;
  border-bottom: 1px solid #E8E2DD;
  font-size: 13px;
}

.connect-supplier-orders-row:last-child td {
  border-bottom: none;
}

.connect-supplier-orders-row {
  transition: background 160ms ease;
}

.connect-supplier-orders-row:hover {
  background: #FCF9F6;
}

.connect-supplier-orders-order-number {
  color: #4E342E;
  font-weight: 700;
}

.connect-supplier-orders-business {
  color: #5C3D24;
  font-weight: 600;
}

.connect-supplier-orders-date {
  color: #7A665B;
}

/* Status badges */
.connect-supplier-orders-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
}

.connect-supplier-orders-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

/* Completed / paid */
.connect-supplier-orders-status.completed,
.connect-supplier-orders-status.paid {
  background: #E6F0E8;
  color: #3F6847;
}

/* Pending / active statuses */
.connect-supplier-orders-status.pending,
.connect-supplier-orders-status.processing,
.connect-supplier-orders-status.in-progress,
.connect-supplier-orders-status.in-transit,
.connect-supplier-orders-status.out-for-delivery {
  background: #F3E7D9;
  color: #8A5A32;
}

/* Unpaid status */
.connect-supplier-orders-status.unpaid {
  background: #F8E2DD;
  color: #9A4938;
}

/* Action */
.connect-supplier-orders-action-cell {
  white-space: nowrap;
}

.connect-supplier-orders-view-button {
  padding: 8px 13px;
  border: 1px solid #D8CCC4;
  border-radius: 8px;
  background: #FFFEFC;
  color: #5C3D24;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition:
    background 180ms ease,
    border-color 180ms ease,
    transform 180ms ease;
}

.connect-supplier-orders-view-button:hover {
  background: #F3E7D9;
  border-color: #D17A4A;
  transform: translateY(-1px);
}

.connect-supplier-orders-view-button:active {
  transform: translateY(0);
}

/* Details card */
.connect-supplier-orders-details {
  margin-top: 24px;
  padding: 26px;
  background: #FFFEFC;
  border-radius: 16px;
  box-shadow: 0 4px 18px rgba(78, 52, 46, 0.08);
}

.connect-supplier-orders-details-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
}

.connect-supplier-orders-details-eyebrow {
  margin: 0 0 6px;
  color: #D17A4A;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.6px;
}

.connect-supplier-orders-details-title {
  margin: 0 0 5px;
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 25px;
  font-weight: 600;
}

.connect-supplier-orders-details-subtitle {
  margin: 0;
  color: #8A776C;
  font-size: 13px;
}

.connect-supplier-orders-close-button {
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

.connect-supplier-orders-close-button:hover {
  background: #F3E7D9;
  border-color: #D17A4A;
  transform: rotate(4deg);
}

/* Details information */
.connect-supplier-orders-details-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  overflow: hidden;
  border: 1px solid #E8E2DD;
  border-radius: 12px;
  background: #E8E2DD;
}

.connect-supplier-orders-detail-item {
  padding: 15px;
  background: #FFFEFC;
}

.connect-supplier-orders-detail-item span {
  display: block;
  margin-bottom: 5px;
  color: #9A887D;
  font-size: 11px;
  font-weight: 600;
}

.connect-supplier-orders-detail-item strong {
  color: #5C3D24;
  font-size: 13px;
}

/* Cost section */
.connect-supplier-orders-cost-section {
  margin-top: 20px;
  padding-top: 18px;
  border-top: 1px solid #E8E2DD;
}

.connect-supplier-orders-cost-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 8px 0;
  color: #7A665B;
  font-size: 13px;
}

.connect-supplier-orders-cost-row strong {
  color: #5C3D24;
}

.connect-supplier-orders-total-row {
  margin-top: 6px;
  padding-top: 14px;
  border-top: 1px solid #E8E2DD;
  color: #4E342E;
  font-size: 15px;
}

.connect-supplier-orders-total-row strong {
  color: #4E342E;
  font-size: 17px;
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
@media (max-width: 900px) {
  .connect-supplier-orders-page {
    padding: 24px;
  }

  .connect-supplier-orders-summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .connect-supplier-orders-details-grid {
    grid-template-columns: 1fr;
  }
}

/* Mobile */
@media (max-width: 640px) {
  .connect-supplier-orders-page {
    padding: 20px 16px;
  }

  .connect-supplier-orders-title {
    font-size: 31px;
  }

  .connect-supplier-orders-summary {
    grid-template-columns: 1fr;
  }

  .connect-supplier-orders-section-header {
    align-items: flex-start;
    flex-direction: column;
    padding: 20px;
  }

  .connect-supplier-orders-count {
    align-self: flex-start;
  }

  .connect-supplier-orders-details {
    padding: 20px;
  }

  .connect-supplier-orders-details-header {
    gap: 12px;
  }

  .connect-supplier-orders-details-title {
    font-size: 22px;
  }

  .connect-supplier-orders-cost-row {
    align-items: flex-start;
  }
}
</style>
