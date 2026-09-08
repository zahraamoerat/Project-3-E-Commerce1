<template>
  <div class="stock-page">

    <!-- Main content -->
    <main class="main-content">

      <!-- Page header -->
      <header class="page-header">
        <div>
          <h1>Stock Management</h1>
          <p>Monitor inventory levels and set reorder alerts.</p>
        </div>

        <div class="search-container">
          <span class="search-icon">⌕</span>
          <input v-model="searchQuery" type="text" placeholder="Search wholesale items..." />
        </div>
      </header>

      <!-- Dashboard statistics -->
      <section class="stats-grid">

        <div class="stat-card">
          <div class="stat-label">TOTAL PRODUCTS LISTED</div>
          <div class="stat-value">{{ totalProducts }}</div>
          <div class="stat-description">
            Across 4 categories
          </div>
        </div>

        <div class="stat-card warning">
          <div class="stat-label">LOW STOCK ITEMS</div>
          <div class="stat-value">{{ lowStockCount }}</div>
          <div class="stat-description warning-text">
            Action recommended
          </div>
        </div>

        <div class="stat-card danger">
          <div class="stat-label">OUT OF STOCK</div>
          <div class="stat-value">{{ outOfStockCount }}</div>
          <div class="stat-description danger-text">
            Urgent restocking required
          </div>
        </div>

        <div class="stat-card warning">
          <div class="stat-label">REORDER PENDING</div>
          <div class="stat-value">{{ reorderPending }}</div>
          <div class="stat-description">
            Pending confirmation
          </div>
        </div>

      </section>

      <!-- Inventory table -->
      <section class="inventory-card">

        <div class="inventory-header">
          <h2>Product Inventory Matrix</h2>
        </div>

        <div class="table-container">
          <table>

            <thead>
              <tr>
                <th>PRODUCT NAME</th>
                <th>SKU</th>
                <th>CURRENT STOCK</th>
                <th>MINIMUM LEVEL</th>
                <th>STATUS</th>
                <th>LAST RESTOCKED</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>

              <tr v-for="product in filteredProducts" :key="product.sku">

                <td class="product-name">
                  {{ product.name }}
                </td>

                <td class="sku">
                  {{ product.sku }}
                </td>

                <td :class="{
                  'stock-warning': product.status === 'Low Stock',
                  'stock-danger': product.status === 'Out of Stock'
                }">
                  {{ product.stock }}
                </td>

                <td>
                  {{ product.minimum }}
                </td>

                <td>
                  <span class="status-badge" :class="getStatusClass(product.status)">
                    {{ product.status }}
                  </span>
                </td>

                <td>
                  {{ product.lastRestocked }}
                </td>

                <td>
                  <button class="restock-button" @click="restockProduct(product)">
                    Restock
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
import { ref, computed } from 'vue'

const searchQuery = ref('')

const products = ref([
  {
    name: 'Takeaway Containers (500ml)',
    sku: 'CFP-TAK-500',
    stock: '40 left',
    stockNumber: 40,
    minimum: '100 units',
    minimumNumber: 100,
    status: 'Low Stock',
    lastRestocked: '02 Oct 2026'
  },
  {
    name: 'Compostable Cups (250ml)',
    sku: 'CFP-CUP-250',
    stock: '1,200 units',
    stockNumber: 1200,
    minimum: '300 units',
    minimumNumber: 300,
    status: 'In Stock',
    lastRestocked: '24 Sep 2026'
  },
  {
    name: 'Cutlery Packs ×500',
    sku: 'CFP-CUT-500',
    stock: '860 units',
    stockNumber: 860,
    minimum: '200 units',
    minimumNumber: 200,
    status: 'In Stock',
    lastRestocked: '10 Oct 2026'
  },
  {
    name: 'Branded Paper Bags',
    sku: 'CFP-BAG-BRN',
    stock: '65 left',
    stockNumber: 65,
    minimum: '150 units',
    minimumNumber: 150,
    status: 'Low Stock',
    lastRestocked: '18 Sep 2026'
  },
  {
    name: 'Food-grade Cling Wrap',
    sku: 'CFP-CLG-FGD',
    stock: '0 units left',
    stockNumber: 0,
    minimum: '15 units',
    minimumNumber: 15,
    status: 'Out of Stock',
    lastRestocked: '05 Aug 2026'
  },
  {
    name: 'Napkin Bundles',
    sku: 'CFP-NAP-WHT',
    stock: '450 units',
    stockNumber: 450,
    minimum: '100 units',
    minimumNumber: 100,
    status: 'In Stock',
    lastRestocked: '04 Oct 2026'
  }
])

const totalProducts = 42

const lowStockCount = computed(() => {
  return products.value.filter(
    product => product.status === 'Low Stock'
  ).length
})

const outOfStockCount = computed(() => {
  return products.value.filter(
    product => product.status === 'Out of Stock'
  ).length
})

const reorderPending = 3

const filteredProducts = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()

  if (!query) {
    return products.value
  }

  return products.value.filter(product =>
    product.name.toLowerCase().includes(query) ||
    product.sku.toLowerCase().includes(query)
  )
})

