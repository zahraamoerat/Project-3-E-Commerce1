<template>

  <div class="products-page">

    <!-- ========================= HEADER ========================= -->

    <header class="products-header">

      <div class="products-title-section">

        <h1>Products</h1>

        <p>
          Manage your wholesale catalog, pricing, and stock levels.
        </p>

      </div>


      <!-- Search -->

      <div class="products-search">

        <FontAwesomeIcon
          :icon="faMagnifyingGlass"
        />

        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search wholesale items..."
        />

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

          <select
            v-model="selectedCategory"
          >

            <option value="All">
              All
            </option>

            <option
              v-for="category in categories"
              :key="category"
              :value="category"
            >
              {{ category }}
            </option>

          </select>

          <FontAwesomeIcon
            :icon="faChevronDown"
          />

        </div>


        <!-- Stock status -->

        <div class="filter-dropdown">

          <span>Stock Status:</span>

          <select
            v-model="selectedStatus"
          >

            <option value="All">
              All
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Inactive">
              Inactive
            </option>

          </select>

          <FontAwesomeIcon
            :icon="faChevronDown"
          />

        </div>

      </div>


      <!-- Add Product -->

      <button
        class="add-product-button"
        @click="addProducts"
      >
        Add Product
      </button>

    </section>


    <!-- ========================= LOADING ========================= -->

    <div
      v-if="loading"
      class="products-message"
    >
      Loading products...
    </div>


    <!-- ========================= ERROR ========================= -->

    <div
      v-if="error && !loading"
      class="products-error"
    >
      {{ error }}

      <button
        type="button"
        @click="fetchProducts"
      >
        Try Again
      </button>
    </div>


    <!-- ========================= PRODUCT LIST ========================= -->

    <main
      v-if="!loading && !error"
      class="product-list"
    >

      <article
        v-for="product in filteredProducts"
        :key="product.id"
        class="product-card"
      >


        <!-- Product Image -->

        <div class="product-image-container">

          <img
            v-if="product.image"
            :src="product.image"
            :alt="product.name"
            class="product-image"
          />


          <div
            v-else
            class="product-image-placeholder"
          >

            <div
              class="paper-stack paper-stack-one"
            ></div>

            <div
              class="paper-stack paper-stack-two"
            ></div>

            <div
              class="paper-stack paper-stack-three"
            ></div>

          </div>

        </div>


        <!-- Product information -->

        <div class="product-content">


          <div class="product-top-row">

            <div>

              <span class="product-category">
                {{ product.category }}
              </span>

              <h2>
                {{ product.name }}
              </h2>

            </div>


            <span
              class="product-status"
              :class="{
                inactive:
                  product.status === 'Inactive'
              }"
            >
              {{ product.status }}
            </span>

          </div>


          <div class="product-details">


            <div class="product-price">

              <span>
                UNIT price
              </span>

              <strong>
                R {{ product.price.toFixed(2) }}
              </strong>

            </div>


            <div class="product-stock">

              <span>
                stock qty
              </span>

              <strong>
                {{ product.stock }} units
              </strong>

            </div>

          </div>


          <!-- Actions -->

          <div class="product-actions">

            <button
              class="edit-button"
              @click="editProduct(product)"
            >
              Edit
            </button>


            <button
              class="delete-button"
              :disabled="deletingId === product.id"
              @click="handleDeleteProduct(product)"
            >
              {{
                deletingId === product.id
                  ? "Deleting..."
                  : "Delete"
              }}
            </button>

          </div>

        </div>

      </article>


      <!-- Empty state -->

      <div
        v-if="filteredProducts.length === 0"
        class="empty-products"
      >

        <h3>
          No products found
        </h3>

        <p>
          Try changing your search or filters.
        </p>

      </div>

    </main>

  </div>

</template>

<script setup>

import {
  computed,
  onMounted,
  onBeforeUnmount,
  ref
} from "vue";

import {
  useRouter
} from "vue-router";


import {
  FontAwesomeIcon
} from "@fortawesome/vue-fontawesome";


import {
  faMagnifyingGlass,
  faChevronDown
} from "@fortawesome/free-solid-svg-icons";


/* ========================= ROUTER ========================= */

const router = useRouter();


/* ========================= STATE ========================= */

const searchQuery = ref("");

const selectedCategory =
  ref("All");

const selectedStatus =
  ref("All");


const loading =
  ref(true);

const error =
  ref("");


/* ========================= PRODUCTS ========================= */

const products =
  ref([]);


