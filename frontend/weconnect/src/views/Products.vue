<template>
  <div class="products-page">

    <!-- ========================= HEADER ========================= -->
    <header class="products-header">

      <div class="products-title-section">
        <h1>Products</h1>
        <p>Manage your wholesale catalog, pricing, and stock levels.</p>
      </div>

      <!-- Search -->
      <div class="products-search">
        <FontAwesomeIcon :icon="faMagnifyingGlass" />
        <input v-model="searchQuery" type="text" placeholder="Search wholesale items..." />
      </div>

    </header>

    <!-- Dotted divider -->
    <div class="header-divider"></div>

    <!-- ========================= CONTROLS ========================= -->
    <section class="products-controls">

      <div class="filter-group">

        <!-- Category -->
        <div class="filter-dropdown">
          <span>Category:</span>

          <select v-model="selectedCategory">
            <option value="All">All</option>
            <option value="Paper Goods">Paper Goods</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Packaging">Packaging</option>
          </select>

          <FontAwesomeIcon :icon="faChevronDown" />
        </div>

        <!-- Stock status -->
        <div class="filter-dropdown">
          <span>Stock Status:</span>

          <select v-model="selectedStatus">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="All">All</option>
          </select>

          <FontAwesomeIcon :icon="faChevronDown" />
        </div>

      </div>

      <!-- Add Product -->
      <button class="add-product-button" @click="addProducts">
        Add Product
      </button>

    </section>

    <!-- ========================= PRODUCT LIST ========================= -->
    <main class="product-list">

      <article v-for="product in filteredProducts" :key="product.id" class="product-card">

        <!-- Product Image -->
        <div class="product-image-container">
          <img v-if="product.image" :src="product.image" :alt="product.name" class="product-image" />

          <div v-else class="product-image-placeholder">
            <div class="paper-stack paper-stack-one"></div>
            <div class="paper-stack paper-stack-two"></div>
            <div class="paper-stack paper-stack-three"></div>
          </div>
        </div>

        <!-- Product information -->
        <div class="product-content">

          <div class="product-top-row">
            <div>
              <span class="product-category">
                {{ product.category }}
              </span>

              <h2>{{ product.name }}</h2>
            </div>

            <span class="product-status" :class="{
              inactive: product.status === 'Inactive'
            }">
              {{ product.status }}
            </span>
          </div>

          <div class="product-details">

            <div class="product-price">
              <span>UNIT price</span>
              <strong>R {{ product.price.toFixed(2) }}</strong>
            </div>

            <div class="product-stock">
              <span>stock qty</span>
              <strong>{{ product.stock }} units</strong>
            </div>

          </div>

          <!-- Actions -->
          <div class="product-actions">

            <button class="edit-button" @click="editProduct(product)">
              Edit
            </button>

            <button class="delete-button" @click="deleteProduct(product)">
              Delete
            </button>

          </div>

        </div>

      </article>

      <!-- Empty state -->
      <div v-if="filteredProducts.length === 0" class="empty-products">
        <h3>No products found</h3>
        <p>Try changing your search or filters.</p>
      </div>

    </main>

  </div>
</template>


<script setup>
import { computed, ref } from "vue"
import { useRouter } from "vue-router"

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"

import {
  faMagnifyingGlass,
  faChevronDown
} from "@fortawesome/free-solid-svg-icons"

import AddProducts from "../views/AddProducts.vue";

const routes = [
  {
    path: "/products/add",
    name: "AddProducts",
    component: AddProducts,
  },
];


/* ========================= ROUTER ========================= */

const router = useRouter()


/* ========================= STATE ========================= */

const searchQuery = ref("")
const selectedCategory = ref("All")
const selectedStatus = ref("Active")


/* ========================= PRODUCTS ========================= */

const products = ref([
  {
    id: 1,
    name: "Napkin Bundles",
    category: "PAPER GOODS",
    price: 145.00,
    stock: 450,
    status: "Active",

    // Add your own image here if you have one:
    // image: new URL("../assets/napkin-bundles.jpg", import.meta.url).href

    image: null
  }
])


/* ========================= FILTERED PRODUCTS ========================= */

const filteredProducts = computed(() => {
  return products.value.filter((product) => {

    const matchesSearch =
      product.name
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase())

    const matchesCategory =
      selectedCategory.value === "All" ||
      product.category.toLowerCase() ===
      selectedCategory.value.toLowerCase()

    const matchesStatus =
      selectedStatus.value === "All" ||
      product.status === selectedStatus.value

    return (
      matchesSearch &&
      matchesCategory &&
      matchesStatus
    )
  })
})


