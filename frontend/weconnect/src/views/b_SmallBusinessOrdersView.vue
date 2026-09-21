<template>

  <!-- Small Business Orders page -->
  <div class="connect-sb-orders-page">

    <!-- Main page heading -->
    <header class="connect-sb-orders-header">

      <!-- Main title area -->
      <div class="connect-sb-orders-heading">
        <p class="connect-sb-orders-eyebrow">
          ORDER MANAGEMENT
        </p>

        <h1 class="connect-sb-orders-title">
          Orders
        </h1>
      </div>

      <!-- Date sits neatly in the top-right -->
      <div class="connect-sb-orders-date-wrapper">
        <FontAwesomeIcon
          :icon="faCalendarDays"
          class="connect-sb-orders-calendar-icon"
        />

        <p class="connect-sb-orders-date">
          Tuesday, September 1, 2026
        </p>
      </div>

      <!-- Full-width divider separates the header from the search -->
      <span class="connect-sb-orders-header-divider"></span>

      <!-- Search sits below the divider -->
      <div class="connect-sb-orders-search">
        <FontAwesomeIcon
          :icon="faMagnifyingGlass"
          class="connect-sb-orders-search-icon"
        />

        <input
          v-model="searchQuery"
          type="search"
          placeholder="Search orders..."
          aria-label="Search orders"
        />
      </div>

    </header>


    <!-- Order filters -->
    <section class="connect-sb-orders-toolbar">

      <div class="connect-sb-orders-tabs">

        <button
          type="button"
          class="connect-sb-orders-tab"
          :class="{ active: activeFilter === 'All' }"
          @click="activeFilter = 'All'"
        >
          All
        </button>

        <button
          type="button"
          class="connect-sb-orders-tab"
          :class="{ active: activeFilter === 'On Process' }"
          @click="activeFilter = 'On Process'"
        >
          On Process
        </button>

        <button
          type="button"
          class="connect-sb-orders-tab"
          :class="{ active: activeFilter === 'Completed' }"
          @click="activeFilter = 'Completed'"
        >
          Completed
        </button>

      </div>

      <!-- Active order count -->
      <div class="connect-sb-orders-count">
        <strong>{{ activeOrdersCount }}</strong>
        <span>active orders</span>

        <span class="connect-sb-orders-count-divider">
          of
        </span>

        <strong>{{ orders.length }}</strong>
        <span>total</span>
      </div>

    </section>


    <!-- Orders -->
    <section class="connect-sb-orders-content">

      <div class="connect-sb-orders-section-heading">

        <div>
          <p class="connect-sb-orders-section-eyebrow">
            YOUR ORDERS
          </p>

          <h2>
            Recent Orders
          </h2>
        </div>

        <span class="connect-sb-orders-heading-line"></span>

      </div>


      <!-- Order cards -->
      <div
        v-if="filteredOrders.length"
        class="connect-sb-orders-grid"
      >

        <article
          v-for="order in filteredOrders"
          :key="order.id"
          class="connect-sb-orders-card"
          :class="{
            'connect-sb-orders-card-selected':
              selectedOrder?.id === order.id
          }"
        >

          <!-- Selected order indicator -->
          <div
            v-if="selectedOrder?.id === order.id"
            class="connect-sb-orders-selected-label"
          >
            <span></span>
            Viewing details
          </div>


          <!-- Card top -->
          <div class="connect-sb-orders-card-top">

            <div class="connect-sb-orders-customer">

              <div class="connect-sb-orders-avatar">
                {{ getInitials(order.supplier) }}
              </div>

              <div>
                <h3>
                  {{ order.supplier }}
                </h3>

                <p>
                  #{{ order.orderNumber }}
                </p>
              </div>

            </div>


            <!-- Order status -->
            <span
              class="connect-sb-orders-status"
              :class="getStatusClass(order.status)"
            >
              <span class="connect-sb-orders-status-dot"></span>
              {{ order.status }}
            </span>

          </div>


          <!-- Card metadata -->
          <div class="connect-sb-orders-card-meta">

            <span>
              <FontAwesomeIcon :icon="faClock" />
              {{ order.date }}
            </span>

            <span>
              <FontAwesomeIcon :icon="faTruck" />
              {{ order.deliveryStatus }}
            </span>

          </div>


          <!-- Items -->
          <div class="connect-sb-orders-items">

            <div class="connect-sb-orders-items-heading">
              <span>ORDER ITEMS</span>
              <span>{{ getOrderItems(order).length }} items</span>
            </div>


            <div
              v-for="item in getOrderItems(order)"
              :key="item.name"
              class="connect-sb-orders-item"
            >

              <div class="connect-sb-orders-item-info">

                <span class="connect-sb-orders-item-name">
                  {{ item.name }}
                </span>

                <span class="connect-sb-orders-item-quantity">
                  Qty {{ item.quantity }}
                </span>

              </div>

              <strong>
                R {{ Number(item.price).toFixed(2) }}
              </strong>

            </div>

          </div>


          <!-- Card footer -->
          <div class="connect-sb-orders-card-footer">

            <div class="connect-sb-orders-total">

              <span>Total</span>

              <strong>
                R {{ Number(order.total).toFixed(2) }}
              </strong>

            </div>


            <div class="connect-sb-orders-card-actions">

              <button
                type="button"
                class="connect-sb-orders-view-button"
                :class="{
                  active: selectedOrder?.id === order.id
                }"
                @click="viewOrder(order)"
              >
                {{ selectedOrder?.id === order.id ? 'Viewing' : 'See Details' }}
                <span>→</span>
              </button>


              <!-- Show payment for orders that still need payment. -->
              <router-link
                v-if="['Pending', 'Overdue', 'Failed'].includes(order.paymentStatus)"
                :to="`/payment/${order.id}`"
                class="connect-sb-orders-pay-button"
              >
                <FontAwesomeIcon :icon="faCreditCard" />
                Pay Bills
              </router-link>

              <!-- Only show tracking when a delivery has been assigned. -->
              <router-link
                v-if="order.deliveryId"
                :to="`/tracking/${order.deliveryId}`"
                class="connect-sb-orders-track-button"
              >
                <FontAwesomeIcon :icon="faLocationDot" />
                Track Delivery
              </router-link>

            </div>

          </div>

        </article>

      </div>


      <!-- No search results -->
      <div
        v-else
        class="connect-sb-orders-empty"
      >

        <div class="connect-sb-orders-empty-icon">
          <FontAwesomeIcon :icon="faBoxOpen" />
        </div>

        <h3>
          No orders found
        </h3>

        <p>
          Try changing your search or selecting another order status.
        </p>

      </div>

    </section>


    <!-- Order details -->
    <Transition name="connect-sb-orders-details">

      <section
        v-if="selectedOrder"
        class="connect-sb-orders-details-card"
      >

        <!-- Small connector that visually links the details to the selected card -->
        <div class="connect-sb-orders-details-connector">
          <span></span>
        </div>


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


          <div
            class="connect-sb-orders-price-row connect-sb-orders-price-total"
          >

            <span>Total with Delivery</span>

            <strong>
              R {{ totalWithDelivery }}
            </strong>

          </div>

        </div>


        <!-- Detail actions -->
        <div class="connect-sb-orders-detail-actions">

          <router-link
            :to="`/tracking?order=${selectedOrder.id}`"
            class="connect-sb-orders-track-button"
          >
            <FontAwesomeIcon :icon="faTruckFast" />
            Track Delivery
          </router-link>


          <!-- Show payment for orders that still need payment. -->
          <router-link
            v-if="['Pending', 'Overdue', 'Failed'].includes(selectedOrder.paymentStatus)"
            :to="`/payment/${selectedOrder.id}`"
            class="connect-sb-orders-details-pay-button"
          >
            <FontAwesomeIcon :icon="faCreditCard" />
            Pay for Order
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
  faBoxOpen,
  faCalendarDays,
  faClock,
  faCreditCard,
  faLocationDot,
  faMagnifyingGlass,
  faTruck,
  faTruckFast
} from '@fortawesome/free-solid-svg-icons'

