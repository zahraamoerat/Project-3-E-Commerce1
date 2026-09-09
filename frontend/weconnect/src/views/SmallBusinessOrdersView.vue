
<template>

  <!-- Small Business Orders page -->
  <div class="connect-sb-orders-page">

    <!-- Page heading -->
    <header class="connect-sb-orders-header">
      <div>
        <p class="connect-sb-orders-eyebrow">
          ORDER MANAGEMENT
        </p>

        <h1 class="connect-sb-orders-title">
          My Orders
        </h1>

        <p class="connect-sb-orders-description">
          Keep track of your supplier orders, payments and deliveries.
        </p>
      </div>
    </header>


    <!-- Quick order summary -->
    <section class="connect-sb-orders-summary">

      <!-- Total orders -->
      <div class="connect-sb-orders-summary-card">
        <span class="connect-sb-orders-summary-icon">📦</span>

        <div>
          <p>Total Orders</p>
          <strong>{{ orders.length }}</strong>
        </div>
      </div>

      <!-- Orders that still need payment -->
      <div class="connect-sb-orders-summary-card">
        <span class="connect-sb-orders-summary-icon">💳</span>

        <div>
          <p>Awaiting Payment</p>
          <strong>{{ unpaidOrders }}</strong>
        </div>
      </div>

      <!-- Orders that are still being delivered -->
      <div class="connect-sb-orders-summary-card">
        <span class="connect-sb-orders-summary-icon">🚚</span>

        <div>
          <p>Active Deliveries</p>
          <strong>{{ activeDeliveries }}</strong>
        </div>
      </div>

    </section>


    <!-- Orders table -->
    <section class="connect-sb-orders-table-card">

      <div class="connect-sb-orders-table-heading">
        <div>
          <h2>Recent Orders</h2>

          <p>
            Your latest purchases from suppliers.
          </p>
        </div>

        <span class="connect-sb-orders-table-accent"></span>
      </div>


      <!-- Allows the table to scroll on small screens -->
      <div class="connect-sb-orders-table-wrapper">

        <table class="connect-sb-orders-table">

          <thead>
            <tr>
              <th>Order Number</th>
              <th>Supplier</th>
              <th>Order Date</th>
              <th>Order Status</th>
              <th>Delivery</th>
              <th>Payment</th>
              <th>Action</th>
            </tr>
          </thead>


          <tbody>

            <tr
              v-for="order in orders"
              :key="order.id"
              class="connect-sb-orders-row"
            >

              <!-- Order number -->
              <td>
                <span class="connect-sb-orders-number">
                  {{ order.orderNumber }}
                </span>
              </td>


              <!-- Supplier -->
              <td>
                <span class="connect-sb-orders-supplier">
                  {{ order.supplier }}
                </span>
              </td>


              <!-- Order date -->
              <td>
                <span class="connect-sb-orders-date">
                  {{ order.date }}
                </span>
              </td>


              <!-- Order status -->
              <td>
                <span
                  class="connect-sb-orders-status"
                  :class="getStatusClass(order.status)"
                >
                  <span class="connect-sb-orders-status-dot"></span>
                  {{ order.status }}
                </span>
              </td>


              <!-- Delivery status -->
              <td>
                <span
                  class="connect-sb-orders-status"
                  :class="getStatusClass(order.deliveryStatus)"
                >
                  <span class="connect-sb-orders-status-dot"></span>
                  {{ order.deliveryStatus }}
                </span>
              </td>


              <!-- Payment status -->
              <td>
                <span
                  class="connect-sb-orders-status"
                  :class="getPaymentClass(order.paymentStatus)"
                >
                  <span class="connect-sb-orders-status-dot"></span>
                  {{ order.paymentStatus }}
                </span>
              </td>


              <!-- Action buttons -->
              <td class="connect-sb-orders-actions">

                <button
                  type="button"
                  class="connect-sb-orders-view-button"
                  @click="viewOrder(order)"
                >
                  View
                  <span>→</span>
                </button>


                <!-- Only show Pay when the order is unpaid -->
                <router-link
                  v-if="order.paymentStatus === 'Unpaid'"
                  :to="`/payment/${order.id}`"
                  class="connect-sb-orders-pay-button"
                >
                  Pay
                </router-link>

              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </section>


    <!-- Order details -->
    <Transition name="connect-sb-orders-details">

      <section
        v-if="selectedOrder"
        class="connect-sb-orders-details-card"
      >

        <div class="connect-sb-orders-details-header">

          <div>
            <p class="connect-sb-orders-details-eyebrow">
              ORDER DETAILS
            </p>

            <h2>
              {{ selectedOrder.orderNumber }}
            </h2>

            <p>
              {{ selectedOrder.supplier }}
            </p>
          </div>


          <!-- Close the details -->
          <button
            type="button"
            class="connect-sb-orders-close-button"
            aria-label="Close order details"
            @click="selectedOrder = null"
          >
            ×
          </button>

        </div>


        <!-- Order information -->
        <div class="connect-sb-orders-details-grid">

          <div class="connect-sb-orders-detail-item">
            <span>Order Date</span>
            <strong>{{ selectedOrder.date }}</strong>
          </div>


          <div class="connect-sb-orders-detail-item">
            <span>Order Status</span>
            <strong>{{ selectedOrder.status }}</strong>
          </div>


          <div class="connect-sb-orders-detail-item">
            <span>Delivery ID</span>
            <strong>{{ selectedOrder.deliveryId }}</strong>
          </div>


          <div class="connect-sb-orders-detail-item">
            <span>Delivery Status</span>
            <strong>{{ selectedOrder.deliveryStatus }}</strong>
          </div>


          <div class="connect-sb-orders-detail-item">
            <span>Payment Status</span>
            <strong>{{ selectedOrder.paymentStatus }}</strong>
          </div>


          <div class="connect-sb-orders-detail-item">
            <span>Delivery Fee</span>

            <strong>
              R {{ Number(selectedOrder.deliveryFee).toFixed(2) }}
            </strong>
          </div>

        </div>


        <!-- Price information -->
        <div class="connect-sb-orders-price-section">

          <div class="connect-sb-orders-price-row">
            <span>Order Total</span>

            <strong>
              R {{ Number(selectedOrder.total).toFixed(2) }}
            </strong>
          </div>


          <div class="connect-sb-orders-price-row connect-sb-orders-price-total">
            <span>Total with Delivery</span>

            <strong>
              R {{ totalWithDelivery }}
            </strong>
          </div>

        </div>


        <!-- Links to other pages where needed -->
        <div class="connect-sb-orders-detail-actions">

          <router-link
            :to="`/tracking?order=${selectedOrder.id}`"
            class="connect-sb-orders-track-button"
          >
            <span>🚚</span>
            Track Delivery
          </router-link>


          <!-- Only show payment when the order is unpaid -->
          <router-link
            v-if="selectedOrder.paymentStatus === 'Unpaid'"
            :to="`/payment/${selectedOrder.id}`"
            class="connect-sb-orders-details-pay-button"
          >
            Pay for Order
            <span>→</span>
          </router-link>

        </div>

      </section>

    </Transition>

  </div>

