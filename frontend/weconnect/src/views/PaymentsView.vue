<template>
  <!-- Main payment page -->
  <div class="connect-payments-page">

    <!-- Page heading -->
    <header class="connect-payments-header">
      <p class="connect-payments-eyebrow">
        PAYMENT
      </p>

      <h1 class="connect-payments-title">
        Complete Payment
      </h1>

      <p class="connect-payments-description">
        Securely pay for your Connect order.
      </p>
    </header>

    <!-- Show an error if the order does not exist -->
    <section
      v-if="!selectedOrder"
      class="connect-payments-error-card"
    >
      <div class="connect-payments-error-icon">
        !
      </div>

      <h2>
        Order Not Found
      </h2>

      <p>
        The selected order could not be found.
      </p>

      <router-link
        to="/small-business/orders"
        class="connect-payments-return-link"
      >
        Return to Orders
      </router-link>
    </section>

    <!-- Payment content -->
    <div
      v-else-if="!paymentSuccess"
      class="connect-payments-layout"
    >

      <!-- Order summary -->
      <section class="connect-payments-order-summary">

        <div class="connect-payments-section-heading">
          <span class="connect-payments-section-label">
            ORDER
          </span>

          <h2 class="connect-payments-order-number">
            {{ selectedOrder.orderNumber }}
          </h2>

          <span class="connect-payments-order-status">
            Payment Required
          </span>
        </div>

        <!-- Supplier and delivery information -->
        <div class="connect-payments-supplier-information">

          <div class="connect-payments-info-row">
            <span>Supplier</span>
            <strong>
              {{ selectedOrder.supplier }}
            </strong>
          </div>

          <div class="connect-payments-info-row">
            <span>Delivery</span>
            <strong>
              {{ selectedOrder.deliveryId }}
            </strong>
          </div>

        </div>

        <!-- Price breakdown -->
        <div class="connect-payments-price-breakdown">

          <div class="connect-payments-price-row">
            <span>Order subtotal</span>
            <span>
              R {{ formatPrice(selectedOrder.subtotal) }}
            </span>
          </div>

          <div class="connect-payments-price-row">
            <span>Delivery fee</span>
            <span>
              R {{ formatPrice(selectedOrder.deliveryFee) }}
            </span>
          </div>

          <!-- Final amount -->
          <div class="connect-payments-total-row">
            <span>Total</span>

            <strong>
              R {{ formatPrice(selectedOrder.total) }}
            </strong>
          </div>

        </div>

        <!-- Small payment note -->
        <div class="connect-payments-summary-note">
          <span class="connect-payments-summary-note-icon">
            ✓
          </span>

          <p>
            Your order will be marked as paid after the payment
            request is completed.
          </p>
        </div>

      </section>

      <!-- Payment section -->
      <section class="connect-payments-form-section">

        <div class="connect-payments-section-heading">
          <span class="connect-payments-section-label">
            PAYMENT METHOD
          </span>

          <h2 class="connect-payments-form-title">
            Choose Payment Method
          </h2>
        </div>

        <!-- Payment method buttons -->
        <div class="connect-payments-methods">

          <button
            type="button"
            class="connect-payments-method-card"
            :class="{ 'connect-payments-method-active': paymentMethod === 'card' }"
            @click="paymentMethod = 'card'"
          >
            <span class="connect-payments-method-icon">
              CARD
            </span>

            <span class="connect-payments-method-content">
              <strong>Card</strong>

              <small>
                Pay using a bank card
              </small>
            </span>

            <span
              v-if="paymentMethod === 'card'"
              class="connect-payments-method-check"
            >
              ✓
            </span>
          </button>

          <button
            type="button"
            class="connect-payments-method-card"
            :class="{ 'connect-payments-method-active': paymentMethod === 'eft' }"
            @click="paymentMethod = 'eft'"
          >
            <span class="connect-payments-method-icon">
              EFT
            </span>

            <span class="connect-payments-method-content">
              <strong>EFT</strong>

              <small>
                Pay using electronic transfer
              </small>
            </span>

            <span
              v-if="paymentMethod === 'eft'"
              class="connect-payments-method-check"
            >
              ✓
            </span>
          </button>

        </div>

        <!-- Card payment form -->
        <div
          v-if="paymentMethod === 'card'"
          class="connect-payments-card-fields"
        >

          <label class="connect-payments-field">
            <span>
              Cardholder Name
            </span>

            <input
              v-model="cardName"
              type="text"
              autocomplete="cc-name"
              placeholder="Enter cardholder name"
            >
          </label>

          <label class="connect-payments-field">
            <span>
              Card Number
            </span>

            <input
              v-model="cardNumber"
              type="text"
              inputmode="numeric"
              autocomplete="cc-number"
              maxlength="19"
              placeholder="1234 5678 9012 3456"
              @input="formatCardNumber"
            >
          </label>

          <!-- Expiry date and CVV sit beside each other -->
          <div class="connect-payments-card-row">

            <label class="connect-payments-field">
              <span>
                Expiry Date
              </span>

              <input
                v-model="expiryDate"
                type="text"
                inputmode="numeric"
                autocomplete="cc-exp"
                maxlength="5"
                placeholder="MM/YY"
                @input="formatExpiryDate"
              >
            </label>

            <label class="connect-payments-field">
              <span>
                CVV
              </span>

              <input
                v-model="cvv"
                type="password"
                inputmode="numeric"
                autocomplete="cc-csc"
                maxlength="4"
                placeholder="123"
              >
            </label>

          </div>

        </div>

        <!-- EFT information -->
        <div
          v-if="paymentMethod === 'eft'"
          class="connect-payments-eft-information"
        >

          <div class="connect-payments-eft-heading">
            <span class="connect-payments-eft-icon">
              EFT
            </span>

            <div>
              <h3>
                Electronic Transfer
              </h3>

              <p>
                Use the reference below when making your bank transfer.
              </p>
            </div>
          </div>

          <div class="connect-payments-reference-box">
            <span>
              Payment Reference
            </span>

            <strong>
              {{ selectedOrder.orderNumber }}
            </strong>
          </div>

          <p class="connect-payments-eft-note">
            Your payment will be confirmed once the transfer is
            received. This prototype currently simulates that process.
          </p>

        </div>

        <!-- Payment button -->
        <button
          type="button"
          class="connect-payments-submit-button"
          :disabled="isProcessing"
          @click="processPayment"
        >
          <span v-if="isProcessing">
            Processing...
          </span>

          <span v-else>
            Pay R {{ formatPrice(selectedOrder.total) }}
          </span>
        </button>

        <!-- Prototype payment notice -->
        <p class="connect-payments-secure-message">
          This is a frontend prototype. Real payment processing will
          be connected through a payment provider when the backend is ready.
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
          ✓
        </div>

        <p class="connect-payments-success-eyebrow">
          PAYMENT COMPLETE
        </p>

        <h2>
          Payment Successful
        </h2>

        <p class="connect-payments-success-message">
          {{ selectedOrder.orderNumber }} has been marked as paid.
        </p>

        <!-- Payment receipt information -->
        <div class="connect-payments-receipt">

          <div class="connect-payments-receipt-row">
            <span>Order</span>

            <strong>
              {{ selectedOrder.orderNumber }}
            </strong>
          </div>

          <div class="connect-payments-receipt-row">
            <span>Payment Method</span>

            <strong>
              {{ paymentMethod === 'card' ? 'Card' : 'EFT' }}
            </strong>
          </div>

          <div class="connect-payments-receipt-row">
            <span>Payment Reference</span>

            <strong>
              {{ paymentReference }}
            </strong>
          </div>

          <div class="connect-payments-receipt-total">
            <span>Total Paid</span>

            <strong>
              R {{ formatPrice(selectedOrder.total) }}
            </strong>
          </div>

        </div>

        <router-link
          to="/small-business/orders"
          class="connect-payments-success-link"
        >
          Return to Orders
        </router-link>

      </section>
    </Transition>

  </div>