// Store orders returned by the backend.
const orders = ref([])

// Store the order currently being viewed.
const selectedOrder = ref(null)

// Search and filter controls.
const searchQuery = ref('')
const activeFilter = ref('All')

// Store loading and error states.
const isLoading = ref(true)
const errorMessage = ref('')

// Filter orders based on the selected status and search text.
const filteredOrders = computed(() => {
  const search = searchQuery.value.trim().toLowerCase()

  return orders.value.filter(order => {
    const matchesFilter =
      activeFilter.value === 'All' ||
      (activeFilter.value === 'On Process' &&
        !['Completed', 'Cancelled'].includes(order.status)) ||
      (activeFilter.value === 'Completed' &&
        order.status === 'Completed')

    const matchesSearch =
      !search ||
      order.orderNumber.toLowerCase().includes(search) ||
      order.supplier.toLowerCase().includes(search) ||
      order.status.toLowerCase().includes(search)

    return matchesFilter && matchesSearch
  })
})

// Count orders that are currently active.
const activeOrdersCount = computed(() => {
  return orders.value.filter(order => {
    return !['Completed', 'Cancelled'].includes(order.status)
  }).length
})

// Calculate the total including the delivery fee.
const totalWithDelivery = computed(() => {
  if (!selectedOrder.value) {
    return '0.00'
  }

  const total =
    Number(selectedOrder.value.total || 0) +
    Number(selectedOrder.value.deliveryFee || 0)

  return total.toFixed(2)
})

