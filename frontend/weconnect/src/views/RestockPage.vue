<template>
  <div class="restock-page">
    <div class="restock-page__shell">
      <header class="restock-header">
        <div>
          <span class="eyebrow">RESTOCK OPERATIONS</span>
          <h1>Restock inventory</h1>
          <p>Track stock health, sales velocity, and place replenishment orders with confidence.</p>
        </div>

        <div class="restock-header__actions">
          <button type="button" class="ghost-button">Export</button>
          <button type="button" class="primary-button">+ New restock order</button>
        </div>
      </header>

      <section class="metrics-grid">
        <article class="metric-card">
          <span>Total SKUs</span>
          <strong>{{ products.length }}</strong>
          <small>Active listings</small>
        </article>
        <article class="metric-card amber">
          <span>Low stock</span>
          <strong>{{ lowStock }}</strong>
          <small>Needs attention</small>
        </article>
        <article class="metric-card red">
          <span>Out of stock</span>
          <strong>{{ outOfStock }}</strong>
          <small>Immediate restock</small>
        </article>
        <article class="metric-card green">
          <span>Well stocked</span>
          <strong>{{ inStock }}</strong>
          <small>Healthy coverage</small>
        </article>
        <article class="metric-card dark">
          <span>Revenue at risk</span>
          <strong>{{ money(valueAtRisk) }}</strong>
          <small>Potential loss</small>
        </article>
      </section>

      <section class="toolbar">
        <div class="tab-list">
          <button v-for="tab in tabs" :key="tab.id" type="button" class="tab-button" :class="{ 'tab-button--active': currentTab === tab.id }" @click="currentTab = tab.id">
            {{ tab.label }}
            <span>{{ countFor(tab.id) }}</span>
          </button>
        </div>

        <div class="toolbar-controls">
          <label class="search-box">
            <span>⌕</span>
            <input v-model="query" type="text" placeholder="Search product or SKU" />
          </label>
          <label class="select-box">
            <span>☷</span>
            <select v-model="supplierFilter">
              <option value="All suppliers">All suppliers</option>
              <option v-for="option in supplierOptions" :key="option" :value="option">{{ option }}</option>
            </select>
          </label>
          <label class="select-box sort-box">
            <span>↕</span>
            <select v-model="sortOrder">
              <option value="urgent">Most urgent first</option>
              <option value="name">Product name</option>
              <option value="stock">Lowest stock first</option>
            </select>
          </label>
        </div>
      </section>

      <section class="inventory-shell">
        <div class="table-header">
          <span class="checkbox-cell"><input type="checkbox" aria-label="Select all products" /></span>
          <span>Product</span>
          <span>Status</span>
          <span>Stock level</span>
          <span>Sales trend</span>
          <span>Urgency</span>
          <span>Restock qty</span>
        </div>

        <template v-for="product in filteredProducts" :key="product.product_id">
        <div class="inventory-row" :class="{ 'inventory-row--active': selectedId === product.product_id }" @click="selectProduct(product.product_id)">
          <div class="checkbox-cell">
            <button type="button" class="expand-button" :aria-label="selectedId === product.product_id ? 'Collapse details' : 'Expand details'" @click.stop="selectProduct(product.product_id)">{{ selectedId === product.product_id ? '⌄' : '›' }}</button>
            <input type="checkbox" :aria-label="`Select ${product.product_name}`" @click.stop />
          </div>
          <div class="product-cell">
            <img :src="product.image" :alt="product.product_name" />
            <div>
              <strong>{{ product.product_name }}</strong>
              <small>{{ product.sku }} · {{ product.category_name }}</small>
            </div>
          </div>

          <div>
            <span class="status-pill" :class="statusClass(product)">{{ stockStatus(product) }}</span>
          </div>

          <div class="gauge-cell">
            <div class="gauge-bar">
              <span :style="{ width: gaugeWidth(product) + '%' }"></span>
            </div>
            <small>{{ product.quantity }} / {{ product.low_stock_threshold + 40 }} units</small>
          </div>

          <div class="sparkline-wrap">
            <svg viewBox="0 0 88 30" aria-label="Sales trend">
              <path :d="makeSparkline(product.quantity, product.low_stock_threshold)" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>

          <div class="urgency-block">
            <strong :style="{ color: urgencyColor(product) }">{{ urgencyText(product) }}</strong>
            <small>{{ urgencyDetail(product) }}</small>
          </div>

          <div class="qty-actions" @click.stop>
            <button type="button" @click="adjustQty(product.product_id, -1)">−</button>
            <input :value="qtyValue(product.product_id)" @input="updateQty(product.product_id, $event.target.value)" type="number" min="0" />
            <button type="button" @click="adjustQty(product.product_id, 1)">+</button>
          </div>
        </div>
        <div v-if="selectedId === product.product_id" class="detail-row">
          <div class="detail-group auto-restock">
            <span class="detail-label">AUTO-RESTOCK</span>
            <label class="toggle-line">
              <input type="checkbox" v-model="autoRestock[product.product_id]" />
              <span class="toggle-switch"></span>
              <span>Manual restock only</span>
            </label>
          </div>
          <div class="detail-group">
            <span class="detail-label">LEAD TIME</span>
            <span class="detail-value">◷ {{ leadTime(product) }} days from {{ product.category_name }}</span>
          </div>
          <div class="detail-group">
            <span class="detail-label">LAST RESTOCKED</span>
            <span class="detail-value">Jul 30</span>
          </div>
        </div>
        </template>

        <div v-if="!filteredProducts.length" class="empty-state">No products match this view.</div>
      </section>

      <div class="save-bar" v-if="selectedProduct">
        <div>
          <strong>{{ selectedProduct.product_name }}</strong>
          <span>{{ selectedProduct.sku }} · {{ selectedProduct.stockStatus }}</span>
        </div>
        <button type="button" class="primary-button" @click="applySelectedStock">Apply stock update</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useSupplierData } from "@/data/supplierData";

