<template>
  <div class="supplier_dashboard_dashboard">
    <aside class="supplier_dashboard_sidebar">
      <div class="supplier_dashboard_sidebar_brand"><span class="supplier_dashboard_eyebrow">SUPPLIER</span><strong>Supplier
          portal</strong></div>
      <nav class="supplier_dashboard_sidebar_nav" aria-label="Supplier navigation"><RouterLink v-for="link in sidebarLinks" :key="link.to"
          :to="link.to" exact-active-class="active">{{ link.label }}</RouterLink></nav>
      <div class="supplier_dashboard_sidebar_foot"><RouterLink to="/products/add" class="supplier_dashboard_primary">Add a product
          <span>+</span></RouterLink>
      </div>
    </aside>
    <main class="supplier_dashboard_main">
      <header class="supplier_dashboard_hero">
        <div><span class="supplier_dashboard_eyebrow">SUPPLIER OVERVIEW</span>
          <h1>Good morning, {{ businessName }}.</h1>
          <p>Manage your catalog and stock to keep buyers informed about your business.</p>
        </div>
      </header>
    <section class="supplier_dashboard_stats">
      <article><span>Catalog products</span><strong>{{ productCount }}</strong><small>Live in your catalogue</small></article>
      <article><span>Orders this month</span><strong>{{ orders.length }}</strong><small>Across {{ buyerCount }} buyers</small>
      </article>
      <article><span>Open revenue</span><strong>{{ money(revenue) }}</strong><small>From placed orders</small>
      </article>
      <article class="supplier_dashboard_alert"><span>Needs attention</span><strong>{{ lowStock + outOfStock }}</strong><small>Inventory
          actions waiting</small></article>
    </section>
    <div class="supplier_dashboard_dashboard-grid">
      <section class="supplier_dashboard_panel">
        <div class="supplier_dashboard_panel-head">
          <div>
            <h2>Recent orders</h2>
            <p>Keep fulfilment moving.</p>
          </div>
          <RouterLink to="/orders">View all</RouterLink>
        </div>
        <article v-for="order in orders" :key="order.id" class="supplier_dashboard_order-row"><span class="supplier_dashboard_order-icon">{{
          order.id.slice(-2) }}</span>
          <div><strong>{{ order.buyer }}</strong><small>{{ order.items }} · {{ order.date }}</small></div><b>{{
            money(order.total) }}</b><span class="supplier_dashboard_status">{{ order.status }}</span>
        </article>
      </section>
      <section class="supplier_dashboard_panel">
        <div class="supplier_dashboard_panel-head">
          <div>
            <h2>Stock spotlight</h2>
            <p>Products that need a decision.</p>
          </div>
          <RouterLink to="/stockmanagement">Manage</RouterLink>
        </div>
        <article v-for="product in attention" :key="product.product_id" class="supplier_dashboard_stock-row"><img :src="product.image"
            :alt="product.product_name" />
          <div><strong>{{ product.product_name }}</strong><small>{{ product.quantity }} units remaining</small></div>
          <span>{{ product.stockStatus }}</span>
        </article>
        <div v-if="!attention.length" class="supplier_dashboard_empty">Everything is comfortably stocked.</div>
      </section>
    </div>
    </main>
  </div>
</template>
<script setup>
import { computed, onMounted } from "vue";
import { RouterLink } from "vue-router";
import { useSupplierData, supplierStats } from "@/data/supplierData";
const { orders, products, profile, loadSupplierData } = useSupplierData();
const { productCount, lowStockCount: lowStock, outOfStockCount: outOfStock, revenue } = supplierStats;
const businessName = computed(() => profile.value.businessName?.trim() || "Supplier");
onMounted(() => {
  loadSupplierData(true);
});
const buyerCount = computed(() => new Set(orders.value.map((order) => order.buyer).filter(Boolean)).size);
const attention = computed(() => products.value.filter((product) => product.stockStatus !== "In stock"));
function money(value) { return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(value); }
</script>
<style scoped>
.supplier_dashboard_dashboard {
  display: grid;
  grid-template-columns: 236px 1fr;
  gap: 28px;
  align-items: start;
  min-height: 100vh;
  padding: clamp(22px, 4vw, 38px) clamp(16px, 4vw, 38px) 48px;
  max-width: 1360px;
  margin: auto;
  background: transparent;
  color: #4d3933;
  font-family: Arial, sans-serif;
}

.supplier_dashboard_sidebar {
  position: sticky;
  top: 24px;
  display: grid;
  align-content: start;
  gap: 18px;
  padding: 22px 16px 18px;
  border: 1px solid #e7ddd3;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 14px 34px rgba(70, 48, 38, .07)
}

.supplier_dashboard_sidebar_brand {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 0 6px 14px;
  border-bottom: 1px solid #efe6dc
}

.supplier_dashboard_sidebar_brand .supplier_dashboard_eyebrow {
  color: #c48b5b;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.9px
}

.supplier_dashboard_sidebar_brand strong {
  color: #4E342E;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 17px;
  font-weight: 600
}

.supplier_dashboard_sidebar_nav {
  display: grid;
  gap: 30p;
  width: 100%
}

.supplier_dashboard_sidebar_nav a {
  display: block;
  padding: 10px 12px;
  border-radius: 8px;
  color: #6b554a;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none
}

