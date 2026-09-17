<template>
  <div class="supplier_orders_page">
    <header class="supplier_orders_header">
      <div><span class="supplier_orders_eyebrow">BUYER RELATIONSHIPS</span>
        <h1>Orders</h1>
        <p>Keep wholesale orders moving from confirmation to delivery.</p>
      </div><button class="supplier_orders_primary" type="button"
        @click="showNotice('New order requests will appear here as buyers check out.')">Order inbox <span>{{
          orders.length }}</span></button>
    </header>
    <section class="supplier_orders_toolbar">
      <div class="supplier_orders_search">⌕ <input v-model="query" placeholder="Search order or buyer" /></div>
      <div class="supplier_orders_tabs"><button v-for="tab in tabs" :key="tab" :class="{ active: selected === tab }" type="button"
          @click="selected = tab">{{ tab }}</button></div>
    </section>
    <section class="supplier_orders_list-card">
      <article v-for="order in filtered" :key="order.id" class="supplier_orders_order">
        <div class="supplier_orders_order-mark">{{ order.id.slice(-2) }}</div>
        <div class="supplier_orders_order-main">
          <div><strong>{{ order.id }}</strong><span>{{ order.date }}</span></div>
          <h2>{{ order.buyer }}</h2>
          <p>{{ order.items }}</p>
        </div>
        <div class="supplier_orders_order-total"><small>Order total</small><strong>{{ money(order.total) }}</strong><span
            :class="statusClass(order.status)">{{ order.status }}</span></div><button class="supplier_orders_icon-action" type="button"
          @click="advanceOrder(order)">{{ nextAction(order.status) }}</button>
      </article>
      <div v-if="!filtered.length" class="supplier_orders_empty">No orders match this view.</div>
    </section>
    <p v-if="notice" class="supplier_orders_notice">{{ notice }}</p>
  </div>
</template>
<script setup>
import { computed, ref } from "vue";
import { useSupplierData } from "@/data/supplierData";
const { orders, updateOrderStatus } = useSupplierData(); const query = ref(""); const selected = ref("All"); const notice = ref(""); const tabs = ["All", "Processing", "Ready to ship", "Delivered"];
const filtered = computed(() => orders.value.filter((order) => (selected.value === "All" || order.status === selected.value) && `${order.id} ${order.buyer} ${order.items}`.toLowerCase().includes(query.value.toLowerCase())));
function money(value) { return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(value); } function statusClass(status) { return status.toLowerCase().replaceAll(" ", "-"); } function showNotice(text) { notice.value = text; setTimeout(() => notice.value = "", 2600); }
function nextAction(status) { return status === "Processing" ? "Mark ready" : status === "Ready to ship" ? "Mark delivered" : "View details"; }
function advanceOrder(order) { const nextStatus = order.status === "Processing" ? "Ready to ship" : order.status === "Ready to ship" ? "Delivered" : order.status; updateOrderStatus(order.id, nextStatus); showNotice(nextStatus === order.status ? `Order ${order.id} is already delivered.` : `${order.id} moved to ${nextStatus}.`); }
</script>
<style scoped>
.supplier_orders_page {
  min-height: 100vh;
  padding: clamp(22px, 4vw, 38px) clamp(16px, 4vw, 38px) 48px;
  background: #f7f5f2;
  color: #4d3933;
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: auto
}

.supplier_orders_header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 25px
}

.supplier_orders_eyebrow {
  color: #d2763d;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.8px
}

.supplier_orders_header h1 {
  margin: 7px 0 5px;
  font: 700 clamp(28px, 4vw, 34px) Georgia, serif;
  color: #44312c
}

.supplier_orders_header p {
  margin: 0;
  color: #88766e
}

.supplier_orders_primary,
.supplier_orders_icon-action {
  border: 0;
  border-radius: 7px;
  padding: 11px 14px;
  background: #e17b3d;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer
}

.supplier_orders_primary span {
  display: inline-block;
  margin-left: 8px;
  padding: 2px 6px;
  border-radius: 9px;
  background: #fff3;
  color: #fff
}

.supplier_orders_toolbar {
  display: flex;
  gap: 15px;
  align-items: center;
  margin-bottom: 15px
}

