<template>
  <div class="products-page">
    <main class="main-content">
      <header class="page-header">
        <div>
          <h1>Products</h1>
          <p>Manage your product catalog and pricing.</p>
        </div>
        <RouterLink to="/products/add" class="add-product-button">
          <FontAwesomeIcon :icon="faPlus" />
          Add product
        </RouterLink>
      </header>

      <section class="products-card">
        <div class="card-heading">
          <h2>All products</h2>
        </div>

        <div class="controls">
          <label class="search-container">
            <FontAwesomeIcon :icon="faMagnifyingGlass" />
            <span class="sr-only">Search products</span>
            <input v-model="searchQuery" type="text" placeholder="Search products..." />
          </label>

          <div class="status-filters" aria-label="Filter products by stock">
            <button v-for="filter in statusFilters" :key="filter.value" type="button" class="filter-button"
              :class="{ 'filter-button--active': selectedStatus === filter.value }"
              @click="selectedStatus = filter.value">
              {{ filter.label }}
            </button>
          </div>

          <span class="result-count">{{ filteredProducts.length }} result<span
              v-if="filteredProducts.length !== 1">s</span></span>

          <div class="view-toggle" aria-label="Product view">
            <button type="button" class="view-button" :class="{ 'view-button--active': viewMode === 'list' }"
              :aria-pressed="viewMode === 'list'" aria-label="List view" @click="viewMode = 'list'">
              <FontAwesomeIcon :icon="faList" />
            </button>
            <button type="button" class="view-button" :class="{ 'view-button--active': viewMode === 'grid' }"
              :aria-pressed="viewMode === 'grid'" aria-label="Grid view" @click="viewMode = 'grid'">
              <FontAwesomeIcon :icon="faTableCells" />
            </button>
          </div>
        </div>

        <div v-if="error" class="message error">{{ error }}</div>

        <div v-if="viewMode === 'list'" class="table-container">
          <table>
            <thead>
              <tr>
                <th>Product <span>▲</span></th>
                <th>Category <span>▲</span></th>
                <th>Price <span>▲</span></th>
                <th>Stock <span>▲</span></th>
                <th>Status <span>▲</span></th>
                <th><span class="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in filteredProducts" :key="product.product_id">
                <td class="product-cell">
                  <span class="product-icon">
                    <FontAwesomeIcon :icon="faCube" />
                  </span>
                  <strong>{{ product.product_name }}</strong>
                </td>
                <td>{{ product.category_name }}</td>
                <td>{{ formatPrice(product.price) }}</td>
                <td>{{ Number(product.quantity).toLocaleString() }} units</td>
                <td>
                  <span class="status-badge" :class="product.stockStatus.toLowerCase().replace(' ', '-')">
                    <span class="status-dot"></span>
                    {{ product.stockStatus }}
                  </span>
                </td>
                <td class="actions">
                  <RouterLink :to="`/products/view/${product.product_id}`" class="icon-button"
                    aria-label="View product">
                    <FontAwesomeIcon :icon="faEye" />
                  </RouterLink>
                  <RouterLink :to="`/products/edit/${product.product_id}`" class="icon-button"
                    aria-label="Edit product">
                    <FontAwesomeIcon :icon="faPen" />
                  </RouterLink>
                  <button class="icon-button" type="button" aria-label="Delete product"
                    :disabled="deletingProductId === product.product_id" @click="deleteProduct(product)">
                    <FontAwesomeIcon :icon="faTrashCan" />
                  </button>
                </td>
              </tr>
              <tr v-if="filteredProducts.length === 0">
                <td colspan="6" class="no-results">No products found.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="product-grid">
          <article v-for="product in filteredProducts" :key="product.product_id" class="product-tile">
            <div class="tile-image">
              <img :src="product.image" :alt="product.product_name" />
              <span class="status-badge" :class="product.stockStatus.toLowerCase().replace(' ', '-')">
                <span class="status-dot"></span>
                {{ product.stockStatus }}
              </span>
            </div>
            <div class="tile-content">
              <span class="tile-category">{{ product.category_name }}</span>
              <h3>{{ product.product_name }}</h3>
              <div class="tile-details">
                <span><small>Price</small><strong>{{ formatPrice(product.price) }}</strong></span>
                <span><small>Stock</small><strong>{{ Number(product.quantity).toLocaleString() }} units</strong></span>
              </div>
              <div class="tile-actions">
                <RouterLink :to="`/products/view/${product.product_id}`" class="tile-view">View product</RouterLink>
                <RouterLink :to="`/products/edit/${product.product_id}`" class="tile-edit">Edit product</RouterLink>
                <button class="icon-button" type="button" aria-label="Delete product"
                  :disabled="deletingProductId === product.product_id" @click="deleteProduct(product)">
                  <FontAwesomeIcon :icon="faTrashCan" />
                </button>
              </div>
            </div>
          </article>
          <div v-if="filteredProducts.length === 0" class="no-results">No products found.</div>
        </div>

        <footer class="card-footer">
          <span>Showing {{ filteredProducts.length ? `1-${filteredProducts.length}` : "0" }} of {{
            filteredProducts.length }}</span>
          <div class="pagination">
            <button type="button" class="pagination-button" disabled aria-label="Previous page">‹</button>
            <button type="button" class="pagination-button pagination-button--current">1</button>
            <button type="button" class="pagination-button" disabled aria-label="Next page">›</button>
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
  faCube,
  faList,
  faMagnifyingGlass,
  faPen,
  faPlus,
  faTableCells,
  faTrashCan,
  faEye
} from "@fortawesome/free-solid-svg-icons";

