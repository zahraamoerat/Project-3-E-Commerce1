<template>
  <div class="supplier_restock_page_restock-page">
    <div class="supplier_restock_page_restock-page__shell">
      <header class="supplier_restock_page_restock-header">
        <div>
          <span class="supplier_restock_page_eyebrow">RESTOCK OPERATIONS</span>
          <h1>Restock inventory</h1>
          <p>Track stock health, sales velocity, and place replenishment orders with confidence.</p>
        </div>

        <div class="supplier_restock_page_restock-header__actions">
          <button type="button" class="supplier_restock_page_ghost-button">Export</button>
          <button type="button" class="supplier_restock_page_primary-button" @click="openRestockFlow">+ New restock
            order</button>
        </div>
      </header>

      <section class="supplier_restock_page_metrics-grid">
        <article class="supplier_restock_page_metric-card">
          <span>Total SKUs</span>
          <strong>{{ products.length }}</strong>
          <small>Active listings</small>
        </article>
        <article class="supplier_restock_page_metric-card supplier_restock_page_amber">
          <span>Low stock</span>
          <strong>{{ lowStock }}</strong>
          <small>Needs attention</small>
        </article>
        <article class="supplier_restock_page_metric-card supplier_restock_page_red">
          <span>Out of stock</span>
          <strong>{{ outOfStock }}</strong>
          <small>Immediate restock</small>
        </article>
        <article class="supplier_restock_page_metric-card supplier_restock_page_green">
          <span>Well stocked</span>
          <strong>{{ inStock }}</strong>
          <small>Healthy coverage</small>
        </article>
        <article class="supplier_restock_page_metric-card supplier_restock_page_dark">
          <span>Revenue at risk</span>
          <strong>{{ money(valueAtRisk) }}</strong>
          <small>Potential loss</small>
        </article>
      </section>

      <section class="supplier_restock_page_toolbar">
        <div class="supplier_restock_page_tab-list">
          <button v-for="tab in tabs" :key="tab.id" type="button" class="supplier_restock_page_tab-button"
            :class="{ 'tab-button--active': currentTab === tab.id }" @click="currentTab = tab.id">
            {{ tab.label }}
            <span>{{ countFor(tab.id) }}</span>
          </button>
        </div>

        <div class="supplier_restock_page_toolbar-controls">
          <label class="supplier_restock_page_search-box">
            <span>⌕</span>
            <input v-model="query" type="text" placeholder="Search product or SKU" />
          </label>
          <label class="supplier_restock_page_select-box">
            <span>☷</span>
            <select v-model="supplierFilter">
              <option value="All suppliers">All suppliers</option>
              <option v-for="option in supplierOptions" :key="option" :value="option">{{ option }}</option>
            </select>
          </label>
          <label class="supplier_restock_page_select-box supplier_restock_page_sort-box">
            <span>↕</span>
            <select v-model="sortOrder">
              <option value="urgent">Most urgent first</option>
              <option value="name">Product name</option>
              <option value="stock">Lowest stock first</option>
            </select>
          </label>
        </div>
      </section>

      <section class="supplier_restock_page_inventory-shell">
        <div class="supplier_restock_page_table-header">
          <span class="supplier_restock_page_checkbox-cell"><input type="checkbox" :checked="allVisibleSelected" :indeterminate="someVisibleSelected" aria-label="Select all visible products" @change="toggleAllVisible($event.target.checked)" /></span>
          <span>Product</span>
          <span>Status</span>
          <span>Stock level</span>
          <span>Sales trend</span>
          <span>Urgency</span>
          <span>Restock qty</span>
        </div>

        <template v-for="product in filteredProducts" :key="product.product_id">
          <div class="supplier_restock_page_inventory-row"
            :class="{ 'inventory-row--active': selectedId === product.product_id }"
            @click="selectProduct(product.product_id)">
            <div class="supplier_restock_page_checkbox-cell">
              <button type="button" class="supplier_restock_page_expand-button"
                :aria-label="selectedId === product.product_id ? 'Collapse details' : 'Expand details'"
                @click.stop="selectProduct(product.product_id)">{{ selectedId === product.product_id ? '⌄' : '›'
                }}</button>
              <input type="checkbox" :checked="!!selectedProducts[product.product_id]" :aria-label="`Select ${product.product_name}`" @click.stop @change="toggleProduct(product.product_id, $event.target.checked)" />
            </div>
            <div class="supplier_restock_page_product-cell">
              <img :src="product.image" :alt="product.product_name" />
              <div>
                <strong>{{ product.product_name }}</strong>
                <small>{{ product.sku }} · {{ product.category_name }}</small>
              </div>
            </div>

            <div>
              <span class="supplier_restock_page_status-pill" :class="statusClass(product)">{{ stockStatus(product)
                }}</span>
            </div>

            <div class="supplier_restock_page_gauge-cell">
              <div class="supplier_restock_page_gauge-bar">
                <span :style="{ width: gaugeWidth(product) + '%' }"></span>
              </div>
              <small>{{ product.quantity }} / {{ product.low_stock_threshold + 40 }} units</small>
            </div>

            <div class="supplier_restock_page_sparkline-wrap">
              <svg viewBox="0 0 88 30" aria-label="Sales trend">
                <path :d="makeSparkline(product.quantity, product.low_stock_threshold)" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>

            <div class="supplier_restock_page_urgency-block">
              <strong :style="{ color: urgencyColor(product) }">{{ urgencyText(product) }}</strong>
              <small>{{ urgencyDetail(product) }}</small>
            </div>

            <div class="supplier_restock_page_qty-actions" @click.stop>
              <button type="button" @click="adjustQty(product.product_id, -1)">−</button>
              <input :value="qtyValue(product.product_id)" @input="updateQty(product.product_id, $event.target.value)"
                type="number" min="0" />
              <button type="button" @click="adjustQty(product.product_id, 1)">+</button>
            </div>
          </div>
          <div v-if="selectedId === product.product_id" class="supplier_restock_page_detail-row">
            <div class="supplier_restock_page_detail-group supplier_restock_page_auto-restock">
              <span class="supplier_restock_page_detail-label">AUTO-RESTOCK</span>
              <label class="supplier_restock_page_toggle-line">
                <input type="checkbox" v-model="autoRestock[product.product_id]" />
                <span class="supplier_restock_page_toggle-switch"></span>
                <span>Manual restock only</span>
              </label>
            </div>
            <div class="supplier_restock_page_detail-group">
              <span class="supplier_restock_page_detail-label">LEAD TIME</span>
              <span class="supplier_restock_page_detail-value">◷ {{ leadTime(product) }} days from {{
                product.category_name }}</span>
            </div>
            <div class="supplier_restock_page_detail-group">
              <span class="supplier_restock_page_detail-label">LAST RESTOCKED</span>
              <span class="supplier_restock_page_detail-value">Jul 30</span>
            </div>
          </div>
        </template>

        <div v-if="!filteredProducts.length" class="supplier_restock_page_empty-state">No products match this view.</div>
      </section>

      <div v-if="stockError" class="supplier_restock_page_stock-message supplier_restock_page_stock-message--error">{{ stockError }}</div><div v-if="stockSuccess" class="supplier_restock_page_stock-message supplier_restock_page_stock-message--success">{{ stockSuccess }}</div><div class="supplier_restock_page_save-bar" v-if="selectedCount">
        <div>
          <div><strong>{{ selectedCount }} product{{ selectedCount === 1 ? "" : "s" }} selected</strong><span>{{ selectedUnitTotal }} units will be applied</span></div>
        </div>
        <button type="button" class="supplier_restock_page_primary-button" @click="applySelectedStock" :disabled="savingStock">{{ savingStock ? "Saving..." : `Apply stock update${selectedCount > 1 ? "s" : ""}` }}</button>
      </div>
    </div>

    <div v-if="restockFlowOpen" class="supplier_restock_page_modal-backdrop">
      <section class="supplier_restock_page_restock-modal" role="dialog" aria-modal="true"
        aria-labelledby="restock-flow-title">
        <button type="button" class="supplier_restock_page_modal-close" aria-label="Close restock order"
          @click="closeRestockFlow">×</button>
        <div class="supplier_restock_page_modal-kicker">RESTOCK OPERATIONS</div>
        <h2 id="supplier_restock_page_restock-flow-title">New restock order</h2>
        <p class="supplier_restock_page_modal-intro">Select products, confirm quantities, then send purchase orders to
          your
          suppliers.</p>

        <div class="supplier_restock_page_wizard-steps" v-if="restockStep < 5">
          <span v-for="step in wizardSteps" :key="step.number"
            :class="{ 'supplier_restock_page_step-active': restockStep === step.number, 'supplier_restock_page_step-done': restockStep > step.number }">
            <b>{{ restockStep > step.number ? '✓' : step.number }}</b>{{ step.label }}
          </span>
        </div>

        <div v-if="restockStep === 1" class="supplier_restock_page_wizard-panel">
          <h3>Select items to restock</h3>
          <p>Low and out-of-stock products are preselected.</p>
          <div class="supplier_restock_page_wizard-actions">
            <input v-model="restockQuery" type="search" placeholder="Search product or SKU" />
            <button type="button" @click="selectFlaggedProducts">Select flagged only</button>
            <button type="button" @click="selectedRestock = {}">Clear all</button>
          </div>
          <label v-for="product in restockCandidates" :key="product.product_id"
            class="supplier_restock_page_wizard-product">
            <input v-model="selectedRestock[product.product_id]" type="checkbox" />
            <img :src="product.image" :alt="product.product_name" />
            <span><strong>{{ product.product_name }}</strong><small>{{ product.sku || 'SKU pending' }} · {{
              product.quantity
                }} units</small></span>
            <em>{{ product.stockStatus }}</em>
          </label>
        </div>

        <div v-else-if="restockStep === 2" class="supplier_restock_page_wizard-panel">
          <h3>Confirm quantities</h3>
          <p>Set the quantity you want to order for each selected product.</p>
          <div v-for="product in selectedRestockProducts" :key="product.product_id"
            class="supplier_restock_page_quantity-row">
            <span><strong>{{ product.product_name }}</strong><small>{{ product.category_name || 'Supplier item'
                }}</small></span>
            <div><button type="button" @click="adjustRestockQty(product.product_id, -1)">−</button><input
                v-model.number="restockQuantities[product.product_id]" type="number" min="0" /><button type="button"
                @click="adjustRestockQty(product.product_id, 1)">+</button></div>
          </div>
          <p v-if="!selectedRestockProducts.length" class="supplier_restock_page_wizard-empty">Go back and select at
            least
            one product.</p>
        </div>

        <div v-else-if="restockStep === 3" class="supplier_restock_page_wizard-panel">
          <h3>Delivery details</h3>
          <p>Choose when and where this restock should arrive.</p>
          <label>Deliver to<select v-model="restockDeliveryLocation">
              <option>Main Warehouse</option>
              <option>Overflow Storage</option>
            </select></label>
          <label>Requested delivery date<input v-model="restockDeliveryDate" type="date" /></label>
          <label>Notes to suppliers<textarea v-model="restockNotes" placeholder="Optional delivery notes" /></label>
        </div>

        <div v-else-if="restockStep === 4" class="supplier_restock_page_wizard-panel">
          <h3>Review and send</h3>
          <p>This will create a restock request for the selected products.</p>
          <div v-for="product in selectedRestockProducts" :key="product.product_id"
            class="supplier_restock_page_review-row"><span>{{ product.product_name }}</span><strong>{{
              restockQuantities[product.product_id] || 0 }} units</strong></div>
          <div class="supplier_restock_page_review-total">{{ selectedRestockProducts.length }} products · {{
            totalRestockUnits }} units</div>
        </div>

        <div v-else class="supplier_restock_page_wizard-confirmation">
          <div class="supplier_restock_page_confirmation-icon">✓</div>
          <h3>Restock order sent</h3>
          <p>Your request for {{ totalRestockUnits }} units has been recorded for {{ restockDeliveryDate }}.</p>
        </div>

        <div class="supplier_restock_page_wizard-footer" v-if="restockStep < 5">
          <button type="button" class="supplier_restock_page_ghost-button"
            @click="restockStep === 1 ? closeRestockFlow() : restockStep--">{{ restockStep === 1 ? 'Cancel' : 'Back'
            }}</button>
          <button type="button" class="supplier_restock_page_primary-button" @click="advanceRestockFlow">{{ restockStep
            ===
            4 ? 'Send restock order' : 'Continue' }}</button>
        </div>
        <div class="supplier_restock_page_wizard-footer" v-else><button type="button"
            class="supplier_restock_page_primary-button" @click="closeRestockFlow">Back to restock inventory</button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useSupplierData } from "@/data/supplierData";