</template>

<script setup>
// Import the Vue functions needed for this page
import { computed, ref } from 'vue'

// Import the route information
import { useRoute } from 'vue-router'

// Import the shared order data
import { orders } from '../data/orders'

// SweetAlert2 handles the payment confirmation and feedback
import Swal from 'sweetalert2'

// Get the current route
const route = useRoute()

// Find the order using the ID from the URL
const selectedOrder = computed(() => {
  return orders.find(order => order.id === Number(route.params.orderId))
})

// Store the selected payment method
const paymentMethod = ref('card')

// Store the card information entered by the user
const cardName = ref('')
const cardNumber = ref('')
const expiryDate = ref('')
const cvv = ref('')

// Store the payment processing state
const isProcessing = ref(false)

// Store whether the payment was successful
const paymentSuccess = ref(false)

// Store the payment reference after payment
const paymentReference = ref('')

// Format prices into two decimal places
function formatPrice(price) {
  return Number(price).toFixed(2)
}

// Add spaces between groups of card numbers
function formatCardNumber(event) {
  const numbersOnly = event.target.value
    .replace(/\D/g, '')
    .slice(0, 16)

  cardNumber.value = numbersOnly.replace(/(.{4})/g, '$1 ').trim()
}

// Format the expiry date as MM/YY
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

