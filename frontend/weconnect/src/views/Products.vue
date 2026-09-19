<template>
  <div class="supplier_products_products-page">
    <main class="supplier_products_main-content">
      <header class="supplier_products_page-header">
        <div>
          <h1>Products</h1>
          <p>Manage your product catalog, pricing and inventory.</p>
          <button type="button" class="supplier_products_export-button" @click="exportCsv">Export CSV</button>
        </div>
        <RouterLink to="/products/add" class="supplier_products_add-product-button">
          <FontAwesomeIcon :icon="faPlus" />
          Add product
        </RouterLink>
      </header>

      <section class="supplier_products_products-card">
        <div class="supplier_products_card-heading">
          <h2>All products</h2>
        </div>

        <div class="supplier_products_controls">
          <button v-if="searchQuery || selectedStatus !== 'All'" type="button" class="supplier_products_clear-filters" @click="searchQuery=''; selectedStatus='All'">Clear filters</button>
          <label class="supplier_products_search-container">
            <FontAwesomeIcon :icon="faMagnifyingGlass" />
            <span class="supplier_products_sr-only">Search products</span>
            <input v-model="searchQuery" type="text" placeholder="Search products..." />
          </label>

          <button type="button" class="supplier_products_advanced-button" @click="advancedFiltersOpen = !advancedFiltersOpen">Advanced filters</button>
          <div class="supplier_products_status-filters" aria-label="Filter products by stock">
            <button v-for="filter in statusFilters" :key="filter.value" type="button" class="supplier_products_filter-button"
              :class="{ 'filter-button--active': selectedStatus === filter.value }"
              @click="selectedStatus = filter.value">
              {{ filter.label }}
            </button>
          </div>

          <span v-if="searchQuery || selectedStatus !== 'All'" class="supplier_products_result-count">{{ filteredProducts.length }} result<span
              v-if="filteredProducts.length !== 1">s</span></span>
          <button v-if="searchQuery || selectedStatus !== 'All'" type="button" class="supplier_products_clear-filters" @click="searchQuery = ''; selectedStatus = 'All'">Clear filters</button>

          <div class="supplier_products_view-toggle" aria-label="Product view">
            <button type="button" class="supplier_products_view-button" :class="{ 'view-button--active': viewMode === 'list' }"
              :aria-pressed="viewMode === 'list'" aria-label="List view" @click="viewMode = 'list'">
              <FontAwesomeIcon :icon="faList" />
            </button>
            <button type="button" class="supplier_products_view-button" :class="{ 'view-button--active': viewMode === 'grid' }"
              :aria-pressed="viewMode === 'grid'" aria-label="Grid view" @click="viewMode = 'grid'">
              <FontAwesomeIcon :icon="faTableCells" />
            </button>
          </div>
        </div>

       <div v-if="advancedFiltersOpen" class="supplier_products_advanced-panel">
  <label>Category<select v-model="categoryFilter"><option v-for="category in categoryOptions" :key="category" :value="category">{{ category }}</option></select></label>
  <label>Min price<input v-model="minPrice" type="number" min="0" step="0.01" placeholder="0" /></label>
  <label>Max price<input v-model="maxPrice" type="number" min="0" step="0.01" placeholder="No limit" /></label>
  <label>Min stock<input v-model="minStock" type="number" min="0" step="1" placeholder="0" /></label>
  <label>Max stock<input v-model="maxStock" type="number" min="0" step="1" placeholder="No limit" /></label>
  <button type="button" class="supplier_products_clear-filters" @click="clearAdvancedFilters">Reset advanced</button>
</div>
<div class="supplier_products_catalog-filter"><label>Catalog <select v-model="selectedCatalog"><option value="Active">Active</option><option value="Archived">Archived</option><option value="All">All</option></select></label></div>
<div v-if="dataError" class="supplier_products_message supplier_products_error">{{ dataError }}</div>
<div v-if="selectedProductIds.length" class="supplier_products_bulk-bar">
  <strong>{{ selectedProductIds.length }} selected</strong>
  <button type="button" @click="bulkStock">Adjust stock</button>
  <button type="button" @click="bulkArchive">Archive</button>
  <button type="button" @click="clearSelection">Clear selection</button>
</div>

