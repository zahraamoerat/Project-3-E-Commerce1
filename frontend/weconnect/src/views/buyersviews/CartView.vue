<template>
  <div class="cart-page">
    <SmallBusinessNavbar />
    <main class="main-content">
      <p v-if="error" class="error-message">{{ error }}</p>
      <p v-if="isLoading" class="loading-message">Loading your cart...</p>
      <div class="cart-topbar">
        <button type="button" class="back-button" @click="goBack">
          <span aria-hidden="true">←</span>
          Back
        </button>
      </div>
      <!-- Top Search & Welcome -->
      <header class="header-section">
        <div>
          <h2 class="welcome-heading">Shopping cart</h2>
          <p class="sub-heading">
            Review your supplier orders before confirming checkout.
          </p>
        </div>
        <div class="search-box">
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input v-model="searchQuery" type="text" placeholder="Search suppliers or products..." />
        </div>
      </header>

      <!-- Cart Workspace Grid -->
      <div v-if="filteredCartGroups.length > 0" class="cart-grid">
        <!-- Left: Supplier Items List -->
        <div class="items-column">
          <div
            v-for="group in filteredCartGroups"
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
                  <p class="item-meta">
                    {{ item.sku }} • {{ item.packageUnit }}
                  </p>
                  <span class="unit-price"
                    >R {{ formatCurrency(item.unitPrice) }} each</span
                  >
                </div>

                <div class="quantity-picker">
                  <button
                    @click="updateQuantity(item.cartItemId, -1)"
                    class="qty-btn"
                  >
                    -
                  </button>
                  <span class="qty-value">{{ item.quantity }}</span>
                  <button
                    @click="updateQuantity(item.cartItemId, 1)"
                    class="qty-btn"
                  >
                    +
                  </button>
                </div>

                <div class="item-total">
                  R {{ formatCurrency(item.unitPrice * item.quantity) }}
                </div>

                <button
                  @click="removeItem(item.cartItemId)"
                  class="delete-icon"
                  title="Remove Item"
                >
                  <svg
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
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
              <span class="total-amount"
                >R {{ formatCurrency(grandTotal) }}</span
              >
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

            <button @click="handleCheckout" class="checkout-button" :disabled="checkoutBusy">
              {{ checkoutBusy ? "Placing order..." : "Proceed to checkout" }}
            </button>

            <p class="security-note">
              <svg
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                ></path>
              </svg>
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
        <button type="button" class="checkout-button browse-btn" @click="$router.push('/small-business/products')">Browse suppliers</button>
      </div>
    </main>
  </div>
</template>

