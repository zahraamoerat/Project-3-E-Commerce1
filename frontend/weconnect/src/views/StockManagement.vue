<template>
  <div class="stock-page">
    <header class="stock-header">
      <div><span class="eyebrow">OPERATIONS CENTER</span>
        <h1>Stock management</h1>
        <p>Stay ahead of demand with a clear view of your supplier inventory.</p>
      </div>
      <div class="search"><span>⌕</span><input v-model="query" placeholder="Search products..." /></div>
    </header>
    <section class="metrics">
      <article><span>Total catalog</span><strong>{{ products.length }}</strong><small>Active wholesale listings</small>
      </article>
      <article class="amber"><span>Low stock</span><strong>{{ lowStock }}</strong><small>Reorder before it slows
          sales</small></article>
      <article class="red"><span>Out of stock</span><strong>{{ outOfStock }}</strong><small>Needs immediate
          attention</small></article>
      <article class="green"><span>Stock value</span><strong>{{ money(stockValue) }}</strong><small>Estimated inventory
          value</small></article>
    </section>
    <section class="inventory-card">
      <div class="card-title">
        <div>
          <h2>Inventory pulse</h2>
          <p>Update quantities after a delivery arrives.</p>
        </div>
        <RouterLink to="/products/add" class="primary-button">Add product</RouterLink>
      </div>
      <div class="inventory-list">
        <article v-for="product in filteredProducts" :key="product.product_id" class="inventory-row"><img
            :src="product.image" :alt="product.product_name" />
          <div class="item-name"><strong>{{ product.product_name }}</strong><span>{{ product.sku }} · {{
            product.category_name }}</span></div>
          <div class="quantity"><small>Current stock</small><strong>{{ product.quantity }} units</strong></div><span
            class="badge" :class="product.stockStatus.toLowerCase().replace(' ', '-')">{{ product.stockStatus
            }}</span><button class="restock-button" type="button" @click="restock(product)">Update stock</button>
        </article>
        <div v-if="!filteredProducts.length" class="empty">No inventory matches your search.</div>
      </div>
    </section>
  </div>
</template>
<script setup>
import { computed, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useSupplierData } from "@/data/supplierData";
const { products, updateProduct } = useSupplierData();
const router = useRouter();
const query = ref("");
const filteredProducts = computed(() => products.value.filter((product) => `${product.product_name} ${product.sku}`.toLowerCase().includes(query.value.toLowerCase().trim())));
const lowStock = computed(() => products.value.filter((product) => product.stockStatus === "Low stock").length);
const outOfStock = computed(() => products.value.filter((product) => product.stockStatus === "Out of stock").length);
const stockValue = computed(() => products.value.reduce((sum, product) => sum + product.price * product.quantity, 0));
function money(value) { return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(value); }
function restock(product) {
  router.push({
    name: "RestockPage",
    params: { id: String(product.product_id) },
  });
}
</script>
<style scoped>
.stock-page {
  min-height: 100vh;
  padding: clamp(22px, 4vw, 38px) clamp(16px, 4vw, 38px) 48px;
  background: #f7f5f2;
  color: #4d3933;
  font-family: Arial, sans-serif
}

.stock-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 25px;
  max-width: 1180px;
  margin: 0 auto 27px
}

.eyebrow {
  color: #d2763d;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.8px
}

.stock-header h1 {
  margin: 7px 0 5px;
  font: 700 clamp(28px, 4vw, 34px) Georgia, serif;
  color: #44312c
}

.stock-header p {
  margin: 0;
  color: #88766e
}

.search {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 280px;
  padding: 12px 14px;
  border: 1px solid #e4ddd8;
  border-radius: 8px;
  background: #fff;
  color: #a49289
}

.search input {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent
}

.metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  max-width: 1180px;
  margin: 0 auto 23px
}

.metrics article {
  padding: 19px;
  border: 1px solid #e6dfda;
  border-radius: 12px;
  background: #fff
}

.metrics span,
.metrics small {
  display: block;
  color: #95827a;
  font-size: 11px
}

.metrics strong {
  display: block;
  margin: 8px 0 3px;
  font: 700 26px Georgia, serif;
  color: #4d3933
}

.metrics .amber strong {
  color: #bd8027
}

.metrics .red strong {
  color: #bd5548
}

.metrics .green strong {
  color: #4d8a5c
}

.inventory-card {
  max-width: 1180px;
  margin: auto;
  border: 1px solid #e6dfda;
  border-radius: 14px;
  background: #fff;
  overflow: hidden
}

.card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 21px 23px;
  border-bottom: 1px solid #eee8e3
}

.card-title h2 {
  margin: 0;
  font: 700 20px Georgia, serif
}

.card-title p {
  margin: 5px 0 0;
  color: #9b8981;
  font-size: 12px
}

.primary-button,
.restock-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 7px;
  padding: 10px 14px;
  background: #e17b3d;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer
}

.inventory-row {
  display: grid;
  grid-template-columns: 50px minmax(180px, 1fr) 130px 110px 120px;
  gap: 15px;
  align-items: center;
  padding: 14px 23px;
  border-bottom: 1px solid #f1eeeb
}

.inventory-row img {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 8px
}

.item-name strong,
.item-name span {
  display: block
}

.item-name strong {
  font-size: 13px;
  color: #523d35
}

.item-name span,
.quantity small {
  margin-top: 4px;
  color: #9a8981;
  font-size: 11px
}

.quantity small,
.quantity strong {
  display: block
}

.quantity strong {
  margin-top: 4px;
  font-size: 13px
}

.badge {
  justify-self: start;
  padding: 6px 9px;
  border-radius: 14px;
  font-size: 11px;
  font-weight: 700
}

.in-stock {
  background: #e8f4e8;
  color: #428252
}

.low-stock {
  background: #fff1da;
  color: #b47a2c
}

.out-of-stock {
  background: #fae5e1;
  color: #b75347
}

.empty {
  text-align: center;
  padding: 35px;
  color: #9b8981
}

@media(max-width:900px) {
  .metrics {
    grid-template-columns: repeat(2, 1fr)
  }

  .stock-header {
    align-items: flex-start;
    flex-direction: column
  }

  .search {
    width: 100%
  }

  .inventory-row {
    grid-template-columns: 50px 1fr 100px
  }

  .quantity,
  .badge {
    display: none
  }
}

@media(max-width:600px) {
  .stock-page {
    padding: 24px 16px
  }

  .metrics {
    grid-template-columns: 1fr 1fr
  }

  .card-title {
    align-items: flex-start;
    gap: 15px;
    flex-direction: column
  }

  .inventory-row {
    padding: 14px
  }

  .restock-button {
    grid-column: 2
  }

  .metrics strong {
    font-size: 22px
  }
}

@media(max-width:480px) {
  .metrics {
    gap: 8px;
  }

  .metrics article {
    padding: 14px;
  }

  .card-title .primary-button {
    width: 100%;
  }

  .inventory-row {
    grid-template-columns: 44px 1fr;
    gap: 10px;
  }

  .inventory-row .restock-button {
    justify-self: start;
  }
}
</style>