/* ========================= ACTIONS ========================= */

function addProduct() {
  router.push("/products/add")
}


function editProduct(product) {
  router.push(`/products/edit/${product.id}`)
}


function deleteProduct(product) {
  const confirmed = window.confirm(
    `Are you sure you want to delete "${product.name}"?`
  )

  if (!confirmed) return

  products.value = products.value.filter(
    item => item.id !== product.id
  )
}

function addProducts() {
  router.push({ name: "AddProducts" });
}
</script>


<style scoped>
/* =========================================================
   PAGE
========================================================= */

.products-page {
  min-height: 100vh;
  background: #f7f6f3;
  color: #523a33;
  box-sizing: border-box;
  font-family: "Figtree", Arial, sans-serif;
}


/* =========================================================
   HEADER
========================================================= */

.products-header {
  height: 58px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}


/* Title */

.products-title-section {
  display: flex;
  flex-direction: column;
}

.products-title-section h1 {
  margin: 0;
  color: #523a33;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.1;
}

.products-title-section p {
  margin: 2px 0 0;
  color: #77716d;
  font-size: 9px;
  font-weight: 400;
}


/* =========================================================
   SEARCH
========================================================= */

.products-search {
  width: 214px;
  height: 25px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
  background: #ffffff;
  border: 1px solid #ebe8e5;
  border-radius: 16px;
  box-sizing: border-box;
}

.products-search svg {
  color: #8b817b;
  font-size: 9px;
}

.products-search input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: #523a33;
  font-family: "Figtree", Arial, sans-serif;
  font-size: 9px;
}

.products-search input::placeholder {
  color: #928c88;
}


/* =========================================================
   HEADER DIVIDER
========================================================= */

.header-divider {
  width: 100%;
  border-top: 2px dotted #9ed2e6;
}


/* =========================================================
   CONTROLS
========================================================= */

.products-controls {
  min-height: 70px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}


/* Filter group */

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}


/* =========================================================
   FILTER DROPDOWNS
========================================================= */

.filter-dropdown {
  position: relative;
  height: 23px;
  padding: 0 9px;
  display: flex;
  align-items: center;
  gap: 3px;
  background: #ffffff;
  border: 1px solid #e8e2de;
  border-radius: 5px;
  color: #574c47;
  font-size: 9px;
  box-sizing: border-box;
}

.filter-dropdown span {
  white-space: nowrap;
}

.filter-dropdown select {
  appearance: none;
  -webkit-appearance: none;
  border: none;
  outline: none;
  background: transparent;
  color: #574c47;
  padding: 0 13px 0 0;
  font-family: inherit;
  font-size: 9px;
  cursor: pointer;
}

.filter-dropdown svg {
  position: absolute;
  right: 6px;
  pointer-events: none;
  font-size: 7px;
  color: #625852;
}


/* =========================================================
   ADD PRODUCT BUTTON
========================================================= */

.add-product-button {
  min-width: 90px;
  height: 29px;
  padding: 0 17px;
  border: none;
  border-radius: 18px;
  background: #d77b45;
  color: #ffffff;
  font-family: "Figtree", Arial, sans-serif;
  font-size: 9px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(82, 58, 51, 0.08);
  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.add-product-button:hover {
  background: #c96d39;
  transform: translateY(-1px);
}


/* =========================================================
   PRODUCT LIST
========================================================= */

.product-list {
  padding: 0 24px 30px;
}


/* =========================================================
   PRODUCT CARD
========================================================= */

.product-card {
  width: 100%;
  background: #ffffff;
  border: 1px solid #e8e2de;
  border-radius: 10px;
  overflow: hidden;
  box-sizing: border-box;
}


/* =========================================================
   PRODUCT IMAGE
========================================================= */

.product-image-container {
  height: 108px;
  margin: 9px 9px 0;
  overflow: hidden;
  border-radius: 6px;
  background: #d9d8d9;
}


/* Real image */

.product-image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}


/* =========================================================
   IMAGE PLACEHOLDER
   Creates a paper-stack appearance when no image exists.
========================================================= */