// Get today's date.
function getCurrentDate() {
  return new Date().toLocaleDateString('en-ZA', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

// Get initials for the supplier avatar.
function getInitials(name) {
  if (!name) {
    return 'SU'
  }

  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word.charAt(0).toUpperCase())
    .join('')
}

// Turn status text into a CSS class.
function getStatusClass(status) {
  if (!status) {
    return 'pending'
  }

  const statusMap = {
    Pending: 'unpaid',
    Completed: 'paid',
    Overdue: 'overdue',
    Failed: 'failed'
  }

  return statusMap[status] || status
    .toLowerCase()
    .replace(/\s+/g, '-')
}

// Get the items already loaded for an order.
function getOrderItems(order) {
  return order.items || []
}

// Open the selected order.
function viewOrder(order) {
  selectedOrder.value = order
}

async function loadOrderPayment(orderId) {
  try {
    const response = await fetch(
      `/api/payments/order/${orderId}`
    )

    if (!response.ok) {
      throw new Error('Failed to load order payment')
    }

    const payments = await response.json()

    if (!payments.length) {
      return {
        status: 'Pending',
        paymentId: null
      }
    }

    // Use the most recent payment for this order.
    const payment = payments[0]

    return {
      status: payment.payment_status || 'Pending',
      paymentId: payment.payment_id || null
    }
  } catch (error) {
    console.error(`Error loading payment for order ${orderId}:`, error)

    return {
      status: 'Pending',
      paymentId: null
    }
  }
}

// Load the items belonging to one order.
async function loadOrderItems(orderId) {
  try {
    const response = await fetch(
      `/api/orders/${orderId}/items`
    )

    if (!response.ok) {
      throw new Error('Failed to load order items')
    }

    const items = await response.json()

    return items.map(item => ({
      name: item.product_name || 'Product',
      quantity: Number(item.quantity || 0),
      price: Number(item.unit_price || 0),
      subtotal: Number(item.subtotal || 0),
      image: item.product_image || null
    }))
  } catch (error) {
    console.error(`Error loading items for order ${orderId}:`, error)

    return []
  }
}

// Load all orders from the backend.
async function loadOrders() {
  try {
    isLoading.value = true
    errorMessage.value = ''

    const response = await fetch('/api/orders?buyerId=1')

    if (!response.ok) {
      throw new Error('Failed to load orders')
    }

    const data = await response.json()

    // Add the real items to each order.
    const ordersWithItems = await Promise.all(
      data.map(async order => {
        const items = await loadOrderItems(order.order_id)
        const payment = await loadOrderPayment(order.order_id)

        return {
          id: order.order_id,
          orderNumber: order.order_number || 'N/A',
          business: order.buyer_name || 'Buyer',
          supplier: order.supplier_name || 'Supplier',
          date: order.order_date
            ? new Date(order.order_date).toLocaleDateString('en-ZA')
            : 'N/A',
          status: order.order_status || 'Pending',

          // Delivery information comes from the related delivery record.
          deliveryId: order.delivery_id || null,
          trackingReference: order.tracking_reference || null,
          deliveryStatus: order.delivery_status || 'Not assigned',
          estimatedArrival: order.estimated_arrival || null,

          paymentStatus: payment.status,
          paymentId: payment.paymentId,

          subtotal: Number(order.total_amount || 0),
          deliveryFee: 0,
          total: Number(order.total_amount || 0),

          items
        }
      })
    )

    orders.value = ordersWithItems
  } catch (error) {
    console.error('Error loading orders:', error)

    errorMessage.value = 'Unable to load orders.'
    orders.value = []
  } finally {
    isLoading.value = false
  }
}

// Load orders when the page opens.
onMounted(() => {
  loadOrders()
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
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}


/* Header */
.connect-sb-orders-header {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto auto auto;
  align-items: start;
  column-gap: 30px;
  margin-bottom: 30px;
}

.connect-sb-orders-heading {
  min-width: 0;
}

.connect-sb-orders-eyebrow,
.connect-sb-orders-details-eyebrow,
.connect-sb-orders-section-eyebrow {
  margin: 0 0 7px;
  color: #D17A4A;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.7px;
}

.connect-sb-orders-title {
  margin: 0;
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 42px;
  font-weight: 600;
  line-height: 1.05;
}


/* Compact date control */
.connect-sb-orders-date-wrapper {
  grid-column: 2;
  grid-row: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 34px;
  padding: 7px 13px;
  box-sizing: border-box;
  border: 1px solid rgba(78, 52, 46, 0.08);
  border-radius: 8px;
  background: #FFFEFC;
  box-shadow: 0 3px 12px rgba(78, 52, 46, 0.035);
  white-space: nowrap;
}

.connect-sb-orders-calendar-icon {
  flex-shrink: 0;
  color: #5C3D24;
  font-size: 11px;
}

.connect-sb-orders-date {
  margin: 0;
  color: #5C3D24;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1px;
}


/* Full-width divider below the heading and date */
.connect-sb-orders-header-divider {
  grid-column: 1 / -1;
  grid-row: 2;
  display: block;
  width: 100%;
  height: 1px;
  margin: 22px 0 14px;
  background: rgba(92, 61, 36, 0.16);
}


/* Search below the divider */
.connect-sb-orders-search {
  grid-column: 2;
  grid-row: 3;
  position: relative;
  display: flex;
  align-items: center;
  width: 285px;
  height: 40px;
  padding: 0 14px;
  box-sizing: border-box;
  border: 1px solid #D8CCC4;
  border-radius: 10px;
  background: #FFFEFC;
  box-shadow: 0 4px 15px rgba(78, 52, 46, 0.045);
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease;
}

.connect-sb-orders-search:focus-within {
  border-color: #D17A4A;
  box-shadow: 0 5px 18px rgba(209, 122, 74, 0.10);
}

.connect-sb-orders-search-icon {
  flex-shrink: 0;
  color: #8A766B;
  font-size: 13px;
}

.connect-sb-orders-search input {
  width: 100%;
  min-width: 0;
  margin-left: 10px;
  border: none;
  outline: none;
  background: transparent;
  color: #5C3D24;
  font-family: inherit;
  font-size: 12px;
}

.connect-sb-orders-search input::placeholder {
  color: #A3938A;
}


/* Filter toolbar */
.connect-sb-orders-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 30px;
}

.connect-sb-orders-tabs {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  border-radius: 12px;
  background: rgba(78, 52, 46, 0.065);
}

.connect-sb-orders-tab {
  min-height: 35px;
  padding: 7px 15px;
  border: none;
  border-radius: 9px;
  background: transparent;
  color: #7A665B;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition:
    background 160ms ease,
    color 160ms ease,
    transform 160ms ease;
}

.connect-sb-orders-tab:hover {
  color: #4E342E;
}

.connect-sb-orders-tab.active {
  background: #FFFEFC;
  color: #4E342E;
  box-shadow: 0 3px 9px rgba(78, 52, 46, 0.08);
}

.connect-sb-orders-count {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #8A766B;
  font-size: 12px;
}

.connect-sb-orders-count strong {
  color: #4E342E;
  font-weight: 800;
}

.connect-sb-orders-count-divider {
  margin: 0 2px;
  color: #B1A39B;
}


/* Orders section heading */
.connect-sb-orders-section-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 16px;
}

