<template>
  <div class="app-layout">
    <!-- Left Sidebar (Pixel-perfect to mockups) -->
    <aside class="sidebar">
      <div class="logo-container">
        <div class="logo-badge">wc</div>
        <div class="logo-text">
          <h1 class="logo-title">WeConnect</h1>
          <span class="logo-subtitle">SMALL BUSINESS</span>
        </div>
      </div>

      <nav class="nav-menu">
        <a href="#" class="nav-item">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          Dashboard
        </a>
        <a href="#" class="nav-item">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          Browse suppliers
        </a>
        <a href="#" class="nav-item">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
          My orders
        </a>
        <a href="#" class="nav-item">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
          Deliveries
        </a>
        <a href="#" class="nav-item">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
          Messages
        </a>
        <a href="#" class="nav-item active">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          Cart
          <span class="cart-count-badge" v-if="totalCartCount > 0">{{ totalCartCount }}</span>
        </a>
        <a href="#" class="nav-item">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
          Business profile
        </a>
      </nav>

      <a href="#" class="logout-link">
        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
        Log out
      </a>
    </aside>

    <!-- Main Workspace -->
    <main class="main-content">
      <!-- Top Search & Welcome -->
      <header class="header-section">
        <div>
          <h2 class="welcome-heading">Shopping cart</h2>
          <p class="sub-heading">Review your supplier orders before confirming checkout.</p>
        </div>
        <div class="search-box">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input type="text" placeholder="Search suppliers or products..." />
        </div>
      </header>

      <!-- Cart Workspace Grid -->
      <div v-if="cartGroups.length > 0" class="cart-grid">
        
        <!-- Left: Supplier Items List -->
        <div class="items-column">
          <div 
            v-for="group in cartGroups" 
            :key="group.supplierId" 
            class="supplier-card"
          >
            <div class="supplier-card-header">
              <div class="supplier-info">
                <span class="avatar-circle">{{ group.supplierInitials }}</span>
                <div>
                  <h3 class="supplier-name">{{ group.supplierName }}</h3>
                  <span class="supplier-location">{{ group.location }}</span>
                </div>
              </div>
              <span class="eta-pill">{{ group.estimatedDelivery }}</span>
            </div>

            <!-- Item Table / List -->
            <div class="item-list">
              <div 
                v-for="item in group.items" 
                :key="item.cartItemId" 
                class="cart-item-row"
              >
                <div class="item-details">
                  <h4 class="item-name">{{ item.productName }}</h4>
                  <p class="item-meta">{{ item.sku }} • {{ item.packageUnit }}</p>
                  <span class="unit-price">R {{ formatCurrency(item.unitPrice) }} each</span>
                </div>

                <div class="quantity-picker">
                  <button @click="updateQuantity(item.cartItemId, -1)" class="qty-btn">-</button>
                  <span class="qty-value">{{ item.quantity }}</span>
                  <button @click="updateQuantity(item.cartItemId, 1)" class="qty-btn">+</button>
                </div>

                <div class="item-total">
                  R {{ formatCurrency(item.unitPrice * item.quantity) }}
                </div>

                <button @click="removeItem(item.cartItemId)" class="delete-icon" title="Remove Item">
                  <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Summary Sidebar Card -->
        <div class="summary-column">
          <div class="summary-card">
            <h3 class="summary-heading">Order summary</h3>

            <div class="summary-line">
              <span>Subtotal ({{ totalCartCount }} items)</span>
              <span>R {{ formatCurrency(subtotal) }}</span>
            </div>
            <div class="summary-line">
              <span>Logistics & Delivery</span>
              <span>R {{ formatCurrency(deliveryFee) }}</span>
            </div>
            <div class="summary-line">
              <span>VAT (15%)</span>
              <span>R {{ formatCurrency(vatAmount) }}</span>
            </div>

            <hr class="summary-divider" />

            <div class="summary-line total-line">
              <span>Total spend</span>
              <span class="total-amount">R {{ formatCurrency(grandTotal) }}</span>
            </div>

            <!-- Payment Choice -->
            <div class="form-group">
              <label class="form-label">Payment option</label>
              <select v-model="selectedPaymentMethod" class="custom-select">
                <option value="invoice">30-Day Invoice (Trade credit)</option>
                <option value="card">Credit / Debit card</option>
                <option value="eft">Instant EFT</option>
              </select>
            </div>

            <button @click="handleCheckout" class="checkout-button">
              Proceed to checkout
            </button>

            <p class="security-note">
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              Encrypted & secure B2B transaction
            </p>
          </div>
        </div>

      </div>

      <!-- Empty State -->
      <div v-else class="empty-cart-card">
        <div class="empty-icon">🛒</div>
        <h3>Your cart is empty</h3>
        <p>Explore suppliers and add wholesale products to your order.</p>
        <button class="checkout-button browse-btn">Browse suppliers</button>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'CartView',
  data() {
    return {
      selectedPaymentMethod: 'invoice',
      deliveryFee: 150.00,
      // Sample data populated to match mockups exactly
      cartGroups: [
        {
          supplierId: 1,
          supplierName: 'Cape Fresh Packaging',
          supplierInitials: 'CF',
          location: 'Paarl, WC',
          estimatedDelivery: '24 min',
          items: [
            {
              cartItemId: 101,
              productName: 'Takeaway containers (500ml)',
              sku: 'CFP-500-BOX',
              packageUnit: 'Pack of 100',
              unitPrice: 450.00,
              quantity: 2
            }
          ]
        },
        {
          supplierId: 2,
          supplierName: 'Green Harvest Produce',
          supplierInitials: 'GH',
          location: 'Stellenbosch, WC',
          estimatedDelivery: 'Tomorrow 9–11am',
          items: [
            {
              cartItemId: 102,
              productName: 'Fresh organic vegetables crate',
              sku: 'GHP-VEG-25KG',
              packageUnit: 'Bulk 25kg',
              unitPrice: 1240.00,
              quantity: 1
            }
          ]
        }
      ]
    }
  },
  computed: {
    totalCartCount() {
      return this.cartGroups.reduce((count, group) => {
        return count + group.items.reduce((sum, item) => sum + item.quantity, 0);
      }, 0);
    },
    subtotal() {
      return this.cartGroups.reduce((total, group) => {
        return total + group.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
      }, 0);
    },
    vatAmount() {
      return this.subtotal * 0.15;
    },
    grandTotal() {
      return this.subtotal > 0 ? this.subtotal + this.deliveryFee + this.vatAmount : 0;
    }
  },
  methods: {
    updateQuantity(cartItemId, delta) {
      this.cartGroups.forEach(group => {
        const item = group.items.find(i => i.cartItemId === cartItemId);
        if (item) {
          item.quantity += delta;
          if (item.quantity < 1) item.quantity = 1;
        }
      });
    },
    removeItem(cartItemId) {
      this.cartGroups.forEach(group => {
        group.items = group.items.filter(i => i.cartItemId !== cartItemId);
      });
      // Remove empty supplier groups
      this.cartGroups = this.cartGroups.filter(group => group.items.length > 0);
    },
    formatCurrency(val) {
      return val.toLocaleString('en-ZA', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    },
    handleCheckout() {
      alert(`Order submitted via ${this.selectedPaymentMethod.toUpperCase()}! Total: R ${this.formatCurrency(this.grandTotal)}`);
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

/* Main Container Layout */
.app-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f9f6f0;
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #2d1810;
}

/* Sidebar styling matching mockups */
.sidebar {
  width: 250px;
  background-color: #4a2e2b;
  color: #ffffff;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 32px;
  padding-left: 8px;
}

.logo-badge {
  background-color: #d97736;
  color: #ffffff;
  font-weight: 700;
  padding: 6px 8px;
  border-radius: 6px;
  font-size: 13px;
}

.logo-title {
  font-family: 'Playfair Display', serif;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.1;
}

.logo-subtitle {
  font-size: 9px;
  letter-spacing: 0.8px;
  color: #cbb2ab;
  display: block;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-grow: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  color: #d1beba;
  text-decoration: none;
  border-radius: 8px;
  font-size: 13.5px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.nav-item:hover, .nav-item.active {
  background-color: #5c3a37;
  color: #ffffff;
}

.cart-count-badge {
  margin-left: auto;
  background: #d97736;
  color: white;
  font-size: 11px;
  padding: 2px 7px;
  border-radius: 10px;
  font-weight: 700;
}

.logout-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  color: #cbb2ab;
  text-decoration: none;
  font-size: 13.5px;
  margin-top: auto;
}

/* Workspace Header */
.main-content {
  flex: 1;
  padding: 32px 40px;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
}

.welcome-heading {
  font-family: 'Playfair Display', serif;
  font-size: 26px;
  font-weight: 700;
  color: #2d1810;
}

.sub-heading {
  color: #7a6862;
  font-size: 13.5px;
  margin-top: 4px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  border: 1px solid #e8ded5;
  padding: 8px 14px;
  border-radius: 20px;
  width: 280px;
  color: #7a6862;
}

.search-box input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 13px;
  width: 100%;
}

/* Workspace Cart Grid */
.cart-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 24px;
}