function getStatusClass(status) {
  if (status === 'In Stock') {
    return 'in-stock'
  }

  if (status === 'Low Stock') {
    return 'low-stock'
  }

  if (status === 'Out of Stock') {
    return 'out-of-stock'
  }

  return ''
}

function restockProduct(product) {
  alert(`Restock requested for ${product.name}`)
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.stock-page {
  min-height: 100vh;
  background: #f6f4f1;
  color: #4b3934;
  font-family: Arial, Helvetica, sans-serif;
}

/* Main content */

.main-content {
  min-height: 100vh;
}

/* Header */

.page-header {
  height: 70px;
  background: #f8f7f5;
  border-bottom: 1px solid #e8e4df;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 26px;
}

.page-header h1 {
  margin: 0;

  font-family: Georgia, 'Times New Roman', serif;
  font-size: 18px;
  font-weight: 700;

  color: #44332f;
}

.page-header p {
  margin: 3px 0 0;

  font-family: Georgia, 'Times New Roman', serif;
  font-size: 10px;

  color: #756a66;
}

/* Search */

.search-container {
  width: 200px;
  height: 25px;

  display: flex;
  align-items: center;

  border: 1px solid #ded9d5;
  border-radius: 20px;

  background: #ffffff;

  padding: 0 10px;
}

.search-icon {
  font-size: 15px;
  color: #756a66;
  margin-right: 5px;
}

.search-container input {
  width: 100%;

  border: none;
  outline: none;

  font-size: 9px;
  color: #4b3934;

  background: transparent;
}

.search-container input::placeholder {
  color: #817873;
}

/* Statistics */

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 13px;

  padding: 26px 26px 15px;
}

.stat-card {
  min-height: 83px;

  background: #ffffff;

  border: 1px solid #e4dfdb;
  border-radius: 10px;

  padding: 12px 13px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.stat-card.warning {
  border-color: #e56f45;
}

.stat-card.danger {
  border-color: #ef5c36;
}

.stat-label {
  font-size: 8px;
  font-weight: 600;
  color: #665c58;
}

.stat-value {
  margin-top: 5px;

  font-family: Georgia, 'Times New Roman', serif;
  font-size: 21px;
  font-weight: 700;

  color: #4b3934;
}

.stat-card.danger .stat-value {
  color: #e84d27;
}

.stat-description {
  font-size: 8px;
  color: #756a66;
}

.warning-text {
  color: #e56f45;
}

.danger-text {
  color: #e84d27;
}

/* Inventory card */

.inventory-card {
  margin: 0 26px;

  background: #ffffff;

  border: 1px solid #e4dfdb;
  border-radius: 11px;

  overflow: hidden;
}

.inventory-header {
  padding: 14px 14px 5px;
}

.inventory-header h2 {
  margin: 0;

  font-family: Georgia, 'Times New Roman', serif;
  font-size: 13px;

  color: #4b3934;
}

/* Table */

.table-container {
  width: 100%;
  overflow-x: auto;
  padding: 0 14px 10px;
}

table {
  width: 100%;
  border-collapse: collapse;

  font-size: 8px;
}

thead tr {
  border-top: 1px solid #e5e0dc;
  border-bottom: 1px solid #e5e0dc;
}

th {
  text-align: left;

  padding: 5px 4px;

  font-size: 7px;
  font-weight: 600;

  color: #756a66;
}

td {
  padding: 7px 4px;

  border-bottom: 1px solid #eeeae7;

  color: #655b57;
}

tbody tr:last-child td {
  border-bottom: none;
}

.product-name {
  color: #4b3934;
  font-weight: 500;
}

.sku {
  color: #817873;
}

.stock-warning {
  color: #df6a42;
  font-weight: 600;
}

.stock-danger {
  color: #e84d27;
  font-weight: 600;
}

/* Status badges */

.status-badge {
  display: inline-flex;
  align-items: center;

  padding: 3px 7px;

  border-radius: 10px;

  font-size: 7px;
  white-space: nowrap;
}

.in-stock {
  background: #e3f2e5;
  color: #32823d;
}

.low-stock {
  background: #f4e9dc;
  color: #d8753f;
}

.out-of-stock {
  background: #fde4df;
  color: #ed593a;
}

/* Restock button */

.restock-button {
  border: none;
  border-radius: 5px;

  background: #d9824e;
  color: white;

  padding: 5px 10px;

  font-size: 7px;
  font-weight: 600;

  cursor: pointer;

  transition: background 0.2s ease;
}

.restock-button:hover {
  background: #c86f3e;
}

.no-results {
  text-align: center;
  padding: 20px;
  color: #817873;
}

/* Responsive */

@media (max-width: 900px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .page-header {
    height: auto;
    padding: 15px;
    gap: 15px;
    flex-direction: column;
    align-items: flex-start;
  }

  .search-container {
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    padding: 15px;
  }

  .inventory-card {
    margin: 0 15px;
  }
}
</style>