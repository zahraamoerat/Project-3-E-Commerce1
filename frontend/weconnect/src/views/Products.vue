<template>
  <div class="supplier_products_products-page">
    <main class="supplier_products_main-content">
      <header class="supplier_products_page-header">
        <div>
          <h1>Products</h1>
          <p>Manage your product catalog and pricing.</p>
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
          <label class="supplier_products_search-container">
            <FontAwesomeIcon :icon="faMagnifyingGlass" />
            <span class="supplier_products_sr-only">Search products</span>
            <input v-model="searchQuery" type="text" placeholder="Search products..." />
          </label>

          <div class="supplier_products_status-filters" aria-label="Filter products by stock">
            <button v-for="filter in statusFilters" :key="filter.value" type="button" class="supplier_products_filter-button"
              :class="{ 'filter-button--active': selectedStatus === filter.value }"
              @click="selectedStatus = filter.value">
              {{ filter.label }}
            </button>
          </div>

          <span class="supplier_products_result-count">{{ filteredProducts.length }} result<span
              v-if="filteredProducts.length !== 1">s</span></span>

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

        <div v-if="dataError" class="supplier_products_message supplier_products_error">{{ dataError }}</div><div v-if="dataError" class="supplier_products_message supplier_products_error">{{ dataError }}</div><div v-if="error" class="supplier_products_message supplier_products_error">{{ error }}</div><div v-if="loading" class="supplier_products_message">Loading products…</div><div v-if="loading" class="supplier_products_message">Loading products…</div>

        <div v-if="viewMode === 'list'" class="supplier_products_table-container">
          <table>
            <thead>
              <tr>
                <th><button type="button" class="supplier_products_sort-heading" @click="toggleSort('name')">Product <span>↕</span></button></th>
                <th>Category</th>
                <th><button type="button" class="supplier_products_sort-heading" @click="toggleSort('price')">Price <span>↕</span></button></th>
                <th><button type="button" class="supplier_products_sort-heading" @click="toggleSort('stock')">Stock <span>↕</span></button></th>
                <th>Status <span>▲</span></th>
                <th><span class="supplier_products_sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in filteredProducts" :key="product.product_id">
                <td class="supplier_products_product-cell">
                  <span class="supplier_products_product-icon">
                    <FontAwesomeIcon :icon="faCube" />
                  </span>
                  <strong>{{ product.product_name }}</strong>
                </td>
                <td>{{ product.category_name }}</td>
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
                  <button class="supplier_products_icon-button" type="button" aria-label="Delete product"
                    :disabled="deletingProductId === product.product_id" @click="deleteProduct(product)">
                    <FontAwesomeIcon :icon="faTrashCan" />
                  </button>
                </td>
              </tr>
              <tr v-if="filteredProducts.length === 0">
                <td colspan="6" class="supplier_products_no-results">No products found.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="supplier_products_product-grid">
          <article v-for="product in filteredProducts" :key="product.product_id" class="supplier_products_product-tile">
            <div class="supplier_products_tile-image">
              <img :src="product.image" :alt="product.product_name" />
              <span class="supplier_products_status-badge" :class="product.stockStatus.toLowerCase().replace(' ', '-')">
                <span class="supplier_products_status-dot"></span>
                {{ product.stockStatus }}
              </span>
            </div>
            <div class="supplier_products_tile-content">
              <span class="supplier_products_tile-category">{{ product.category_name }}</span>
              <h3>{{ product.product_name }}</h3>
              <div class="supplier_products_tile-details">
                <span><small>Price</small><strong>{{ formatPrice(product.price) }}</strong></span>
                <span><small>Stock</small><strong>{{ Number(product.quantity).toLocaleString() }} units</strong></span>
              </div>
              <div class="supplier_products_tile-actions">
                <RouterLink :to="`/products/view/${product.product_id}`" class="supplier_products_tile-view">View product</RouterLink>
                <RouterLink :to="`/products/edit/${product.product_id}`" class="supplier_products_tile-edit">Edit product</RouterLink>
                <button class="supplier_products_icon-button" type="button" aria-label="Delete product"
                  :disabled="deletingProductId === product.product_id" @click="deleteProduct(product)">
                  <FontAwesomeIcon :icon="faTrashCan" />
                </button>
              </div>
            </div>
          </article>
          <div v-if="filteredProducts.length === 0" class="supplier_products_no-results">No products found.</div>
        </div>

        <footer class="supplier_products_card-footer">
          <span>Showing {{ filteredProducts.length ? `1-${filteredProducts.length}` : "0" }} of {{
            filteredProducts.length }}</span>
          <div class="supplier_products_pagination">
            <button type="button" class="supplier_products_pagination-button" disabled aria-label="Previous page">‹</button>
            <button type="button" class="supplier_products_pagination-button supplier_products_pagination-button--current">1</button>
            <button type="button" class="supplier_products_pagination-button" disabled aria-label="Next page">›</button>
          </div>
        </footer>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { RouterLink } from "vue-router";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useSupplierData } from "@/data/supplierData";
import {
  faCube, faList, faMagnifyingGlass, faPen, faPlus,
  faTableCells, faTrashCan, faEye
} from "@fortawesome/free-solid-svg-icons";

const { products, removeProduct, loading, error: dataError } = useSupplierData();
const searchQuery = ref("");
const sortBy = ref("name");
const sortDirection = ref("asc");
const selectedStatus = ref("All");
const sortBy = ref("name");
const sortDirection = ref("asc");
const viewMode = ref("list");
const deletingProductId = ref(null);
const error = ref("");
function toggleSort(field) { if (sortBy.value === field) sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc"; else { sortBy.value = field; sortDirection.value = "asc"; } }

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
      (selectedStatus.value === "All" || product.stockStatus === selectedStatus.value);
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

function toggleSort(field) {
  if (sortBy.value === field) sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  else { sortBy.value = field; sortDirection.value = "asc"; }
}
function formatPrice(price) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(Number(price || 0));
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
  min-width: 760px;
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
}

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
