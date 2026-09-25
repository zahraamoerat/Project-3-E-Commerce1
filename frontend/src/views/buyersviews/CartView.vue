<template>
  <div class="cart-page">
    <SmallBusinessNavbar />

    <!-- Page heading / breadcrumb -->
    <section class="page-hero">
      <div class="hero-pattern hero-pattern-left" aria-hidden="true"></div>
      <div class="hero-pattern hero-pattern-right" aria-hidden="true"></div>
      <div class="hero-inner">
        <h1>Shopping Cart</h1>
        <p>
          <router-link to="/small-business/products">Home</router-link>
          <span>/</span>
          Shopping Cart
        </p>
      </div>
    </section>

    <main class="main-content">
      <p v-if="error" class="status-message error-message" role="alert">
        {{ error }}
      </p>
      <p v-if="isLoading" class="status-message loading-message" role="status">
        Loading your cart...
      </p>

      <div v-if="cartGroups.length > 0" class="cart-layout">
        <section class="cart-section" aria-labelledby="cart-items-heading">
          <div class="section-heading">
            <div>
              <p class="eyebrow">Your selection</p>
              <h2 id="cart-items-heading">Cart Items</h2>
            </div>
            <span class="item-count">{{ totalCartCount }} item{{ totalCartCount === 1 ? "" : "s" }}</span>
          </div>

          <div class="cart-table">
            <div class="table-header">
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Subtotal</span>
            </div>

            <div
              v-for="group in filteredCartGroups"
              :key="group.supplierId"
              class="supplier-group"
            >
              <div class="supplier-label">
                <span class="supplier-dot" aria-hidden="true"></span>
                <span>{{ group.supplierName }}</span>
                <span class="supplier-delivery">{{ group.estimatedDelivery }}</span>
              </div>

              <article
                v-for="item in group.items"
                :key="item.cartItemId"
                class="cart-row"
              >
                <div class="product-cell">
                  <button
                    type="button"
                    class="remove-button"
                    :aria-label="`Remove ${item.productName} from cart`"
                    title="Remove item"
                    @click="removeItem(item.cartItemId)"
                  >
                    ×
                  </button>

                  <div class="product-image-wrap">
                    <img
                      v-if="item.imageUrl"
                      :src="resolveImageUrl(item.imageUrl)"
                      :alt="item.productName"
                      class="product-image"
                      @error="handleImageError"
                    />
                    <div v-else class="product-image-placeholder" aria-hidden="true">
                      {{ productInitials(item.productName) }}
                    </div>
                  </div>

                  <div class="product-copy">
                    <h3>{{ item.productName }}</h3>
                    <p>{{ item.sku }} · {{ item.packageUnit }}</p>
                  </div>
                </div>

                <div class="price-cell">
                  R {{ formatCurrency(item.unitPrice) }}
                </div>

                <div class="quantity-cell">
                  <div class="quantity-picker" :aria-label="`Quantity for ${item.productName}`">
                    <button
                      type="button"
                      class="qty-btn"
                      :aria-label="`Decrease quantity of ${item.productName}`"
                      @click="updateQuantity(item.cartItemId, -1)"
                    >
                      −
                    </button>
                    <span class="qty-value">{{ item.quantity }}</span>
                    <button
                      type="button"
                      class="qty-btn"
                      :aria-label="`Increase quantity of ${item.productName}`"
                      @click="updateQuantity(item.cartItemId, 1)"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div class="subtotal-cell">
                  R {{ formatCurrency(item.unitPrice * item.quantity) }}
                </div>
              </article>
            </div>
          </div>

          <div v-if="searchQuery && filteredCartGroups.length === 0" class="no-results">
            <strong>No matching cart items</strong>
            <span>Try a different product or supplier name.</span>
          </div>

          <div class="cart-actions">
            <router-link to="/small-business/products" class="continue-shopping">
              <span aria-hidden="true">←</span>
              Continue Shopping
            </router-link>
          </div>
        </section>

        <aside class="summary-column" aria-labelledby="summary-heading">
          <div class="summary-card">
            <h2 id="summary-heading">Order Summary</h2>

            <div class="summary-line">
              <span>Items</span>
              <strong>{{ totalCartCount }}</strong>
            </div>

            <div class="summary-line">
              <span>Sub Total</span>
              <strong>R {{ formatCurrency(subtotal) }}</strong>
            </div>

            <div class="summary-line">
              <span>Shipping</span>
              <strong>{{ deliveryFee === 0 ? "Free" : "R " + formatCurrency(deliveryFee) }}</strong>
            </div>

            <div class="summary-line">
              <span>Taxes (15% VAT)</span>
              <strong>R {{ formatCurrency(vatAmount) }}</strong>
            </div>

            <div class="summary-divider"></div>

            <div class="summary-line total-line">
              <span>Total</span>
              <strong>R {{ formatCurrency(grandTotal) }}</strong>
            </div>

            <p class="shipping-note">
              <span aria-hidden="true">✓</span>
              Free shipping on orders over R1500
            </p>

            <div class="payment-group">
              <label for="payment-method">Payment option</label>
              <select id="payment-method" v-model="selectedPaymentMethod">
                <option value="invoice">30-Day Invoice (Trade credit)</option>
                <option value="card">Credit / Debit Card</option>
                <option value="eft">Instant EFT</option>
              </select>
            </div>

            <button
              type="button"
              class="checkout-button"
              :disabled="checkoutBusy || isLoading"
              @click="handleCheckout"
            >
              {{ checkoutBusy ? "Placing order..." : "Proceed to Checkout" }}
            </button>

            <p class="secure-note">
              <span aria-hidden="true">🔒</span>
              Secure and encrypted checkout
            </p>
          </div>
        </aside>
      </div>

      <section v-else-if="!isLoading" class="empty-cart">
        <div class="empty-icon" aria-hidden="true">🛒</div>
        <p class="eyebrow">Nothing here yet</p>
        <h2>Your cart is empty</h2>
        <p>Browse our marketplace and add wholesale products to your order.</p>
        <router-link to="/small-business/products" class="checkout-button empty-button">
          Browse Products
        </router-link>
      </section>

      <!-- Trust / service strip inspired by the supplied design -->
      <section class="benefits-strip" aria-label="Shopping benefits">
        <article class="benefit-card">
          <div class="benefit-icon" aria-hidden="true">◈</div>
          <div>
            <h3>Free Shipping</h3>
            <p>Free shipping for orders above R1500.</p>
          </div>
        </article>

        <article class="benefit-card">
          <div class="benefit-icon" aria-hidden="true">▣</div>
          <div>
            <h3>Flexible Payment</h3>
            <p>Multiple secure payment options.</p>
          </div>
        </article>

        <article class="benefit-card">
          <div class="benefit-icon" aria-hidden="true">◉</div>
          <div>
            <h3>24x7 Support</h3>
            <p>We're available to help when you need us.</p>
          </div>
        </article>
      </section>
    </main>
  </div>
