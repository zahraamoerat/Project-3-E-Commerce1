<template>
  <div class="connect-payments-page">
    <!-- Page header -->
    <header class="connect-payments-header">
      <div class="connect-payments-header-copy">
        <p class="connect-payments-eyebrow">SECURE CHECKOUT</p>
        <h1 class="connect-payments-title">Complete Payment</h1>
        <p class="connect-payments-description">
          Review your order and choose how you would like to pay.
        </p>
      </div>

      <div class="connect-payments-header-badge">
        <FontAwesomeIcon :icon="faShieldHalved" />
        <span>Secure checkout</span>
      </div>
    </header>

    <!-- Show an error if the order does not exist -->
    <section
      v-if="!selectedOrder"
      class="connect-payments-error-card"
    >
      <div class="connect-payments-error-icon">
        <FontAwesomeIcon :icon="faCircleExclamation" />
      </div>

      <p class="connect-payments-error-eyebrow">ORDER ERROR</p>

      <h2>Order Not Found</h2>

      <p>
        The selected order could not be found.
      </p>

      <router-link
        to="/small-business/orders"
        class="connect-payments-return-link"
      >
        <FontAwesomeIcon :icon="faArrowLeft" />
        Return to Orders
      </router-link>
    </section>

    <!-- Payment content -->
    <div
      v-else-if="!paymentSuccess"
      class="connect-payments-layout"
    >
      <!-- LEFT: Order summary -->
      <section class="connect-payments-order-panel">
        <div class="connect-payments-panel-top">
          <div>
            <p class="connect-payments-section-label">ORDER SUMMARY</p>
            <h2>{{ selectedOrder.orderNumber }}</h2>
          </div>

          <span class="connect-payments-pending-pill">
            <span></span>
            Payment Required
          </span>
        </div>

        <!-- Supplier and delivery -->
        <div class="connect-payments-order-identity">
          <div class="connect-payments-identity-item">
            <div class="connect-payments-identity-icon">
              <FontAwesomeIcon :icon="faStore" />
            </div>

            <div>
              <span>SUPPLIER</span>
              <strong>{{ selectedOrder.supplier }}</strong>
            </div>
          </div>

          <div class="connect-payments-identity-item">
            <div class="connect-payments-identity-icon">
              <FontAwesomeIcon :icon="faTruckFast" />
            </div>

            <div>
              <span>DELIVERY</span>
              <strong>{{ selectedOrder.deliveryId }}</strong>
            </div>
          </div>
        </div>

        <!-- Order amount -->
        <div class="connect-payments-amount-card">
          <div class="connect-payments-amount-heading">
            <span>AMOUNT DUE</span>
            <FontAwesomeIcon :icon="faReceipt" />
          </div>

          <strong>
            R {{ formatPrice(selectedOrder.total) }}
          </strong>

          <p>
            Includes your order and delivery fee.
          </p>
        </div>

        <!-- Price breakdown -->
        <div class="connect-payments-price-breakdown">
          <div class="connect-payments-price-row">
            <span>Order subtotal</span>
            <strong>
              R {{ formatPrice(selectedOrder.subtotal) }}
            </strong>
          </div>

          <div class="connect-payments-price-row">
            <span>Delivery fee</span>
            <strong>
              R {{ formatPrice(selectedOrder.deliveryFee) }}
            </strong>
          </div>

          <div class="connect-payments-price-divider"></div>

          <div class="connect-payments-total-row">
            <span>Total</span>
            <strong>
              R {{ formatPrice(selectedOrder.total) }}
            </strong>
          </div>
        </div>

        <!-- Payment note -->
        <div class="connect-payments-summary-note">
          <div class="connect-payments-summary-note-icon">
            <FontAwesomeIcon :icon="faCircleCheck" />
          </div>

          <div>
            <strong>Ready for payment</strong>
            <p>
              Once payment is completed, your order will be marked as paid.
            </p>
          </div>
        </div>
      </section>

      <!-- RIGHT: Payment section -->
      <section class="connect-payments-payment-panel">
        <div class="connect-payments-panel-heading">
          <p class="connect-payments-section-label">PAYMENT METHOD</p>
          <h2>How would you like to pay?</h2>
          <p>
            Select a payment method below to continue.
          </p>
        </div>

        <!-- Payment method selector -->
        <div class="connect-payments-methods">
          <button
            type="button"
            class="connect-payments-method-card"
            :class="{
              'connect-payments-method-active': paymentMethod === 'card'
            }"
            @click="paymentMethod = 'card'"
          >
            <div class="connect-payments-method-icon">
              <FontAwesomeIcon :icon="faCreditCard" />
            </div>

            <div class="connect-payments-method-content">
              <strong>Bank Card</strong>
              <small>Visa, Mastercard or debit card</small>
            </div>

            <div
              class="connect-payments-method-selector"
              :class="{
                selected: paymentMethod === 'card'
              }"
            >
              <FontAwesomeIcon
                v-if="paymentMethod === 'card'"
                :icon="faCheck"
              />
            </div>
          </button>

          <button
            type="button"
            class="connect-payments-method-card"
            :class="{
              'connect-payments-method-active': paymentMethod === 'eft'
            }"
            @click="paymentMethod = 'eft'"
          >
            <div class="connect-payments-method-icon eft">
              <FontAwesomeIcon :icon="faBuildingColumns" />
            </div>

            <div class="connect-payments-method-content">
              <strong>EFT</strong>
              <small>Pay directly from your bank account</small>
            </div>

            <div
              class="connect-payments-method-selector"
              :class="{
                selected: paymentMethod === 'eft'
              }"
            >
              <FontAwesomeIcon
                v-if="paymentMethod === 'eft'"
                :icon="faCheck"
              />
            </div>
          </button>
        </div>

        <!-- Card payment -->
        <Transition name="connect-payments-form">
          <div
            v-if="paymentMethod === 'card'"
            class="connect-payments-payment-form"
          >
            <div class="connect-payments-form-intro">
              <div>
                <h3>Card details</h3>
                <p>Enter the details shown on your bank card.</p>
              </div>

              <FontAwesomeIcon :icon="faLock" />
            </div>

            <label class="connect-payments-field">
              <span>Cardholder Name</span>

              <div class="connect-payments-input-wrapper">
                <FontAwesomeIcon :icon="faUser" />

                <input
                  v-model="cardName"
                  type="text"
                  autocomplete="cc-name"
                  placeholder="Enter cardholder name"
                />
              </div>
            </label>

            <label class="connect-payments-field">
              <span>Card Number</span>

              <div class="connect-payments-input-wrapper">
                <FontAwesomeIcon :icon="faCreditCard" />

                <input
                  v-model="cardNumber"
                  type="text"
                  inputmode="numeric"
                  autocomplete="cc-number"
                  maxlength="19"
                  placeholder="1234 5678 9012 3456"
                  @input="formatCardNumber"
                />
              </div>
            </label>

            <div class="connect-payments-card-row">
              <label class="connect-payments-field">
                <span>Expiry Date</span>

                <div class="connect-payments-input-wrapper">
                  <FontAwesomeIcon :icon="faCalendarDays" />

                  <input
                    v-model="expiryDate"
                    type="text"
                    inputmode="numeric"
                    autocomplete="cc-exp"
                    maxlength="5"
                    placeholder="MM/YY"
                    @input="formatExpiryDate"
                  />
                </div>
              </label>

              <label class="connect-payments-field">
                <span>CVV</span>

                <div class="connect-payments-input-wrapper">
                  <FontAwesomeIcon :icon="faLock" />

                  <input
                    v-model="cvv"
                    type="password"
                    inputmode="numeric"
                    autocomplete="cc-csc"
                    maxlength="4"
                    placeholder="123"
                  />
                </div>
              </label>
            </div>

            <div class="connect-payments-card-security">
              <FontAwesomeIcon :icon="faShieldHalved" />

              <span>
                Your card details are protected during this prototype checkout.
              </span>
            </div>
          </div>
        </Transition>

        <!-- EFT payment -->
        <Transition name="connect-payments-form">
          <div
            v-if="paymentMethod === 'eft'"
            class="connect-payments-eft-information"
          >
            <div class="connect-payments-eft-heading">
              <div class="connect-payments-eft-icon">
                <FontAwesomeIcon :icon="faBuildingColumns" />
              </div>

              <div>
                <p class="connect-payments-section-label">BANK TRANSFER</p>
                <h3>Electronic Funds Transfer</h3>
                <p>
                  Use the order reference below when making your transfer.
                </p>
              </div>
            </div>

            <div class="connect-payments-reference-box">
              <div>
                <span>PAYMENT REFERENCE</span>
                <strong>{{ selectedOrder.orderNumber }}</strong>
              </div>

              <FontAwesomeIcon :icon="faCopy" />
            </div>

            <div class="connect-payments-eft-note">
              <FontAwesomeIcon :icon="faCircleInfo" />

              <p>
                Your payment will be confirmed once the transfer is received.
                This prototype currently simulates that process.
              </p>
            </div>
          </div>
        </Transition>

        <!-- Payment action -->
        <div class="connect-payments-action">
          <button
            type="button"
            class="connect-payments-submit-button"
            :disabled="isProcessing"
            @click="processPayment"
          >
            <span v-if="isProcessing">
              <FontAwesomeIcon
                :icon="faSpinner"
                spin
              />
              Processing payment...
            </span>

            <span v-else>
              Pay R {{ formatPrice(selectedOrder.total) }}
              <FontAwesomeIcon :icon="faArrowRight" />
            </span>
          </button>

          <div class="connect-payments-trust-row">
            <FontAwesomeIcon :icon="faLock" />
            <span>Secure checkout</span>
            <span class="connect-payments-trust-divider"></span>
            <span>WeConnect Payments</span>
          </div>
        </div>

        <!-- Prototype notice -->
        <p class="connect-payments-prototype-message">
          This is a frontend prototype. Real payment processing will be
          connected through a payment provider when the backend is ready.
        </p>
      </section>
    </div>

    <!-- Successful payment receipt -->
    <Transition name="connect-payments-success">
      <section
        v-if="paymentSuccess"
        class="connect-payments-success-card"
      >
        <div class="connect-payments-success-icon">
          <FontAwesomeIcon :icon="faCheck" />
        </div>

        <p class="connect-payments-success-eyebrow">
          PAYMENT COMPLETE
        </p>

        <h2>Payment Successful</h2>

        <p class="connect-payments-success-message">
          Your payment has been recorded and
          {{ selectedOrder.orderNumber }} is now marked as paid.
        </p>

        <!-- Receipt -->
        <div class="connect-payments-receipt">
          <div class="connect-payments-receipt-header">
            <div>
              <span>PAYMENT RECEIPT</span>
              <strong>{{ paymentReference }}</strong>
            </div>

            <FontAwesomeIcon :icon="faReceipt" />
          </div>

          <div class="connect-payments-receipt-row">
            <span>Order</span>
            <strong>{{ selectedOrder.orderNumber }}</strong>
          </div>

          <div class="connect-payments-receipt-row">
            <span>Supplier</span>
            <strong>{{ selectedOrder.supplier }}</strong>
          </div>

          <div class="connect-payments-receipt-row">
            <span>Payment Method</span>
            <strong>
              {{ paymentMethod === 'card' ? 'Bank Card' : 'EFT' }}
            </strong>
          </div>

          <div class="connect-payments-receipt-row">
            <span>Payment Reference</span>
            <strong>{{ paymentReference }}</strong>
          </div>

          <div class="connect-payments-receipt-total">
            <span>Total Paid</span>
            <strong>
              R {{ formatPrice(selectedOrder.total) }}
            </strong>
          </div>
        </div>

        <div class="connect-payments-success-actions">
          <router-link
            to="/small-business/orders"
            class="connect-payments-success-link primary"
          >
            <FontAwesomeIcon :icon="faArrowLeft" />
            Return to Orders
          </router-link>
        </div>
      </section>
    </Transition>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faArrowLeft,
  faArrowRight,
  faBuildingColumns,
  faCalendarDays,
  faCheck,
  faCircleCheck,
  faCircleExclamation,
  faCircleInfo,
  faCopy,
  faCreditCard,
  faLock,
  faReceipt,
  faShieldHalved,
  faSpinner,
  faStore,
  faTruckFast,
  faUser
} from '@fortawesome/free-solid-svg-icons'

