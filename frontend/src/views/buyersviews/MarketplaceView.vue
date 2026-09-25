<template>
  <div class="marketplace-page">
    <header class="marketplace-header">
      <div class="brand">
        <img src="../../assets/link-icon-white.png" alt="WeConnect" />
        <div><strong>WeConnect</strong><span>B2B Marketplace</span></div>
      </div>
      <div class="header-actions">
        <router-link to="/cart" class="cart-link">View Cart</router-link>
        <button type="button" @click="logout">Log out</button>
      </div>
    </header>

    <main class="content">
      <div class="intro">
        <div>
          <p class="eyebrow">BUYER MARKETPLACE</p>
          <h1>Browse wholesale products</h1>
          <p>
            Products shown here are loaded directly from the WeConnect database.
          </p>
        </div>
      </div>

      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="isLoading" class="state">Loading products...</p>

      <section v-else class="product-grid">
        <article
          v-for="product in products"
          :key="product.id"
          class="product-card"
        >
          <img :src="product.image" :alt="product.title" />
          <div class="product-body">
            <span class="category">{{ product.category }}</span>
            <h2>{{ product.title }}</h2>
            <p class="supplier">
              {{ product.supplier || "Verified supplier" }}
            </p>
            <p v-if="product.description" class="description">
              {{ product.description }}
            </p>
            <div class="product-footer">
              <strong>R {{ Number(product.price || 0).toFixed(2) }}</strong>
              <span>{{ product.stockQty }} available</span>
            </div>
            <button
              type="button"
              @click="addToCart(product)"
              :disabled="addingId === product.id"
            >
              {{ addingId === product.id ? "Adding..." : "Add to cart" }}
            </button>
          </div>
        </article>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { api } from "@/services/api";

// Marketplace state used while products are loading or being added to the cart.
const products = ref([]);
const isLoading = ref(true);
const error = ref("");
const addingId = ref(null);

const loadProducts = async () => {
  try {
    products.value = await api.getProducts();
  } catch (err) {
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
};

// Add one product to the logged-in buyer's cart.
const addToCart = async (product) => {
  const buyerId = localStorage.getItem("weconnect_buyer_id");
  if (!buyerId) {
    error.value =
      "Please log in as a buyer before adding products to your cart.";
    return;
  }

  addingId.value = product.id;
  try {
    await api.addToCart(buyerId, product.id, 1);
  } catch (err) {
    error.value = err.message;
  } finally {
    addingId.value = null;
  }
};

const logout = () => {
  localStorage.removeItem("weconnect_token");
  localStorage.removeItem("weconnect_role");
  localStorage.removeItem("weconnect_user_id");
  localStorage.removeItem("weconnect_buyer_id");
  localStorage.removeItem("weconnect_supplier_id");
  window.location.href = "/login";
};

onMounted(loadProducts);
</script>

<style scoped>
.marketplace-page {
  min-height: 100vh;
  background: #f7f5f0;
  color: #332d29;
}
.marketplace-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 6%;
  background: #fff;
  border-bottom: 1px solid #e8e1d9;
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}
.brand img {
  width: 38px;
  height: 38px;
  object-fit: contain;
}
.brand strong {
  display: block;
  font-size: 18px;
}
.brand span {
  display: block;
  font-size: 11px;
  color: #78716c;
}
.header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}
.header-actions button,
.cart-link {
  border: 1px solid #cd6d43;
  border-radius: 20px;
  padding: 9px 15px;
  background: #fff;
  color: #3b2c24;
  text-decoration: none;
  font: inherit;
  cursor: pointer;
}
.content {
  max-width: 1200px;
  margin: auto;
  padding: 48px 24px;
}
.eyebrow,
.category {
  color: #cd6d43;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
}
.intro h1 {
  font-family: Georgia, serif;
  font-size: 38px;
  margin: 8px 0;
}
.intro p {
  color: #78716c;
}
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-top: 30px;
}
.product-card {
  background: #fff;
  border: 1px solid #e7e1db;
  border-radius: 14px;
  overflow: hidden;
}
.product-card > img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  background: #eee8e1;
}
.product-body {
  padding: 18px;
}
.product-body h2 {
  font-family: Georgia, serif;
  font-size: 20px;
  margin: 8px 0 4px;
}
.supplier,
.description {
  color: #78716c;
  font-size: 13px;
}
.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: end;
  margin: 18px 0;
}
.product-footer strong {
  font-size: 18px;
  color: #cd6d43;
}
.product-footer span {
  font-size: 11px;
  color: #78716c;
}
.product-body button {
  width: 100%;
  border: 0;
  border-radius: 9px;
  padding: 11px;
  background: #cd6d43;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}
.product-body button:disabled {
  opacity: 0.6;
  cursor: wait;
}
.error {
  padding: 12px;
  background: #fef3f2;
  color: #b42318;
  border-radius: 8px;
}

@media (max-width: 640px) {
  .marketplace-header {
    align-items: flex-start;
    flex-direction: column;
    gap: 16px;
    padding: 16px 20px;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions button,
  .cart-link {
    flex: 1;
    text-align: center;
  }

  .content {
    padding: 32px 16px;
  }

  .intro h1 {
    font-size: 32px;
    line-height: 1.15;
  }

  .product-grid {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-top: 24px;
  }
}
.state {
  padding: 30px 0;
}
</style>