<div v-if="error" class="supplier_products_message supplier_products_error">
  {{ error }}
</div>

<div v-if="loading" class="supplier_products_message">
  Loading products…
</div>
        <div v-if="viewMode === 'list'" class="supplier_products_table-container">
          <table>
            <thead>
              <tr>
                <th class="supplier_products_checkbox-cell"><input type="checkbox" :checked="allVisibleSelected" @change="toggleSelectAll" aria-label="Select all visible products" /></th>
                <th><button type="button" class="supplier_products_sort-heading" @click="toggleSort('name')">Product <span>↕</span></button></th>
                <th>SKU</th><th>Catalog</th>
                <th>Category</th>
                <th><button type="button" class="supplier_products_sort-heading" @click="toggleSort('price')">Price <span>↕</span></button></th>
                <th><button type="button" class="supplier_products_sort-heading" @click="toggleSort('stock')">Stock <span>↕</span></button></th>
                <th>Status</th>
                <th><span class="supplier_products_sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in paginatedProducts" :key="product.product_id">
                <td class="supplier_products_checkbox-cell"><input v-model="selectedProductIds" type="checkbox" :value="product.product_id" :aria-label="'Select ' + product.product_name" /></td>
                <td class="supplier_products_product-cell">
                  <span class="supplier_products_product-icon"><img v-if="product.image" :src="product.image" :alt="product.product_name" @error="handleImageError" /><FontAwesomeIcon v-else :icon="faCube" /></span>
                  <strong>{{ product.product_name }}</strong>
                </td>
                <td class="supplier_products_sku">{{ product.sku || "—" }}</td>
                <td>{{ product.category_name }}</td><td><span :class="['catalog-badge', product.catalog_status === 'Archived' ? 'catalog-badge--archived' : 'catalog-badge--active']">{{ product.catalog_status || "Active" }}</span></td>
                <td>{{ formatPrice(product.price) }}</td>
                <td>{{ Number(product.quantity).toLocaleString() }} units</td>
                <td>
                  <span class="supplier_products_status-badge" :class="product.stockStatus.toLowerCase().replace(' ', '-')">
                    <span class="supplier_products_status-dot"></span>
                    {{ product.stockStatus }}
                  </span>
                </td>
                <td class="supplier_products_actions">
                  <RouterLink :to="`/products/view/${product.product_id}`" class="supplier_products_icon-button"
                    aria-label="View product">
                    <FontAwesomeIcon :icon="faEye" />
                  </RouterLink>
                  <RouterLink :to="`/products/edit/${product.product_id}`" class="supplier_products_icon-button"
                    aria-label="Edit product">
                    <FontAwesomeIcon :icon="faPen" />
                  </RouterLink>
                  <button class="supplier_products_icon-button" type="button" aria-label="Duplicate product" @click="duplicate(product)" :disabled="duplicatingProductId === product.product_id"><FontAwesomeIcon :icon="faCopy" /></button>
                  <button class="supplier_products_icon-button" type="button" aria-label="Delete product"
                    :disabled="deletingProductId === product.product_id" @click="deleteProduct(product)">
                    <FontAwesomeIcon :icon="faTrashCan" />
                  </button>
                </td>
              </tr>
              <tr v-if="filteredProducts.length === 0">
                <td colspan="9" class="supplier_products_no-results"><strong>{{ searchQuery || selectedStatus !== "All" ? "No products match your filters" : "Your catalog is empty" }}</strong><br /><span>{{ searchQuery || selectedStatus !== "All" ? "Try clearing your search or stock filter." : "Add your first product to start building your catalog." }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="supplier_products_product-grid">
          <article v-for="product in paginatedProducts" :key="product.product_id" class="supplier_products_product-tile">
            <div class="supplier_products_tile-image">
              <img :src="product.image" :alt="product.product_name" />
              <span class="supplier_products_status-badge" :class="product.stockStatus.toLowerCase().replace(' ', '-')">
                <span class="supplier_products_status-dot"></span>
                {{ product.stockStatus }}
              </span>
            </div>
            <div class="supplier_products_tile-content">
              <span class="supplier_products_tile-category">{{ product.category_name }} · {{ product.sku || "No SKU" }}</span>
              <h3>{{ product.product_name }}</h3>
              <div class="supplier_products_tile-details">
                <span><small>Price</small><strong>{{ formatPrice(product.price) }}</strong></span>
                <span><small>Stock</small><strong>{{ Number(product.quantity).toLocaleString() }} units</strong></span>
              </div>
              <div class="supplier_products_tile-actions">
                <RouterLink :to="`/products/view/${product.product_id}`" class="supplier_products_tile-view">View product</RouterLink>
                <RouterLink :to="`/products/edit/${product.product_id}`" class="supplier_products_tile-edit">Edit product</RouterLink>
                <button class="supplier_products_icon-button" type="button" aria-label="Duplicate product" @click="duplicate(product)" :disabled="duplicatingProductId === product.product_id"><FontAwesomeIcon :icon="faCopy" /></button>
                <button class="supplier_products_icon-button" type="button" aria-label="Delete product"
                  :disabled="deletingProductId === product.product_id" @click="deleteProduct(product)">
                  <FontAwesomeIcon :icon="faTrashCan" />
                </button>
              </div>
            </div>
          </article>
          <div v-if="filteredProducts.length === 0" class="supplier_products_no-results"><strong>{{ searchQuery || selectedStatus !== "All" ? "No products match your filters" : "Your catalog is empty" }}</strong><br /><span>{{ searchQuery || selectedStatus !== "All" ? "Try clearing your search or stock filter." : "Add your first product to start building your catalog." }}</span></div>
        </div>

        <footer class="supplier_products_card-footer">
          <span>Showing {{ pageStart }}-{{ pageEnd }} of {{ filteredProducts.length }}</span>
          <div class="supplier_products_pagination">
            <button type="button" class="supplier_products_pagination-button" :disabled="currentPage === 1" aria-label="Previous page" @click="goToPage(currentPage - 1)">‹</button>
            <button v-for="page in totalPages" :key="page" type="button" class="supplier_products_pagination-button" :class="{ 'supplier_products_pagination-button--current': currentPage === page }" :aria-current="currentPage === page ? 'page' : undefined" @click="goToPage(page)">{{ page }}</button>
            <button type="button" class="supplier_products_pagination-button" :disabled="currentPage === totalPages" aria-label="Next page" @click="goToPage(currentPage + 1)">›</button>
          </div>
        </footer>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { RouterLink } from "vue-router";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useSupplierData } from "@/data/supplierData";