import Swal from 'sweetalert2'

// Get the current route.
const route = useRoute()

// Base URL used to reach the backend API.
const apiUrl = import.meta.env.VITE_API_URL || '/api'

// Store the order loaded from the backend.
const order = ref(null)

// Store the order's payment information.
const existingPayment = ref(null)

// Store loading and error states.
const isLoading = ref(true)
const loadError = ref('')

// Store the selected payment method.
const paymentMethod = ref('card')

// Store card information entered by the user.
// These values are only used for frontend validation.
const cardName = ref('')
const cardNumber = ref('')
const expiryDate = ref('')
const cvv = ref('')

// Store payment state.
const isProcessing = ref(false)
const paymentSuccess = ref(false)

// Store the payment reference returned by the backend.
const paymentReference = ref('')

// Return the order currently being displayed.
const selectedOrder = computed(() => {
  return order.value
})

// Format prices into two decimal places.
function formatPrice(price) {
  return Number(price || 0).toFixed(2)
}

// Add spaces between groups of card numbers.
function formatCardNumber(event) {
  const numbersOnly = event.target.value
    .replace(/\D/g, '')
    .slice(0, 16)

  cardNumber.value = numbersOnly
    .replace(/(.{4})/g, '$1 ')
    .trim()
}

// Format expiry date as MM/YY.
function formatExpiryDate(event) {
  const numbersOnly = event.target.value
    .replace(/\D/g, '')
    .slice(0, 4)

  if (numbersOnly.length > 2) {
    expiryDate.value =
      `${numbersOnly.slice(0, 2)}/${numbersOnly.slice(2)}`
  } else {
    expiryDate.value = numbersOnly
  }
}