const route = useRoute();
const { products, updateProductStock } = useSupplierData();

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
const selectedProducts = ref({});
const autoRestock = ref({});
const savingStock = ref(false);
const stockError = ref("");
const stockSuccess = ref("");
const restockFlowOpen = ref(false);
const restockStep = ref(1);
const restockQuery = ref("");
const selectedRestock = ref({});
const restockQuantities = ref({});
const restockDeliveryLocation = ref("Main Warehouse");
const restockDeliveryDate = ref(new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10));
const restockNotes = ref("");
const wizardSteps = [
  { number: 1, label: "Select items" },
  { number: 2, label: "Quantities" },
  { number: 3, label: "Delivery" },
  { number: 4, label: "Review" },
];

const supplierOptions = computed(() => [
  ...new Set(products.value.map((product) => product.category_name)),
]);

const restockCandidates = computed(() => {
  const term = restockQuery.value.trim().toLowerCase();
  return products.value.filter((product) => !term || `${product.product_name} ${product.sku || ""}`.toLowerCase().includes(term));
});

const selectedRestockProducts = computed(() => products.value.filter((product) => selectedRestock.value[product.product_id]));
const totalRestockUnits = computed(() => selectedRestockProducts.value.reduce((sum, product) => sum + Number(restockQuantities.value[product.product_id] || 0), 0));