const route = useRoute();
const { products, updateProduct } = useSupplierData();

const tabs = [
  { id: "all", label: "All items" },
  { id: "out", label: "Out of stock" },
  { id: "low", label: "Low stock" },
  { id: "ok", label: "Well stocked" },
];

const query = ref("");
const currentTab = ref("all");
const supplierFilter = ref("All suppliers");
const sortOrder = ref("urgent");
const selectedId = ref(Number(route.params.id) || products.value[0]?.product_id || null);
const qtyMap = ref({});
const autoRestock = ref({});

const supplierOptions = computed(() => [
  ...new Set(products.value.map((product) => product.category_name)),
]);

const lowStock = computed(() => products.value.filter((product) => product.stockStatus === "Low stock").length);
const outOfStock = computed(() => products.value.filter((product) => product.stockStatus === "Out of stock").length);
const inStock = computed(() => products.value.filter((product) => product.stockStatus === "In stock").length);
const valueAtRisk = computed(() =>
  products.value.reduce((sum, product) => {
    if (product.stockStatus === "In stock") return sum;
    return sum + Number(product.price || 0) * Math.max(0, Number(product.low_stock_threshold || 0) - Number(product.quantity || 0));
  }, 0),
);

const selectedProduct = computed(() =>
  products.value.find((product) => product.product_id === selectedId.value) || null,
);

const filteredProducts = computed(() => {
  const term = query.value.trim().toLowerCase();

  let rows = products.value.filter((product) => {
    const matchesTab = currentTab.value === "all" || statusKey(product) === currentTab.value;
    const matchesSupplier = supplierFilter.value === "All suppliers" || product.category_name === supplierFilter.value;
    const matchesText = !term || `${product.product_name} ${product.sku}`.toLowerCase().includes(term);
    return matchesTab && matchesSupplier && matchesText;
  });

  return rows.sort((first, second) => {
    if (sortOrder.value === "name") return first.product_name.localeCompare(second.product_name);
    if (sortOrder.value === "stock") return Number(first.quantity || 0) - Number(second.quantity || 0);
    return statusKey(first).localeCompare(statusKey(second));
  });
});