// Check the card fields before starting the payment.
function validateCardDetails() {
  if (!cardName.value.trim()) {
    return 'Please enter the cardholder name.'
  }

  const cleanCardNumber = cardNumber.value.replace(/\s/g, '')

  if (cleanCardNumber.length !== 16) {
    return 'Please enter a valid 16-digit card number.'
  }

  // Check that the expiry follows MM/YY format.
  if (!/^\d{2}\/\d{2}$/.test(expiryDate.value)) {
    return 'Please enter the expiry date in MM/YY format.'
  }

  if (!/^\d{3,4}$/.test(cvv.value)) {
    return 'Please enter a valid CVV.'
  }

  return null
}

// Load one order from the backend.
async function loadOrder() {
  try {
    isLoading.value = true
    loadError.value = ''

    const orderId = Number(route.params.orderId)

    if (!orderId) {
      throw new Error('Invalid order ID')
    }

    const buyerId = localStorage.getItem('weconnect_buyer_id')

    if (!buyerId) {
      throw new Error('Please sign in to view this order.')
    }

    const response = await fetch(
      `${apiUrl}/orders/${orderId}?buyerId=${encodeURIComponent(buyerId)}`
    )

    if (!response.ok) {
      throw new Error('Failed to load order')
    }

    const data = await response.json()

    if (!data) {
      throw new Error('Order not found')
    }

    order.value = {
      id: data.order_id,
      orderNumber: data.order_number || 'N/A',
      business: data.buyer_name || 'Buyer',
      supplier: data.supplier_name || 'Supplier',
      status: data.order_status || 'Pending',
      subtotal: Number(data.total_amount || 0),
      deliveryFee: 0,
      total: Number(data.total_amount || 0),
      deliveryId: data.delivery_id || 'Not assigned'
    }

    await loadExistingPayment(orderId, buyerId)
  } catch (error) {
    console.error('Error loading payment order:', error)

    loadError.value =
      'Unable to load the selected order.'
  } finally {
    isLoading.value = false
  }
}