/* ========================= DELETE STATE ========================= */

const deletingId =
  ref(null);


/* ========================= CATEGORIES ========================= */

const categories =
  computed(() => {

    const categoryList =
      products.value
        .map(product => product.category)
        .filter(Boolean);


    return [
      ...new Set(categoryList)
    ];

  });


/* ========================= FETCH PRODUCTS ========================= */

const fetchProducts = async () => {

  loading.value = true;

  error.value = "";


  try {

    const response =
      await fetch(
        "http://localhost:5000/api/products"
      );


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(
        data.message ||
        "Failed to load products."
      );

    }


    /*
     * Convert database fields into
     * the fields used by the UI.
     */

    products.value =
      data.map(product => ({

        id:
          product.product_id,

        name:
          product.product_name,

        category:
          product.category_name ||
          "Uncategorized",

        price:
          Number(product.price) || 0,

        stock:
          Number(product.quantity) || 0,

        status:
          product.is_active
            ? "Active"
            : "Inactive",

        sku:
          product.sku,

        description:
          product.description,

        image:
          product.product_image

      }));


  } catch (err) {

    console.error(
      "Error loading products:",
      err
    );

    error.value =
      err.message ||
      "Unable to load products.";

  } finally {

    loading.value = false;

  }

};


/* ========================= FILTERED PRODUCTS ========================= */

const filteredProducts =
  computed(() => {

    return products.value.filter(
      (product) => {

        const matchesSearch =
          product.name
            .toLowerCase()
            .includes(
              searchQuery.value
                .toLowerCase()
            );


        const matchesCategory =
          selectedCategory.value === "All" ||
          product.category.toLowerCase() ===
          selectedCategory.value.toLowerCase();


        const matchesStatus =
          selectedStatus.value === "All" ||
          product.status ===
          selectedStatus.value;


        return (
          matchesSearch &&
          matchesCategory &&
          matchesStatus
        );

      }
    );

  });


/* ========================= ADD PRODUCT ========================= */

function addProducts() {

  router.push("/products/add");

}


/* ========================= EDIT ========================= */

function editProduct(product) {

  router.push(
    `/products/edit/${product.id}`
  );

}


/* ========================= DELETE ========================= */

async function handleDeleteProduct(product) {

  const confirmed =
    window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );


  if (!confirmed) {

    return;

  }


  deletingId.value = product.id;

  error.value = "";


  try {

    const response =
      await fetch(
        `http://localhost:5000/api/products/${product.id}`,
        {
          method: "DELETE"
        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(
        data.message ||
        "Failed to delete product."
      );

    }


    products.value =
      products.value.filter(
        item =>
          item.id !== product.id
      );


  } catch (err) {

    console.error(
      "Error deleting product:",
      err
    );

    error.value =
      err.message ||
      "Unable to delete product.";

  } finally {

    deletingId.value = null;

  }

}


/* ========================= REFRESH AFTER PUBLISH ========================= */

const handleProductPublished =
  () => {

    fetchProducts();

  };


/* ========================= PAGE LOAD ========================= */

onMounted(() => {

  fetchProducts();

  window.addEventListener(
    "product-published",
    handleProductPublished
  );

});


/* ========================= CLEANUP ========================= */

onBeforeUnmount(() => {

  window.removeEventListener(
    "product-published",
    handleProductPublished
  );

});

</script>

<style scoped>

/* =========================================================
   PAGE
========================================================= */

.products-page {
  width: 100%;
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
  min-height: 82px;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
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
  font-size: 30px;
  font-weight: 700;
  line-height: 1.1;
}

.products-title-section p {
  margin: 6px 0 0;
  color: #77716d;
  font-size: 13px;
  line-height: 1.4;
}


/* =========================================================
   SEARCH
========================================================= */

.products-search {
  width: 310px;
  height: 42px;

  display: flex;
  align-items: center;
  gap: 11px;

  padding: 0 15px;

  background: #ffffff;
  border: 1px solid #e5dfdb;
  border-radius: 22px;

  box-sizing: border-box;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.products-search:focus-within {
  border-color: #d77b45;
  box-shadow:
    0 0 0 3px rgba(215, 123, 69, 0.10);
}

.products-search svg {
  color: #8b817b;
  font-size: 14px;
  flex-shrink: 0;
}

.products-search input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;

  color: #523a33;

  font-family: "Figtree", Arial, sans-serif;
  font-size: 13px;
}

.products-search input::placeholder {
  color: #9a928d;
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
  min-height: 92px;

  padding: 0 32px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 20px;

  box-sizing: border-box;
}