function countFor(tabId) {
  if (tabId === "all") return products.value.length;
  if (tabId === "out") return outOfStock.value;
  if (tabId === "low") return lowStock.value;
  if (tabId === "ok") return inStock.value;
  return 0;
}

function stockStatus(product) {
  const quantity = Number(product.quantity || 0);
  if (quantity === 0) return "Out of stock";
  if (quantity <= Number(product.low_stock_threshold || 0)) return "Low stock";
  return "In stock";
}

function statusKey(product) {
  const label = stockStatus(product);
  if (label === "Out of stock") return "out";
  if (label === "Low stock") return "low";
  return "ok";
}

function statusClass(product) {
  const label = stockStatus(product);
  if (label === "Out of stock") return "status-pill--danger";
  if (label === "Low stock") return "status-pill--warn";
  return "status-pill--good";
}

function gaugeWidth(product) {
  const quantity = Number(product.quantity || 0);
  const max = Math.max(Number(product.low_stock_threshold || 40) + 40, 1);
  return Math.min(100, Math.round((quantity / max) * 100));
}

function urgencyText(product) {
  const quantity = Number(product.quantity || 0);
  const threshold = Number(product.low_stock_threshold || 0);
  if (quantity === 0) return "Reorder now";
  if (quantity <= threshold) return "Reorder soon";
  return "On track";
}

function urgencyColor(product) {
  const quantity = Number(product.quantity || 0);
  const threshold = Number(product.low_stock_threshold || 0);
  if (quantity === 0) return "#d76a5b";
  if (quantity <= threshold) return "#c79442";
  return "#4d8a5c";
}

function urgencyDetail(product) {
  const quantity = Number(product.quantity || 0);
  const threshold = Number(product.low_stock_threshold || 0);
  if (quantity === 0) return "Immediate action";
  if (quantity <= threshold) return `${quantity} left · reorder`;
  return `${quantity} left · healthy`;
}

function leadTime(product) {
  return product.stockStatus === "Out of stock" ? 10 : product.stockStatus === "Low stock" ? 6 : 9;
}

function makeSparkline(quantity, threshold) {
  const points = [
    8, 18, 14, 12, 10, 6, 4,
    Math.max(2, Math.min(25, quantity || threshold || 10)),
  ];

  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);
  const range = max - min || 1;

  const mapped = points.map((value, index) => {
    const x = 3 + (index * 80) / (points.length - 1);
    const y = 26 - ((value - min) / range) * 18;
    return `${x},${y}`;
  });

  return `M ${mapped.join(" L ")}`;
}

function qtyValue(productId) {
  if (!qtyMap.value[productId]) {
    const product = products.value.find((item) => item.product_id === productId);
    const value = product ? Number(product.quantity || 0) : 0;
    qtyMap.value[productId] = value;
  }
  return qtyMap.value[productId];
}

function adjustQty(productId, delta) {
  const current = Number(qtyValue(productId) || 0) + delta;
  qtyMap.value[productId] = Math.max(0, current);
}

function updateQty(productId, rawValue) {
  const numeric = Number(rawValue);
  qtyMap.value[productId] = Number.isFinite(numeric) ? Math.max(0, numeric) : 0;
}

function selectProduct(productId) {
  selectedId.value = productId;
}

function applySelectedStock() {
  if (!selectedProduct.value) return;
  const nextQty = Number(qtyMap.value[selectedProduct.value.product_id] ?? selectedProduct.value.quantity ?? 0);
  updateProduct(selectedProduct.value.product_id, { quantity: nextQty });
  selectedProduct.value.quantity = nextQty;
}

function money(value) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}
</script>

<style scoped>
:global(html),
:global(body),
:global(#app) {
  margin: 0;
  min-height: 100%;
  background: #f7f5f2;
}

