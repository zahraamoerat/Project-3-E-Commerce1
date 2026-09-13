<template>
  <div class="products-page">
    <main class="main-content">
      <header class="page-header">
        <div>
          <h1>Products</h1>
          <p>Manage your wholesale products and inventory.</p>
        </div>

        <RouterLink to="/add-products" class="add-product-button">
          + Add Product
        </RouterLink>
      </header>

      <section class="controls">
        <div class="search-container">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search products or SKU..."
          />
        </div>

        <select v-model="selectedStatus" class="filter-select">
          <option value="All">All Products</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </section>

      <div v-if="loading" class="message loading">
        Loading products...
      </div>

      <div v-else-if="error" class="message error">
        {{ error }}
      </div>

      <section v-else class="products-card">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>SKU</th>
                <th>CATEGORY</th>
                <th>PRICE</th>
                <th>STOCK</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="product in filteredProducts"
                :key="product.product_id"
              >
                <td class="product-name">
                  {{ product.product_name }}
                </td>

                <td>
                  {{ product.sku || "—" }}
                </td>

                <td>
                  {{ product.category_name || "Uncategorised" }}
                </td>

                <td>
                  {{ formatPrice(product.price) }}
                </td>

                <td>
                  {{ Number(product.quantity || 0) }}
                </td>

                <td>
                  <span
                    class="status-badge"
                    :class="
                      product.is_active
                        ? 'active'
                        : 'inactive'
                    "
                  >
                    {{
                      product.is_active
                        ? "Active"
                        : "Inactive"
                    }}
                  </span>
                </td>

                <td class="actions">
                  <RouterLink
                    :to="`/edit-product/${product.product_id}`"
                    class="edit-button"
                  >
                    Edit
                  </RouterLink>

                  <button
                    class="delete-button"
                    :disabled="
                      deletingProductId ===
                      product.product_id
                    "
                    @click="deleteProduct(product)"
                  >
                    {{
                      deletingProductId ===
                      product.product_id
                        ? "Deleting..."
                        : "Delete"
                    }}
                  </button>
                </td>
              </tr>

              <tr v-if="filteredProducts.length === 0">
                <td colspan="7" class="no-results">
                  No products found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { RouterLink } from "vue-router";
import { api } from "@/services/api";

const products = ref([]);
const searchQuery = ref("");
const selectedStatus = ref("All");

const loading = ref(true);
const error = ref("");

const deletingProductId = ref(null);

async function loadProducts() {
  loading.value = true;
  error.value = "";

  try {
    const data = await api.getProducts();

    products.value = Array.isArray(data)
      ? data
      : data.products || [];
  } catch (err) {
    console.error("Failed to load products:", err);

    error.value =
      err.message ||
      "Unable to load products. Please try again.";
  } finally {
    loading.value = false;
  }
}

const filteredProducts = computed(() => {
  const query =
    searchQuery.value
      .toLowerCase()
      .trim();

  return products.value.filter((product) => {
    const productName =
      (product.product_name || "").toLowerCase();

    const sku =
      (product.sku || "").toLowerCase();

    const category =
      (product.category_name || "").toLowerCase();

    const matchesSearch =
      !query ||
      productName.includes(query) ||
      sku.includes(query) ||
      category.includes(query);

    const isActive =
      Boolean(Number(product.is_active));

    const productStatus =
      isActive ? "Active" : "Inactive";

    const matchesStatus =
      selectedStatus.value === "All" ||
      productStatus === selectedStatus.value;

    return matchesSearch && matchesStatus;
  });
});

function formatPrice(price) {
  const numericPrice = Number(price || 0);

  return new Intl.NumberFormat(
    "en-ZA",
    {
      style: "currency",
      currency: "ZAR"
    }
  ).format(numericPrice);
}

async function deleteProduct(product) {
  const confirmed = window.confirm(
    `Are you sure you want to delete "${product.product_name}"?`
  );

  if (!confirmed) {
    return;
  }

  deletingProductId.value =
    product.product_id;

  error.value = "";

  try {
    await api.deleteProduct(
      product.product_id
    );

    products.value =
      products.value.filter(
        (item) =>
          item.product_id !==
          product.product_id
      );
  } catch (err) {
    console.error(
      "Failed to delete product:",
      err
    );

    error.value =
      err.message ||
      "Failed to delete product.";
  } finally {
    deletingProductId.value = null;
  }
}

onMounted(() => {
  loadProducts();
});
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.products-page {
  min-height: 100vh;
  background: #f6f4f1;
  color: #4b3934;
  font-family: Arial, Helvetica, sans-serif;
}

.main-content {
  max-width: 1500px;
  margin: 0 auto;
  padding-bottom: 40px;
}

.page-header {
  min-height: 120px;
  padding: 25px 40px;
  background: #f8f7f5;
  border-bottom: 1px solid #e8e4df;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.page-header h1 {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 32px;
  color: #44332f;
}

.page-header p {
  margin: 8px 0 0;
  color: #756a66;
}

.add-product-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  background: #d9824e;
  color: white;

  padding: 12px 20px;
  border-radius: 8px;

  text-decoration: none;
  font-weight: 700;
}

.add-product-button:hover {
  background: #c86f3e;
}

.controls {
  padding: 30px 40px;
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.search-container {
  flex: 1;
  min-width: 240px;
}

.search-container input,
.filter-select {
  width: 100%;
  height: 46px;

  border: 1px solid #ded9d5;
  border-radius: 8px;

  background: white;
  padding: 0 14px;

  font-size: 14px;
  color: #4b3934;
}

.filter-select {
  width: 180px;
}

.message {
  margin: 0 40px 20px;
  padding: 15px 18px;
  border-radius: 8px;
}

.loading {
  background: #fff7e8;
  color: #8a621f;
}

.error {
  background: #fde4df;
  color: #b73e26;
}

.products-card {
  margin: 0 40px;

  background: white;
  border: 1px solid #e4dfdb;
  border-radius: 16px;

  overflow: hidden;
}

.table-container {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  min-width: 900px;
  border-collapse: collapse;
}

thead {
  background: #faf9f7;
}

th {
  text-align: left;
  padding: 16px;
  font-size: 11px;
  letter-spacing: 0.5px;
  color: #756a66;
  border-bottom: 1px solid #e5e0dc;
}

td {
  padding: 18px 16px;
  border-bottom: 1px solid #eeeae7;
  color: #655b57;
}

tbody tr:hover {
  background: #faf8f6;
}

.product-name {
  color: #4b3934;
  font-weight: 700;
}

.status-badge {
  display: inline-flex;
  padding: 7px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
}

.status-badge.active {
  background: #e3f2e5;
  color: #32823d;
}

.status-badge.inactive {
  background: #fde4df;
  color: #b73e26;
}

.actions {
  display: flex;
  gap: 10px;
}

.edit-button,
.delete-button {
  border: none;
  border-radius: 7px;

  padding: 9px 14px;

  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  text-decoration: none;
}

.edit-button {
  background: #eee8e3;
  color: #4b3934;
}

.delete-button {
  background: #fde4df;
  color: #b73e26;
}

.delete-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.no-results {
  text-align: center;
  padding: 35px;
  color: #756a66;
}

@media (max-width: 700px) {
  .page-header {
    padding: 25px 20px;
    align-items: flex-start;
    flex-direction: column;
  }

  .controls {
    padding: 20px;
  }

  .filter-select {
    width: 100%;
  }

  .products-card {
    margin: 0 20px;
  }

  .message {
    margin: 0 20px 20px;
  }
}
</style>