const { products, removeProduct } = useSupplierData();

const searchQuery = ref("");
const selectedStatus = ref("All");
const viewMode = ref("list");
const deletingProductId = ref(null);
const error = ref("");

const statusFilters = [
  { label: "All products", value: "All" },
  { label: "In stock", value: "In stock" },
  { label: "Low stock", value: "Low stock" },
  { label: "Out of stock", value: "Out of stock" }
];

const filteredProducts = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();

  return products.value.filter((product) => {
    const matchesSearch = !query || [product.product_name, product.category_name]
      .some((value) => value.toLowerCase().includes(query));
    const matchesStatus = selectedStatus.value === "All" || product.stockStatus === selectedStatus.value;
    return matchesSearch && matchesStatus;
  });
});

function formatPrice(price) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0
  }).format(price);
}

async function deleteProduct(product) {
  const result = await Swal.fire({
    title: "Delete product?",
    text: `Are you sure you want to delete "${product.product_name}"?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Delete product",
    cancelButtonText: "Keep product",
    confirmButtonColor: "#b75347",
    cancelButtonColor: "#684b41",
    reverseButtons: true,
  });

  if (!result.isConfirmed) {
    return;
  }

  deletingProductId.value = product.product_id;
  removeProduct(product.product_id);
  deletingProductId.value = null;

  await Swal.fire({
    title: "Product deleted",
    text: `${product.product_name} was removed from your catalog.`,
    icon: "success",
    toast: true,
    position: "top-end",
    timer: 2600,
    showConfirmButton: false,
    timerProgressBar: true,
    confirmButtonColor: "#4d8a5c",
  });
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.products-page {
  min-height: 100vh;
  padding: clamp(18px, 3vw, 30px) clamp(14px, 3vw, 30px) 48px;
  background: #f7f5f2;
  color: #4d3933;
  font-family: Arial, Helvetica, sans-serif;
}

.main-content {
  max-width: 1280px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 20px;
}

.page-header h1,
.card-heading h2 {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  color: #44312c;
}

.page-header h1 {
  font-size: clamp(25px, 3vw, 32px);
  line-height: 1.15;
}

.page-header p {
  margin: 5px 0 0;
  color: #85736d;
  font-size: 14px;
}

.add-product-button {
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

.add-product-button:hover {
  background: #ce6930;
}

.products-card {
  overflow: hidden;
  border: 1px solid #e5dfda;
  border-radius: 13px;
  background: #fff;
  box-shadow: 0 7px 20px rgba(75, 56, 48, .06);
}

.card-heading {
  padding: 16px 20px 14px;
  border-bottom: 1px solid #eeeae7;
}

.card-heading h2 {
  font-size: 17px;
}

.controls {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 13px 20px;
  border-bottom: 1px solid #eeeae7;
}

.search-container {
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

.search-container input {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: #57453e;
  font-size: 13px;
}

.status-filters {
  display: flex;
  gap: 8px;
}

.filter-button,
.view-button {
  border: 1px solid #e7e0db;
  background: #fff;
  color: #685750;
  cursor: pointer;
}

.filter-button {
  padding: 8px 14px;
  border-radius: 18px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.filter-button--active {
  border-color: #684b41;
  background: #684b41;
  color: #fff;
}

.result-count {
  margin-left: auto;
  color: #aa9a92;
  font-size: 12px;
  white-space: nowrap;
}

.view-toggle {
  display: flex;
  gap: 2px;
  padding: 3px;
  border: 1px solid #e7e0db;
  border-radius: 8px;
}

.view-button {
  width: 30px;
  height: 28px;
  border: 0;
  border-radius: 5px;
  color: #aa9c95;
}

.view-button--active {
  background: #f1eeeb;
  color: #69534a;
}

.table-container {
  overflow-x: auto;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  padding: 20px;
  background: #faf9f7;
}

.product-tile {
  overflow: hidden;
  border: 1px solid #e8e1dc;
  border-radius: 11px;
  background: #fff;
}

.tile-image {
  position: relative;
  height: 150px;
  background: #f1ebe5;
}

.tile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.tile-image .status-badge {
  position: absolute;
  top: 10px;
  right: 10px;
}

.tile-content {
  padding: 15px;
}

.tile-category {
  color: #a08f87;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .4px;
}

.tile-content h3 {
  margin: 6px 0 15px;
  color: #4b3934;
  font: 700 17px Georgia, "Times New Roman", serif;
}

.tile-details {
  display: flex;
  gap: 28px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0ece9;
}

.tile-details span small,
.tile-details span strong {
  display: block;
}

.tile-details small {
  margin-bottom: 4px;
  color: #a08f87;
  font-size: 10px;
}

.tile-details strong {
  color: #5b453c;
  font-size: 13px;
}

.tile-actions {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  padding-top: 13px;
}

.tile-view,
.tile-edit {
  color: #c9631f;
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
}

.tile-view {
  padding: 7px 10px;
  border: 1px solid #e7e0d8;
  border-radius: 7px;
  color: #684d45;
}

.tile-view:hover,
.tile-edit:hover {
  color: #c9631f;
}

.product-grid .no-results {
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

.product-cell {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #4b3934;
}

.product-icon {
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

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 16px;
  font-size: 11px;
  font-weight: 700;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.in-stock {
  background: #e6f3e9;
  color: #3b8955;
}

.low-stock {
  background: #fff2dc;
  color: #b57725;
}

.out-of-stock {
  background: #fae5e1;
  color: #b85043;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 7px;
}

.icon-button {
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

.icon-button:hover {
  border-color: #cdbeb5;
  color: #563f37;
}

.icon-button:disabled {
  opacity: .45;
  cursor: not-allowed;
}

.no-results {
  padding: 34px;
  text-align: center;
  color: #a08f87;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  color: #aa9a92;
  font-size: 12px;
}

.pagination {
  display: flex;
  gap: 5px;
}

.pagination-button {
  width: 31px;
  height: 31px;
  border: 1px solid #eee8e4;
  border-radius: 7px;
  background: #fff;
  color: #b8aaa4;
  font-size: 18px;
  cursor: pointer;
}

.pagination-button--current {
  border-color: #60453d;
  background: #60453d;
  color: #fff;
  font-size: 13px;
}

.pagination-button:disabled {
  cursor: not-allowed;
  opacity: .55;
}

.message {
  margin: 12px 20px;
  padding: 10px 12px;
  border-radius: 7px;
  background: #fae5e1;
  color: #b85043;
  font-size: 13px;
}

.sr-only {
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
  .controls {
    flex-wrap: wrap;
  }

  .search-container {
    flex: 1 1 250px;
  }

  .result-count {
    margin-left: 0;
  }

  .product-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .products-page .page-header {
    flex-direction: column;
    gap: 14px;
  }

  .add-product-button {
    align-self: flex-start;
  }

  .controls {
    align-items: stretch;
    flex-wrap: wrap;
  }

  .search-container {
    width: 100%;
    flex-basis: 100%;
  }

  .status-filters {
    max-width: 100%;
    overflow-x: auto;
    padding-bottom: 2px;
  }
}

@media (max-width: 600px) {
  .products-page {
    padding: 18px 14px 32px;
  }

  .page-header {
    flex-direction: column;
  }

  .add-product-button {
    align-self: stretch;
    justify-content: center;
  }

  .controls {
    align-items: stretch;
    padding: 12px 14px;
  }

  .search-container {
    width: 100%;
  }

  .status-filters {
    width: 100%;
    overflow-x: auto;
  }

  .product-grid {
    grid-template-columns: 1fr;
    padding: 14px;
  }

  .result-count {
    margin-right: auto;
  }

  .card-heading,
  .card-footer {
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