import {
  faCube, faList, faMagnifyingGlass, faPen, faPlus,
  faTableCells, faTrashCan, faEye, faCopy
} from "@fortawesome/free-solid-svg-icons";

const { products, removeProduct, duplicateProduct, updateProductStock, loading, error: dataError } = useSupplierData();

const searchQuery = ref("");
const currentPage = ref(1);
const selectedProductIds = ref([]);
const pageSize = 10;
const sortBy = ref("name");
const sortDirection = ref("asc");
const selectedStatus = ref("All");
const selectedCatalog = ref("Active");
const viewMode = ref("list");
const deletingProductId = ref(null);
const duplicatingProductId = ref(null);
const categoryFilter = ref("All");
const minPrice = ref("");
const maxPrice = ref("");
const minStock = ref("");
const maxStock = ref("");
const error = ref("");
const categoryOptions = computed(() => ["All", ...new Set(products.value.map((product) => product.category_name).filter(Boolean).sort())]);
const advancedFiltersOpen = ref(false);
const statusFilters = [
  { label: "All products", value: "All" },
  { label: "In stock", value: "In stock" },
  { label: "Low stock", value: "Low stock" },
  { label: "Out of stock", value: "Out of stock" }
];

const filteredProducts = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  const list = products.value.filter((product) => {
    const searchable = [product.product_name, product.category_name, product.sku]
      .filter(Boolean).map(String).join(" ").toLowerCase();
    return (!query || searchable.includes(query)) &&
      (selectedStatus.value === "All" || product.stockStatus === selectedStatus.value) &&
      (selectedCatalog.value === "All" || (product.catalog_status || "Active") === selectedCatalog.value) &&
      (categoryFilter.value === "All" || product.category_name === categoryFilter.value) &&
      (minPrice.value === "" || Number(product.price) >= Number(minPrice.value)) &&
      (maxPrice.value === "" || Number(product.price) <= Number(maxPrice.value)) &&
      (minStock.value === "" || Number(product.quantity) >= Number(minStock.value)) &&
      (maxStock.value === "" || Number(product.quantity) <= Number(maxStock.value));
  });
  return [...list].sort((a, b) => {
    let left, right;
    if (sortBy.value === "price") {
      left = Number(a.price || 0); right = Number(b.price || 0);
    } else if (sortBy.value === "stock") {
      left = Number(a.quantity || 0); right = Number(b.quantity || 0);
    } else {
      left = String(a.product_name || "").toLowerCase();
      right = String(b.product_name || "").toLowerCase();
    }
    const result = left < right ? -1 : left > right ? 1 : 0;
    return sortDirection.value === "asc" ? result : -result;
  });
});