// Load the latest payment for this order.
async function loadExistingPayment(orderId, buyerId) {
  try {
    const response = await fetch(
      `${apiUrl}/payments/order/${orderId}?buyerId=${encodeURIComponent(buyerId || '')}`
    )

    if (!response.ok) {
      throw new Error('Failed to load payment')
    }

    const payments = await response.json()

    if (!payments.length) {
      existingPayment.value = null
      return
    }

    existingPayment.value = payments[0]

    // If the order is already paid, show the receipt.
    if (existingPayment.value.payment_status === 'Completed') {
      paymentReference.value =
        existingPayment.value.transaction_reference || ''

      paymentSuccess.value = true
    }
  } catch (error) {
    console.error('Error loading existing payment:', error)

    existingPayment.value = null
  }
}

// Convert the selected frontend payment method into
// the payment method name stored in the database.
function getPaymentMethodName() {
  return paymentMethod.value === 'card'
    ? 'Bank Card'
    : 'EFT'
}

// Send the payment to the backend.
async function submitPayment() {
  const response = await fetch(
    `${apiUrl}/payments`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        orderId: selectedOrder.value.id,
        methodName: getPaymentMethodName(),
        amount: selectedOrder.value.total
      })
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.message || 'Failed to process payment'
    )
  }

  return data
}

// Process the payment.
async function processPayment() {
  // Stop if the order is unavailable.
  if (!selectedOrder.value) {
    return
  }

  // Prevent paying the same order twice.
  if (existingPayment.value?.payment_status === 'Completed') {
    await Swal.fire({
      icon: 'info',
      title: 'Already paid',
      text: 'This order already has a completed payment.',
      confirmButtonColor: '#4E342E'
    })

    paymentSuccess.value = true
    return
  }

  // Validate card details before continuing.
  if (paymentMethod.value === 'card') {
    const validationMessage = validateCardDetails()

    if (validationMessage) {
      await Swal.fire({
        icon: 'warning',
        title: 'Check your details',
        text: validationMessage,
        confirmButtonColor: '#c48b5b'
      })

      return
    }
  }

  // Ask for confirmation before processing.
  const confirmation = await Swal.fire({
    title: 'Confirm payment',
    text: `You are about to pay R ${formatPrice(
      selectedOrder.value.total
    )} for ${selectedOrder.value.orderNumber}.`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Confirm Payment',
    cancelButtonText: 'Go Back',
    confirmButtonColor: '#c48b5b',
    cancelButtonColor: '#7A665B'
  })

  if (!confirmation.isConfirmed) {
    return
  }

  isProcessing.value = true

  // Show processing feedback.
  Swal.fire({
    title: 'Processing payment',
    text: 'Please wait while your payment is being processed.',
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading()
    }
  })

  try {
    // Create the real payment record in MySQL.
    const payment = await submitPayment()

    paymentReference.value =
      payment.transactionReference || ''

    // Store the returned payment information locally.
    existingPayment.value = {
      payment_id: payment.paymentId,
      payment_status: 'Completed',
      transaction_reference: payment.transactionReference
    }

    isProcessing.value = false

    Swal.close()

    await Swal.fire({
      icon: 'success',
      title: 'Order placed',
      text: `Order ${selectedOrder.value.orderNumber} has been paid successfully.`,
      confirmButtonText: 'View Receipt',
      confirmButtonColor: '#4E342E'
    })

    paymentSuccess.value = true
  } catch (error) {
    console.error('Error processing payment:', error)

    isProcessing.value = false

    Swal.close()

    await Swal.fire({
      icon: 'error',
      title: 'Payment failed',
      text:
        error.message ||
        'We could not record your payment. Please try again.',
      confirmButtonColor: '#4E342E'
    })
  }
}