/* Filter group */

.filter-group {
  display: flex;
  align-items: center;
  gap: 12px;
}


/* =========================================================
   FILTER DROPDOWNS
========================================================= */

.filter-dropdown {
  position: relative;

  min-width: 180px;
  height: 42px;

  padding: 0 14px;

  display: flex;
  align-items: center;
  gap: 5px;

  background: #ffffff;
  border: 1px solid #e3dcd8;
  border-radius: 8px;

  color: #574c47;

  font-size: 13px;

  box-sizing: border-box;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.filter-dropdown:hover {
  border-color: #cfc4be;
}

.filter-dropdown:focus-within {
  border-color: #d77b45;
  box-shadow:
    0 0 0 3px rgba(215, 123, 69, 0.08);
}

.filter-dropdown span {
  white-space: nowrap;
  color: #817872;
}

.filter-dropdown select {
  appearance: none;
  -webkit-appearance: none;

  border: none;
  outline: none;
  background: transparent;

  color: #523a33;

  padding: 0 20px 0 0;

  font-family: inherit;
  font-size: 13px;
  font-weight: 600;

  cursor: pointer;
}

.filter-dropdown svg {
  position: absolute;
  right: 13px;

  pointer-events: none;

  font-size: 11px;
  color: #625852;
}


/* =========================================================
   ADD PRODUCT BUTTON
========================================================= */

.add-product-button {
  min-width: 135px;
  height: 44px;

  padding: 0 24px;

  border: none;
  border-radius: 22px;

  background: #d77b45;
  color: #ffffff;

  font-family: "Figtree", Arial, sans-serif;
  font-size: 13px;
  font-weight: 600;

  cursor: pointer;

  box-shadow:
    0 4px 10px rgba(82, 58, 51, 0.12);

  transition:
    background 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.add-product-button:hover {
  background: #c96d39;

  transform: translateY(-2px);

  box-shadow:
    0 7px 16px rgba(82, 58, 51, 0.16);
}

.add-product-button:active {
  transform: translateY(0);
}


/* =========================================================
   LOADING / ERROR
========================================================= */

.products-message,
.products-error {
  margin: 0 32px 30px;
  padding: 40px;
  background: #ffffff;
  border: 1px solid #e5dfdb;
  border-radius: 14px;
  text-align: center;
  color: #77716d;
  box-sizing: border-box;
}

.products-error {
  color: #c0392b;
}

.products-error button {
  display: block;
  margin: 15px auto 0;
  padding: 9px 18px;
  border: none;
  border-radius: 20px;
  background: #d77b45;
  color: #ffffff;
  cursor: pointer;
}


/* =========================================================
   PRODUCT LIST
========================================================= */

.product-list {
  padding: 0 32px 40px;

  display: grid;

  grid-template-columns: repeat(
    auto-fit,
    minmax(420px, 1fr)
  );

  gap: 24px;

  box-sizing: border-box;
}


/* =========================================================
   PRODUCT CARD
========================================================= */

.product-card {
  width: 100%;

  background: #ffffff;

  border: 1px solid #e5dfdb;
  border-radius: 14px;

  overflow: hidden;

  box-sizing: border-box;

  box-shadow:
    0 2px 8px rgba(82, 58, 51, 0.04);

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.product-card:hover {
  transform: translateY(-2px);

  box-shadow:
    0 8px 22px rgba(82, 58, 51, 0.09);
}


/* =========================================================
   PRODUCT IMAGE
========================================================= */

.product-image-container {
  height: 230px;

  margin: 12px 12px 0;

  overflow: hidden;

  border-radius: 10px;

  background: #d9d8d9;
}

.product-image {
  width: 100%;
  height: 100%;

  display: block;

  object-fit: cover;
}


/* =========================================================
   IMAGE PLACEHOLDER
========================================================= */

.product-image-placeholder {
  position: relative;

  width: 100%;
  height: 100%;

  overflow: hidden;

  background:
    linear-gradient(
      165deg,
      #aaa8ac 0%,
      #d6d5d5 40%,
      #f3f1e9 40%,
      #f3f1e9 65%,
      #b8b7b9 100%
    );
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
    repeating-linear-gradient(
      to bottom,
      #eeeeea 0px,
      #eeeeea 3px,
      #dadad5 4px
    );
}


/* Right paper */

.paper-stack-three {
  width: 16%;
  height: 110%;

  left: 57%;
  top: -5%;

  background:
    repeating-linear-gradient(
      to bottom,
      #eeeee9 0px,
      #eeeee9 3px,
      #d7d7d2 4px
    );
}


/* =========================================================
   PRODUCT CONTENT
========================================================= */

.product-content {
  padding: 18px 18px 16px;
}


/* =========================================================
   PRODUCT TOP ROW
========================================================= */

.product-top-row {
  display: flex;

  align-items: flex-start;
  justify-content: space-between;

  gap: 20px;
}


/* =========================================================
   CATEGORY
========================================================= */

.product-category {
  display: block;

  margin-bottom: 7px;

  color: #948b86;

  font-size: 10px;
  font-weight: 600;

  letter-spacing: 0.6px;

  text-transform: uppercase;
}


/* =========================================================
   PRODUCT NAME
========================================================= */

.product-top-row h2 {
  margin: 0;

  color: #523a33;

  font-family:
    Georgia,
    "Times New Roman",
    serif;

  font-size: 21px;
  font-weight: 700;

  line-height: 1.2;
}


/* =========================================================
   STATUS
========================================================= */

.product-status {
  flex-shrink: 0;

  margin-top: 2px;

  padding: 6px 11px;

  border-radius: 20px;

  background: #e5f4e4;
  color: #4d9855;

  font-size: 10px;
  font-weight: 700;
}

.product-status.inactive {
  background: #f5e5e2;
  color: #bd6555;
}


/* =========================================================
   PRODUCT DETAILS
========================================================= */

.product-details {
  min-height: 68px;

  margin-top: 18px;
  padding-bottom: 15px;

  display: flex;

  align-items: flex-end;
  justify-content: space-between;

  border-bottom: 1px solid #eeeae7;
}


/* Price / Stock */

.product-price,
.product-stock {
  display: flex;

  flex-direction: column;
}

.product-price span,
.product-stock span {
  margin-bottom: 6px;

  color: #9a928d;

  font-size: 10px;
  font-weight: 600;

  letter-spacing: 0.4px;

  text-transform: uppercase;
}

.product-price strong,
.product-stock strong {
  color: #523a33;

  font-size: 16px;
  font-weight: 700;
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

  gap: 10px;

  padding-top: 15px;
}

.product-actions button {
  height: 38px;

  border-radius: 7px;

  font-family:
    "Figtree",
    Arial,
    sans-serif;

  font-size: 12px;
  font-weight: 600;

  cursor: pointer;

  transition:
    background 0.2s ease,
    border-color 0.2s ease;
}

.product-actions button:disabled {
  opacity: 0.6;

  cursor: not-allowed;
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

  border-color: #e5cfc8;
}


/* =========================================================
   EMPTY STATE
========================================================= */

.empty-products {
  grid-column: 1 / -1;

  margin-top: 5px;

  padding: 70px 20px;

  text-align: center;

  background: #ffffff;

  border: 1px solid #e8e2de;
  border-radius: 14px;
}

.empty-products h3 {
  margin: 0 0 8px;

  color: #523a33;

  font-family: Georgia, serif;

  font-size: 20px;
}

.empty-products p {
  margin: 0;

  color: #8c8580;

  font-size: 13px;
}


/* =========================================================
   TABLET
========================================================= */

@media (max-width: 1100px) {

  .products-header,
  .products-controls {
    padding-left: 24px;
    padding-right: 24px;
  }

  .product-list {
    padding-left: 24px;
    padding-right: 24px;

    grid-template-columns:
      repeat(auto-fit, minmax(360px, 1fr));
  }

  .products-search {
    width: 260px;
  }

}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 700px) {

  .products-header {
    min-height: auto;

    padding: 20px 16px 16px;

    flex-direction: column;
    align-items: stretch;

    gap: 16px;
  }

  .products-title-section h1 {
    font-size: 28px;
  }

  .products-title-section p {
    font-size: 12px;
  }

  .products-search {
    width: 100%;
    height: 44px;
  }


  .products-controls {
    padding: 16px;

    flex-direction: column;

    align-items: stretch;
  }

  .filter-group {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-dropdown {
    width: 100%;
  }

  .add-product-button {
    width: 100%;
  }


  .product-list {
    padding: 0 16px 30px;

    grid-template-columns: 1fr;

    gap: 18px;
  }

  .products-message,
  .products-error {
    margin-left: 16px;
    margin-right: 16px;
  }

  .product-card {
    min-width: 0;
  }

  .product-top-row h2 {
    font-size: 18px;
  }

}

</style>