const totalPages = computed(() => Math.max(1, Math.ceil(filteredProducts.value.length / pageSize)));
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredProducts.value.slice(start, start + pageSize);
});
const pageStart = computed(() => filteredProducts.value.length ? (currentPage.value - 1) * pageSize + 1 : 0);
const pageEnd = computed(() => Math.min(currentPage.value * pageSize, filteredProducts.value.length));
const allVisibleSelected = computed(() => paginatedProducts.value.length > 0 && paginatedProducts.value.every((product) => selectedProductIds.value.includes(product.product_id)));

function toggleSelectAll(event) {
  const ids = paginatedProducts.value.map((product) => product.product_id);
  if (event.target.checked) selectedProductIds.value = [...new Set([...selectedProductIds.value, ...ids])];
  else selectedProductIds.value = selectedProductIds.value.filter((id) => !ids.includes(id));
}
function clearSelection() { selectedProductIds.value = []; }
function handleImageError(event) { event.target.style.display = "none"; }
async function bulkStock() {
  const value = window.prompt("Enter the new stock quantity for all selected products:");
  if (value === null) return;
  const quantity = Number(value);
  if (!Number.isInteger(quantity) || quantity < 0) { error.value = "Stock must be a non-negative whole number."; return; }
  try { for (const id of selectedProductIds.value) await updateProductStock(id, quantity); clearSelection(); }
  catch (err) { error.value = err.message || "Unable to update stock."; }
}
async function bulkArchive() {
  if (!window.confirm("Archive " + selectedProductIds.value.length + " selected product(s)?")) return;
  try { for (const id of selectedProductIds.value) await removeProduct(id); clearSelection(); }
  catch (err) { error.value = err.message || "Unable to archive selected products."; }
}
function goToPage(page) {
  currentPage.value = Math.min(Math.max(1, page), totalPages.value);
}
watch([searchQuery, selectedStatus, selectedCatalog, sortBy, sortDirection, categoryFilter, minPrice, maxPrice, minStock, maxStock], () => { currentPage.value = 1; });