// Load the order when the payment page opens.
onMounted(() => {
  loadOrder()
})
</script>

<style scoped>
/* Main payment page */
.connect-payments-page {
  min-height: 100vh;
  padding: 38px 40px 60px;
  box-sizing: border-box;
  background: var(--sb-bg);
  color: var(--sb-ink);
  font-family: var(--sb-font-body);
}

/* Header */
.connect-payments-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 30px;
  max-width: 1180px;
  margin: 0 auto 30px;
  padding-bottom: 25px;
  border-bottom: 1px solid #D8CBC4;
}

.connect-payments-header-copy {
  min-width: 0;
}

.connect-payments-eyebrow {
  margin: 0 0 9px;
  color: #c48b5b;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 2px;
}

.connect-payments-title {
  margin: 0 0 8px;
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 40px;
  font-weight: 600;
  line-height: 1.1;
}

.connect-payments-description {
  max-width: 620px;
  margin: 0;
  color: #7A665B;
  font-size: 14px;
  line-height: 1.6;
}

.connect-payments-header-badge {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  flex-shrink: 0;
  padding: 10px 14px;
  border: 1px solid #DDD0C9;
  border-radius: 999px;
  background: rgba(255, 254, 252, 0.72);
  color: #5C3D24;
  font-size: 11px;
  font-weight: 700;
}

.connect-payments-header-badge svg {
  color: #3F6847;
}

/* Main checkout layout */
.connect-payments-layout {
  display: grid;
  grid-template-columns: minmax(320px, 0.82fr) minmax(450px, 1.18fr);
  gap: 24px;
  max-width: 1180px;
  margin: 0 auto;
  align-items: start;
}

/* Main panels */
.connect-payments-order-panel,
.connect-payments-payment-panel {
  border: 1px solid rgba(220, 205, 197, 0.8);
  border-radius: 18px;
  background: #FFFEFC;
  box-shadow: 0 8px 26px rgba(78, 52, 46, 0.07);
  box-sizing: border-box;
}

.connect-payments-order-panel {
  padding: 27px;
}

.connect-payments-payment-panel {
  padding: 29px;
}

/* Panel heading */
.connect-payments-panel-top,
.connect-payments-panel-heading {
  margin-bottom: 24px;
}

.connect-payments-panel-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 15px;
}

.connect-payments-section-label {
  margin: 0 0 7px;
  color: #c48b5b;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.7px;
}

.connect-payments-panel-top h2 {
  margin: 0;
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 25px;
  font-weight: 600;
}

.connect-payments-panel-heading h2 {
  margin: 0 0 7px;
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 27px;
  font-weight: 600;
}

.connect-payments-panel-heading > p:last-child {
  margin: 0;
  color: #8A776C;
  font-size: 12px;
  line-height: 1.5;
}

.connect-payments-pending-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  padding: 6px 9px;
  border-radius: 999px;
  background: #F8E8D9;
  color: #8A5A32;
  font-size: 9px;
  font-weight: 800;
  white-space: nowrap;
}

.connect-payments-pending-pill span {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #c48b5b;
}

/* Supplier and delivery identity */
.connect-payments-order-identity {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 19px;
}

.connect-payments-identity-item {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  padding: 12px;
  border: 1px solid #E8E2DD;
  border-radius: 11px;
  background: #FCF9F6;
}

.connect-payments-identity-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 8px;
  background: #F1E5DE;
  color: #8A5A32;
  font-size: 12px;
}

.connect-payments-identity-item div:last-child {
  min-width: 0;
}

.connect-payments-identity-item span {
  display: block;
  margin-bottom: 3px;
  color: #9A887E;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1px;
}