.connect-sb-orders-section-eyebrow {
  margin-bottom: 4px;
  font-size: 10px;
  letter-spacing: 1.5px;
}

.connect-sb-orders-section-heading h2 {
  margin: 0;
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 25px;
  font-weight: 600;
}

.connect-sb-orders-heading-line {
  width: 42px;
  height: 5px;
  margin-bottom: 5px;
  border-radius: 999px;
  background: #D17A4A;
}


/* Order cards */
.connect-sb-orders-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 17px;
}

.connect-sb-orders-card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 20px;
  border: 1px solid rgba(78, 52, 46, 0.075);
  border-radius: 17px;
  background: #FFFEFC;
  box-shadow: 0 6px 22px rgba(78, 52, 46, 0.065);
  overflow: hidden;
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    border-color 180ms ease,
    background 180ms ease;
}

.connect-sb-orders-card::before {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: #D17A4A;
  content: "";
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 220ms ease;
}

.connect-sb-orders-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(78, 52, 46, 0.105);
}

.connect-sb-orders-card:hover::before {
  transform: scaleX(1);
}


/* Selected card stands out from the other orders */
.connect-sb-orders-card-selected {
  border-color: rgba(209, 122, 74, 0.45);
  background: #FFFCF8;
  box-shadow: 0 12px 32px rgba(78, 52, 46, 0.13);
}

