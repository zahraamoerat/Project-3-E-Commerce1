<template>
  <div class="stock-page">
    <header class="stock-header">
      <div><span class="eyebrow">INVENTORY OPERATIONS</span><h1>Stock management</h1><p>Monitor inventory levels, identify shortages and restock products quickly.</p></div>
      <div class="header-actions"><label class="search"><span>⌕</span><input v-model="query" aria-label="Search inventory" placeholder="Search products or SKU..." /></label><RouterLink to="/products/add" class="primary">+ Add product</RouterLink></div>
    </header>
    <section class="metrics">
      <article><span>Total products</span><strong>{{ products.length }}</strong><small>In your catalogue</small></article>
      <article><span>Healthy stock</span><strong class="green">{{ inStock }}</strong><small>Above reorder level</small></article>
      <article><span>Low stock</span><strong class="amber">{{ lowStock }}</strong><small>Needs attention</small></article>
      <article><span>Out of stock</span><strong class="red">{{ outOfStock }}</strong><small>Restock immediately</small></article>
    </section>
    <div v-if="alerts.length" class="alert-banner"><div><strong>{{ alerts.length }} product{{ alerts.length === 1 ? "" : "s" }} need attention</strong><span>Out-of-stock and low-stock inventory is ready for review.</span></div><button type="button" @click="viewAlerts">View alerts</button></div><div v-if="message" class="notice success">{{ message }}</div><div v-if="error" class="notice error">{{ error }}</div><section class="inventory-card">
      <div class="toolbar">
        <div><h2>Inventory</h2><p>{{ pageStart }}–{{ pageEnd }} of {{ filteredProducts.length }} products</p></div>
        <div class="toolbar-controls"><button class="export" type="button" @click="exportInventory">Export CSV</button><select v-model="categoryFilter" aria-label="Filter by category"><option value="All">All categories</option><option v-for="category in categories" :key="category" :value="category">{{ category }}</option></select><select v-model="sortOrder" aria-label="Sort inventory"><option value="stock">Lowest stock first</option><option value="name">Product name</option><option value="updated">Recently updated</option><option value="restocked">Recently restocked</option></select></div>
        <div class="filters"><button v-for="filter in filters" :key="filter" :class="{active: statusFilter===filter}" @click="statusFilter=filter">{{ filter }}</button></div>
      </div>
      <div v-if="selectedCount" class="bulk-bar"><strong>{{ selectedCount }} selected</strong><select v-model="bulkMode"><option value="receive">Receive stock</option><option value="set">Set exact stock</option></select><input v-model.number="bulkQuantity" type="number" min="0" step="1" aria-label="Bulk quantity" /><button type="button" :disabled="bulkSaving" @click="applyBulk">{{ bulkSaving ? "Saving..." : "Apply" }}</button><button type="button" class="link-button" @click="clearSelection">Clear</button></div><div class="table-head"><span><input type="checkbox" :checked="allVisibleSelected" :indeterminate="someVisibleSelected" @change="toggleAll($event.target.checked)" aria-label="Select visible products" /> Product</span><span>Stock</span><span>Reorder</span><span>Status</span><span>Price</span><span>Actions</span></div>
      <div v-for="product in pagedProducts" :key="product.product_id" class="inventory-row">
        <div class="product"><input type="checkbox" :checked="!!selected[product.product_id]" @change="toggleProduct(product.product_id,$event.target.checked)" :aria-label="`Select ${product.product_name}`" /><img :src="product.image" :alt="product.product_name" /><div><strong>{{ product.product_name }}</strong><span>{{ product.sku }} · {{ product.category_name || "Uncategorised" }}</span></div></div>
        <div class="quantity"><strong>{{ product.quantity }}</strong><span>units</span></div><div class="reorder"><strong>{{ recommendedQty(product) }}</strong><span>recommended · {{ product.lead_time_days || 1 }}d lead</span></div>
        <span class="badge" :class="statusClass(stockStatus(product))">{{ stockStatus(product) }}</span>
        <strong class="price">{{ money(product.price) }}</strong>
        <div class="actions"><button class="secondary" type="button" @click="showProductHistory(product)">History</button><button class="edit-stock" type="button" @click="startEdit(product)">Edit</button><button class="restock" type="button" @click="openReceive(product)">Receive</button></div>
      </div>
      <div v-if="pageCount > 1" class="pagination"><button :disabled="page === 1" @click="page--">Previous</button><button v-for="n in pageCount" :key="n" :class="{ active: page === n }" @click="page = n">{{ n }}</button><button :disabled="page === pageCount" @click="page++">Next</button></div><div v-if="loading" class="empty"><strong>Loading inventory...</strong><span>Fetching your latest stock levels.</span></div><div v-else-if="!filteredProducts.length" class="empty"><strong>No products found</strong><span>Try another search or filter.</span></div></section><section class="history-card"><div class="history-head"><div><h2>Recent stock activity</h2><p>Every quantity change is recorded for traceability.</p></div><button type="button" @click="loadHistory">Refresh</button></div><div v-if="historyLoading" class="history-empty">Loading stock activity...</div><div v-else-if="!history.length" class="history-empty">No stock changes have been recorded yet.</div><div v-else class="history-list"><div v-for="item in history.slice(0,8)" :key="item.stock_history_id" class="history-row"><div><strong>{{ item.product_name }}</strong><span>{{ item.reason || "Stock adjustment" }}</span></div><div><strong>{{ signedChange(item.change_quantity) }}</strong><span>{{ item.previous_quantity }} → {{ item.new_quantity }} units</span></div><time>{{ formatDate(item.created_at) }}</time></div></div></section><section class="analytics-card"><div class="history-head"><div><h2>Stock movement analytics</h2><p>Inventory movement recorded over the last 30 days.</p></div><button type="button" @click="loadAnalytics">Refresh</button></div><div v-if="analyticsLoading" class="history-empty">Loading analytics...</div><div v-else class="analytics-grid"><article><span>Units received</span><strong>{{ analyticsTotals.received }}</strong></article><article><span>Units removed</span><strong>{{ analyticsTotals.removed }}</strong></article><article><span>Adjustments</span><strong>{{ analyticsTotals.adjustments }}</strong></article><article><span>Net movement</span><strong>{{ analyticsTotals.received - analyticsTotals.removed }}</strong></article></div></section><div v-if="historyProduct" class="modal-backdrop" @click.self="historyProduct=null"><section class="stock-modal wide"><button class="close" type="button" @click="historyProduct=null">×</button><span class="eyebrow">PRODUCT HISTORY</span><h2>{{ historyProduct.product_name }}</h2><p>Current stock: <strong>{{ historyProduct.quantity }} units</strong></p><div class="history-list"><div v-if="productHistoryLoading" class="history-empty">Loading product history...</div><div v-for="item in productHistory" :key="item.stock_history_id" class="history-row"><div><strong>{{ item.reason || "Stock adjustment" }}</strong><span>{{ item.previous_quantity }} → {{ item.new_quantity }} units</span></div><div><strong>{{ signedChange(item.change_quantity) }}</strong></div><time>{{ formatDate(item.created_at) }}</time></div><div v-if="!productHistory.length" class="history-empty">No history recorded for this product.</div></div></section></div><div v-if="editing" class="modal-backdrop" @click.self="cancelEdit"><section class="stock-modal"><button class="close" type="button" @click="cancelEdit">×</button><span class="eyebrow">STOCK ADJUSTMENT</span><h2>{{ adjustmentMode === "receive" ? "Receive stock for" : "Set stock for" }} {{ editing.product_name }}</h2><p>Current stock: <strong>{{ editing.quantity }} units</strong></p><p v-if="adjustmentMode === 'receive'">New stock after receipt: <strong>{{ Number(editing.quantity) + Number(editQuantity || 0) }} units</strong></p><label>{{ adjustmentMode === "receive" ? "Quantity received" : "New quantity" }}<input v-model.number="editQuantity" type="number" min="0" step="1" /></label><label>Reason<select v-model="editReason"><option v-if="adjustmentMode === 'set'">Manual adjustment</option><option v-if="adjustmentMode === 'receive'">Delivery received</option><option>Damaged stock</option><option>Stock count correction</option><option>Returned stock</option></select></label><div class="modal-actions"><button type="button" class="cancel" @click="cancelEdit">Cancel</button><button type="button" class="save" :disabled="saving" @click="saveStock">{{ saving ? "Saving..." : "Save stock" }}</button></div></section></div>
  </div>