<script>
import { api } from "@/services/api";
import SmallBusinessNavbar from "@/components/SmallBusinessNavbar.vue";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default {
  name: "CartView",
  data() {
    return {
      selectedPaymentMethod: "invoice",
      deliveryFee: 150.0,
      cartGroups: [],
      searchQuery: "",
      checkoutBusy: false,
      isLoading: false,
      error: "",
    };
  },
  // Group the cart items by supplier so each supplier gets its own section.
  computed: {
    totalCartCount() {
      return this.cartGroups.reduce(
        (count, group) =>
          count + group.items.reduce((sum, item) => sum + item.quantity, 0),
        0,
      );
    },
    subtotal() {
      return this.cartGroups.reduce(
        (total, group) =>
          total +
          group.items.reduce(
            (sum, item) => sum + item.unitPrice * item.quantity,
            0,
          ),
        0,
      );
    },
    vatAmount() {
      return this.subtotal * 0.15;
    },
    grandTotal() {
      return this.subtotal > 0
        ? this.subtotal + this.deliveryFee + this.vatAmount
        : 0;
    },
    filteredCartGroups() {
      const query = this.searchQuery.trim().toLowerCase();
      if (!query) return this.cartGroups;
      return this.cartGroups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) =>
            [item.productName, item.sku, group.supplierName]
              .filter(Boolean)
              .some((value) => String(value).toLowerCase().includes(query))
          ),
        }))
        .filter((group) => group.items.length > 0);
    },
  },
  async mounted() {
    await this.loadCart();
  },
  methods: {
    // Group the cart items by supplier so each supplier gets its own section.
    async loadCart() {
      const buyerId = localStorage.getItem("weconnect_buyer_id") || "1";
      this.isLoading = true;
      this.error = "";

      try {
        const items = await api.getCart(buyerId);
        const groups = new Map();

        items.forEach((item) => {
          if (!groups.has(item.supplier_id)) {
            groups.set(item.supplierId, {
              supplierId: item.supplierId,
              supplierName: item.supplier || "Supplier",
              supplierInitials: String(item.supplier || "Supplier")
                .split(/\s+/)
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part[0].toUpperCase())
                .join(""),
              location: "Wholesale supplier",
              estimatedDelivery: "2–5 days",
              items: [],
            });
          }

          groups.get(item.supplierId).items.push({
            cartItemId: item.cartItemId,
            productId: item.productId,
            productName: item.title,
            sku: item.sku || "Wholesale product",
            packageUnit: item.unit || "unit",
            unitPrice: Number(item.price),
            quantity: Number(item.quantity),
            imageUrl: item.image,
          });
        });

        this.cartGroups = Array.from(groups.values());
      } catch (error) {
        this.error = error.message;
      } finally {
        this.isLoading = false;
      }
    },

    async updateQuantity(cartItemId, delta) {
      const buyerId = localStorage.getItem("weconnect_buyer_id") || "1";
      if (!buyerId) return;

      for (const group of this.cartGroups) {
        const item = group.items.find((i) => i.cartItemId === cartItemId);
        if (!item) continue;

        const newQuantity = item.quantity + delta;
        if (newQuantity <= 0) {
          await this.removeItem(cartItemId);
          return;
        }

        try {
          await api.updateCartItem(buyerId, cartItemId, newQuantity);
          item.quantity = newQuantity;
        } catch (error) {
          this.error = error.message;
        }
        return;
      }
    },

    async removeItem(cartItemId) {
      const buyerId = localStorage.getItem("weconnect_buyer_id") || "1";
      if (!buyerId) return;

      try {
        await api.removeCartItem(buyerId, cartItemId);
        this.cartGroups.forEach((group) => {
          group.items = group.items.filter((i) => i.cartItemId !== cartItemId);
        });
        this.cartGroups = this.cartGroups.filter(
          (group) => group.items.length > 0,
        );
      } catch (error) {
        this.error = error.message;
      }
    },

    goBack() {
      if (window.history.length > 1) this.$router.back();
      else this.$router.push("/");
    },

    formatCurrency(val) {
      return Number(val).toLocaleString("en-ZA", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },

    async handleCheckout() {
      if (!this.cartGroups.length || this.checkoutBusy) return;

      const buyerId = localStorage.getItem("weconnect_buyer_id") || "1";
      this.checkoutBusy = true;
      this.error = "";

      try {
        const result = await api.checkoutCart(
          buyerId,
          this.selectedPaymentMethod
        );

        await Swal.fire({
          title: "Order placed",
          text: `Your ${result.orders?.length || 1} supplier order(s) were created successfully.`,
          icon: "success",
          confirmButtonText: "View orders",
        });

        this.cartGroups = [];
        this.$router.push("/small-business/orders");
      } catch (error) {
        this.error = error.message || "Checkout failed. Please try again.";
        await Swal.fire({
          title: "Checkout failed",
          text: this.error,
          icon: "error",
          confirmButtonText: "Close",
        });
      } finally {
        this.checkoutBusy = false;
      }
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap");

/* Main Container Layout */
.cart-page {
  min-height: 100vh;
  background-color: #f9f6f0;
  font-family: "Plus Jakarta Sans", sans-serif;
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
  font-family: "Playfair Display", serif;
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

.nav-item:hover,
.nav-item.active {
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
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 40px;
}

.cart-topbar {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 24px;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 14px;
  border: 1px solid #d8c9bf;
  border-radius: 8px;
  background: #ffffff;
  color: #5c3a37;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.back-button:hover {
  background: #f7ebe1;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
}

.welcome-heading {
  font-family: "Playfair Display", serif;
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
  font-family: "Playfair Display", serif;
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

@media (max-width: 900px) {
  .main-content {
    padding: 24px;
  }

  .cart-grid {
    grid-template-columns: 1fr;
  }

  .summary-card {
    position: static;
  }
}

@media (max-width: 640px) {
  .main-content {
    padding: 20px 16px;
  }

  .header-section {
    flex-direction: column;
    gap: 16px;
  }

  .welcome-heading {
    font-size: 24px;
  }

  .search-box {
    width: 100%;
  }

  .supplier-card {
    padding: 16px;
  }

  .supplier-card-header {
    align-items: flex-start;
    gap: 12px;
  }

  .eta-pill {
    white-space: nowrap;
  }

  .cart-item-row {
    grid-template-columns: 1fr auto;
    gap: 10px 12px;
  }

  .item-details {
    min-width: 0;
  }

  .item-name {
    overflow-wrap: anywhere;
  }

  .quantity-picker {
    grid-column: 1;
  }

  .item-total {
    grid-column: 2;
    grid-row: 2;
  }

  .delete-icon {
    grid-column: 2;
    grid-row: 1;
    align-self: start;
  }

  .summary-card,
  .empty-cart-card {
    padding: 18px;
  }

  .summary-line {
    gap: 16px;
  }

  .security-note {
    text-align: center;
  }
}
</style>