// Check the card fields before starting the prototype payment
function validateCardDetails() {
  if (!cardName.value.trim()) {
    return 'Please enter the cardholder name.'
  }

  const cleanCardNumber = cardNumber.value.replace(/\s/g, '')

  if (cleanCardNumber.length !== 16) {
    return 'Please enter a valid 16-digit card number.'
  }

  if (!/^\d{2}\/\d{2}$/.test(expiryDate.value)) {
    return 'Please enter the expiry date in MM/YY format.'
  }

  if (!/^\d{3,4}$/.test(cvv.value)) {
    return 'Please enter a valid CVV.'
  }

  return null
}

// Simulate the payment process
async function processPayment() {

  // Stop the process if there is no selected order
  if (!selectedOrder.value) {
    return
  }

  // Validate card details before continuing
  if (paymentMethod.value === 'card') {
    const validationMessage = validateCardDetails()

    if (validationMessage) {
      await Swal.fire({
        icon: 'warning',
        title: 'Check your details',
        text: validationMessage,
        confirmButtonColor: '#D17A4A'
      })

      return
    }
  }

  // Ask for confirmation before processing the payment
  const confirmation = await Swal.fire({
    title: 'Confirm payment',
    text: `You are about to pay R ${formatPrice(selectedOrder.value.total)} for ${selectedOrder.value.orderNumber}.`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Confirm Payment',
    cancelButtonText: 'Go Back',
    confirmButtonColor: '#D17A4A',
    cancelButtonColor: '#7A665B'
  })

  // Stop if the user cancels
  if (!confirmation.isConfirmed) {
    return
  }

  // Show the processing state on the page
  isProcessing.value = true

  // Show a loading SweetAlert while the prototype processes
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

  // Simulate a short payment request
  setTimeout(async () => {

    // Mark the order as paid for the frontend prototype
    selectedOrder.value.paymentStatus = 'Paid'

    // Create a temporary payment reference
    paymentReference.value = `PAY-${selectedOrder.value.id}001`

    // Store the temporary payment reference
    selectedOrder.value.paymentId = paymentReference.value

    // Stop the processing state
    isProcessing.value = false

    // Close the loading alert
    Swal.close()

    // Show the successful payment notification
    await Swal.fire({
      icon: 'success',
      title: 'Payment Successful',
      text: `Payment ${paymentReference.value} has been recorded successfully.`,
      confirmButtonText: 'View Receipt',
      confirmButtonColor: '#4E342E'
    })

    // Show the on-page receipt after the SweetAlert
    paymentSuccess.value = true

  }, 1500)
}
</script>

<style scoped>

/* Main page */
.connect-payments-page {
  min-height: 100vh;
  padding: 32px;
  box-sizing: border-box;
  background: #E8E2DD;
  color: #5C3D24;
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

/* Page heading */
.connect-payments-header {
  max-width: 1100px;
  margin: 0 auto 28px;
}

.connect-payments-eyebrow {
  margin: 0 0 8px;
  color: #D17A4A;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.8px;
}

.connect-payments-title {
  margin: 0 0 8px;
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 38px;
  font-weight: 600;
  line-height: 1.1;
}

.connect-payments-description {
  max-width: 650px;
  margin: 0;
  color: #7A665B;
  font-size: 15px;
  line-height: 1.6;
}

/* Main payment layout */
.connect-payments-layout {
  display: grid;
  grid-template-columns: minmax(300px, 0.85fr) minmax(400px, 1.15fr);
  gap: 24px;
  max-width: 1100px;
  margin: 0 auto;
  align-items: start;
}

/* Shared card styling */
.connect-payments-order-summary,
.connect-payments-form-section {
  padding: 28px;
  background: #FFFEFC;
  border-radius: 16px;
  box-shadow: 0 4px 18px rgba(78, 52, 46, 0.08);
  box-sizing: border-box;
}

/* Section headings */
.connect-payments-section-label {
  color: #D17A4A;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.7px;
}

.connect-payments-order-number,
.connect-payments-form-title {
  margin: 7px 0 0;
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 27px;
  font-weight: 600;
  line-height: 1.2;
}

.connect-payments-order-status {
  display: inline-flex;
  margin-top: 12px;
  padding: 6px 10px;
  border-radius: 999px;
  background: #F8E8D9;
  color: #8A5A32;
  font-size: 11px;
  font-weight: 700;
}

/* Supplier and delivery information */
.connect-payments-supplier-information {
  margin: 28px 0;
  padding: 17px 0;
  border-top: 1px solid #E8E2DD;
  border-bottom: 1px solid #E8E2DD;
}

.connect-payments-info-row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 9px 0;
  font-size: 13px;
}