</template>


<script setup>

import { computed, ref } from 'vue'

// Get the order data
import { orders } from '../data/orders'


// Keep track of the order the user clicks
const selectedOrder = ref(null)


// Count unpaid orders
const unpaidOrders = computed(() => {
  return orders.filter(order => order.paymentStatus === 'Unpaid').length
})


// Count deliveries that are still active
const activeDeliveries = computed(() => {
  return orders.filter(order => {
    return order.deliveryStatus.toLowerCase() !== 'completed'
  }).length
})


// Show the order details
function viewOrder(order) {
  selectedOrder.value = order
}


// Turn status text into a class name
function getStatusClass(status) {
  return status.toLowerCase().replace(/\s+/g, '-')
}


// Get the payment status class
function getPaymentClass(status) {
  return status.toLowerCase().replace(/\s+/g, '-')
}


// Add the delivery fee to the order total
const totalWithDelivery = computed(() => {

  if (!selectedOrder.value) {
    return '0.00'
  }

  const total = Number(selectedOrder.value.total)
  const deliveryFee = Number(selectedOrder.value.deliveryFee)

  return (total + deliveryFee).toFixed(2)
})

</script>


<style scoped>

/* Main page */
.connect-sb-orders-page {
  min-height: 100vh;
  padding: 34px;
  box-sizing: border-box;
  background: #E8E2DD;
  color: #5C3D24;

  /* Keep the main interface clean and easy to read */
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}


/* Header */
.connect-sb-orders-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 28px;
}

.connect-sb-orders-eyebrow,
.connect-sb-orders-details-eyebrow {
  margin: 0 0 7px;
  color: #D17A4A;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.7px;
}

.connect-sb-orders-title {
  margin: 0 0 8px;
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 40px;
  font-weight: 600;
  line-height: 1.1;
}

.connect-sb-orders-description {
  margin: 0;
  max-width: 600px;
  color: #7A665B;
  font-size: 15px;
  line-height: 1.6;
}


/* Summary cards */
.connect-sb-orders-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 22px;
}