.connect-payments-identity-item strong {
  display: block;
  overflow: hidden;
  color: #4E342E;
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Amount highlight */
.connect-payments-amount-card {
  position: relative;
  overflow: hidden;
  margin-bottom: 21px;
  padding: 20px;
  border-radius: 14px;
  background: #4E342E;
  color: #FFFEFC;
}

.connect-payments-amount-card::after {
  position: absolute;
  right: -35px;
  bottom: -45px;
  width: 130px;
  height: 130px;
  border: 1px solid rgba(255, 254, 252, 0.08);
  border-radius: 50%;
  content: "";
}

.connect-payments-amount-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #DCCDC5;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.connect-payments-amount-heading svg {
  color: #c48b5b;
  font-size: 13px;
}

.connect-payments-amount-card > strong {
  display: block;
  margin-top: 8px;
  color: #FFFEFC;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 32px;
  font-weight: 500;
}

.connect-payments-amount-card p {
  margin: 6px 0 0;
  color: #CDBFB8;
  font-size: 10px;
}

/* Price breakdown */
.connect-payments-price-breakdown {
  margin-top: 4px;
}

.connect-payments-price-row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 9px 0;
  color: #7A665B;
  font-size: 12px;
}

.connect-payments-price-row strong {
  color: #5C3D24;
  font-weight: 600;
}

.connect-payments-price-divider {
  height: 1px;
  margin: 7px 0;
  background: #E5DCD6;
}

.connect-payments-total-row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding-top: 10px;
  color: #4E342E;
  font-size: 15px;
  font-weight: 700;
}

.connect-payments-total-row strong {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 18px;
}

/* Payment readiness note */
.connect-payments-summary-note {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 22px;
  padding: 13px;
  border: 1px solid #E4DCD6;
  border-radius: 11px;
  background: #F8F3EF;
}

.connect-payments-summary-note-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #E6F0E8;
  color: #3F6847;
  font-size: 10px;
}

.connect-payments-summary-note strong {
  display: block;
  margin-bottom: 3px;
  color: #5C3D24;
  font-size: 11px;
}

.connect-payments-summary-note p {
  margin: 0;
  color: #8A776C;
  font-size: 10px;
  line-height: 1.5;
}

/* Payment methods */
.connect-payments-methods {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 11px;
  margin-bottom: 23px;
}

.connect-payments-method-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 11px;
  min-height: 75px;
  padding: 13px;
  border: 1px solid #DCCDC5;
  border-radius: 12px;
  background: #FFFEFC;
  color: #4E342E;
  text-align: left;
  cursor: pointer;
  box-sizing: border-box;
  transition:
    border-color 180ms ease,
    background 180ms ease,
    transform 180ms ease,
    box-shadow 180ms ease;
}

.connect-payments-method-card:hover {
  border-color: #c48b5b;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(78, 52, 46, 0.07);
}

.connect-payments-method-active {
  border-color: #c48b5b;
  background: #FBF1EB;
  box-shadow: 0 0 0 1px #c48b5b;
}

.connect-payments-method-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 39px;
  height: 39px;
  flex-shrink: 0;
  border-radius: 9px;
  background: #4E342E;
  color: #FFFEFC;
  font-size: 14px;
}

.connect-payments-method-icon.eft {
  background: #5C3D24;
}

.connect-payments-method-content {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.connect-payments-method-content strong {
  color: #4E342E;
  font-size: 12px;
}

.connect-payments-method-content small {
  color: #8A776C;
  font-size: 9px;
  line-height: 1.4;
}

.connect-payments-method-selector {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  margin-left: auto;
  border: 1px solid #CFC0B8;
  border-radius: 50%;
  color: #FFFEFC;
  font-size: 9px;
  box-sizing: border-box;
}

.connect-payments-method-selector.selected {
  border-color: #c48b5b;
  background: #c48b5b;
}

/* Card form */
.connect-payments-payment-form {
  padding-top: 1px;
}

.connect-payments-form-intro {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 19px;
  padding-bottom: 13px;
  border-bottom: 1px solid #E8E2DD;
}

.connect-payments-form-intro h3 {
  margin: 0 0 3px;
  color: #4E342E;
  font-size: 14px;
}

.connect-payments-form-intro p {
  margin: 0;
  color: #8A776C;
  font-size: 10px;
}

.connect-payments-form-intro > svg {
  color: #8A5A32;
  font-size: 14px;
}

.connect-payments-card-fields {
  display: grid;
  gap: 15px;
}

.connect-payments-field {
  display: grid;
  gap: 6px;
  color: #5C3D24;
  font-size: 10px;
  font-weight: 700;
}

.connect-payments-input-wrapper {
  position: relative;
}

.connect-payments-input-wrapper > svg {
  position: absolute;
  top: 50%;
  left: 13px;
  color: #A18E84;
  font-size: 12px;
  pointer-events: none;
  transform: translateY(-50%);
}

.connect-payments-field input {
  width: 100%;
  padding: 12px 13px 12px 36px;
  border: 1px solid #DCCDC5;
  border-radius: 8px;
  outline: none;
  background: #FFFEFC;
  color: #4E342E;
  font-family: inherit;
  font-size: 12px;
  box-sizing: border-box;
  transition:
    border-color 180ms ease,
    box-shadow 180ms ease,
    background 180ms ease;
}

.connect-payments-field input::placeholder {
  color: #B2A39B;
}

.connect-payments-field input:focus {
  border-color: #c48b5b;
  background: #FFFFFF;
  box-shadow: 0 0 0 3px rgba(164, 117, 71, 0.1);
}

.connect-payments-card-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 13px;
}

