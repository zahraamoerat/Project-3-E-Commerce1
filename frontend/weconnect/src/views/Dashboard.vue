<template>
  <div class="dashboard">
    <header class="hero">
      <div><span class="eyebrow">SUPPLIER OVERVIEW</span>
        <h1>Good morning, Cedar &amp; Finch.</h1>
        <p>Your catalog is active and buyers are already browsing your latest stock.</p>
        <RouterLink to="/products/add" class="primary">Add a product <span>+</span></RouterLink>
      </div><img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80"
        alt="Supplier team working together" />
    </header>
    <section class="stats">
      <article><span>Catalog products</span><strong>{{ productCount }}</strong><small>+2 this month</small></article>
      <article><span>Orders this month</span><strong>{{ orders.length }}</strong><small>Across 8 buyers</small>
      </article>
      <article><span>Open revenue</span><strong>{{ money(revenue) }}</strong><small>+12.4% from last month</small>
      </article>
      <article class="alert"><span>Needs attention</span><strong>{{ lowStock + outOfStock }}</strong><small>Inventory
          actions waiting</small></article>
    </section>
    <div class="dashboard-grid">
      <section class="panel">
        <div class="panel-head">
          <div>
            <h2>Recent orders</h2>
            <p>Keep fulfilment moving.</p>
          </div>
          <RouterLink to="/orders">View all</RouterLink>
        </div>
        <article v-for="order in orders" :key="order.id" class="order-row"><span class="order-icon">{{
          order.id.slice(-2) }}</span>
          <div><strong>{{ order.buyer }}</strong><small>{{ order.items }} · {{ order.date }}</small></div><b>{{
            money(order.total) }}</b><span class="status">{{ order.status }}</span>
        </article>
      </section>
      <section class="panel">
        <div class="panel-head">
          <div>
            <h2>Stock spotlight</h2>
            <p>Products that need a decision.</p>
          </div>
          <RouterLink to="/stockmanagement">Manage</RouterLink>
        </div>
        <article v-for="product in attention" :key="product.product_id" class="stock-row"><img :src="product.image"
            :alt="product.product_name" />
          <div><strong>{{ product.product_name }}</strong><small>{{ product.quantity }} units remaining</small></div>
          <span>{{ product.stockStatus }}</span>
        </article>
        <div v-if="!attention.length" class="empty">Everything is comfortably stocked.</div>
      </section>
    </div>
  </div>
</template>
<script setup>
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { useSupplierData, supplierStats } from "@/data/supplierData";
const { orders, products } = useSupplierData();
const { productCount, lowStockCount: lowStock, outOfStockCount: outOfStock, revenue } = supplierStats;
const attention = computed(() => products.value.filter((product) => product.stockStatus !== "In stock"));
function money(value) { return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(value); }
</script>
<style scoped>
.dashboard {
  min-height: 100vh;
  padding: clamp(22px, 4vw, 38px) clamp(16px, 4vw, 38px) 48px;
  background: #f7f5f2;
  color: #4d3933;
  font-family: Arial, sans-serif;
  max-width: 1360px;
  margin: auto
}

.hero {
  display: grid;
  grid-template-columns: 1fr 330px;
  gap: 28px;
  align-items: stretch;
  padding: 28px;
  border-radius: 15px;
  background: #684b41;
  color: #fff;
  overflow: hidden
}

.eyebrow {
  color: #dba47c;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.8px
}

.hero h1 {
  max-width: 600px;
  margin: 10px 0 8px;
  font: 700 36px Georgia, serif
}

.hero p {
  max-width: 530px;
  margin: 0 0 24px;
  color: #e2d1c9
}

.hero img {
  width: 100%;
  height: 190px;
  object-fit: cover;
  border-radius: 10px;
  opacity: .88
}

.primary {
  display: inline-flex;
  gap: 14px;
  padding: 11px 15px;
  border-radius: 7px;
  background: #e17b3d;
  color: #fff;
  text-decoration: none;
  font-size: 13px;
  font-weight: 700
}

.primary span {
  font-size: 18px;
  line-height: 12px
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin: 22px 0
}

.stats article {
  padding: 17px;
  border: 1px solid #e6dfda;
  border-radius: 11px;
  background: #fff
}

.stats span,
.stats small {
  display: block;
  color: #98857c;
  font-size: 11px
}

.stats strong {
  display: block;
  margin: 7px 0 3px;
  font: 700 25px Georgia, serif
}

.stats small {
  color: #55865d
}

.stats .alert strong,
.stats .alert small {
  color: #b8762b
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1.2fr .8fr;
  gap: 20px
}

.panel {
  padding: 21px;
  border: 1px solid #e6dfda;
  border-radius: 13px;
  background: #fff
}

.panel-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px
}

.panel-head h2 {
  margin: 0;
  font: 700 20px Georgia, serif
}

.panel-head p {
  margin: 4px 0 0;
  color: #9a8981;
  font-size: 12px
}

.panel-head a {
  color: #d2763d;
  font-size: 12px;
  font-weight: 700;
  text-decoration: none
}

.order-row,
.stock-row {
  display: grid;
  grid-template-columns: 38px 1fr auto auto;
  gap: 11px;
  align-items: center;
  padding: 12px 0;
  border-top: 1px solid #f1eeeb
}

.order-icon {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: #f1e9e4;
  color: #9e674d;
  font-size: 11px;
  font-weight: 700
}

.order-row strong,
.stock-row strong,
.order-row small,
.stock-row small {
  display: block
}

.order-row small,
.stock-row small {
  margin-top: 3px;
  color: #9a8981;
  font-size: 11px
}

.order-row b {
  font-size: 12px
}

.status,
.stock-row>span {
  padding: 5px 8px;
  border-radius: 12px;
  background: #edf5ed;
  color: #4d8756;
  font-size: 10px;
  font-weight: 700
}

.stock-row {
  grid-template-columns: 42px 1fr auto
}

.stock-row img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 7px
}

.stock-row>span {
  background: #fff1dc;
  color: #ae792d
}

.empty {
  padding: 24px 0;
  color: #9a8981;
  font-size: 13px
}

@media(max-width:850px) {
  .hero {
    grid-template-columns: 1fr
  }

  .stats {
    grid-template-columns: repeat(2, 1fr)
  }

  .dashboard-grid {
    grid-template-columns: 1fr
  }
}

@media(max-width:700px) {
  .hero h1 {
    font-size: 30px;
  }

  .hero img {
    height: 160px;
  }

  .order-row {
    grid-template-columns: 38px 1fr auto;
  }

  .order-row b,
  .order-row .status {
    grid-column: 2 / -1;
    justify-self: start;
  }
}

@media(max-width:600px) {
  .dashboard {
    padding: 20px 14px
  }

  .hero {
    padding: 22px
  }

  .hero h1 {
    font-size: 29px
  }

  .stats {
    gap: 8px
  }

  .stats strong {
    font-size: 21px
  }
}
</style>