button,
input,
select {
  font: inherit;
}

button {
  cursor: pointer;
}

.restock-page {
  min-height: 100vh;
  background: #f7f5f2;
  color: #4d3933;
  font-family: Arial, sans-serif;
}

.restock-page__shell {
  max-width: 1536px;
  margin: 0 auto;
  padding: 14px 0 42px;
}

.restock-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 18px;
  margin: 0 22px 18px;
}

.eyebrow {
  display: inline-block;
  color: #d2763d;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.8px;
}

.restock-header h1 {
  margin: 8px 0 6px;
  font: 700 clamp(30px, 4vw, 40px) Georgia, serif;
  color: #44312c;
}

.restock-header p {
  margin: 0;
  color: #88766e;
}

.restock-header__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.ghost-button,
.primary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: none;
  padding: 10px 16px;
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
}

.ghost-button {
  background: #fff;
  color: #4d3933;
  border: 1px solid #e4ddd8;
}

.primary-button {
  background: #e17b3d;
  color: #fff;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 20px;
}

.checkbox-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.checkbox-cell input {
  width: 15px;
  height: 15px;
  accent-color: #c65b2b;
}

.metric-card {
  padding: 18px 18px 16px;
  border: 1px solid #e6dfda;
  border-radius: 12px;
  background: #fff;
}

.metric-card span,
.metric-card small {
  display: block;
  color: #95827a;
  font-size: 11px;
}

.metric-card strong {
  display: block;
  margin: 8px 0 4px;
  font: 700 26px Georgia, serif;
  color: #4d3933;
}