.connect-payments-info-row span {
  color: #8A776C;
}

.connect-payments-info-row strong {
  color: #4E342E;
  text-align: right;
}

/* Price breakdown */
.connect-payments-price-breakdown {
  margin-top: 20px;
}

.connect-payments-price-row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 10px 0;
  color: #7A665B;
  font-size: 14px;
}

.connect-payments-total-row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-top: 12px;
  padding-top: 18px;
  border-top: 1px solid #DCCDC5;
  color: #4E342E;
  font-size: 21px;
}

.connect-payments-total-row strong {
  font-family: Georgia, "Times New Roman", serif;
}

/* Small note inside the order summary */
.connect-payments-summary-note {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 24px;
  padding: 13px;
  border-radius: 10px;
  background: #F6EEE9;
}

.connect-payments-summary-note-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #E6F0E8;
  color: #3F6847;
  font-size: 11px;
  font-weight: 700;
}

.connect-payments-summary-note p {
  margin: 0;
  color: #7A665B;
  font-size: 12px;
  line-height: 1.5;
}

/* Payment method choices */
.connect-payments-methods {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin: 25px 0;
}

.connect-payments-method-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 76px;
  padding: 14px;
  border: 1px solid #DCCDC5;
  border-radius: 11px;
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
  border-color: #D17A4A;
  transform: translateY(-1px);
  box-shadow: 0 5px 14px rgba(78, 52, 46, 0.07);
}

.connect-payments-method-active {
  border: 2px solid #D17A4A;
  background: #F8EEE8;
}

.connect-payments-method-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 9px;
  background: #4E342E;
  color: #FFFEFC;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.connect-payments-method-content {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.connect-payments-method-content strong {
  color: #4E342E;
  font-size: 13px;
}

.connect-payments-method-content small {
  color: #7A665B;
  font-size: 11px;
  line-height: 1.4;
}

.connect-payments-method-check {
  margin-left: auto;
  color: #D17A4A;
  font-size: 17px;
  font-weight: 800;
}

/* Card fields */
.connect-payments-card-fields {
  display: grid;
  gap: 17px;
}

.connect-payments-field {
  display: grid;
  gap: 7px;
  color: #4E342E;
  font-size: 13px;
  font-weight: 600;
}

.connect-payments-field input {
  width: 100%;
  padding: 13px 14px;
  border: 1px solid #DCCDC5;
  border-radius: 8px;
  outline: none;
  background: #FFFEFC;
  color: #4E342E;
  font-family: inherit;
  font-size: 14px;
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
  border-color: #D17A4A;
  background: #FFFFFF;
  box-shadow: 0 0 0 3px rgba(209, 122, 74, 0.1);
}

.connect-payments-card-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

/* EFT information */
.connect-payments-eft-information {
  padding: 20px;
  border: 1px solid #E8D9D0;
  border-radius: 11px;
  background: #F6EEE9;
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
  font-size: 9px;
  font-weight: 800;
}

.connect-payments-eft-information h3 {
  margin: 0 0 5px;
  color: #4E342E;
  font-size: 16px;
}

.connect-payments-eft-information p {
  margin: 0;
  color: #7A665B;
  font-size: 13px;
  line-height: 1.5;
}

.connect-payments-reference-box {
  margin-top: 17px;
  padding: 14px;
  border: 1px solid #E0D2CA;
  border-radius: 8px;
  background: #FFFEFC;
}

.connect-payments-reference-box span {
  display: block;
  margin-bottom: 5px;
  color: #8A776C;
  font-size: 11px;
}

.connect-payments-reference-box strong {
  color: #4E342E;
  font-size: 14px;
}

.connect-payments-eft-note {
  margin-top: 14px !important;
  font-size: 11px !important;
}

/* Main payment button */
.connect-payments-submit-button {
  width: 100%;
  margin-top: 25px;
  padding: 15px;
  border: none;
  border-radius: 9px;
  background: #D17A4A;
  color: #FFFEFC;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  box-sizing: border-box;
  transition:
    background 180ms ease,
    transform 180ms ease,
    box-shadow 180ms ease;
}

.connect-payments-submit-button:hover:not(:disabled) {
  background: #C46C3E;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(209, 122, 74, 0.2);
}