/* Supplier Card */
.supplier-card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e8ded5;
  padding: 20px;
  margin-bottom: 20px;
}

.supplier-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 14px;
  border-bottom: 1px solid #f2eae4;
  margin-bottom: 14px;
}

.supplier-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar-circle {
  width: 36px;
  height: 36px;
  background-color: #f7ebe1;
  color: #b85c14;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
}

.supplier-name {
  font-size: 15px;
  font-weight: 700;
}

.supplier-location {
  font-size: 12px;
  color: #7a6862;
}

.eta-pill {
  background: #faebd7;
  color: #b85c14;
  font-size: 11.5px;
  padding: 5px 12px;
  border-radius: 16px;
  font-weight: 600;
}

/* Item Rows */
.cart-item-row {
  display: grid;
  grid-template-columns: 2fr 100px 110px 30px;
  align-items: center;
  gap: 16px;
  padding: 12px 0;
}

.cart-item-row:not(:last-child) {
  border-bottom: 1px dashed #e8ded5;
}

.item-name {
  font-size: 14.5px;
  font-weight: 600;
}

.item-meta {
  font-size: 12px;
  color: #7a6862;
  margin-top: 2px;
}

.unit-price {
  font-size: 12px;
  color: #d97736;
  font-weight: 600;
}