.supplier_dashboard_sidebar_nav a:hover {
  background: #f7f1ea;
  color: #4E342E
}

.supplier_dashboard_sidebar_nav a.active {
  background: #efe0d0;
  color: #4E342E
}

.supplier_dashboard_sidebar_foot {
  padding-top: 14px;
  border-top: 1px solid #efe6dc
}

.supplier_dashboard_sidebar_foot .supplier_dashboard_primary {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 11px 14px;
  border-radius: 8px;
  background: #4E342E;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none
}

.supplier_dashboard_sidebar_foot .supplier_dashboard_primary span {
  font-size: 16px;
  line-height: 1
}

.supplier_dashboard_main {
  min-width: 0
}

.supplier_dashboard_hero {
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

.supplier_dashboard_eyebrow {
  color: #dba47c;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.8px
}

.supplier_dashboard_hero h1 {
  max-width: 600px;
  margin: 10px 0 8px;
  font: 700 36px Georgia, serif
}

.supplier_dashboard_hero p {
  max-width: 530px;
  margin: 0 0 24px;
  color: #e2d1c9
}

.supplier_dashboard_hero img {
  width: 100%;
  height: 190px;
  object-fit: cover;
  border-radius: 10px;
  opacity: .88
}

.supplier_dashboard_primary {
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

.supplier_dashboard_primary span {
  font-size: 18px;
  line-height: 12px
}

.supplier_dashboard_stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin: 22px 0
}

.supplier_dashboard_stats article {
  padding: 17px;
  border: 1px solid #e6dfda;
  border-radius: 11px;
  background: #fff
}

.supplier_dashboard_stats span,
.supplier_dashboard_stats small {
  display: block;
  color: #98857c;
  font-size: 11px
}

.supplier_dashboard_stats strong {
  display: block;
  margin: 7px 0 3px;
  font: 700 25px Georgia, serif
}

.supplier_dashboard_stats small {
  color: #55865d
}

.supplier_dashboard_stats .supplier_dashboard_alert strong,
.supplier_dashboard_stats .supplier_dashboard_alert small {
  color: #b8762b
}

.supplier_dashboard_dashboard-grid {
  display: grid;
  grid-template-columns: 1.2fr .8fr;
  gap: 20px
}

.supplier_dashboard_panel {
  padding: 21px;
  border: 1px solid #e6dfda;
  border-radius: 13px;
  background: #fff
}

.supplier_dashboard_panel-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px
}

.supplier_dashboard_panel-head h2 {
  margin: 0;
  font: 700 20px Georgia, serif
}

.supplier_dashboard_panel-head p {
  margin: 4px 0 0;
  color: #9a8981;
  font-size: 12px
}

.supplier_dashboard_panel-head a {
  color: #d2763d;
  font-size: 12px;
  font-weight: 700;
  text-decoration: none
}

.supplier_dashboard_order-row,
.supplier_dashboard_stock-row {
  display: grid;
  grid-template-columns: 38px 1fr auto auto;
  gap: 11px;
  align-items: center;
  padding: 12px 0;
  border-top: 1px solid #f1eeeb
}

.supplier_dashboard_order-icon {
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

.supplier_dashboard_order-row strong,
.supplier_dashboard_stock-row strong,
.supplier_dashboard_order-row small,
.supplier_dashboard_stock-row small {
  display: block
}

.supplier_dashboard_order-row small,
.supplier_dashboard_stock-row small {
  margin-top: 3px;
  color: #9a8981;
  font-size: 11px
}

.supplier_dashboard_order-row b {
  font-size: 12px
}

.supplier_dashboard_status,
.supplier_dashboard_stock-row>span {
  padding: 5px 8px;
  border-radius: 12px;
  background: #edf5ed;
  color: #4d8756;
  font-size: 10px;
  font-weight: 700
}

.supplier_dashboard_stock-row {
  grid-template-columns: 42px 1fr auto
}

.supplier_dashboard_stock-row img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 7px
}

.supplier_dashboard_stock-row>span {
  background: #fff1dc;
  color: #ae792d
}

.supplier_dashboard_empty {
  padding: 24px 0;
  color: #9a8981;
  font-size: 13px
}

@media(max-width:850px) {
  .supplier_dashboard_hero {
    grid-template-columns: 1fr
  }

  .supplier_dashboard_stats {
    grid-template-columns: repeat(2, 1fr)
  }

  .supplier_dashboard_dashboard-grid {
    grid-template-columns: 1fr
  }
}

@media(max-width:700px) {
  .supplier_dashboard_hero h1 {
    font-size: 30px;
  }

  .supplier_dashboard_hero img {
    height: 160px;
  }

  .supplier_dashboard_order-row {
    grid-template-columns: 38px 1fr auto;
  }

  .supplier_dashboard_order-row b,
  .supplier_dashboard_order-row .supplier_dashboard_status {
    grid-column: 2 / -1;
    justify-self: start;
  }
}

@media(max-width:600px) {
  .supplier_dashboard_dashboard {
    padding: 20px 14px
  }

  .supplier_dashboard_hero {
    padding: 22px
  }

  .supplier_dashboard_hero h1 {
    font-size: 29px
  }

  .supplier_dashboard_stats {
    gap: 8px
  }

  .supplier_dashboard_stats strong {
    font-size: 21px
  }
}
</style>