.connect-sb-orders-summary-card {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 78px;
  padding: 16px 18px;
  box-sizing: border-box;
  border: 1px solid rgba(78, 52, 46, 0.07);
  border-radius: 15px;
  background: #FFFEFC;
  box-shadow: 0 5px 18px rgba(78, 52, 46, 0.055);
  transition:
    transform 180ms ease,
    box-shadow 180ms ease;
}

.connect-sb-orders-summary-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 9px 24px rgba(78, 52, 46, 0.1);
}

.connect-sb-orders-summary-icon {
  display: grid;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 12px;
  background: #F3E7D9;
  font-size: 18px;
}

.connect-sb-orders-summary-card p {
  margin: 0 0 3px;
  color: #8A766B;
  font-size: 12px;
  font-weight: 600;
}

.connect-sb-orders-summary-card strong {
  color: #4E342E;
  font-size: 21px;
  font-weight: 750;
}


/* Orders table */
.connect-sb-orders-table-card {
  overflow: hidden;
  border: 1px solid rgba(78, 52, 46, 0.07);
  border-radius: 18px;
  background: #FFFEFC;
  box-shadow: 0 7px 24px rgba(78, 52, 46, 0.07);
}

.connect-sb-orders-table-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 24px 18px;
}

.connect-sb-orders-table-heading h2 {
  margin: 0 0 4px;
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 23px;
  font-weight: 600;
}

.connect-sb-orders-table-heading p {
  margin: 0;
  color: #8A766B;
  font-size: 13px;
}

.connect-sb-orders-table-accent {
  width: 42px;
  height: 5px;
  border-radius: 999px;
  background: #D17A4A;
}


/* Keeps the table usable on phones */
.connect-sb-orders-table-wrapper {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.connect-sb-orders-table {
  width: 100%;
  min-width: 850px;
  border-collapse: collapse;
}

.connect-sb-orders-table thead {
  background: #4E342E;
}

.connect-sb-orders-table th {
  padding: 14px 17px;
  color: #FFFEFC;
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.4px;
  white-space: nowrap;
}

.connect-sb-orders-row {
  border-bottom: 1px solid #EEE7E2;
  transition: background 180ms ease;
}

.connect-sb-orders-row:last-child {
  border-bottom: none;
}

.connect-sb-orders-row:hover {
  background: #FCF8F4;
}

.connect-sb-orders-row td {
  padding: 16px 17px;
  color: #5C3D24;
  font-size: 13px;
  vertical-align: middle;
}

.connect-sb-orders-number {
  color: #4E342E;
  font-weight: 750;
}

.connect-sb-orders-supplier {
  font-weight: 600;
}

.connect-sb-orders-date {
  color: #8A766B;
}


/* Status badges */
.connect-sb-orders-status {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
}

.connect-sb-orders-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.connect-sb-orders-status.completed,
.connect-sb-orders-status.paid {
  background: #E6F0E8;
  color: #3F6847;
}

.connect-sb-orders-status.unpaid {
  background: #F8E2DD;
  color: #9A4938;
}

.connect-sb-orders-status.processing,
.connect-sb-orders-status.pending,
.connect-sb-orders-status.in-transit,
.connect-sb-orders-status.out-for-delivery {
  background: #F3E7D9;
  color: #8A5A32;
}


/* Action buttons */
.connect-sb-orders-actions {
  white-space: nowrap;
}

.connect-sb-orders-view-button,
.connect-sb-orders-pay-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-height: 34px;
  padding: 8px 12px;
  border-radius: 9px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  transition:
    transform 160ms ease,
    background 160ms ease,
    box-shadow 160ms ease;
}

.connect-sb-orders-view-button {
  gap: 7px;
  margin-right: 5px;
  border: 1px solid #D8CCC4;
  background: #FFFEFC;
  color: #5C3D24;
}

.connect-sb-orders-view-button:hover {
  transform: translateY(-1px);
  border-color: #BDAEA4;
  background: #F8F2ED;
}

.connect-sb-orders-pay-button {
  border: 1px solid #D17A4A;
  background: #D17A4A;
  color: #FFFEFC;
  box-shadow: 0 4px 10px rgba(209, 122, 74, 0.18);
}

.connect-sb-orders-pay-button:hover {
  transform: translateY(-1px);
  background: #BF683A;
  box-shadow: 0 6px 14px rgba(209, 122, 74, 0.25);
}


/* Order details */
.connect-sb-orders-details-card {
  margin-top: 22px;
  padding: 25px;
  border: 1px solid rgba(78, 52, 46, 0.07);
  border-radius: 18px;
  background: #FFFEFC;
  box-shadow: 0 8px 26px rgba(78, 52, 46, 0.08);
}

.connect-sb-orders-details-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 22px;
}