const lowStock = computed(() => products.value.filter((product) => product.stockStatus === "Low stock").length);
const outOfStock = computed(() => products.value.filter((product) => product.stockStatus === "Out of stock").length);
const inStock = computed(() => products.value.filter((product) => product.stockStatus === "In stock").length);
const valueAtRisk = computed(() =>
  products.value.reduce((sum, product) => {
    if (product.stockStatus === "In stock") return sum;
    return sum + Number(product.price || 0) * Math.max(0, Number(product.low_stock_threshold || 0) - Number(product.quantity || 0));
  }, 0),
);

function selectFlaggedProducts() {
  selectedRestock.value = Object.fromEntries(products.value.filter((product) => product.stockStatus !== "In stock").map((product) => [product.product_id, true]));
}

function openRestockFlow() {
  restockStep.value = 1;
  restockQuery.value = "";
  selectedRestock.value = {};
  restockQuantities.value = Object.fromEntries(products.value.map((product) => [product.product_id, Math.max(1, Number(product.low_stock_threshold || 1) - Number(product.quantity || 0))]));
  selectFlaggedProducts();
  restockFlowOpen.value = true;
}

function closeRestockFlow() {
  restockFlowOpen.value = false;
}

function adjustRestockQty(productId, delta) {
  restockQuantities.value[productId] = Math.max(0, Number(restockQuantities.value[productId] || 0) + delta);
}