.connect-sb-orders-card-selected::before {
  transform: scaleX(1);
}

.connect-sb-orders-card-selected:hover {
  transform: translateY(-2px);
}


/* Small label that identifies the selected card */
.connect-sb-orders-selected-label {
  display: flex;
  align-items: center;
  gap: 6px;
  width: fit-content;
  margin-bottom: 13px;
  padding: 4px 8px;
  border-radius: 999px;
  background: #F3E7D9;
  color: #8A5A32;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.7px;
  text-transform: uppercase;
}

.connect-sb-orders-selected-label span {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #D17A4A;
  box-shadow: 0 0 0 3px rgba(209, 122, 74, 0.10);
}


/* Card header */
.connect-sb-orders-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.connect-sb-orders-customer {
  display: flex;
  align-items: center;
  gap: 11px;
  min-width: 0;
}

.connect-sb-orders-avatar {
  display: grid;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 12px;
  background: #F3E7D9;
  color: #5C3D24;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.connect-sb-orders-card-selected .connect-sb-orders-avatar {
  background: #D17A4A;
  color: #FFFEFC;
}

.connect-sb-orders-customer h3 {
  margin: 0 0 3px;
  overflow: hidden;
  color: #4E342E;
  font-size: 14px;
  font-weight: 750;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.connect-sb-orders-customer p {
  margin: 0;
  color: #9A8A81;
  font-size: 11px;
}


/* Status */
.connect-sb-orders-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  padding: 5px 8px;
  border-radius: 999px;
  font-size: 9px;
  font-weight: 800;
  white-space: nowrap;
}

.connect-sb-orders-status-dot {
  width: 5px;
  height: 5px;
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
.connect-sb-orders-status.out-for-delivery,
.connect-sb-orders-status.ready,
.connect-sb-orders-status.in-progress {
  background: #F3E7D9;
  color: #8A5A32;
}


/* Card metadata */
.connect-sb-orders-card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 13px;
  margin-top: 15px;
  padding-bottom: 14px;
  border-bottom: 1px solid #EEE7E2;
}

.connect-sb-orders-card-meta span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #8A766B;
  font-size: 10px;
}

.connect-sb-orders-card-meta svg {
  color: #D17A4A;
  font-size: 10px;
}


/* Items section */
.connect-sb-orders-items {
  padding: 15px 0;
}

.connect-sb-orders-items-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}

.connect-sb-orders-items-heading span:first-child {
  color: #A08F85;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.2px;
}

.connect-sb-orders-items-heading span:last-child {
  color: #A08F85;
  font-size: 9px;
}

.connect-sb-orders-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 6px 0;
}

.connect-sb-orders-item-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: 2px;
}

.connect-sb-orders-item-name {
  overflow: hidden;
  color: #5C3D24;
  font-size: 12px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.connect-sb-orders-item-quantity {
  color: #9A8A81;
  font-size: 10px;
}

.connect-sb-orders-item strong {
  flex-shrink: 0;
  color: #5C3D24;
  font-size: 11px;
  font-weight: 700;
}


/* Card footer */
.connect-sb-orders-card-footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-top: auto;
  padding-top: 15px;
  border-top: 1px solid #EEE7E2;
}

.connect-sb-orders-total {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.connect-sb-orders-total span {
  color: #8A766B;
  font-size: 10px;
}

.connect-sb-orders-total strong {
  color: #4E342E;
  font-size: 19px;
  font-weight: 800;
}

.connect-sb-orders-card-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.connect-sb-orders-view-button,
.connect-sb-orders-pay-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 32px;
  padding: 7px 10px;
  box-sizing: border-box;
  border-radius: 8px;
  font-family: inherit;
  font-size: 10px;
  font-weight: 750;
  text-decoration: none;
  cursor: pointer;
  transition:
    transform 160ms ease,
    background 160ms ease,
    box-shadow 160ms ease;
}

