<template>
  <div class="main-content">
    <header class="page-header">
      <div>
        <h1>Browse suppliers</h1>
        <p class="subtitle">Find and compare large suppliers for the products you need.</p>
      </div>
      <div class="search-box">
        <input v-model="searchQuery" type="text" placeholder="Search suppliers or products..." />
      </div>
    </header>

    <!-- Filters -->
    <div class="filters card">
      <div class="filter-group">
        <label>Category</label>
        <select v-model="selectedCategory">
          <option value="">All categories</option>
          <option v-for="c in categories" :key="c.categoryId" :value="c.categoryId">
            {{ c.name }}
          </option>
        </select>
      </div>

      <label class="checkbox-filter">
        <input type="checkbox" v-model="verifiedOnly" />
        Verified only
      </label>

      <label class="checkbox-filter">
        <input type="checkbox" v-model="quickDeliveryOnly" />
        Quick delivery
      </label>
    </div>

    <p class="results-count">
      {{ loading ? "Loading suppliers..." : `Showing ${suppliers.length} supplier${suppliers.length === 1 ? "" : "s"}` }}
    </p>

    <!-- Supplier cards -->
    <div class="supplier-grid">
      <div class="card supplier-card" v-for="s in suppliers" :key="s.supplierId">
        <div class="supplier-top">
          <div class="supplier-initials">{{ initials(s.companyName) }}</div>
          <span v-if="s.isVerified" class="verified-tag">Verified</span>
        </div>
        <h3>{{ s.companyName }}</h3>
        <p class="location">{{ s.city }}</p>
        <p class="description">{{ s.description || "No business description added yet." }}</p>
        <div class="supplier-footer">
          <span v-if="s.quickDelivery" class="delivery-tag">Quick delivery</span>
          <button class="btn-primary btn-small">View products</button>
        </div>
      </div>

      <p v-if="!loading && suppliers.length === 0" class="empty-state">
        No suppliers match your filters. Try adjusting your search or category.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import api from "../services/api";

const searchQuery = ref("");
const selectedCategory = ref("");
const verifiedOnly = ref(false);
const quickDeliveryOnly = ref(false);

const categories = ref([
  { categoryId: 1, name: "Agricultural Inputs" },
  { categoryId: 2, name: "Equipment & Machinery Parts" },
  { categoryId: 3, name: "Packaging & Supplies" },
]);

// Filtering now happens server-side (search/category/verifiedOnly/quickDelivery
// are all sent as query params) since suppliers no longer carries a categoryId
// field to filter against client-side - see suppliers.js for why.
const suppliers = ref([]);
const loading = ref(false);

async function loadSuppliers() {
  loading.value = true;
  try {
    const { data } = await api.get("/suppliers", {
      params: {
        search: searchQuery.value || undefined,
        category: selectedCategory.value || undefined,
        verifiedOnly: verifiedOnly.value ? "true" : undefined,
        quickDelivery: quickDeliveryOnly.value ? "true" : undefined,
      },
    });
    suppliers.value = data;
  } catch (err) {
    console.error("Failed to load suppliers:", err);
    suppliers.value = [];
  } finally {
    loading.value = false;
  }
}

// Debounced so typing in the search box doesn't fire a request per keystroke.
let debounceTimer = null;
watch([searchQuery, selectedCategory, verifiedOnly, quickDeliveryOnly], () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(loadSuppliers, 300);
});

function initials(name) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

onMounted(loadSuppliers);
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}
.subtitle {
  color: var(--color-text-muted);
  font-size: 14px;
  margin: 4px 0 0;
}
.search-box input {
  width: 260px;
}

.filters {
  display: flex;
  align-items: flex-end;
  gap: 24px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 220px;
}
.filter-group label {
  font-size: 13px;
  color: var(--color-text-muted);
}
.checkbox-filter {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--color-text);
}
.checkbox-filter input {
  width: auto;
}

.results-count {
  color: var(--color-text-muted);
  font-size: 13px;
  margin: 0 0 16px;
}

.supplier-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}
.supplier-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.supplier-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.supplier-initials {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-accent-soft);
  color: var(--color-accent);
  font-weight: 700;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.verified-tag {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 20px;
  background: #E3F2E7;
  color: var(--color-success);
}
.supplier-card h3 {
  font-size: 15px;
}
.location {
  font-size: 12px;
  color: var(--color-text-muted);
  margin: 0;
}
.description {
  font-size: 13px;
  color: var(--color-text-muted);
  margin: 0;
  flex: 1;
}
.supplier-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}
.delivery-tag {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 20px;
  background: var(--color-accent-soft);
  color: var(--color-accent);
}
.btn-small {
  padding: 6px 12px;
  font-size: 12px;
}
.empty-state {
  color: var(--color-text-muted);
  font-size: 14px;
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px 0;
}
</style>