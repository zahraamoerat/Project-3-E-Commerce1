<template>

  <!-- Small Business Deliveries page -->
  <div class="connect-sb-deliveries-page">

    <!-- Page heading -->
    <header class="connect-sb-deliveries-header">

      <div>
        <p class="connect-sb-deliveries-eyebrow">
          DELIVERY MANAGEMENT
        </p>

        <h1 class="connect-sb-deliveries-title">
          My Deliveries
        </h1>

        <p class="connect-sb-deliveries-description">
          Follow your orders from supplier to delivery and keep track of their progress.
        </p>
      </div>

    </header>


    <!-- Delivery summary -->
    <section class="connect-sb-deliveries-summary">

      <!-- Total deliveries -->
      <div class="connect-sb-deliveries-summary-card">
        <span class="connect-sb-deliveries-summary-icon">
          📦
        </span>

        <div>
          <p>Total Deliveries</p>
          <strong>{{ deliveries.length }}</strong>
        </div>
      </div>


      <!-- Deliveries still in progress -->
      <div class="connect-sb-deliveries-summary-card">
        <span class="connect-sb-deliveries-summary-icon">
          🚚
        </span>

        <div>
          <p>In Progress</p>
          <strong>{{ activeDeliveries }}</strong>
        </div>
      </div>


      <!-- Completed deliveries -->
      <div class="connect-sb-deliveries-summary-card">
        <span class="connect-sb-deliveries-summary-icon">
          ✓
        </span>

        <div>
          <p>Completed</p>
          <strong>{{ completedDeliveries }}</strong>
        </div>
      </div>

    </section>


    <!-- Deliveries table -->
    <section class="connect-sb-deliveries-table-card">

      <div class="connect-sb-deliveries-table-heading">

        <div>
          <h2>Delivery Overview</h2>

          <p>
            Deliveries connected to your supplier orders.
          </p>
        </div>

        <span class="connect-sb-deliveries-table-accent"></span>

      </div>


      <!-- Allows the table to scroll on smaller screens -->
      <div class="connect-sb-deliveries-table-wrapper">

        <table class="connect-sb-deliveries-table">

          <thead>
            <tr>
              <th>Delivery Number</th>
              <th>Order Number</th>
              <th>Supplier</th>
              <th>Delivery Status</th>
              <th>Payment</th>
              <th>Action</th>
            </tr>
          </thead>


          <tbody>

            <tr
              v-for="delivery in deliveries"
              :key="delivery.deliveryId"
              class="connect-sb-deliveries-row"
            >

              <!-- Delivery number -->
              <td>
                <span class="connect-sb-deliveries-number">
                  {{ delivery.deliveryId }}
                </span>
              </td>


              <!-- Related order -->
              <td>
                <span class="connect-sb-deliveries-order">
                  {{ delivery.orderNumber }}
                </span>
              </td>


              <!-- Supplier -->
              <td>
                <span class="connect-sb-deliveries-supplier">
                  {{ delivery.supplier }}
                </span>
              </td>


              <!-- Delivery status -->
              <td>
                <span
                  class="connect-sb-deliveries-status"
                  :class="getStatusClass(delivery.deliveryStatus)"
                >
                  <span class="connect-sb-deliveries-status-dot"></span>
                  {{ delivery.deliveryStatus }}
                </span>
              </td>


              <!-- Payment status -->
              <td>
                <span
                  class="connect-sb-deliveries-status"
                  :class="getStatusClass(delivery.paymentStatus)"
                >
                  <span class="connect-sb-deliveries-status-dot"></span>
                  {{ delivery.paymentStatus }}
                </span>
              </td>


              <!-- Track delivery -->
              <td class="connect-sb-deliveries-actions">

                <button
                  type="button"
                  class="connect-sb-deliveries-track-button"
                  @click="trackDelivery(delivery)"
                >
                  Track
                  <span>→</span>
                </button>

              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </section>


    <!-- Selected delivery details -->
    <Transition name="connect-sb-deliveries-details">

      <section
        v-if="selectedDelivery"
        class="connect-sb-deliveries-details-card"
      >

        <div class="connect-sb-deliveries-details-header">

          <div>
            <p class="connect-sb-deliveries-details-eyebrow">
              DELIVERY DETAILS
            </p>

            <h2>
              {{ selectedDelivery.deliveryId }}
            </h2>

            <p>
              {{ selectedDelivery.supplier }}
            </p>
          </div>


          <!-- Close the delivery details -->
          <button
            type="button"
            class="connect-sb-deliveries-close-button"
            aria-label="Close delivery details"
            @click="selectedDelivery = null"
          >
            ×
          </button>

        </div>


        <!-- Delivery information -->
        <div class="connect-sb-deliveries-details-grid">

          <div class="connect-sb-deliveries-detail-item">
            <span>Delivery Number</span>
            <strong>{{ selectedDelivery.deliveryId }}</strong>
          </div>


          <div class="connect-sb-deliveries-detail-item">
            <span>Order Number</span>
            <strong>{{ selectedDelivery.orderNumber }}</strong>
          </div>


          <div class="connect-sb-deliveries-detail-item">
            <span>Supplier</span>
            <strong>{{ selectedDelivery.supplier }}</strong>
          </div>


          <div class="connect-sb-deliveries-detail-item">
            <span>Delivery Status</span>

            <strong>
              {{ selectedDelivery.deliveryStatus }}
            </strong>
          </div>


          <div class="connect-sb-deliveries-detail-item">
            <span>Payment Status</span>

            <strong>
              {{ selectedDelivery.paymentStatus }}
            </strong>
          </div>


          <div class="connect-sb-deliveries-detail-item">
            <span>Delivery Fee</span>

            <strong>
              R {{ Number(selectedDelivery.deliveryFee).toFixed(2) }}
            </strong>
          </div>

        </div>


        <!-- Cost information -->
        <div class="connect-sb-deliveries-price-section">

          <div class="connect-sb-deliveries-price-row">
            <span>Order Total</span>

            <strong>
              R {{ Number(selectedDelivery.total).toFixed(2) }}
            </strong>
          </div>


          <div class="connect-sb-deliveries-price-row connect-sb-deliveries-price-total">
            <span>Delivery Fee</span>

            <strong>
              R {{ Number(selectedDelivery.deliveryFee).toFixed(2) }}
            </strong>
          </div>

        </div>


        <!-- Open the actual live tracking page -->
        <div class="connect-sb-deliveries-detail-actions">

          <router-link
            to="/tracking"
            class="connect-sb-deliveries-tracking-link"
          >
            <span>🚚</span>
            Open Live Tracking
          </router-link>

        </div>

      </section>

    </Transition>

  </div>