.connect-payments-submit-button:active:not(:disabled) {
  transform: translateY(0);
}

.connect-payments-submit-button:disabled {
  background: #BCA99F;
  cursor: not-allowed;
}

/* Prototype notice */
.connect-payments-secure-message {
  margin: 13px 0 0;
  color: #8A776D;
  font-size: 11px;
  line-height: 1.5;
  text-align: center;
}

/* Error card */
.connect-payments-error-card {
  max-width: 600px;
  margin: 50px auto;
  padding: 32px;
  background: #FFFEFC;
  border: 1px solid #E3D7D0;
  border-radius: 16px;
  box-shadow: 0 4px 18px rgba(78, 52, 46, 0.08);
  text-align: center;
  box-sizing: border-box;
}

.connect-payments-error-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin-bottom: 15px;
  border-radius: 50%;
  background: #F8E2DD;
  color: #9A4938;
  font-size: 20px;
  font-weight: 800;
}

.connect-payments-error-card h2 {
  margin: 0 0 9px;
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 25px;
}

.connect-payments-error-card p {
  margin: 0 0 20px;
  color: #7A665B;
  font-size: 13px;
}

.connect-payments-return-link,
.connect-payments-success-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 11px 18px;
  border-radius: 9px;
  background: #4E342E;
  color: #FFFEFC;
  text-decoration: none;
  font-size: 13px;
  font-weight: 700;
  transition:
    background 180ms ease,
    transform 180ms ease,
    box-shadow 180ms ease;
}

.connect-payments-return-link:hover,
.connect-payments-success-link:hover {
  background: #5C3D24;
  transform: translateY(-1px);
  box-shadow: 0 5px 14px rgba(78, 52, 46, 0.16);
}

/* Successful payment receipt */
.connect-payments-success-card {
  max-width: 600px;
  margin: 30px auto 0;
  padding: 35px;
  background: #FFFEFC;
  border-radius: 16px;
  box-shadow: 0 4px 18px rgba(78, 52, 46, 0.08);
  text-align: center;
  box-sizing: border-box;
}

.connect-payments-success-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 58px;
  height: 58px;
  margin-bottom: 15px;
  border-radius: 50%;
  background: #E6F0E8;
  color: #3F6847;
  font-size: 27px;
  font-weight: 700;
}

.connect-payments-success-eyebrow {
  margin: 0 0 6px;
  color: #D17A4A;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.6px;
}

.connect-payments-success-card h2 {
  margin: 0 0 9px;
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 29px;
  font-weight: 600;
}

.connect-payments-success-message {
  margin: 0 0 22px;
  color: #7A665B;
  font-size: 13px;
}

/* Simple payment receipt */
.connect-payments-receipt {
  margin-bottom: 24px;
  padding: 15px 18px;
  border: 1px solid #E8E2DD;
  border-radius: 11px;
  background: #FCF9F6;
  text-align: left;
}

.connect-payments-receipt-row,
.connect-payments-receipt-total {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 9px 0;
  font-size: 12px;
}

.connect-payments-receipt-row {
  color: #8A776C;
}

.connect-payments-receipt-row strong {
  color: #5C3D24;
  text-align: right;
}

.connect-payments-receipt-total {
  margin-top: 5px;
  padding-top: 13px;
  border-top: 1px solid #E0D2CA;
  color: #4E342E;
  font-size: 14px;
  font-weight: 700;
}

.connect-payments-receipt-total strong {
  font-family: Georgia, "Times New Roman", serif;
}

/* Success card animation */
.connect-payments-success-enter-active {
  transition:
    opacity 250ms ease,
    transform 250ms ease;
}

.connect-payments-success-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

/* Tablet */
@media (max-width: 900px) {
  .connect-payments-page {
    padding: 24px;
  }

  .connect-payments-layout {
    grid-template-columns: 1fr;
  }

  .connect-payments-order-summary {
    order: 1;
  }

  .connect-payments-form-section {
    order: 2;
  }
}

/* Mobile */
@media (max-width: 640px) {
  .connect-payments-page {
    padding: 20px 16px;
  }

  .connect-payments-title {
    font-size: 31px;
  }

  .connect-payments-order-summary,
  .connect-payments-form-section {
    padding: 20px;
    border-radius: 14px;
  }

  .connect-payments-methods {
    grid-template-columns: 1fr;
  }

  .connect-payments-card-row {
    grid-template-columns: 1fr;
  }

  .connect-payments-info-row {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
  }

  .connect-payments-info-row strong {
    text-align: left;
  }

  .connect-payments-success-card {
    padding: 26px 20px;
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

</style>