function toggleSort(field) {
  if (sortBy.value === field) sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  else { sortBy.value = field; sortDirection.value = "asc"; }
}
function clearAdvancedFilters() { categoryFilter.value = "All"; minPrice.value = ""; maxPrice.value = ""; minStock.value = ""; maxStock.value = ""; }
async function duplicate(product) { duplicatingProductId.value = product.product_id; error.value = ""; try { const created = await duplicateProduct(product.product_id); await Swal.fire({ title: "Product duplicated", text: `${created.product_name} was added to your catalog.`, icon: "success", toast: true, position: "top-end", timer: 2200, showConfirmButton: false }); } catch (err) { error.value = err.message || "Unable to duplicate product."; } finally { duplicatingProductId.value = null; } }
function csvEscape(value) { const text = value === null || value === undefined ? "" : String(value); return `"${text.replace(/"/g, '""')}"`; }
function exportCsv() { const rows = filteredProducts.value.map((product) => [product.product_id, product.product_name, product.sku || "", product.category_name || "", product.price, product.quantity, product.stockStatus]); const csv = [["Product ID","Product Name","SKU","Category","Price","Stock","Status"], ...rows].map((row) => row.map(csvEscape).join(",")).join("
"); const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = "products-export.csv"; link.click(); URL.revokeObjectURL(url); }
function formatPrice(price) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(Number(price || 0));
}
async function restoreProduct(product) {
  error.value = "";
  try { await fetch(`/api/products/${product.product_id}/restore`, { method: "POST", headers: { Authorization: `Bearer ${localStorage.getItem("weconnect_token")}` } }); await import("@/data/supplierData").then(m => m.loadSupplierData(true)); } catch (err) { error.value = err.message || "Unable to restore product."; }
}

async function deleteProduct(product) {
  const result = await Swal.fire({
    title: "Delete product?",
    text: `Are you sure you want to delete "${product.product_name}"?`,
    icon: "warning", showCancelButton: true,
    confirmButtonText: "Delete product", cancelButtonText: "Keep product",
    reverseButtons: true
  });
  if (!result.isConfirmed) return;
  deletingProductId.value = product.product_id;
  error.value = "";
  try {
    await removeProduct(product.product_id);
    await Swal.fire({ title: "Product deleted", text: `${product.product_name} was removed from your catalog.`, icon: "success", toast: true, position: "top-end", timer: 2200, showConfirmButton: false });
  } catch (err) {
    error.value = err.message || "Unable to delete the product.";
    await Swal.fire({ title: "Delete failed", text: error.value, icon: "error" });
  } finally {
    deletingProductId.value = null;
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.supplier_products_products-page {
  min-height: 100vh;
  padding: clamp(18px, 3vw, 30px) clamp(14px, 3vw, 30px) 48px;
  background: #f7f5f2;
  color: #4d3933;
  font-family: Arial, Helvetica, sans-serif;
}

.supplier_products_main-content {
  max-width: 1280px;
  margin: 0 auto;
}

.supplier_products_page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 20px;
}

.supplier_products_page-header h1,
.supplier_products_card-heading h2 {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  color: #44312c;
}

.supplier_products_page-header h1 {
  font-size: clamp(25px, 3vw, 32px);
  line-height: 1.15;
}

.supplier_products_page-header p {
  margin: 5px 0 0;
  color: #85736d;
  font-size: 14px;
}

.supplier_products_add-product-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 17px;
  border-radius: 9px;
  background: #e17b3d;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
}

 .supplier_products_export-button { border: 1px solid #dfd3cb; border-radius: 9px; background: #fff; color: #684d45; padding: 10px 14px; font-weight: 700; cursor: pointer; }
.supplier_products_export-button:hover { border-color: #c9631f; color: #c9631f; }
.supplier_products_advanced-button { border: 1px solid #e7e0db; border-radius: 8px; background: #fff; color: #685750; padding: 8px 12px; font-weight: 700; cursor: pointer; }
.supplier_products_advanced-panel { display: flex; flex-wrap: wrap; align-items: end; gap: 12px; padding: 13px 20px; background: #faf8f6; border-bottom: 1px solid #eeeae7; }
.supplier_products_advanced-panel label { display: flex; flex-direction: column; gap: 5px; color: #8a7971; font-size: 11px; font-weight: 700; }
.supplier_products_advanced-panel input, .supplier_products_advanced-panel select { min-width: 130px; height: 34px; border: 1px solid #e4ded9; border-radius: 7px; background: #fff; padding: 0 8px; color: #57453e; }
.supplier_products_add-product-button:hover {
  background: #ce6930;
}

.supplier_products_products-card {
  overflow: hidden;
  border: 1px solid #e5dfda;
  border-radius: 13px;
  background: #fff;
  box-shadow: 0 7px 20px rgba(75, 56, 48, .06);
}

.supplier_products_card-heading {
  padding: 16px 20px 14px;
  border-bottom: 1px solid #eeeae7;
}

.supplier_products_card-heading h2 {
  font-size: 17px;
}

.supplier_products_controls {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 13px 20px;
  border-bottom: 1px solid #eeeae7;
}

.supplier_products_search-container {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 368px;
  height: 38px;
  padding: 0 12px;
  border: 1px solid #e4ded9;
  border-radius: 8px;
  background: #faf9f7;
  color: #b2a7a1;
}

.supplier_products_search-container input {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: #57453e;
  font-size: 13px;
}

.supplier_products_status-filters {
  display: flex;
  gap: 8px;
}

.supplier_products_filter-button,
.supplier_products_view-button {
  border: 1px solid #e7e0db;
  background: #fff;
  color: #685750;
  cursor: pointer;
}

.supplier_products_filter-button {
  padding: 8px 14px;
  border-radius: 18px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.supplier_products_filter-button--active {
  border-color: #684b41;
  background: #684b41;
  color: #fff;
}

.supplier_products_result-count {
  margin-left: auto;
  color: #aa9a92;
  font-size: 12px;
  white-space: nowrap;
}

.supplier_products_view-toggle {
  display: flex;
  gap: 2px;
  padding: 3px;
  border: 1px solid #e7e0db;
  border-radius: 8px;
}

.supplier_products_view-button {
  width: 30px;
  height: 28px;
  border: 0;
  border-radius: 5px;
  color: #aa9c95;
}

.supplier_products_view-button--active {
  background: #f1eeeb;
  color: #69534a;
}

.supplier_products_table-container {
  overflow-x: auto;
}

.supplier_products_product-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  padding: 20px;
  background: #faf9f7;
}

.supplier_products_product-tile {
  overflow: hidden;
  border: 1px solid #e8e1dc;
  border-radius: 11px;
  background: #fff;
}

.supplier_products_tile-image {
  position: relative;
  height: 150px;
  background: #f1ebe5;
}

.supplier_products_tile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.supplier_products_tile-image .supplier_products_status-badge {
  position: absolute;
  top: 10px;
  right: 10px;
}

.supplier_products_tile-content {
  padding: 15px;
}

.supplier_products_tile-category {
  color: #a08f87;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .4px;
}

.supplier_products_tile-content h3 {
  margin: 6px 0 15px;
  color: #4b3934;
  font: 700 17px Georgia, "Times New Roman", serif;
}

.supplier_products_tile-details {
  display: flex;
  gap: 28px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0ece9;
}

.supplier_products_tile-details span small,
.supplier_products_tile-details span strong {
  display: block;
}

.supplier_products_tile-details small {
  margin-bottom: 4px;
  color: #a08f87;
  font-size: 10px;
}

.supplier_products_tile-details strong {
  color: #5b453c;
  font-size: 13px;
}

.supplier_products_tile-actions {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  padding-top: 13px;
}

.supplier_products_tile-view,
.supplier_products_tile-edit {
  color: #c9631f;
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
}

.supplier_products_tile-view {
  padding: 7px 10px;
  border: 1px solid #e7e0d8;
  border-radius: 7px;
  color: #684d45;
}

.supplier_products_tile-view:hover,
.supplier_products_tile-edit:hover {
  color: #c9631f;
}

.supplier_products_product-grid .supplier_products_no-results {
  grid-column: 1 / -1;
  border-bottom: 0;
}

table {
  width: 100%;
  min-width: 900px;
  border-collapse: collapse;
}

th {
  padding: 12px 20px;
  border-bottom: 1px solid #eeeae7;
  color: #a08f87;
  font-size: 11px;
  font-weight: 700;
  text-align: left;
  text-transform: none;
}

th span {
  color: #c0b4ae;
  font-size: 9px;
}

td {
  padding: 13px 20px;
  border-bottom: 1px solid #f1eeeb;
  color: #675851;
  font-size: 13px;
}

tbody tr:hover {
  background: #fdfcfb;
}

.supplier_products_product-cell {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #4b3934;
}

.supplier_products_product-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 8px;
  background: #f1ebe5;
  color: #c78a57;
  font-size: 16px;
  overflow: hidden;
}
.supplier_products_product-icon img { width: 100%; height: 100%; object-fit: cover; }
.supplier_products_checkbox-cell { width: 42px; text-align: center; }
.supplier_products_checkbox-cell input { width: 15px; height: 15px; cursor: pointer; }
.supplier_products_sku { font-family: monospace; font-size: 12px; }
.supplier_products_bulk-bar { display: flex; align-items: center; gap: 9px; padding: 10px 20px; background: #f7f2ee; border-bottom: 1px solid #eadfd8; }
.supplier_products_bulk-bar button, .supplier_products_clear-filters { border: 1px solid #dfd3cb; border-radius: 7px; background: #fff; color: #684d45; padding: 7px 10px; font-size: 11px; font-weight: 700; cursor: pointer; }
.supplier_products_bulk-bar button:hover, .supplier_products_clear-filters:hover { border-color: #c9631f; color: #c9631f; }
.supplier_products_clear-filters { margin-left: auto; white-space: nowrap; }

.supplier_products_status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 16px;
  font-size: 11px;
  font-weight: 700;
}

.supplier_products_status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.supplier_products_in-stock {
  background: #e6f3e9;
  color: #3b8955;
}

.supplier_products_low-stock {
  background: #fff2dc;
  color: #b57725;
}

.supplier_products_out-of-stock {
  background: #fae5e1;
  color: #b85043;
}

.supplier_products_actions {
  display: flex;
  justify-content: flex-end;
  gap: 7px;
}

.supplier_products_icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 33px;
  height: 33px;
  border: 1px solid #ebe4df;
  border-radius: 8px;
  background: #fff;
  color: #8a7971;
  cursor: pointer;
  text-decoration: none;
}

.supplier_products_icon-button:hover {
  border-color: #cdbeb5;
  color: #563f37;
}

.supplier_products_icon-button:disabled {
  opacity: .45;
  cursor: not-allowed;
}

.supplier_products_no-results {
  padding: 34px;
  text-align: center;
  color: #a08f87;
}

.supplier_products_card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  color: #aa9a92;
  font-size: 12px;
}

.supplier_products_pagination {
  display: flex;
  gap: 5px;
}

.supplier_products_pagination-button {
  width: 31px;
  height: 31px;
  border: 1px solid #eee8e4;
  border-radius: 7px;
  background: #fff;
  color: #b8aaa4;
  font-size: 18px;
  cursor: pointer;
}

.supplier_products_pagination-button--current {
  border-color: #60453d;
  background: #60453d;
  color: #fff;
  font-size: 13px;
}

.supplier_products_pagination-button:disabled {
  cursor: not-allowed;
  opacity: .55;
}

.supplier_products_message {
  margin: 12px 20px;
  padding: 10px 12px;
  border-radius: 7px;
  background: #fae5e1;
  color: #b85043;
  font-size: 13px;
}

.supplier_products_sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 900px) {
  .supplier_products_controls {
    flex-wrap: wrap;
  }

  .supplier_products_search-container {
    flex: 1 1 250px;
  }

  .supplier_products_result-count {
    margin-left: 0;
  }

  .supplier_products_product-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .supplier_products_products-page .supplier_products_page-header {
    flex-direction: column;
    gap: 14px;
  }

  .supplier_products_add-product-button {
    align-self: flex-start;
  }

  .supplier_products_controls {
    align-items: stretch;
    flex-wrap: wrap;
  }

  .supplier_products_search-container {
    width: 100%;
    flex-basis: 100%;
  }

  .supplier_products_status-filters {
    max-width: 100%;
    overflow-x: auto;
    padding-bottom: 2px;
  }
}

@media (max-width: 600px) {
  .supplier_products_products-page {
    padding: 18px 14px 32px;
  }

  .supplier_products_page-header {
    flex-direction: column;
  }

  .supplier_products_add-product-button {
    align-self: stretch;
    justify-content: center;
  }

  .supplier_products_controls {
    align-items: stretch;
    padding: 12px 14px;
  }

  .supplier_products_search-container {
    width: 100%;
  }

  .supplier_products_status-filters {
    width: 100%;
    overflow-x: auto;
  }

  .supplier_products_product-grid {
    grid-template-columns: 1fr;
    padding: 14px;
  }

  .supplier_products_result-count {
    margin-right: auto;
  }

  .supplier_products_card-heading,
  .supplier_products_card-footer {
    padding-left: 14px;
    padding-right: 14px;
  }

  th,
  td {
    padding-left: 14px;
    padding-right: 14px;
  }
}
</style>

<style scoped> .catalog-badge{display:inline-block;padding:4px 8px;border-radius:12px;background:#e8f4e8;color:#3f7d4d;font-size:10px;font-weight:700}.catalog-badge--archived{background:#eee9e6;color:#786860}.supplier_products_catalog-filter{padding:0 20px 12px}.supplier_products_catalog-filter label{font-size:11px;font-weight:700;color:#897870}.supplier_products_catalog-filter select{margin-left:8px;border:1px solid #e4ded9;border-radius:7px;padding:6px 9px;background:#fff}</style>