</template>


<script setup>

import { computed, ref } from 'vue'

// Get the shared order data
import { orders } from '../data/orders'


// Turn the order information into delivery information
const deliveries = orders.map(order => ({
  deliveryId: order.deliveryId,
  orderNumber: order.orderNumber,
  supplier: order.supplier,
  deliveryStatus: order.deliveryStatus,
  paymentStatus: order.paymentStatus,
  deliveryFee: order.deliveryFee,
  total: order.total
}))


// Keep track of the delivery the user selects
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


// Show the selected delivery details
function trackDelivery(delivery) {
  selectedDelivery.value = delivery
}


// Turn status text into a class name
function getStatusClass(status) {
  return status.toLowerCase().replace(/\s+/g, '-')
}

</script>


<style scoped>

/* Main page */
.connect-sb-deliveries-page {
  min-height: 100vh;
  padding: 34px;
  box-sizing: border-box;
  background: #E8E2DD;
  color: #5C3D24;

  /* Keep the interface text clean while headings use a serif */
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}


/* Header */
.connect-sb-deliveries-header {
  margin-bottom: 28px;
}

.connect-sb-deliveries-eyebrow,
.connect-sb-deliveries-details-eyebrow {
  margin: 0 0 7px;
  color: #D17A4A;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.7px;
}

.connect-sb-deliveries-title {
  margin: 0 0 8px;
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 40px;
  font-weight: 600;
  line-height: 1.1;
}

.connect-sb-deliveries-description {
  margin: 0;
  max-width: 650px;
  color: #7A665B;
  font-size: 15px;
  line-height: 1.6;
}