function advanceRestockFlow() {
  if (restockStep.value === 1 && !selectedRestockProducts.value.length) return;
  if (restockStep.value === 2 && !selectedRestockProducts.value.some((product) => Number(restockQuantities.value[product.product_id] || 0) > 0)) return;
  restockStep.value += 1;
}

const selectedProduct = computed(() => products.value.find((product) => product.product_id === selectedId.value) || null);
const visibleIds = computed(() => filteredProducts.value.map((product) => product.product_id));
const selectedCount = computed(() => Object.values(selectedProducts.value).filter(Boolean).length);
const selectedUnitTotal = computed(() => Object.entries(selectedProducts.value).reduce((sum, [id, selected]) => selected ? sum + Number(qtyValue(Number(id)) || 0) : sum, 0));
const allVisibleSelected = computed(() => visibleIds.value.length > 0 && visibleIds.value.every((id) => !!selectedProducts.value[id]));
const someVisibleSelected = computed(() => visibleIds.value.some((id) => !!selectedProducts.value[id]) && !allVisibleSelected.value);

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
  if (rawValue === "") { qtyMap.value[productId] = 0; return; }
  const numeric = Number(rawValue);
  qtyMap.value[productId] = Number.isFinite(numeric) ? Math.max(0, Math.floor(numeric)) : 0;
}

function selectProduct(productId) {
  selectedId.value = productId;
}

function toggleProduct(productId, checked) {
  selectedProducts.value = { ...selectedProducts.value, [productId]: checked };
  if (checked) qtyValue(productId);
}

function toggleAllVisible(checked) {
  const next = { ...selectedProducts.value };
  visibleIds.value.forEach((id) => { next[id] = checked; if (checked) qtyValue(id); });
  selectedProducts.value = next;
}

function applySelectedStock() {
  const selectedIds = Object.entries(selectedProducts.value).filter(([, selected]) => selected).map(([id]) => Number(id));
  if (!selectedIds.length || savingStock.value) return;
  const invalid = selectedIds.find((id) => !Number.isInteger(Number(qtyValue(id))) || Number(qtyValue(id)) < 0);
  if (invalid) { stockError.value = "Restock quantities must be whole numbers of 0 or more."; stockSuccess.value = ""; return; }
  savingStock.value = true;
  stockError.value = ""; stockSuccess.value = "";
  Promise.all(selectedIds.map((id) => updateProductStock(id, Number(qtyValue(id)), "Delivery received")))
    .then(() => { stockSuccess.value = `${selectedIds.length} product${selectedIds.length === 1 ? "" : "s"} updated successfully.`; selectedProducts.value = {}; })
    .catch((error) => { stockError.value = error.message || "Unable to apply the stock update."; })
    .finally(() => { savingStock.value = false; });
}