</template>
<script setup>
import { computed, ref, watch } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useSupplierData } from "@/data/supplierData";
const { products, updateProductStock, loading } = useSupplierData();
const router = useRouter(), query = ref(""), statusFilter = ref("All"), categoryFilter = ref("All"), sortOrder = ref("stock"), page = ref(1);
const editing = ref(null), adjustmentMode = ref("set"), editQuantity = ref(0), editReason = ref("Manual adjustment"), saving = ref(false), message = ref(""), error = ref("");
const selected = ref({}), bulkMode = ref("receive"), bulkQuantity = ref(0), bulkSaving = ref(false);
const selectedCount = computed(() => Object.values(selected.value).filter(Boolean).length);
const visibleIds = computed(() => pagedProducts.value.map(p => p.product_id));
const allVisibleSelected = computed(() => visibleIds.value.length > 0 && visibleIds.value.every(id => selected.value[id]));
const someVisibleSelected = computed(() => visibleIds.value.some(id => selected.value[id]) && !allVisibleSelected.value);
const history = ref([]), historyLoading = ref(false), alerts = ref([]), alertsLoading = ref(false), analytics = ref([]), analyticsLoading = ref(false), historyProduct = ref(null), productHistory = ref([]), productHistoryLoading = ref(false);
const filters = ["All", "In stock", "Low stock", "Out of stock"];
const analyticsTotals = computed(() => analytics.value.reduce((totals, item) => ({ received: totals.received + Number(item.units_received || 0), removed: totals.removed + Number(item.units_removed || 0), adjustments: totals.adjustments + Number(item.adjustments || 0) }), { received: 0, removed: 0, adjustments: 0 }));
const categories = computed(() => [...new Set(products.value.map(p => p.category_name).filter(Boolean))].sort());
const pageSize = 10;
const pageCount = computed(() => Math.max(1, Math.ceil(filteredProducts.value.length / pageSize)));
const pageStart = computed(() => filteredProducts.value.length ? (page.value - 1) * pageSize + 1 : 0);
const pageEnd = computed(() => Math.min(page.value * pageSize, filteredProducts.value.length));
const pagedProducts = computed(() => filteredProducts.value.slice((page.value - 1) * pageSize, page.value * pageSize));
function stockStatus(p){const q=Number(p.quantity||0),t=Number(p.low_stock_threshold||0);return q===0?"Out of stock":q<=t?"Low stock":"In stock"}
function recommendedQty(p){return Math.max(0,Number(p.recommended_reorder_qty ?? Math.max(Number(p.low_stock_threshold||0)-Number(p.quantity||0),0)))}
const filteredProducts = computed(() => { const rows = products.value.filter(p => { const text = `${p.product_name||""} ${p.sku||""} ${p.category_name||""}`.toLowerCase(); const matchesSearch = text.includes(query.value.trim().toLowerCase()); const matchesStatus = statusFilter.value === "All" || stockStatus(p).toLowerCase() === statusFilter.value.toLowerCase(); const matchesCategory = categoryFilter.value === "All" || p.category_name === categoryFilter.value; return matchesSearch && matchesStatus && matchesCategory; }); return [...rows].sort((a,b) => sortOrder.value === "restocked" ? new Date(b.last_restocked||0)-new Date(a.last_restocked||0) : sortOrder.value === "name" ? String(a.product_name||"").localeCompare(String(b.product_name||"")) : sortOrder.value === "updated" ? new Date(b.updated_at||0)-new Date(a.updated_at||0) : Number(a.quantity||0)-Number(b.quantity||0)); });
watch([query,statusFilter,categoryFilter,sortOrder],()=>page.value=1);
watch(pageCount,()=>{if(page.value>pageCount.value)page.value=pageCount.value});
const inStock = computed(() => products.value.filter(p => stockStatus(p) === "In stock").length);
const lowStock = computed(() => products.value.filter(p => stockStatus(p) === "Low stock").length);
const outOfStock = computed(() => products.value.filter(p => stockStatus(p) === "Out of stock").length);
function money(value){return new Intl.NumberFormat("en-ZA",{style:"currency",currency:"ZAR",maximumFractionDigits:0}).format(Number(value)||0)}
function statusClass(status){return String(status||"").toLowerCase().replaceAll(" ","-")}
async function showProductHistory(product){historyProduct.value=product;productHistory.value=[];productHistoryLoading.value=true;try{const response=await fetch(`/api/products/${product.product_id}/stock/history`);if(!response.ok)throw new Error("Unable to load product history.");productHistory.value=await response.json()}catch(e){error.value=e.message}finally{productHistoryLoading.value=false}}
function viewAlerts(){statusFilter.value = alerts.value.some((item) => String(item.alert_status || item.stockStatus || "").toLowerCase() === "out of stock") ? "Out of stock" : "Low stock"}
function toggleProduct(id,checked){selected.value={...selected.value,[id]:checked}}
function toggleAll(checked){const next={...selected.value};visibleIds.value.forEach(id=>next[id]=checked);selected.value=next}
function clearSelection(){selected.value={}}
async function applyBulk(){const qty=Number(bulkQuantity.value);if(!selectedCount.value)return;if(!Number.isInteger(qty)||qty<0){error.value="Bulk quantity must be a non-negative whole number.";return}const updates=Object.entries(selected.value).filter(([,v])=>v).map(([id])=>{const p=products.value.find(x=>Number(x.product_id)===Number(id));return {product_id:Number(id),quantity:bulkMode.value==="receive"?Number(p?.quantity||0)+qty:qty}});const maxDelta=Math.max(...updates.map(u=>Math.abs(u.quantity-Number(products.value.find(p=>Number(p.product_id)===u.product_id)?.quantity||0))));if(maxDelta>=100&&!window.confirm("This bulk change is 100 units or more. Continue?"))return;bulkSaving.value=true;try{const r=await fetch("/api/products/stock/bulk",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({updates,reason:bulkMode.value==="receive"?"Delivery received":"Manual adjustment"})});const b=await r.json();if(!r.ok)throw new Error(b.message||"Bulk update failed.");message.value=b.message;clearSelection();await loadHistory();setTimeout(()=>message.value="",3500)}catch(e){error.value=e.message}finally{bulkSaving.value=false}}
function restock(product){router.push({name:"RestockPage",params:{id:String(product.product_id)}})}
function openReceive(product){editing.value=product;adjustmentMode.value="receive";editQuantity.value=0;editReason.value="Delivery received"}
function startEdit(product){message.value="";error.value="";editing.value=product;adjustmentMode.value="set";editQuantity.value=Number(product.quantity)||0;editReason.value="Manual adjustment"}
function cancelEdit(){editing.value=null}
async function saveStock(){if(!editing.value)return;const input=Number(editQuantity.value);if(!Number.isInteger(input)||input<0){error.value="Quantity must be a non-negative whole number.";return}saving.value=true;error.value="";message.value="";const quantity=adjustmentMode.value==="receive"?Number(editing.value.quantity)+input:input;if(Math.abs(quantity-Number(editing.value.quantity))>=100&&!window.confirm("This adjustment is 100 units or more. Continue?")){saving.value=false;return}try{await updateProductStock(editing.value.product_id,quantity,editReason.value);message.value="Stock updated successfully.";editing.value=null;await loadHistory();setTimeout(()=>{message.value=""},3500)}catch(e){error.value=e.message||"Unable to update stock."}finally{saving.value=false}}
async function loadAnalytics(){analyticsLoading.value=true;try{const response=await fetch("/api/products/stock/analytics");if(!response.ok)throw new Error("Unable to load stock movement analytics.");analytics.value=await response.json()}catch(e){error.value=e.message}finally{analyticsLoading.value=false}}
async function loadHistory(){historyLoading.value=true;try{const token=localStorage.getItem("weconnect_token");const response=await fetch("/api/products/stock/history",{headers:token?{Authorization:`Bearer ${token}`}:{} });if(!response.ok)throw new Error("Unable to load stock history.");history.value=await response.json()}catch(e){error.value=e.message||"Unable to load stock history."}finally{historyLoading.value=false}}
function signedChange(value){const n=Number(value)||0;return `${n>0?"+":""}${n}`}
function exportInventory(){const headers=["Product","SKU","Category","Current stock","Reorder level","Recommended reorder","Status","Lead time (days)","Last restocked"];const rows=filteredProducts.value.map(p=>[p.product_name,p.sku||"",p.category_name||"",p.quantity,p.low_stock_threshold,recommendedQty(p),stockStatus(p),p.lead_time_days||1,formatDate(p.last_restocked)]);const csv=[headers,...rows].map(row=>row.map(v=>"\""+String(v??"").replaceAll("\"","\"\"")+"\"").join(",")).join("\\n");const blob=new Blob([csv],{type:"text/csv"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="weconnect-inventory.csv";a.click();URL.revokeObjectURL(a.href)}
function formatDate(value){if(!value)return "—";return new Intl.DateTimeFormat("en-ZA",{dateStyle:"medium",timeStyle:"short"}).format(new Date(value))}
async function loadAlerts(){alertsLoading.value=true;try{const token=localStorage.getItem("weconnect_token");const response=await fetch("/api/products/stock/alerts",{headers:token?{Authorization:`Bearer ${token}`}:{} });if(!response.ok)throw new Error("Unable to load inventory alerts.");alerts.value=await response.json()}catch(e){console.warn(e.message)}finally{alertsLoading.value=false}}
loadHistory();loadAlerts();loadAnalytics();
const alertTimer = window.setInterval(loadAlerts, 60000);
window.addEventListener("beforeunload", () => window.clearInterval(alertTimer));
</script>
<style scoped>
.stock-page{
  width:100%;
  min-height:100vh;
  box-sizing:border-box;
  padding:28px clamp(18px,3vw,38px) 48px;
  background:#f7f4f1;
  color:#4b3932;
}
.stock-header,.metrics,.alert-banner,.notice,.inventory-card,.history-card,.analytics-card{
  width:min(1240px,100%);
  margin-inline:auto;
}
.stock-header{
  display:flex;
  align-items:flex-end;
  justify-content:space-between;
  gap:24px;
  margin-bottom:20px;
}
.eyebrow{display:block;margin-bottom:6px;color:#c46f3d;font-size:9px;font-weight:800;letter-spacing:1.8px}
.stock-header h1{margin:0;color:#3d2d27;font:700 32px/1.15 Georgia,serif}
.stock-header p{margin:7px 0 0;color:#8b7971;font-size:12px}
.header-actions{display:flex;align-items:center;gap:8px}
.search{
  display:flex;align-items:center;gap:8px;width:270px;height:38px;box-sizing:border-box;
  padding:0 11px;border:1px solid #ded6d0;border-radius:9px;background:#fff;
}
.search span{color:#c46f3d;font-size:16px}
.search input{width:100%;border:0;outline:0;background:transparent;color:#4b3932;font-size:11px}
.primary,.restock{
  display:inline-flex;align-items:center;justify-content:center;min-height:38px;
  padding:0 13px;border:0;border-radius:9px;background:#704f43;color:#fff;
  font-size:11px;font-weight:700;text-decoration:none;cursor:pointer;
}
.primary:hover,.restock:hover{background:#5e4036}

.metrics{
  display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-bottom:14px
}
.metrics article{
  position:relative;padding:15px 17px;border:1px solid #e2dbd5;border-radius:12px;
  background:#fff;box-shadow:0 4px 16px rgba(67,47,38,.04)
}
.metrics span,.metrics small{display:block;color:#8c7b73;font-size:10px}
.metrics strong{display:block;margin:5px 0 2px;color:#47362f;font:700 25px Georgia,serif}
.metrics .green{color:#3e8060}.metrics .amber{color:#ad762d}.metrics .red{color:#b55249}

.alert-banner{
  display:flex;align-items:center;justify-content:space-between;gap:12px;
  box-sizing:border-box;margin-bottom:12px;padding:12px 15px;
  border:1px solid #ecd6bd;border-radius:10px;background:#fff8ee
}
.alert-banner strong{display:block;color:#87591f;font-size:11px}
.alert-banner span{display:block;margin-top:3px;color:#9b8067;font-size:10px}
.alert-banner button{
  border:1px solid #ddc09f;border-radius:7px;padding:7px 10px;background:#fff;
  color:#965f2b;font-size:10px;font-weight:700;cursor:pointer
}
.notice{box-sizing:border-box;margin-bottom:12px;padding:10px 13px;border-radius:9px;font-size:11px;font-weight:700}
.notice.success{border:1px solid #cfe1d5;background:#f0f8f2;color:#397052}
.notice.error{border:1px solid #edcfca;background:#fff3f1;color:#a34e47}

.inventory-card,.history-card,.analytics-card{
  overflow:hidden;border:1px solid #e1dad4;border-radius:14px;background:#fff;
  box-shadow:0 6px 22px rgba(67,47,38,.045)
}
.toolbar{
  display:grid;grid-template-columns:auto 1fr;gap:12px 20px;align-items:center;
  padding:16px 18px;border-bottom:1px solid #eee8e3
}
.toolbar h2,.history-head h2{margin:0;color:#40302a;font:700 18px Georgia,serif}
.toolbar p,.history-head p{margin:3px 0 0;color:#99877f;font-size:10px}
.toolbar-controls{
  display:flex;justify-content:flex-end;align-items:center;gap:7px;flex-wrap:wrap
}
.export,.toolbar-controls select{
  height:34px;box-sizing:border-box;border:1px solid #ded6d0;border-radius:7px;
  padding:0 9px;background:#fff;color:#6f5c54;font-size:10px;font-weight:600
}
.filters{grid-column:1/-1;display:flex;gap:6px;overflow:auto}
.filters button{
  border:1px solid #e0d8d2;border-radius:999px;padding:6px 10px;background:#f8f5f2;
  color:#806d64;font-size:10px;font-weight:700;white-space:nowrap;cursor:pointer
}
.filters button.active{border-color:#704f43;background:#704f43;color:#fff}

.bulk-bar{
  display:flex;align-items:center;gap:7px;flex-wrap:wrap;padding:9px 18px;
  border-bottom:1px solid #eee8e3;background:#fff9f4;font-size:10px
}
.bulk-bar select,.bulk-bar input{
  height:32px;box-sizing:border-box;border:1px solid #ded6d0;border-radius:7px;padding:0 8px;background:#fff
}
.bulk-bar button{
  height:32px;border:0;border-radius:7px;padding:0 10px;background:#704f43;color:#fff;font-size:10px;font-weight:700;cursor:pointer
}
.bulk-bar button:disabled{opacity:.5;cursor:not-allowed}.bulk-bar .link-button{background:transparent;color:#704f43}

.table-head,.inventory-row{
  display:grid;
  grid-template-columns:minmax(240px,2.4fr) 70px 125px 105px 90px minmax(150px,1.45fr);
  gap:12px;
  align-items:center;
}
.table-head{
  padding:9px 18px;background:#f8f5f2;color:#98867e;font-size:9px;font-weight:800;
  text-transform:uppercase;letter-spacing:.7px
}
.table-head span{min-width:0}.table-head span:first-child{display:flex;align-items:center;gap:8px}
.table-head input,.product input{accent-color:#704f43}
.inventory-row{padding:12px 18px;border-top:1px solid #f0ebe7;transition:background .15s ease}
.inventory-row:hover{background:#fffaf6}

.product{display:flex;align-items:center;gap:9px;min-width:0}
.product img{
  width:42px;height:42px;flex:0 0 42px;object-fit:cover;border:1px solid #ebe3dd;border-radius:8px;background:#f7f3ef
}
.product div{min-width:0}
.product strong{display:block;overflow:hidden;color:#4b3932;font-size:11px;line-height:1.3;text-overflow:ellipsis;white-space:nowrap}
.product span{display:block;overflow:hidden;margin-top:3px;color:#9a8981;font-size:9px;text-overflow:ellipsis;white-space:nowrap}
.quantity strong,.reorder strong{display:block;color:#4b3932;font-size:11px}
.quantity span,.reorder span{display:block;margin-top:3px;color:#9a8981;font-size:9px}
.reorder{min-width:0}
.badge{
  justify-self:start;padding:5px 7px;border-radius:999px;font-size:9px;font-weight:800;white-space:nowrap
}
.in-stock{background:#e7f3ea;color:#3e8060}.low-stock{background:#fff0d8;color:#a66e25}.out-of-stock{background:#fae5e1;color:#b55249}
.price{color:#5d4840;font-size:10px;white-space:nowrap}
.actions{display:flex;justify-content:flex-end;gap:5px;flex-wrap:wrap}
.actions button{
  min-height:29px;padding:5px 8px;border-radius:7px;font-size:9px;font-weight:700;cursor:pointer
}
.actions .secondary{border:1px solid #ded6d0;background:#fff;color:#704f43}
.actions .edit-stock{border:1px solid #d8c9c0;background:#f8f3ef;color:#704f43}
.actions .restock{background:#704f43;color:#fff}

.pagination{
  display:flex;justify-content:center;align-items:center;gap:4px;padding:13px;border-top:1px solid #eee8e3
}
.pagination button{
  min-width:30px;height:30px;border:1px solid #ded6d0;border-radius:7px;background:#fff;color:#704f43;font-size:10px;cursor:pointer
}
.pagination button.active{background:#704f43;color:#fff}.pagination button:disabled{opacity:.45;cursor:not-allowed}

.history-card,.analytics-card{margin-top:16px}
.history-head{
  display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 18px;border-bottom:1px solid #eee8e3
}
.history-head button{
  border:1px solid #ded6d0;border-radius:7px;padding:7px 10px;background:#fff;color:#704f43;font-size:10px;font-weight:700;cursor:pointer
}
.history-list{padding:0 18px}
.history-row{
  display:grid;grid-template-columns:minmax(0,1fr) 170px 150px;gap:14px;align-items:center;
  padding:11px 0;border-bottom:1px solid #f0ebe7
}
.history-row:last-child{border-bottom:0}
.history-row strong{display:block;color:#55423a;font-size:10px}.history-row span,.history-row time{display:block;margin-top:3px;color:#99877f;font-size:9px}
.history-row time{text-align:right}
.history-empty,.empty{padding:25px;text-align:center;color:#918078;font-size:10px}
.empty strong,.empty span{display:block}.empty strong{margin-bottom:3px;color:#604e46}

.analytics-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;padding:14px 18px}
.analytics-grid article{padding:12px;border:1px solid #eee6e0;border-radius:9px;background:#faf8f6}
.analytics-grid span{display:block;color:#918078;font-size:9px}.analytics-grid strong{display:block;margin-top:4px;color:#4d3933;font:700 20px Georgia,serif}

.modal-backdrop{
  position:fixed;inset:0;z-index:50;display:grid;place-items:center;padding:18px;box-sizing:border-box;
  background:rgba(48,35,30,.42);backdrop-filter:blur(3px)
}
.stock-modal{
  position:relative;width:min(440px,100%);max-height:90vh;overflow:auto;box-sizing:border-box;padding:23px;
  border:1px solid #e3d9d2;border-radius:15px;background:#fff;box-shadow:0 28px 70px rgba(45,31,25,.25)
}
.stock-modal.wide{width:min(680px,100%)}
.stock-modal h2{margin:7px 0 5px;color:#3f302b;font:700 21px Georgia,serif}
.stock-modal p{margin:0 0 14px;color:#8d7b72;font-size:10px}
.stock-modal label{display:block;margin:13px 0 0;color:#66554e;font-size:10px;font-weight:700}
.stock-modal input,.stock-modal select{display:block;width:100%;box-sizing:border-box;margin-top:5px;padding:9px;border:1px solid #e1d8d1;border-radius:8px;background:#fff}
.close{position:absolute;top:9px;right:12px;border:0;background:transparent;color:#8d7b72;font-size:24px;cursor:pointer}
.modal-actions{display:flex;justify-content:flex-end;gap:7px;margin-top:18px}
.cancel,.save{border-radius:8px;padding:8px 12px;font-size:10px;font-weight:700;cursor:pointer}
.cancel{border:1px solid #ded6d0;background:#fff;color:#704f43}.save{border:0;background:#704f43;color:#fff}.save:disabled{opacity:.6;cursor:not-allowed}

@media (max-width:1100px){
  .stock-header{align-items:flex-start;flex-direction:column}.header-actions{width:100%;justify-content:flex-start}
  .search{width:min(360px,100%)}.metrics{grid-template-columns:repeat(2,1fr)}
  .table-head,.inventory-row{grid-template-columns:minmax(220px,2fr) 65px 115px 100px 85px 145px}
}
@media (max-width:850px){
  .table-head{display:none}
  .inventory-row{grid-template-columns:minmax(0,1fr) auto;gap:9px 12px;padding:14px}
  .inventory-row .product{grid-column:1/-1}
  .inventory-row .quantity,.inventory-row .reorder{display:flex;align-items:baseline;gap:5px}
  .inventory-row .badge{justify-self:end}.inventory-row .price{justify-self:end}
  .inventory-row .actions{grid-column:1/-1;justify-content:flex-start}
  .analytics-grid{grid-template-columns:repeat(2,1fr)}
}
@media (max-width:600px){
  .stock-page{padding:20px 12px 38px}.stock-header h1{font-size:28px}
  .header-actions{width:100%;flex-direction:column;align-items:stretch}.search{width:100%}.primary{width:100%}
  .toolbar{grid-template-columns:1fr;padding:14px}.toolbar-controls{justify-content:flex-start}.filters{grid-column:auto}
  .toolbar-controls>*{flex:1}.alert-banner{align-items:flex-start;flex-direction:column}.alert-banner button{width:100%}
  .bulk-bar{padding:9px 14px}.bulk-bar>*{flex:1}.history-head{padding:14px}.history-list{padding:0 14px}
  .history-row{grid-template-columns:1fr;gap:4px}.history-row time{text-align:left}.analytics-grid{padding:12px 14px;gap:7px}
  .modal-actions{flex-direction:column}.modal-actions button{width:100%}
}
@media (max-width:400px){
  .metrics,.analytics-grid{grid-template-columns:1fr}.inventory-row{grid-template-columns:1fr}
  .inventory-row .badge,.inventory-row .price{justify-self:start}.inventory-row .actions{display:grid;grid-template-columns:1fr 1fr 1fr}.actions button{width:100%}
}
</style>