/* Delivery summary */
.connect-sb-deliveries-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 22px;
}

.connect-sb-deliveries-summary-card {
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

.connect-sb-deliveries-summary-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 9px 24px rgba(78, 52, 46, 0.1);
}

.connect-sb-deliveries-summary-icon {
  display: grid;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 12px;
  background: #F3E7D9;
  font-size: 18px;
}

.connect-sb-deliveries-summary-card p {
  margin: 0 0 3px;
  color: #8A766B;
  font-size: 12px;
  font-weight: 600;
}

.connect-sb-deliveries-summary-card strong {
  color: #4E342E;
  font-size: 21px;
  font-weight: 750;
}


/* Deliveries table */
.connect-sb-deliveries-table-card {
  overflow: hidden;
  border: 1px solid rgba(78, 52, 46, 0.07);
  border-radius: 18px;
  background: #FFFEFC;
  box-shadow: 0 7px 24px rgba(78, 52, 46, 0.07);
}

.connect-sb-deliveries-table-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 24px 18px;
}

.connect-sb-deliveries-table-heading h2 {
  margin: 0 0 4px;
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 23px;
  font-weight: 600;
}

.connect-sb-deliveries-table-heading p {
  margin: 0;
  color: #8A766B;
  font-size: 13px;
}

.connect-sb-deliveries-table-accent {
  width: 42px;
  height: 5px;
  border-radius: 999px;
  background: #D17A4A;
}


/* Keeps the table usable on phones */
.connect-sb-deliveries-table-wrapper {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.connect-sb-deliveries-table {
  width: 100%;
  min-width: 800px;
  border-collapse: collapse;
}

.connect-sb-deliveries-table thead {
  background: #4E342E;
}

.connect-sb-deliveries-table th {
  padding: 14px 17px;
  color: #FFFEFC;
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.4px;
  white-space: nowrap;
}

.connect-sb-deliveries-row {
  border-bottom: 1px solid #EEE7E2;
  transition: background 180ms ease;
}

.connect-sb-deliveries-row:last-child {
  border-bottom: none;
}

.connect-sb-deliveries-row:hover {
  background: #FCF8F4;
}

.connect-sb-deliveries-row td {
  padding: 16px 17px;
  color: #5C3D24;
  font-size: 13px;
  vertical-align: middle;
}

.connect-sb-deliveries-number {
  color: #4E342E;
  font-weight: 750;
}

.connect-sb-deliveries-order {
  color: #8A766B;
}

.connect-sb-deliveries-supplier {
  font-weight: 600;
}


/* Status badges */
.connect-sb-deliveries-status {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
}

.connect-sb-deliveries-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}


/* Completed deliveries and paid orders */
.connect-sb-deliveries-status.completed,
.connect-sb-deliveries-status.paid {
  background: #E6F0E8;
  color: #3F6847;
}


/* Unpaid deliveries */
.connect-sb-deliveries-status.unpaid {
  background: #F8E2DD;
  color: #9A4938;
}


/* Deliveries that are still moving */
.connect-sb-deliveries-status.processing,
.connect-sb-deliveries-status.pending,
.connect-sb-deliveries-status.in-progress,
.connect-sb-deliveries-status.in-transit,
.connect-sb-deliveries-status.out-for-delivery {
  background: #F3E7D9;
  color: #8A5A32;
}


/* Table action */
.connect-sb-deliveries-actions {
  white-space: nowrap;
}

.connect-sb-deliveries-track-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 34px;
  padding: 8px 13px;
  box-sizing: border-box;
  border: 1px solid #D17A4A;
  border-radius: 9px;
  background: #D17A4A;
  color: #FFFEFC;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(209, 122, 74, 0.16);
  transition:
    transform 160ms ease,
    background 160ms ease,
    box-shadow 160ms ease;
}

.connect-sb-deliveries-track-button:hover {
  transform: translateY(-1px);
  background: #BF683A;
  box-shadow: 0 6px 14px rgba(209, 122, 74, 0.24);
}


