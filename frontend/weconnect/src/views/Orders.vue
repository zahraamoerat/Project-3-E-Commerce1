<template>
  <div class="page">
    <header class="header">
      <div><span class="eyebrow">BUYER RELATIONSHIPS</span>
        <h1>Orders</h1>
        <p>Keep wholesale orders moving from confirmation to delivery.</p>
      </div><button class="primary" type="button"
        @click="showNotice('New order requests will appear here as buyers check out.')">Order inbox <span>{{
          orders.length }}</span></button>
    </header>
    <section class="toolbar">
      <div class="search">⌕ <input v-model="query" placeholder="Search order or buyer" /></div>
      <div class="tabs"><button v-for="tab in tabs" :key="tab" :class="{ active: selected === tab }" type="button"
          @click="selected = tab">{{ tab }}</button></div>
    </section>
    <section class="list-card">
      <article v-for="order in filtered" :key="order.id" class="order">
        <div class="order-mark">{{ order.id.slice(-2) }}</div>
        <div class="order-main">
          <div><strong>{{ order.id }}</strong><span>{{ order.date }}</span></div>
          <h2>{{ order.buyer }}</h2>
          <p>{{ order.items }}</p>
        </div>
        <div class="order-total"><small>Order total</small><strong>{{ money(order.total) }}</strong><span
            :class="statusClass(order.status)">{{ order.status }}</span></div><button class="icon-action" type="button"
          @click="advanceOrder(order)">{{ nextAction(order.status) }}</button>
      </article>
      <div v-if="!filtered.length" class="empty">No orders match this view.</div>
    </section>
    <p v-if="notice" class="notice">{{ notice }}</p>
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
.page {
  min-height: 100vh;
  padding: clamp(22px, 4vw, 38px) clamp(16px, 4vw, 38px) 48px;
  background: #f7f5f2;
  color: #4d3933;
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: auto
}

.header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 25px
}

.eyebrow {
  color: #d2763d;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.8px
}

.header h1 {
  margin: 7px 0 5px;
  font: 700 clamp(28px, 4vw, 34px) Georgia, serif;
  color: #44312c
}

.header p {
  margin: 0;
  color: #88766e
}

.primary,
.icon-action {
  border: 0;
  border-radius: 7px;
  padding: 11px 14px;
  background: #e17b3d;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer
}

.primary span {
  display: inline-block;
  margin-left: 8px;
  padding: 2px 6px;
  border-radius: 9px;
  background: #fff3;
  color: #fff
}

.toolbar {
  display: flex;
  gap: 15px;
  align-items: center;
  margin-bottom: 15px
}

.search {
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

.search input {
  width: 100%;
  border: 0;
  outline: 0
}

.tabs {
  display: flex;
  gap: 7px
}

.tabs button {
  padding: 9px 12px;
  border: 1px solid #e4ddd8;
  border-radius: 16px;
  background: #fff;
  color: #725d54;
  font-size: 11px;
  cursor: pointer
}

.tabs .active {
  border-color: #684b41;
  background: #684b41;
  color: #fff
}

.list-card {
  border: 1px solid #e6dfda;
  border-radius: 13px;
  background: #fff;
  overflow: hidden
}

.order {
  display: grid;
  grid-template-columns: 48px 1fr 150px 100px;
  align-items: center;
  gap: 16px;
  padding: 18px 21px;
  border-bottom: 1px solid #f0ece9
}

.order-mark {
  display: grid;
  place-items: center;
  width: 43px;
  height: 43px;
  border-radius: 10px;
  background: #f1e9e4;
  color: #96654d;
  font-weight: 700
}

.order-main>div {
  display: flex;
  gap: 10px
}

.order-main strong {
  font-size: 13px
}

.order-main span,
.order-main p {
  color: #9b8981;
  font-size: 11px
}

.order-main h2 {
  margin: 7px 0 2px;
  font: 700 16px Georgia, serif
}

.order-main p {
  margin: 0
}

.order-total small,
.order-total strong {
  display: block
}

.order-total small {
  color: #9b8981;
  font-size: 10px
}

.order-total strong {
  margin: 3px 0 7px;
  font-size: 14px
}

.order-total span {
  display: inline-block;
  padding: 4px 7px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 700
}

.processing {
  background: #fff1dc;
  color: #aa742b
}

.ready-to-ship {
  background: #e7f2e8;
  color: #478253
}

.delivered {
  background: #eee9f4;
  color: #765b8d
}

.icon-action {
  background: #684b41
}

.empty {
  text-align: center;
  padding: 40px;
  color: #9b8981
}

.notice {
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

  .header,
  .toolbar {
    align-items: flex-start;
    flex-direction: column
  }

  .search {
    width: 100%
  }

  .tabs {
    overflow: auto;
    width: 100%
  }

  .order {
    grid-template-columns: 45px 1fr
  }

  .order-total,
  .icon-action {
    grid-column: 2
  }

  .icon-action {
    justify-self: start
  }
}

@media(max-width:560px) {
  .header .primary {
    width: 100%;
  }

  .toolbar {
    align-items: stretch;
  }

  .search {
    width: 100%;
  }

  .tabs {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 2px;
  }

  .tabs button {
    flex: 0 0 auto;
  }

  .order {
    grid-template-columns: 42px 1fr;
    gap: 12px;
    padding: 16px;
  }

  .order-total,
  .order .icon-action {
    grid-column: 2;
    justify-self: start;
  }
}
</style>