.connect-payments-card-security {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 1px;
  color: #7C897F;
  font-size: 9px;
}

.connect-payments-card-security svg {
  color: #4F7458;
}

/* EFT */
.connect-payments-eft-information {
  padding: 19px;
  border: 1px solid #E6D7CE;
  border-radius: 12px;
  background: #F8F2EE;
}

.connect-payments-eft-heading {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.connect-payments-eft-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 9px;
  background: #4E342E;
  color: #FFFEFC;
  font-size: 14px;
}

.connect-payments-eft-heading h3 {
  margin: 0 0 4px;
  color: #4E342E;
  font-size: 15px;
}

.connect-payments-eft-heading > div:last-child > p:last-child {
  margin: 0;
  color: #7A665B;
  font-size: 10px;
  line-height: 1.5;
}

.connect-payments-reference-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-top: 17px;
  padding: 13px;
  border: 1px solid #E0D2CA;
  border-radius: 8px;
  background: #FFFEFC;
}

.connect-payments-reference-box span {
  display: block;
  margin-bottom: 4px;
  color: #9A887E;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1px;
}

.connect-payments-reference-box strong {
  color: #4E342E;
  font-size: 13px;
}

.connect-payments-reference-box > svg {
  color: #8A776C;
  font-size: 12px;
}

.connect-payments-eft-note {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  margin: 13px 0 0;
  color: #8A776C;
  font-size: 9px;
  line-height: 1.5;
}

.connect-payments-eft-note svg {
  margin-top: 2px;
  flex-shrink: 0;
  color: #c48b5b;
}

/* Payment action */
.connect-payments-action {
  margin-top: 24px;
}

.connect-payments-submit-button {
  width: 100%;
  min-height: 49px;
  padding: 13px 16px;
  border: none;
  border-radius: 9px;
  background: #c48b5b;
  color: #FFFEFC;
  font-family: inherit;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  box-sizing: border-box;
  transition:
    background 180ms ease,
    transform 180ms ease,
    box-shadow 180ms ease;
}

.connect-payments-submit-button span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
}

.connect-payments-submit-button:hover:not(:disabled) {
  background: #a37547;
  transform: translateY(-1px);
  box-shadow: 0 7px 18px rgba(164, 117, 71, 0.22);
}

.connect-payments-submit-button:active:not(:disabled) {
  transform: translateY(0);
}

.connect-payments-submit-button:disabled {
  background: #BCA99F;
  cursor: not-allowed;
}

.connect-payments-trust-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  margin-top: 11px;
  color: #96857B;
  font-size: 8px;
}

.connect-payments-trust-row svg {
  color: #55715B;
}

.connect-payments-trust-divider {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #B9AAA2;
}

.connect-payments-prototype-message {
  margin: 13px 0 0;
  color: #9A887E;
  font-size: 8px;
  line-height: 1.5;
  text-align: center;
}

/* Form transitions */
.connect-payments-form-enter-active,
.connect-payments-form-leave-active {
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}

.connect-payments-form-enter-from,
.connect-payments-form-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

/* Error state */
.connect-payments-error-card {
  max-width: 600px;
  margin: 55px auto;
  padding: 38px;
  border: 1px solid #E3D7D0;
  border-radius: 18px;
  background: #FFFEFC;
  box-shadow: 0 8px 25px rgba(78, 52, 46, 0.07);
  text-align: center;
  box-sizing: border-box;
}

.connect-payments-error-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  margin-bottom: 15px;
  border-radius: 50%;
  background: #F8E2DD;
  color: #9A4938;
  font-size: 18px;
}

.connect-payments-error-eyebrow {
  margin: 0 0 6px;
  color: #c48b5b;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.connect-payments-error-card h2 {
  margin: 0 0 9px;
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 26px;
}

.connect-payments-error-card p:not(.connect-payments-error-eyebrow) {
  margin: 0 0 21px;
  color: #7A665B;
  font-size: 12px;
}

.connect-payments-return-link,
.connect-payments-success-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 40px;
  padding: 10px 17px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 11px;
  font-weight: 700;
  transition:
    background 180ms ease,
    transform 180ms ease,
    box-shadow 180ms ease;
}