/* Delivery details */
.connect-sb-deliveries-details-card {
  margin-top: 22px;
  padding: 25px;
  border: 1px solid rgba(78, 52, 46, 0.07);
  border-radius: 18px;
  background: #FFFEFC;
  box-shadow: 0 8px 26px rgba(78, 52, 46, 0.08);
}

.connect-sb-deliveries-details-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 22px;
}

.connect-sb-deliveries-details-header h2 {
  margin: 0 0 3px;
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 26px;
  font-weight: 600;
}

.connect-sb-deliveries-details-header p:last-child {
  margin: 0;
  color: #8A766B;
  font-size: 13px;
}


/* Close button */
.connect-sb-deliveries-close-button {
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

.connect-sb-deliveries-close-button:hover {
  transform: rotate(90deg);
  background: #F3E7D9;
}


/* Delivery information grid */
.connect-sb-deliveries-details-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  overflow: hidden;
  border: 1px solid #EEE7E2;
  border-radius: 13px;
  background: #EEE7E2;
}

.connect-sb-deliveries-detail-item {
  padding: 15px;
  background: #FFFEFC;
}

.connect-sb-deliveries-detail-item span {
  display: block;
  margin-bottom: 5px;
  color: #8A766B;
  font-size: 11px;
}

.connect-sb-deliveries-detail-item strong {
  color: #5C3D24;
  font-size: 13px;
}


/* Cost information */
.connect-sb-deliveries-price-section {
  margin-top: 18px;
  padding: 15px 17px;
  border-radius: 12px;
  background: #F8F2ED;
}

.connect-sb-deliveries-price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 5px 0;
  color: #7A665B;
  font-size: 13px;
}

.connect-sb-deliveries-price-row strong {
  color: #5C3D24;
}

.connect-sb-deliveries-price-total {
  margin-top: 6px;
  padding-top: 11px;
  border-top: 1px solid #E2D7CF;
}

.connect-sb-deliveries-price-total strong {
  color: #D17A4A;
}


/* Live tracking button */
.connect-sb-deliveries-detail-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
}

.connect-sb-deliveries-tracking-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  padding: 10px 17px;
  box-sizing: border-box;
  border-radius: 10px;
  background: #4E342E;
  color: #FFFEFC;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 5px 14px rgba(78, 52, 46, 0.14);
  transition:
    transform 160ms ease,
    background 160ms ease,
    box-shadow 160ms ease;
}

.connect-sb-deliveries-tracking-link:hover {
  transform: translateY(-2px);
  background: #3E2924;
  box-shadow: 0 7px 17px rgba(78, 52, 46, 0.2);
}


/* Delivery details animation */
.connect-sb-deliveries-details-enter-active,
.connect-sb-deliveries-details-leave-active {
  transition:
    opacity 220ms ease,
    transform 220ms ease;
}

.connect-sb-deliveries-details-enter-from,
.connect-sb-deliveries-details-leave-to {
  opacity: 0;
  transform: translateY(10px);
}


/* Tablet */
@media (max-width: 900px) {

  .connect-sb-deliveries-page {
    padding: 26px;
  }

  .connect-sb-deliveries-summary {
    grid-template-columns: repeat(2, 1fr);
  }

  .connect-sb-deliveries-details-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}


/* Phone */
@media (max-width: 640px) {

  .connect-sb-deliveries-page {
    padding: 20px 15px;
  }

  .connect-sb-deliveries-title {
    font-size: 32px;
  }

  .connect-sb-deliveries-description {
    font-size: 14px;
  }

  .connect-sb-deliveries-summary {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .connect-sb-deliveries-summary-card {
    min-height: 70px;
  }

  .connect-sb-deliveries-table-heading {
    padding: 19px 17px 16px;
  }

  .connect-sb-deliveries-table-heading h2 {
    font-size: 21px;
  }

  /* Keep the table scrollable instead of squeezing the columns */
  .connect-sb-deliveries-table {
    min-width: 760px;
  }

  .connect-sb-deliveries-details-card {
    padding: 20px 16px;
  }

  .connect-sb-deliveries-details-grid {
    grid-template-columns: 1fr;
  }

  .connect-sb-deliveries-tracking-link {
    width: 100%;
  }
}

</style>