/* Quantity controls */
.quantity-picker {
  display: flex;
  align-items: center;
  border: 1px solid #e8ded5;
  border-radius: 6px;
  overflow: hidden;
  width: fit-content;
}

.qty-btn {
  background: #f9f6f0;
  border: none;
  width: 28px;
  height: 28px;
  cursor: pointer;
  font-weight: 700;
  color: #2d1810;
}

.qty-btn:hover {
  background: #e8ded5;
}

.qty-value {
  padding: 0 10px;
  font-size: 13px;
  font-weight: 600;
}

.item-total {
  font-weight: 700;
  font-size: 14.5px;
  text-align: right;
}

.delete-icon {
  background: none;
  border: none;
  color: #c29b93;
  cursor: pointer;
  display: flex;
  justify-content: flex-end;
}

.delete-icon:hover {
  color: #a83232;
}

/* Right Summary Panel */
.summary-card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e8ded5;
  padding: 22px;
  position: sticky;
  top: 32px;
}

.summary-heading {
  font-family: 'Playfair Display', serif;
  font-size: 19px;
  margin-bottom: 18px;
  font-weight: 700;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  font-size: 13.5px;
  color: #7a6862;
  margin-bottom: 10px;
}

.summary-divider {
  border: none;
  border-top: 1px solid #e8ded5;
  margin: 14px 0;
}

.total-line {
  font-size: 15px;
  font-weight: 700;
  color: #2d1810;
}

.total-amount {
  color: #d97736;
  font-size: 18px;
}

.form-group {
  margin-top: 18px;
}

.form-label {
  display: block;
  font-size: 11.5px;
  font-weight: 600;
  color: #7a6862;
  margin-bottom: 6px;
  text-transform: uppercase;
}

.custom-select {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #e8ded5;
  background: #f9f6f0;
  font-size: 13.5px;
  outline: none;
}

.checkout-button {
  width: 100%;
  background-color: #d97736;
  color: #ffffff;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14.5px;
  cursor: pointer;
  margin-top: 18px;
  transition: background 0.2s ease;
}

.checkout-button:hover {
  background-color: #c26527;
}

.security-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 11px;
  color: #7a6862;
  margin-top: 14px;
}

.empty-cart-card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e8ded5;
  padding: 60px;
  text-align: center;
}

.empty-icon {
  font-size: 40px;
  margin-bottom: 12px;
}

.browse-btn {
  width: auto;
  padding: 10px 24px;
  margin-top: 16px;
}
</style>