.connect-payments-return-link {
  background: #4E342E;
  color: #FFFEFC;
}

.connect-payments-return-link:hover {
  background: #5C3D24;
  transform: translateY(-1px);
  box-shadow: 0 5px 14px rgba(78, 52, 46, 0.16);
}

/* Success receipt */
.connect-payments-success-card {
  max-width: 650px;
  margin: 35px auto 0;
  padding: 40px;
  border: 1px solid #DDD2CB;
  border-radius: 20px;
  background: #FFFEFC;
  box-shadow: 0 10px 30px rgba(78, 52, 46, 0.08);
  text-align: center;
  box-sizing: border-box;
}

.connect-payments-success-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
  border-radius: 50%;
  background: #E6F0E8;
  color: #3F6847;
  font-size: 25px;
}

.connect-payments-success-eyebrow {
  margin: 0 0 6px;
  color: #c48b5b;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.7px;
}

.connect-payments-success-card h2 {
  margin: 0 0 9px;
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 31px;
  font-weight: 600;
}

.connect-payments-success-message {
  max-width: 450px;
  margin: 0 auto 25px;
  color: #7A665B;
  font-size: 12px;
  line-height: 1.6;
}

/* Receipt */
.connect-payments-receipt {
  margin-bottom: 25px;
  padding: 18px 20px;
  border: 1px solid #E8E2DD;
  border-radius: 12px;
  background: #FCF9F6;
  text-align: left;
}

.connect-payments-receipt-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 9px;
  padding-bottom: 13px;
  border-bottom: 1px solid #E2D8D2;
}

.connect-payments-receipt-header div {
  display: grid;
  gap: 3px;
}

.connect-payments-receipt-header span {
  color: #9A887E;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1px;
}

.connect-payments-receipt-header strong {
  color: #4E342E;
  font-size: 12px;
}

.connect-payments-receipt-header > svg {
  color: #c48b5b;
  font-size: 15px;
}

.connect-payments-receipt-row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 9px 0;
  color: #8A776C;
  font-size: 10px;
}

.connect-payments-receipt-row strong {
  color: #5C3D24;
  font-weight: 700;
  text-align: right;
}

.connect-payments-receipt-total {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-top: 5px;
  padding-top: 14px;
  border-top: 1px solid #E0D2CA;
  color: #4E342E;
  font-size: 13px;
  font-weight: 700;
}

.connect-payments-receipt-total strong {
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 18px;
}

.connect-payments-success-actions {
  display: flex;
  justify-content: center;
}

.connect-payments-success-link.primary {
  background: #4E342E;
  color: #FFFEFC;
}

.connect-payments-success-link.primary:hover {
  background: #5C3D24;
  transform: translateY(-1px);
  box-shadow: 0 5px 14px rgba(78, 52, 46, 0.16);
}

/* Success animation */
.connect-payments-success-enter-active {
  transition:
    opacity 280ms ease,
    transform 280ms ease;
}

.connect-payments-success-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

/* Tablet */
@media (max-width: 950px) {
  .connect-payments-page {
    padding: 28px 24px 50px;
  }

  .connect-payments-layout {
    grid-template-columns: 1fr;
  }

  .connect-payments-order-panel {
    order: 1;
  }

  .connect-payments-payment-panel {
    order: 2;
  }
}

/* Smaller tablet */
@media (max-width: 700px) {
  .connect-payments-header {
    align-items: flex-start;
    flex-direction: column;
    gap: 17px;
  }

  .connect-payments-header-badge {
    align-self: flex-start;
  }

  .connect-payments-order-identity {
    grid-template-columns: 1fr;
  }
}

/* Mobile */
@media (max-width: 560px) {
  .connect-payments-page {
    padding: 22px 16px 40px;
  }

  .connect-payments-title {
    font-size: 32px;
  }

  .connect-payments-header {
    margin-bottom: 22px;
    padding-bottom: 20px;
  }

  .connect-payments-order-panel,
  .connect-payments-payment-panel {
    padding: 21px;
    border-radius: 15px;
  }

  .connect-payments-panel-top {
    flex-direction: column;
  }

  .connect-payments-pending-pill {
    align-self: flex-start;
  }

  .connect-payments-methods {
    grid-template-columns: 1fr;
  }

  .connect-payments-card-row {
    grid-template-columns: 1fr;
  }

  .connect-payments-success-card {
    padding: 30px 20px;
  }

  .connect-payments-receipt-row,
  .connect-payments-receipt-total {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
  }

  .connect-payments-receipt-row strong {
    text-align: left;
  }
}

/* Shared small-business visual system */
:global(body) { margin: 0; background: var(--sb-bg); }
:global(*) { box-sizing: border-box; }
</style>