.connect-sb-orders-details-header h2 {
  margin: 0 0 3px;
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 26px;
  font-weight: 600;
}

.connect-sb-orders-details-header p:last-child {
  margin: 0;
  color: #8A766B;
  font-size: 13px;
}

.connect-sb-orders-close-button {
  display: grid;
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  place-items: center;
  border: 1px solid #DDD2CB;
  border-radius: 50%;
  background: transparent;
  color: #7A665B;
  font-family: inherit;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  transition:
    transform 160ms ease,
    background 160ms ease;
}

.connect-sb-orders-close-button:hover {
  transform: rotate(90deg);
  background: #F3E7D9;
}


/* Order details grid */
.connect-sb-orders-details-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  overflow: hidden;
  border: 1px solid #EEE7E2;
  border-radius: 13px;
  background: #EEE7E2;
}

.connect-sb-orders-detail-item {
  padding: 15px;
  background: #FFFEFC;
}

.connect-sb-orders-detail-item span {
  display: block;
  margin-bottom: 5px;
  color: #8A766B;
  font-size: 11px;
}

.connect-sb-orders-detail-item strong {
  color: #5C3D24;
  font-size: 13px;
}


/* Price section */
.connect-sb-orders-price-section {
  margin-top: 18px;
  padding: 15px 17px;
  border-radius: 12px;
  background: #F8F2ED;
}

.connect-sb-orders-price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 5px 0;
  color: #7A665B;
  font-size: 13px;
}

.connect-sb-orders-price-row strong {
  color: #5C3D24;
}

.connect-sb-orders-price-total {
  margin-top: 6px;
  padding-top: 11px;
  border-top: 1px solid #E2D7CF;
  color: #4E342E;
  font-weight: 700;
}

.connect-sb-orders-price-total strong {
  color: #D17A4A;
  font-size: 18px;
}


/* Detail buttons */
.connect-sb-orders-detail-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
}

.connect-sb-orders-track-button,
.connect-sb-orders-details-pay-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  padding: 10px 17px;
  box-sizing: border-box;
  border-radius: 10px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  transition:
    transform 160ms ease,
    box-shadow 160ms ease,
    background 160ms ease;
}

.connect-sb-orders-track-button {
  border: 1px solid #D8CCC4;
  background: #FFFEFC;
  color: #5C3D24;
}

.connect-sb-orders-track-button:hover {
  transform: translateY(-2px);
  background: #F8F2ED;
  box-shadow: 0 5px 14px rgba(78, 52, 46, 0.08);
}

.connect-sb-orders-details-pay-button {
  background: #D17A4A;
  color: #FFFEFC;
  box-shadow: 0 5px 14px rgba(209, 122, 74, 0.18);
}

.connect-sb-orders-details-pay-button:hover {
  transform: translateY(-2px);
  background: #BF683A;
  box-shadow: 0 7px 17px rgba(209, 122, 74, 0.25);
}


/* Small animation when order details open */
.connect-sb-orders-details-enter-active,
.connect-sb-orders-details-leave-active {
  transition:
    opacity 220ms ease,
    transform 220ms ease;
}

.connect-sb-orders-details-enter-from,
.connect-sb-orders-details-leave-to {
  opacity: 0;
  transform: translateY(10px);
}


/* Tablet */
@media (max-width: 900px) {

  .connect-sb-orders-page {
    padding: 26px;
  }

  .connect-sb-orders-summary {
    grid-template-columns: repeat(2, 1fr);
  }

  .connect-sb-orders-details-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}


/* Phone */
@media (max-width: 640px) {

  .connect-sb-orders-page {
    padding: 20px 15px;
  }

  .connect-sb-orders-header {
    margin-bottom: 22px;
  }

  .connect-sb-orders-title {
    font-size: 32px;
  }

  .connect-sb-orders-description {
    max-width: 100%;
    font-size: 14px;
  }

  .connect-sb-orders-summary {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .connect-sb-orders-summary-card {
    min-height: 70px;
  }

  .connect-sb-orders-table-heading {
    padding: 19px 17px 16px;
  }

  .connect-sb-orders-table-heading h2 {
    font-size: 21px;
  }

  /* Keep the table scrollable instead of squeezing the columns */
  .connect-sb-orders-table {
    min-width: 780px;
  }

  .connect-sb-orders-details-card {
    padding: 20px 16px;
  }

  .connect-sb-orders-details-grid {
    grid-template-columns: 1fr;
  }

  .connect-sb-orders-detail-actions {
    flex-direction: column;
  }

  .connect-sb-orders-track-button,
  .connect-sb-orders-details-pay-button {
    width: 100%;
  }
}

</style>