.metric-card.amber strong { color: #bd8027; }
.metric-card.red strong { color: #bd5548; }
.metric-card.green strong { color: #4d8a5c; }
.metric-card.dark {
  background: #523a33;
  border-color: #523a33;
}
.metric-card.dark span,
.metric-card.dark small,
.metric-card.dark strong { color: #fff; }

.toolbar {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: center;
  flex-wrap: wrap;
  margin: 0 0 20px;
  padding: 0 22px;
}

.tab-list {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.tab-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #e6dfda;
  border-radius: 999px;
  padding: 7px 12px;
  background: #fff;
  color: #4d3933;
  font-size: 12.5px;
  font-weight: 600;
}

.tab-button span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  min-height: 18px;
  border-radius: 999px;
  background: #f3eee9;
  font-size: 10.5px;
}

.tab-button--active {
  background: #e17b3d;
  border-color: #e17b3d;
  color: #fff;
}

.tab-button--active span {
  background: rgba(255,255,255,0.18);
}

.toolbar-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.search-box,
.select-box {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 38px;
  padding: 0 12px;
  border: 1px solid #e6dfda;
  border-radius: 8px;
  background: #fff;
  color: #9a8981;
}

.search-box {
  width: 250px;
}

.search-box input,
.select-box select {
  width: 100%;
  border: none;
  background: transparent;
  outline: none;
  color: #4d3933;
  font-size: 13px;
}

.inventory-shell {
  border: 1px solid #e6dfda;
  border-radius: 14px;
  background: #fff;
  overflow: hidden;
}

.table-header,
.inventory-row {
  display: grid;
  grid-template-columns: 70px 2.2fr 1fr 1.2fr 1.1fr 1.1fr 1fr;
  gap: 12px;
  align-items: center;
}

.table-header {
  padding: 13px 18px;
  background: #f8f5f2;
  border-bottom: 1px solid #eee8e3;
}

.table-header span {
  color: #9a8981;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}

.inventory-row {
  padding: 14px 18px;
  border-bottom: 1px solid #f1eeeb;
  cursor: pointer;
}

.expand-button {
  width: 18px;
  border: 0;
  padding: 0;
  background: transparent;
  color: #89776e;
  font-size: 18px;
  line-height: 1;
}

.detail-row {
  display: grid;
  grid-template-columns: 1.5fr 1.2fr 1fr;
  gap: 30px;
  align-items: center;
  padding: 18px 70px 20px;
  border-bottom: 1px solid #e6dfda;
  background: #faf8f5;
}

.detail-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-label {
  color: #8d7a70;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.6px;
}

.detail-value,
.toggle-line {
  color: #4d3933;
  font-size: 13px;
}

.toggle-line {
  display: flex;
  align-items: center;
  gap: 10px;
}

.toggle-line input {
  position: absolute;
  opacity: 0;
}

.toggle-switch {
  position: relative;
  width: 42px;
  height: 24px;
  border-radius: 999px;
  background: #d7cfc4;
}

.toggle-switch::after {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  content: "";
  transition: transform 0.2s ease;
}

.toggle-line input:checked + .toggle-switch {
  background: #d2763d;
}

.toggle-line input:checked + .toggle-switch::after {
  transform: translateX(18px);
}

.inventory-row--active {
  background: #faf6f3;
}

.product-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.product-cell img {
  width: 42px;
  height: 42px;
  object-fit: cover;
  border-radius: 8px;
}

.product-cell strong,
.product-cell small {
  display: block;
}

.product-cell strong {
  font-size: 13.5px;
  color: #4d3933;
}

.product-cell small {
  margin-top: 4px;
  color: #9a8981;
  font-size: 11px;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
}

.status-pill--danger { background: #fae4e0; color: #b75347; }
.status-pill--warn { background: #fff2dc; color: #b98532; }
.status-pill--good { background: #ebf5eb; color: #4d8a5c; }

.gauge-cell {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.gauge-bar {
  position: relative;
  width: 100%;
  height: 6px;
  border-radius: 999px;
  background: #eee6e1;
  overflow: hidden;
}

.gauge-bar span {
  position: absolute;
  inset: 0 auto 0 0;
  display: block;
  border-radius: inherit;
  background: linear-gradient(90deg, #d6d1a1, #e17b3d);
}

.gauge-cell small,
.urgency-block small {
  color: #9a8981;
  font-size: 10.5px;
}

.sparkline-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d2763d;
}

.sparkline-wrap svg {
  width: 90px;
  height: 30px;
}

.urgency-block {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.urgency-block strong {
  font-size: 12.5px;
}

.qty-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.qty-actions button {
  width: 24px;
  height: 24px;
  border: 1px solid #e6dfda;
  border-radius: 6px;
  background: #f8f5f2;
  color: #5d4c45;
  font-size: 16px;
  line-height: 1;
}

.qty-actions input {
  width: 42px;
  border: 1px solid #e6dfda;
  border-radius: 6px;
  background: #fff;
  color: #4d3933;
  text-align: center;
  padding: 5px 2px;
  font-size: 13px;
}

.save-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  margin-top: 18px;
  padding: 15px 18px;
  border: 1px solid #e6dfda;
  border-radius: 12px;
  background: #fff;
}

.save-bar strong,
.save-bar span {
  display: block;
}

.save-bar strong {
  color: #4d3933;
}

.save-bar span {
  margin-top: 4px;
  color: #9a8981;
  font-size: 12px;
}

.empty-state {
  padding: 32px 20px;
  text-align: center;
  color: #9a8981;
}

@media (max-width: 980px) {
  .metrics-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}

@media (max-width: 760px) {
  .restock-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .restock-header__actions {
    width: 100%;
  }

  .restock-header__actions > * { flex: 1; }

  .metrics-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }

  .table-header { display: none; }

  .inventory-row {
    grid-template-columns: 34px 1fr;
    gap: 10px;
    padding: 14px;
  }

  .inventory-row > :not(.checkbox-cell):not(.product-cell) {
    grid-column: 2;
  }

  .detail-row {
    grid-template-columns: 1fr;
    padding: 18px;
  }

  .save-bar {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 520px) {
  .metrics-grid { grid-template-columns: 1fr; }

  .toolbar-controls { width: 100%; }

  .search-box, .select-box { width: 100%; }
}
</style>