watch(products, (items) => {
  if (!selectedId.value && items.length) selectedId.value = items[0].product_id;
}, { immediate: true });

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

.supplier_restock_page_restock-page {
  min-height: 100vh;
  background: #f7f5f2;
  color: #4d3933;
  font-family: Arial, sans-serif;
}

.supplier_restock_page_restock-page__shell {
  max-width: 1536px;
  margin: 0 auto;
  padding: 14px 0 42px;
}

.supplier_restock_page_restock-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 18px;
  margin: 0 22px 18px;
}

.supplier_restock_page_eyebrow {
  display: inline-block;
  color: #d2763d;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.8px;
}

.supplier_restock_page_restock-header h1 {
  margin: 8px 0 6px;
  font: 700 clamp(30px, 4vw, 40px) Georgia, serif;
  color: #44312c;
}

.supplier_restock_page_restock-header p {
  margin: 0;
  color: #88766e;
}

.supplier_restock_page_restock-header__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.supplier_restock_page_ghost-button,
.supplier_restock_page_primary-button {
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

.supplier_restock_page_ghost-button {
  background: #fff;
  color: #4d3933;
  border: 1px solid #e4ddd8;
}

.supplier_restock_page_primary-button {
  background: #e17b3d;
  color: #fff;
}

.supplier_restock_page_primary-button:disabled {
  opacity: .55;
  cursor: not-allowed;
}

.supplier_restock_page_stock-message {
  margin-top: 14px;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
}

.supplier_restock_page_stock-message--error { background: #fae4e0; color: #b75347; }
.supplier_restock_page_stock-message--success { background: #ebf5eb; color: #4d8a5c; }

.supplier_restock_page_metrics-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 20px;
}

.supplier_restock_page_checkbox-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.supplier_restock_page_checkbox-cell input {
  width: 15px;
  height: 15px;
  accent-color: #c65b2b;
}

.supplier_restock_page_metric-card {
  padding: 18px 18px 16px;
  border: 1px solid #e6dfda;
  border-radius: 12px;
  background: #fff;
}

.supplier_restock_page_metric-card span,
.supplier_restock_page_metric-card small {
  display: block;
  color: #95827a;
  font-size: 11px;
}

.supplier_restock_page_metric-card strong {
  display: block;
  margin: 8px 0 4px;
  font: 700 26px Georgia, serif;
  color: #4d3933;
}

.supplier_restock_page_metric-card.amber strong {
  color: #bd8027;
}

.supplier_restock_page_metric-card.red strong {
  color: #bd5548;
}

.supplier_restock_page_metric-card.green strong {
  color: #4d8a5c;
}

.supplier_restock_page_metric-card.dark {
  background: #523a33;
  border-color: #523a33;
}

.supplier_restock_page_metric-card.dark span,
.supplier_restock_page_metric-card.dark small,
.supplier_restock_page_metric-card.dark strong {
  color: #fff;
}

.supplier_restock_page_toolbar {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: center;
  flex-wrap: wrap;
  margin: 0 0 20px;
  padding: 0 22px;
}

.supplier_restock_page_tab-list {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.supplier_restock_page_tab-button {
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

.supplier_restock_page_tab-button span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  min-height: 18px;
  border-radius: 999px;
  background: #f3eee9;
  font-size: 10.5px;
}

.supplier_restock_page_tab-button--active {
  background: #e17b3d;
  border-color: #e17b3d;
  color: #fff;
}

.supplier_restock_page_tab-button--active span {
  background: rgba(255, 255, 255, 0.18);
}

.supplier_restock_page_toolbar-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.supplier_restock_page_search-box,
.supplier_restock_page_select-box {
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

.supplier_restock_page_search-box {
  width: 250px;
}

.supplier_restock_page_search-box input,
.supplier_restock_page_select-box select {
  width: 100%;
  border: none;
  background: transparent;
  outline: none;
  color: #4d3933;
  font-size: 13px;
}

.supplier_restock_page_inventory-shell {
  border: 1px solid #e6dfda;
  border-radius: 14px;
  background: #fff;
  overflow: hidden;
}

.supplier_restock_page_table-header,
.supplier_restock_page_inventory-row {
  display: grid;
  grid-template-columns: 70px 2.2fr 1fr 1.2fr 1.1fr 1.1fr 1fr;
  gap: 12px;
  align-items: center;
}

.supplier_restock_page_table-header {
  padding: 13px 18px;
  background: #f8f5f2;
  border-bottom: 1px solid #eee8e3;
}

.supplier_restock_page_table-header span {
  color: #9a8981;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}

.supplier_restock_page_inventory-row {
  padding: 14px 18px;
  border-bottom: 1px solid #f1eeeb;
  cursor: pointer;
}

.supplier_restock_page_expand-button {
  width: 18px;
  border: 0;
  padding: 0;
  background: transparent;
  color: #89776e;
  font-size: 18px;
  line-height: 1;
}

.supplier_restock_page_detail-row {
  display: grid;
  grid-template-columns: 1.5fr 1.2fr 1fr;
  gap: 30px;
  align-items: center;
  padding: 18px 70px 20px;
  border-bottom: 1px solid #e6dfda;
  background: #faf8f5;
}

.supplier_restock_page_detail-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.supplier_restock_page_detail-label {
  color: #8d7a70;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.6px;
}

.supplier_restock_page_detail-value,
.supplier_restock_page_toggle-line {
  color: #4d3933;
  font-size: 13px;
}

.supplier_restock_page_toggle-line {
  display: flex;
  align-items: center;
  gap: 10px;
}

.supplier_restock_page_toggle-line input {
  position: absolute;
  opacity: 0;
}

.supplier_restock_page_toggle-switch {
  position: relative;
  width: 42px;
  height: 24px;
  border-radius: 999px;
  background: #d7cfc4;
}

.supplier_restock_page_toggle-switch::after {
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

.supplier_restock_page_toggle-line input:checked+.supplier_restock_page_toggle-switch {
  background: #d2763d;
}

.supplier_restock_page_toggle-line input:checked+.supplier_restock_page_toggle-switch::after {
  transform: translateX(18px);
}

.supplier_restock_page_inventory-row--active {
  background: #faf6f3;
}

.supplier_restock_page_product-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.supplier_restock_page_product-cell img {
  width: 42px;
  height: 42px;
  object-fit: cover;
  border-radius: 8px;
}

.supplier_restock_page_product-cell strong,
.supplier_restock_page_product-cell small {
  display: block;
}

.supplier_restock_page_product-cell strong {
  font-size: 13.5px;
  color: #4d3933;
}

.supplier_restock_page_product-cell small {
  margin-top: 4px;
  color: #9a8981;
  font-size: 11px;
}

.supplier_restock_page_status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
}

.supplier_restock_page_status-pill--danger {
  background: #fae4e0;
  color: #b75347;
}

.supplier_restock_page_status-pill--warn {
  background: #fff2dc;
  color: #b98532;
}

.supplier_restock_page_status-pill--good {
  background: #ebf5eb;
  color: #4d8a5c;
}

.supplier_restock_page_gauge-cell {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.supplier_restock_page_gauge-bar {
  position: relative;
  width: 100%;
  height: 6px;
  border-radius: 999px;
  background: #eee6e1;
  overflow: hidden;
}

.supplier_restock_page_gauge-bar span {
  position: absolute;
  inset: 0 auto 0 0;
  display: block;
  border-radius: inherit;
  background: linear-gradient(90deg, #d6d1a1, #e17b3d);
}

.supplier_restock_page_gauge-cell small,
.supplier_restock_page_urgency-block small {
  color: #9a8981;
  font-size: 10.5px;
}

.supplier_restock_page_sparkline-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d2763d;
}

.supplier_restock_page_sparkline-wrap svg {
  width: 90px;
  height: 30px;
}

.supplier_restock_page_urgency-block {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.supplier_restock_page_urgency-block strong {
  font-size: 12.5px;
}

.supplier_restock_page_qty-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.supplier_restock_page_qty-actions button {
  width: 24px;
  height: 24px;
  border: 1px solid #e6dfda;
  border-radius: 6px;
  background: #f8f5f2;
  color: #5d4c45;
  font-size: 16px;
  line-height: 1;
}

.supplier_restock_page_qty-actions input {
  width: 42px;
  border: 1px solid #e6dfda;
  border-radius: 6px;
  background: #fff;
  color: #4d3933;
  text-align: center;
  padding: 5px 2px;
  font-size: 13px;
}

.supplier_restock_page_save-bar {
  position: sticky;
  bottom: 12px;
  z-index: 10;
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

.supplier_restock_page_save-bar strong,
.supplier_restock_page_save-bar span {
  display: block;
}

.supplier_restock_page_save-bar strong {
  color: #4d3933;
}

.supplier_restock_page_save-bar span {
  margin-top: 4px;
  color: #9a8981;
  font-size: 12px;
}

.supplier_restock_page_empty-state {
  padding: 32px 20px;
  text-align: center;
  color: #9a8981;
}

@media (max-width: 980px) {
  .supplier_restock_page_metrics-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .supplier_restock_page_restock-page__shell { padding: 14px 12px 90px; }
  .supplier_restock_page_restock-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .supplier_restock_page_restock-header__actions {
    width: 100%;
  }

  .supplier_restock_page_restock-header__actions>* {
    flex: 1;
  }

  .supplier_restock_page_metrics-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .supplier_restock_page_table-header {
    display: none;
  }

  .supplier_restock_page_inventory-row {
    grid-template-columns: 34px minmax(0, 1fr);
    gap: 10px 12px;
    padding: 14px;
  }

  .supplier_restock_page_inventory-row > .supplier_restock_page_checkbox-cell { grid-column: 1; grid-row: 1; align-self: start; }
  .supplier_restock_page_inventory-row > .supplier_restock_page_product-cell { grid-column: 2; grid-row: 1; min-width: 0; }
  .supplier_restock_page_inventory-row > .supplier_restock_page_gauge-cell,
  .supplier_restock_page_inventory-row > .supplier_restock_page_status-pill,
  .supplier_restock_page_inventory-row > .supplier_restock_page_sparkline-wrap,
  .supplier_restock_page_inventory-row > .supplier_restock_page_urgency-block,
  .supplier_restock_page_inventory-row > .supplier_restock_page_qty-actions { grid-column: 2; width: 100%; }
  .supplier_restock_page_inventory-row > .supplier_restock_page_sparkline-wrap { justify-content: flex-start; }
  .supplier_restock_page_qty-actions { justify-content: flex-start; }
  .supplier_restock_page_qty-actions input { width: 64px; }

  .supplier_restock_page_detail-row {
    grid-template-columns: 1fr;
    padding: 18px;
  }

  .supplier_restock_page_save-bar {
    flex-direction: column;
    align-items: stretch;
    padding: 14px;
  }
  .supplier_restock_page_save-bar .supplier_restock_page_primary-button { width: 100%; }
}

@media (max-width: 520px) {
  .supplier_restock_page_restock-header { margin: 0 4px 16px; }
  .supplier_restock_page_restock-header__actions > * { width: 100%; }
  .supplier_restock_page_toolbar { padding: 0 4px; }
  .supplier_restock_page_tab-list { width: 100%; overflow-x: auto; flex-wrap: nowrap; padding-bottom: 3px; }
  .supplier_restock_page_tab-button { flex: 0 0 auto; }
  .supplier_restock_page_inventory-shell { border-radius: 10px; }

  .supplier_restock_page_metrics-grid {
    grid-template-columns: 1fr;
  }

  .supplier_restock_page_toolbar-controls {
    width: 100%;
  }

  .supplier_restock_page_search-box,
  .supplier_restock_page_select-box { width: 100%; box-sizing: border-box; }
  .supplier_restock_page_product-cell img { width: 40px; height: 40px; }
  .supplier_restock_page_product-cell strong { font-size: 12.5px; }
  .supplier_restock_page_product-cell small { font-size: 10px; }
}

.supplier_restock_page_modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(45, 31, 25, .48);
}

.supplier_restock_page_restock-modal {
  position: relative;
  width: min(760px, 100%);
  max-height: min(760px, 92vh);
  overflow: auto;
  padding: 28px;
  border: 1px solid #e6dfda;
  border-radius: 14px;
  background: #f7f5f2;
  box-shadow: 0 18px 50px rgba(45, 31, 25, .24);
}

.supplier_restock_page_modal-close {
  position: absolute;
  top: 16px;
  right: 18px;
  border: 0;
  background: transparent;
  color: #88766e;
  font-size: 26px;
  line-height: 1;
}

.supplier_restock_page_modal-kicker {
  color: #d2763d;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
}

.supplier_restock_page_restock-modal h2 {
  margin: 7px 0 5px;
  color: #44312c;
  font: 700 28px Georgia, serif;
}

.supplier_restock_page_modal-intro,
.supplier_restock_page_wizard-panel>p,
.supplier_restock_page_wizard-confirmation p {
  margin: 0 0 18px;
  color: #88766e;
  font-size: 13px;
}

.supplier_restock_page_wizard-steps {
  display: flex;
  gap: 8px;
  margin: 22px 0 16px;
}

.supplier_restock_page_wizard-steps span {
  display: flex;
  align-items: center;
  gap: 7px;
  flex: 1;
  color: #9a8981;
  font-size: 11px;
  font-weight: 600;
}

.supplier_restock_page_wizard-steps b {
  display: grid;
  width: 24px;
  height: 24px;
  place-items: center;
  border: 1px solid #d8cec7;
  border-radius: 50%;
  background: #fff;
}

.supplier_restock_page_wizard-steps .supplier_restock_page_step-active,
.supplier_restock_page_wizard-steps .supplier_restock_page_step-done {
  color: #4d3933;
}

.supplier_restock_page_wizard-steps .supplier_restock_page_step-active b {
  border-color: #e17b3d;
  background: #e17b3d;
  color: #fff;
}

.supplier_restock_page_wizard-steps .supplier_restock_page_step-done b {
  border-color: #4d8a5c;
  background: #4d8a5c;
  color: #fff;
}

.supplier_restock_page_wizard-panel {
  padding: 20px;
  border: 1px solid #e6dfda;
  border-radius: 12px;
  background: #fff;
}

.supplier_restock_page_wizard-panel h3,
.supplier_restock_page_wizard-confirmation h3 {
  margin: 0 0 5px;
  color: #4d3933;
  font: 700 18px Georgia, serif;
}

.supplier_restock_page_wizard-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}

.supplier_restock_page_wizard-actions input,
.supplier_restock_page_wizard-panel select,
.supplier_restock_page_wizard-panel textarea {
  box-sizing: border-box;
  width: 100%;
  padding: 9px 11px;
  border: 1px solid #e4ddd8;
  border-radius: 8px;
  background: #faf9f7;
  color: #4d3933;
}

.supplier_restock_page_wizard-actions input {
  flex: 1 1 220px;
}

.supplier_restock_page_wizard-actions button,
.supplier_restock_page_quantity-row button {
  border: 1px solid #e4ddd8;
  border-radius: 7px;
  padding: 7px 10px;
  background: #fff;
  color: #685750;
}

.supplier_restock_page_wizard-product {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-top: 1px solid #f0ece9;
}

.supplier_restock_page_wizard-product img {
  width: 38px;
  height: 38px;
  border-radius: 7px;
  object-fit: cover;
}

.supplier_restock_page_wizard-product span {
  flex: 1;
  min-width: 0;
}

.supplier_restock_page_wizard-product strong,
.supplier_restock_page_wizard-product small,
.supplier_restock_page_quantity-row strong,
.supplier_restock_page_quantity-row small {
  display: block;
}

.supplier_restock_page_wizard-product small,
.supplier_restock_page_quantity-row small {
  margin-top: 3px;
  color: #9a8981;
  font-size: 11px;
}

.supplier_restock_page_wizard-product em {
  color: #b98532;
  font-size: 11px;
  font-style: normal;
  font-weight: 700;
}

.supplier_restock_page_quantity-row,
.supplier_restock_page_review-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 12px 0;
  border-top: 1px solid #f0ece9;
}

.supplier_restock_page_quantity-row>span {
  flex: 1;
}

.supplier_restock_page_quantity-row>div {
  display: flex;
  align-items: center;
  gap: 5px;
}

.supplier_restock_page_quantity-row input {
  width: 54px;
  padding: 6px;
  border: 1px solid #e4ddd8;
  border-radius: 6px;
  text-align: center;
}

.supplier_restock_page_wizard-panel label {
  display: block;
  margin-bottom: 14px;
  color: #685750;
  font-size: 12px;
  font-weight: 700;
}

.supplier_restock_page_wizard-panel label input,
.supplier_restock_page_wizard-panel label select,
.supplier_restock_page_wizard-panel label textarea {
  display: block;
  margin-top: 6px;
}

.supplier_restock_page_wizard-panel textarea {
  min-height: 80px;
  resize: vertical;
}

.supplier_restock_page_review-total {
  margin-top: 15px;
  padding: 13px;
  border-radius: 8px;
  background: #f8f5f2;
  color: #4d3933;
  font-weight: 700;
}

.supplier_restock_page_wizard-empty {
  text-align: center;
}

.supplier_restock_page_wizard-footer {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 16px;
}

.supplier_restock_page_wizard-confirmation {
  padding: 30px 20px;
  text-align: center;
}

.supplier_restock_page_confirmation-icon {
  display: grid;
  width: 56px;
  height: 56px;
  margin: 0 auto 14px;
  place-items: center;
  border-radius: 50%;
  background: #ebf5eb;
  color: #4d8a5c;
  font-size: 28px;
  font-weight: 700;
}

@media (max-width: 560px) {
  .supplier_restock_page_restock-modal {
    padding: 22px 16px;
  }

  .supplier_restock_page_wizard-steps span {
    display: block;
    text-align: center;
  }

  .supplier_restock_page_wizard-steps b {
    margin: 0 auto 4px;
  }
}
</style>