</template>

<script>
import { api, resolveImageUrl as resolveAssetUrl } from "@/services/api";
import SmallBusinessNavbar from "@/components/SmallBusinessNavbar.vue";
import { basketKey } from "@/stores/basket";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default {
  name: "CartView",

  components: {
    SmallBusinessNavbar,
  },

  data() {
    return {
      selectedPaymentMethod: "invoice",
      cartGroups: [],
      searchQuery: "",
      checkoutBusy: false,
      isLoading: false,
      error: "",
    };
  },

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

    deliveryFee() {
      if (this.subtotal <= 0) return 0;
      return this.subtotal >= 1500 ? 0 : 150;
    },

    grandTotal() {
      return this.subtotal + this.deliveryFee + this.vatAmount;
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
              .some((value) =>
                String(value).toLowerCase().includes(query),
              ),
          ),
        }))
        .filter((group) => group.items.length > 0);
    },
  },

  async mounted() {
    await this.loadCart();
  },

  methods: {
    async loadCart() {
      const buyerId = localStorage.getItem("weconnect_buyer_id");
      this.isLoading = true;
      this.error = "";

      if (!buyerId) {
        this.error = "Please sign in to view your cart.";
        this.cartGroups = [];
        this.isLoading = false;
        return;
      }

      let items = [];
      let loadError = "";
      try {
        items = (await api.getCart(buyerId)) || [];
      } catch (error) {
        loadError = error.message || "Unable to load your cart.";
      }

      // Merge any locally tracked items the cart service didn't return so the
      // products the user added always show up in the cart.
      const knownIds = new Set(items.map((item) => String(item.productId)));
      this.readLocalBasket().forEach((localItem) => {
        if (!knownIds.has(String(localItem.productId))) {
          items.push(localItem);
        }
      });

      this.error = loadError && items.length === 0 ? loadError : "";

      const groups = new Map();

      items.forEach((item) => {
        const supplierId = item.supplierId ?? item.supplier_id ?? 0;

        if (!groups.has(supplierId)) {
          groups.set(supplierId, {
            supplierId,
            supplierName: item.supplier || "Supplier",
            supplierInitials: String(item.supplier || "Supplier")
              .split(/\s+/)
              .filter(Boolean)
              .slice(0, 2)
              .map((part) => part[0].toUpperCase())
              .join(""),
            estimatedDelivery: "2–5 days",
            items: [],
          });
        }

        groups.get(supplierId).items.push({
          cartItemId: item.cartItemId,
          productId: item.productId,
          productName: item.title || "Wholesale product",
          sku: item.sku || "Wholesale product",
          packageUnit: item.unit || "unit",
          unitPrice: Number(item.price) || 0,
          quantity: Number(item.quantity) || 1,
          imageUrl: item.image || "",
        });
      });

      this.cartGroups = Array.from(groups.values());
      this.isLoading = false;
    },

    readLocalBasket() {
      try {
        const stored = JSON.parse(
          localStorage.getItem(basketKey()) || "{}",
        );
        return Object.entries(stored).map(([productId, entry]) => {
          const product = entry.product || {};
          return {
            cartItemId: entry.cartItemId || `local-${productId}`,
            productId: productId || product.id || 0,
            supplierId: product.supplierId || product.supplier_id || 0,
            title: product.title || product.product_name || "Wholesale product",
            sku: product.sku || "Wholesale product",
            unit: product.unit || "unit",
            price: Number(product.price) || 0,
            quantity: Number(entry.quantity) || 1,
            image: product.image || "",
            supplier: product.supplier || "Supplier",
          };
        });
      } catch {
        return [];
      }
    },

    async updateQuantity(cartItemId, delta) {
      const buyerId = localStorage.getItem("weconnect_buyer_id");

      if (!buyerId) {
        this.error = "Please sign in to update your cart.";
        return;
      }

      for (const group of this.cartGroups) {
        const item = group.items.find((cartItem) => cartItem.cartItemId === cartItemId);

        if (!item) continue;

        const newQuantity = item.quantity + delta;

        if (newQuantity <= 0) {
          await this.removeItem(cartItemId);
          return;
        }

        try {
          await api.updateCartItem(buyerId, cartItemId, newQuantity);
          item.quantity = newQuantity;
          this.error = "";
        } catch (error) {
          this.error = error.message || "Unable to update the quantity.";
        }

        return;
      }
    },

    async removeItem(cartItemId) {
      const buyerId = localStorage.getItem("weconnect_buyer_id");

      if (!buyerId) {
        this.error = "Please sign in to update your cart.";
        return;
      }

      try {
        await api.removeCartItem(buyerId, cartItemId);

        this.cartGroups.forEach((group) => {
          group.items = group.items.filter(
            (item) => item.cartItemId !== cartItemId,
          );
        });

        this.cartGroups = this.cartGroups.filter(
          (group) => group.items.length > 0,
        );

        this.error = "";
      } catch (error) {
        this.error = error.message || "Unable to remove the item.";
      }
    },

    formatCurrency(value) {
      return Number(value || 0).toLocaleString("en-ZA", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },

    productInitials(name) {
      return String(name || "Product")
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("");
    },

    resolveImageUrl(imageUrl) {
      return resolveAssetUrl(imageUrl);
    },

    handleImageError(event) {
      event.target.style.display = "none";
      const placeholder = event.target.nextElementSibling;
      if (placeholder) placeholder.style.display = "grid";
    },

    async handleCheckout() {
      if (!this.cartGroups.length || this.checkoutBusy) return;

      const buyerId = localStorage.getItem("weconnect_buyer_id");

      if (!buyerId) {
        this.error = "Please sign in to place an order.";
        return;
      }
      this.checkoutBusy = true;
      this.error = "";

      try {
        const result = await api.checkoutCart(
          buyerId,
          this.selectedPaymentMethod,
        );

        this.cartGroups = [];
        this.$router.push(`/payment/${result.orders?.[0]?.order_id}`);
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
@import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap");

:global(*) {
  box-sizing: border-box;
}

:global(body) {
  margin: 0;
  background: #f8f7f5;
  font-family: "DM Sans", sans-serif;
  color: #2e211d;
}

.cart-page {
  min-height: 100vh;
  background: #f8f7f5;
  color: #2e211d;
  font-family: "DM Sans", sans-serif;
}

/* Template-style page heading */
.page-hero {
  position: relative;
  min-height: 128px;
  display: grid;
  place-items: center;
  overflow: hidden;
  background: #f2f2f1;
  border-bottom: 1px solid #ebe8e4;
}

.hero-inner {
  position: relative;
  z-index: 1;
  text-align: center;
}

.hero-inner h1 {
  margin: 0;
  font-family: "Playfair Display", serif;
  font-size: clamp(28px, 4vw, 40px);
  line-height: 1.1;
  color: #33231e;
}

.hero-inner p {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin: 10px 0 0;
  color: #8b7b74;
  font-size: 11px;
}

.hero-inner a {
  color: #66534c;
  text-decoration: none;
}

.hero-inner a:hover {
  color: #b7652b;
}

.hero-pattern {
  position: absolute;
  width: 125px;
  height: 80px;
  opacity: .45;
  background-image: radial-gradient(#c8c5c1 1.5px, transparent 1.5px);
  background-size: 9px 9px;
}

.hero-pattern-left {
  left: 8%;
  bottom: -42px;
  transform: rotate(-7deg);
}

.hero-pattern-right {
  right: 9%;
  top: -44px;
  transform: rotate(10deg);
}

/* Main layout */
.main-content {
  width: min(1180px, calc(100% - 48px));
  margin: 0 auto;
  padding: 30px 0 48px;
}

.status-message {
  margin: 0 0 18px;
  padding: 11px 14px;
  border-radius: 7px;
  font-size: 13px;
}

.error-message {
  color: #8b2727;
  background: #fceaea;
  border: 1px solid #f2caca;
}

.loading-message {
  color: #705c53;
  background: #fff;
  border: 1px solid #e8e1dc;
}

.cart-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 310px;
  gap: 28px;
  align-items: start;
}

.cart-section {
  min-width: 0;
}

.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 16px;
  margin-bottom: 13px;
}

.eyebrow {
  margin: 0 0 4px;
  color: #ad6b3b;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.3px;
  text-transform: uppercase;
}

.section-heading h2 {
  margin: 0;
  font-family: "Playfair Display", serif;
  font-size: 22px;
  color: #33231e;
}

.item-count {
  color: #7b6d66;
  font-size: 12px;
}

/* Table-like cart structure */
.cart-table {
  overflow: hidden;
  background: #fff;
  border: 1px solid #ebe5df;
  box-shadow: 0 8px 24px rgba(71, 50, 38, .05);
}

.table-header,
.cart-row {
  display: grid;
  grid-template-columns: minmax(250px, 1fr) 90px 115px 100px;
  column-gap: 18px;
  align-items: center;
}

.table-header {
  min-height: 40px;
  padding: 0 18px;
  background: #f5c15d;
  color: #5c351d;
  font-size: 9px;
  font-weight: 700;
}

.table-header span:nth-child(n + 2) {
  text-align: center;
}

.supplier-group + .supplier-group {
  border-top: 1px solid #eee7e1;
}

.supplier-label {
  display: flex;
  align-items: center;
  gap: 7px;
  min-height: 31px;
  padding: 7px 18px;
  background: #fbf9f7;
  color: #765f55;
  font-size: 10px;
  font-weight: 700;
}

.supplier-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #b7652b;
}

.supplier-delivery {
  margin-left: auto;
  color: #9a8a82;
  font-size: 9px;
  font-weight: 500;
}

.cart-row {
  min-height: 93px;
  padding: 13px 18px;
  border-bottom: 1px solid #eeeae6;
}

.cart-row:last-child {
  border-bottom: 0;
}

.product-cell {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.remove-button {
  flex: 0 0 17px;
  width: 17px;
  height: 17px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #766862;
  font-size: 17px;
  line-height: 17px;
  cursor: pointer;
}

.remove-button:hover {
  color: #a53232;
}

.product-image-wrap {
  flex: 0 0 54px;
  width: 54px;
  height: 64px;
  overflow: hidden;
  background: #f0e9e2;
}

.product-image,
.product-image-placeholder {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-image-placeholder {
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #eadfd6, #d5b9a6);
  color: #69473a;
  font-size: 13px;
  font-weight: 700;
}

.product-copy {
  min-width: 0;
}

.product-copy h3 {
  margin: 0 0 4px;
  overflow-wrap: anywhere;
  color: #3c2b25;
  font-size: 12px;
  font-weight: 700;
}

.product-copy p {
  margin: 0;
  color: #95847c;
  font-size: 9px;
  line-height: 1.4;
}

.price-cell,
.subtotal-cell {
  color: #3c302b;
  font-size: 11px;
  text-align: center;
}

.subtotal-cell {
  font-weight: 700;
}

.quantity-cell {
  display: flex;
  justify-content: center;
}

.quantity-picker {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  overflow: hidden;
  border: 1px solid #ded8d3;
  background: #fff;
}

.qty-btn {
  width: 27px;
  height: 29px;
  padding: 0;
  border: 0;
  background: #fff;
  color: #5d4a42;
  font-size: 14px;
  cursor: pointer;
}

.qty-btn:hover {
  background: #f5eee8;
}

.qty-value {
  min-width: 30px;
  color: #3d302a;
  font-size: 11px;
  font-weight: 700;
  text-align: center;
}

.cart-actions {
  display: flex;
  justify-content: flex-start;
  padding-top: 15px;
}

.continue-shopping {
  color: #6f4a38;
  font-size: 11px;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.continue-shopping:hover {
  color: #b7652b;
}

.no-results {
  padding: 26px;
  text-align: center;
  color: #7c6d66;
}

.no-results strong,
.no-results span {
  display: block;
}

.no-results strong {
  margin-bottom: 4px;
  color: #3c2b25;
}

/* Summary */
.summary-card {
  position: sticky;
  top: 92px;
  padding: 18px;
  background: #fff;
  border: 1px solid #e8e2dc;
  box-shadow: 0 8px 24px rgba(71, 50, 38, .05);
}

.summary-card h2 {
  margin: 0 0 18px;
  color: #3a2923;
  font-family: "Playfair Display", serif;
  font-size: 18px;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 11px;
  color: #8a7a72;
  font-size: 10px;
}

.summary-line strong {
  color: #3e312b;
  font-weight: 600;
  text-align: right;
}

.summary-divider {
  margin: 15px 0;
  border: 0;
  border-top: 1px solid #ebe5df;
}

.total-line {
  align-items: center;
  margin-bottom: 14px;
  color: #3b2b25;
  font-size: 13px;
  font-weight: 700;
}

.total-line strong {
  color: #a85b27;
  font-size: 16px;
}

.shipping-note {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 17px;
  padding: 8px 9px;
  background: #f8f2ea;
  color: #6c5a51;
  font-size: 9px;
  line-height: 1.35;
}

.shipping-note span {
  color: #9f5d2b;
  font-weight: 700;
}

.payment-group {
  margin-top: 4px;
}

.payment-group label {
  display: block;
  margin-bottom: 6px;
  color: #77665e;
  font-size: 9px;
  font-weight: 700;
}

.payment-group select {
  width: 100%;
  min-height: 35px;
  padding: 0 9px;
  border: 1px solid #ddd6d0;
  border-radius: 2px;
  background: #fff;
  color: #4d3c34;
  font: inherit;
  font-size: 10px;
  outline: none;
}

.payment-group select:focus {
  border-color: #b7652b;
  box-shadow: 0 0 0 2px rgba(183, 101, 43, .1);
}

.checkout-button {
  display: flex;
  width: 100%;
  min-height: 38px;
  align-items: center;
  justify-content: center;
  margin-top: 13px;
  padding: 0 14px;
  border: 0;
  border-radius: 2px;
  background: #4c2818;
  color: #fff;
  font: inherit;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
  transition: background .2s ease, transform .2s ease;
}

.checkout-button:hover:not(:disabled) {
  background: #67371f;
  transform: translateY(-1px);
}

.checkout-button:disabled {
  cursor: not-allowed;
  opacity: .65;
}

.secure-note {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin: 11px 0 0;
  color: #998a83;
  font-size: 8px;
}

/* Empty state */
.empty-cart {
  padding: 65px 24px;
  background: #fff;
  border: 1px solid #e8e2dc;
  text-align: center;
}

.empty-icon {
  margin-bottom: 12px;
  font-size: 36px;
}

.empty-cart h2 {
  margin: 0 0 7px;
  font-family: "Playfair Display", serif;
  font-size: 24px;
}

.empty-cart > p:not(.eyebrow) {
  margin: 0 auto;
  max-width: 420px;
  color: #82736c;
  font-size: 12px;
}

.empty-button {
  width: auto;
  display: inline-flex;
  margin-top: 20px;
  padding: 0 24px;
}

/* Bottom benefit strip */
.benefits-strip {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  margin-top: 42px;
}

.benefit-card {
  display: flex;
  align-items: center;
  gap: 11px;
}

.benefit-icon {
  flex: 0 0 35px;
  width: 35px;
  height: 35px;
  display: grid;
  place-items: center;
  border: 1px solid #b8865d;
  border-radius: 9px;
  background: #fffaf4;
  color: #8f542d;
  font-size: 17px;
}

.benefit-card h3 {
  margin: 0 0 3px;
  color: #40332d;
  font-size: 11px;
}

.benefit-card p {
  margin: 0;
  color: #91827a;
  font-size: 8px;
}

/* Responsive */
@media (max-width: 980px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }

  .summary-card {
    position: static;
  }

  .summary-column {
    max-width: 430px;
    width: 100%;
    margin-left: auto;
  }
}

@media (max-width: 720px) {
  .main-content {
    width: min(100% - 24px, 620px);
    padding-top: 22px;
  }

  .page-hero {
    min-height: 112px;
  }

  .table-header {
    display: none;
  }

  .cart-row {
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 10px 14px;
    padding: 15px;
  }

  .product-cell {
    grid-column: 1 / -1;
  }

  .price-cell {
    grid-column: 1;
    text-align: left;
  }

  .quantity-cell {
    grid-column: 2;
    grid-row: 2;
    justify-content: flex-end;
  }

  .subtotal-cell {
    grid-column: 1 / -1;
    padding-top: 2px;
    border-top: 1px dashed #e6dfda;
    text-align: left;
  }

  .supplier-label {
    padding-left: 15px;
    padding-right: 15px;
  }

  .benefits-strip {
    grid-template-columns: 1fr;
    gap: 17px;
    margin-top: 28px;
  }
}

@media (max-width: 460px) {
  .main-content {
    width: calc(100% - 18px);
  }

  .hero-inner h1 {
    font-size: 28px;
  }

  .section-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 3px;
  }

  .cart-row {
    padding: 13px 11px;
  }

  .product-image-wrap {
    flex-basis: 50px;
    width: 50px;
    height: 60px;
  }

  .summary-card {
    padding: 16px;
  }
}
</style>