.connect-sb-orders-view-button {
  border: 1px solid #D8CCC4;
  background: #FFFEFC;
  color: #5C3D24;
}

.connect-sb-orders-view-button:hover {
  transform: translateY(-1px);
  background: #F8F2ED;
}

.connect-sb-orders-view-button.active {
  border-color: #D17A4A;
  background: #F3E7D9;
  color: #8A5A32;
}

.connect-sb-orders-pay-button {
  border: 1px solid #D17A4A;
  background: #D17A4A;
  color: #FFFEFC;
  box-shadow: 0 3px 9px rgba(209, 122, 74, 0.18);
}

.connect-sb-orders-pay-button:hover {
  transform: translateY(-1px);
  background: #BF683A;
  box-shadow: 0 5px 12px rgba(209, 122, 74, 0.24);
}


/* Empty state */
.connect-sb-orders-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 260px;
  padding: 30px;
  border: 1px dashed #D4C7BE;
  border-radius: 17px;
  background: rgba(255, 254, 252, 0.6);
  text-align: center;
}

.connect-sb-orders-empty-icon {
  display: grid;
  width: 48px;
  height: 48px;
  margin-bottom: 12px;
  place-items: center;
  border-radius: 14px;
  background: #F3E7D9;
  color: #5C3D24;
  font-size: 19px;
}

.connect-sb-orders-empty h3 {
  margin: 0 0 5px;
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 21px;
}

.connect-sb-orders-empty p {
  margin: 0;
  color: #8A766B;
  font-size: 12px;
}


/* Order details */
.connect-sb-orders-details-card {
  position: relative;
  margin-top: 25px;
  padding: 25px;
  border: 1px solid rgba(209, 122, 74, 0.24);
  border-radius: 18px;
  background: #FFFEFC;
  box-shadow: 0 10px 30px rgba(78, 52, 46, 0.10);
}


/* This small accent visually connects the detail panel to the selected order */
.connect-sb-orders-details-connector {
  position: absolute;
  top: -7px;
  left: 50%;
  display: flex;
  justify-content: center;
  width: 100%;
  transform: translateX(-50%);
  pointer-events: none;
}

.connect-sb-orders-details-connector span {
  width: 58px;
  height: 4px;
  border-radius: 999px;
  background: #D17A4A;
  box-shadow: 0 2px 7px rgba(209, 122, 74, 0.18);
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


/* Details animation */
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
@media (max-width: 1050px) {

  .connect-sb-orders-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

}


/* Smaller tablet */
@media (max-width: 900px) {

  .connect-sb-orders-page {
    padding: 26px;
  }

  .connect-sb-orders-header {
    column-gap: 20px;
  }

  .connect-sb-orders-date-wrapper {
    max-width: 100%;
  }

  .connect-sb-orders-search {
    width: 320px;
    max-width: 100%;
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
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-bottom: 22px;
  }

  .connect-sb-orders-title {
    font-size: 34px;
  }

  .connect-sb-orders-date-wrapper {
    align-self: flex-start;
    min-height: 32px;
  }

  .connect-sb-orders-header-divider {
    width: 100%;
    margin: 4px 0 2px;
  }

  .connect-sb-orders-search {
    width: 100%;
  }

  .connect-sb-orders-toolbar {
    align-items: flex-start;
    flex-direction: column;
    gap: 13px;
    margin-bottom: 25px;
  }

  .connect-sb-orders-tabs {
    width: 100%;
  }

  .connect-sb-orders-tab {
    flex: 1;
    padding: 7px 9px;
  }

  .connect-sb-orders-count {
    padding-left: 3px;
  }

  .connect-sb-orders-grid {
    grid-template-columns: 1fr;
  }

  .connect-sb-orders-section-heading h2 {
    font-size: 22px;
  }

  .connect-sb-orders-card {
    padding: 18px;
  }

  .connect-sb-orders-card-footer {
    align-items: stretch;
    flex-direction: column;
  }

  .connect-sb-orders-card-actions {
    width: 100%;
  }

  .connect-sb-orders-view-button,
  .connect-sb-orders-pay-button {
    flex: 1;
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