.product-image-placeholder {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background:
    linear-gradient(165deg,
      #a9a7ab 0%,
      #d6d5d5 40%,
      #f3f1e9 40%,
      #f3f1e9 65%,
      #b8b7b9 100%);
}


/* Paper stacks */

.paper-stack {
  position: absolute;
  background: #eeeee7;
  box-shadow:
    inset -2px 0 rgba(130, 128, 123, 0.15),
    0 2px 4px rgba(0, 0, 0, 0.04);
}


/* Large left paper */

.paper-stack-one {
  width: 30%;
  height: 120%;
  left: 28%;
  top: -8%;
  transform: skewY(2deg);
}


/* Center paper */

.paper-stack-two {
  width: 23%;
  height: 105%;
  left: 43%;
  top: -4%;
  border-radius: 5px;
  background:
    repeating-linear-gradient(to bottom,
      #eeeeea 0px,
      #eeeeea 2px,
      #dadad5 3px);
}


/* Right paper */

.paper-stack-three {
  width: 16%;
  height: 110%;
  left: 57%;
  top: -5%;
  background:
    repeating-linear-gradient(to bottom,
      #eeeee9 0px,
      #eeeee9 2px,
      #d7d7d2 3px);
}


/* =========================================================
   PRODUCT CONTENT
========================================================= */

.product-content {
  padding: 10px 9px 9px;
}


/* =========================================================
   PRODUCT TOP ROW
========================================================= */

.product-top-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}


/* Category */

.product-category {
  display: block;
  margin-bottom: 5px;
  color: #8d8884;
  font-size: 7px;
  font-weight: 500;
  letter-spacing: 0.2px;
  text-transform: uppercase;
}


/* Product name */

.product-top-row h2 {
  margin: 0;
  color: #523a33;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 12px;
  font-weight: 700;
}


/* =========================================================
   STATUS
========================================================= */

.product-status {
  margin-top: 2px;
  padding: 3px 7px;
  border-radius: 10px;
  background: #e5f4e4;
  color: #4d9855;
  font-size: 7px;
  font-weight: 600;
}

.product-status.inactive {
  background: #f5e5e2;
  color: #bd6555;
}


/* =========================================================
   PRODUCT DETAILS
========================================================= */

.product-details {
  min-height: 40px;
  margin-top: 7px;
  padding-bottom: 7px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  border-bottom: 1px solid #eeeae7;
}


/* Price */

.product-price,
.product-stock {
  display: flex;
  flex-direction: column;
}

.product-price span,
.product-stock span {
  margin-bottom: 3px;
  color: #9a928d;
  font-size: 6px;
  font-weight: 500;
  text-transform: uppercase;
}

.product-price strong,
.product-stock strong {
  color: #523a33;
  font-size: 9px;
  font-weight: 600;
}

.product-stock {
  text-align: right;
}


/* =========================================================
   ACTION BUTTONS
========================================================= */

.product-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 7px;
  padding-top: 9px;
}

.product-actions button {
  height: 22px;
  border-radius: 5px;
  font-family: "Figtree", Arial, sans-serif;
  font-size: 7px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}


/* Edit */

.edit-button {
  border: none;
  background: #f3f1ee;
  color: #645953;
}

.edit-button:hover {
  background: #e9e5e1;
}


/* Delete */

.delete-button {
  border: 1px solid #ebe3df;
  background: #ffffff;
  color: #e35f3d;
}

.delete-button:hover {
  background: #fff5f2;
}


/* =========================================================
   EMPTY STATE
========================================================= */

.empty-products {
  margin-top: 20px;
  padding: 50px 20px;
  text-align: center;
  background: #ffffff;
  border: 1px solid #e8e2de;
  border-radius: 10px;
}

.empty-products h3 {
  margin: 0 0 5px;
  color: #523a33;
  font-family: Georgia, serif;
  font-size: 15px;
}

.empty-products p {
  margin: 0;
  color: #8c8580;
  font-size: 10px;
}


/* =========================================================
   TABLET
========================================================= */

@media (max-width: 900px) {

  .products-header {
    padding: 0 18px;
  }

  .products-controls {
    padding: 0 18px;
  }

  .product-list {
    padding-left: 18px;
    padding-right: 18px;
  }
}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 700px) {

  .products-header {
    height: auto;
    padding: 18px 16px 12px;
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .products-search {
    width: 100%;
    height: 32px;
  }

  .products-controls {
    padding: 12px 16px;
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .filter-group {
    width: 100%;
    overflow-x: auto;
  }

  .filter-dropdown {
    flex-shrink: 0;
  }

  .add-product-button {
    width: 100%;
    height: 34px;
  }

  .product-list {
    padding: 0 16px 25px;
  }

  .product-image-container {
    height: 140px;
  }
}


/* =========================================================
   SMALL MOBILE
========================================================= */

@media (max-width: 450px) {

  .products-title-section h1 {
    font-size: 19px;
  }

  .product-image-container {
    height: 120px;
  }

  .product-actions {
    gap: 5px;
  }
}
</style>
