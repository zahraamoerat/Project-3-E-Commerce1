<template>
  <!-- Small reusable link for opening the cart. -->
  <router-link to="/cart" class="cart-button" aria-label="Open shopping cart">
    <svg
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
    <span>Cart</span>
  </router-link>
</template>

<style scoped>
/* Cart button styling */
.cart-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 1px solid #d97746;
  border-radius: 20px;
  color: #b85c14;
  background: #fff;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
}

.cart-button:hover {
  background: #fff8f5;
}
</style>