.supplier_orders_search {
  display: flex;
  align-items: center;
  gap: 9px;
  width: 270px;
  padding: 11px 13px;
  border: 1px solid #e4ddd8;
  border-radius: 8px;
  background: #fff;
  color: #aa978e
}

.supplier_orders_search input {
  width: 100%;
  border: 0;
  outline: 0
}

.supplier_orders_tabs {
  display: flex;
  gap: 7px
}

.supplier_orders_tabs button {
  padding: 9px 12px;
  border: 1px solid #e4ddd8;
  border-radius: 16px;
  background: #fff;
  color: #725d54;
  font-size: 11px;
  cursor: pointer
}

.supplier_orders_tabs .supplier_orders_active {
  border-color: #684b41;
  background: #684b41;
  color: #fff
}

.supplier_orders_list-card {
  border: 1px solid #e6dfda;
  border-radius: 13px;
  background: #fff;
  overflow: hidden
}

.supplier_orders_order {
  display: grid;
  grid-template-columns: 48px 1fr 150px 100px;
  align-items: center;
  gap: 16px;
  padding: 18px 21px;
  border-bottom: 1px solid #f0ece9
}

.supplier_orders_order-mark {
  display: grid;
  place-items: center;
  width: 43px;
  height: 43px;
  border-radius: 10px;
  background: #f1e9e4;
  color: #96654d;
  font-weight: 700
}

.supplier_orders_order-main>div {
  display: flex;
  gap: 10px
}

.supplier_orders_order-main strong {
  font-size: 13px
}

.supplier_orders_order-main span,
.supplier_orders_order-main p {
  color: #9b8981;
  font-size: 11px
}

.supplier_orders_order-main h2 {
  margin: 7px 0 2px;
  font: 700 16px Georgia, serif
}

.supplier_orders_order-main p {
  margin: 0
}

.supplier_orders_order-total small,
.supplier_orders_order-total strong {
  display: block
}

.supplier_orders_order-total small {
  color: #9b8981;
  font-size: 10px
}

.supplier_orders_order-total strong {
  margin: 3px 0 7px;
  font-size: 14px
}

.supplier_orders_order-total span {
  display: inline-block;
  padding: 4px 7px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 700
}

.supplier_orders_processing {
  background: #fff1dc;
  color: #aa742b
}

.supplier_orders_ready-to-ship {
  background: #e7f2e8;
  color: #478253
}

.supplier_orders_delivered {
  background: #eee9f4;
  color: #765b8d
}

.supplier_orders_icon-action {
  background: #684b41
}

.supplier_orders_empty {
  text-align: center;
  padding: 40px;
  color: #9b8981
}

.supplier_orders_notice {
  position: fixed;
  right: 25px;
  bottom: 25px;
  padding: 13px 16px;
  border-radius: 8px;
  background: #684b41;
  color: #fff;
  font-size: 13px
}

@media(max-width:800px) {

  .supplier_orders_header,
  .supplier_orders_toolbar {
    align-items: flex-start;
    flex-direction: column
  }

  .supplier_orders_search {
    width: 100%
  }

  .supplier_orders_tabs {
    overflow: auto;
    width: 100%
  }

  .supplier_orders_order {
    grid-template-columns: 45px 1fr
  }

  .supplier_orders_order-total,
  .supplier_orders_icon-action {
    grid-column: 2
  }

  .supplier_orders_icon-action {
    justify-self: start
  }
}

@media(max-width:560px) {
  .supplier_orders_header .supplier_orders_primary {
    width: 100%;
  }

  .supplier_orders_toolbar {
    align-items: stretch;
  }

  .supplier_orders_search {
    width: 100%;
  }

  .supplier_orders_tabs {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 2px;
  }

  .supplier_orders_tabs button {
    flex: 0 0 auto;
  }

  .supplier_orders_order {
    grid-template-columns: 42px 1fr;
    gap: 12px;
    padding: 16px;
  }

  .supplier_orders_order-total,
  .supplier_orders_order .supplier_orders_icon-action {
    grid-column: 2;
    justify-self: start;
  }
}
</style>
