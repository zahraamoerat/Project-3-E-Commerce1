<template>
  <div class="edit-product_page">

    <!-- ===================================================== PAGE HEADER ====================================================== -->
    <header class="edit-product_page-header">

      <div class="edit-product_page-header-content">
        <h1>Edit Product</h1>

        <p>
          Update product details, pricing, and stock information.
        </p>
      </div>

    </header>


    <!-- LOADING -->
    <div
      v-if="isLoading"
      class="edit-product_message"
    >
      Loading product...
    </div>


    <!-- LOAD ERROR -->
    <div
      v-if="loadError && !isLoading"
      class="edit-product_error-message"
    >
      {{ loadError }}

      <button
        type="button"
        @click="loadProduct"
      >
        Try Again
      </button>
    </div>


    <!-- ===================================================== MAIN CONTENT ====================================================== -->
    <div
      v-if="!isLoading && !loadError"
      class="edit-product_content-grid"
    >

      <!-- =================================================== LEFT COLUMN ==================================================== -->
      <div class="edit-product_left-column">

        <!-- =============================================== PRODUCT DETAILS ================================================ -->
        <section class="edit-product_card">

          <h2>Product Details &amp; Cataloging</h2>

          <div class="edit-product_form-group">
            <label>WHOLESALE PRODUCT TITLE</label>

            <input
              v-model="form.product_name"
              type="text"
              placeholder="e.g. Sugar Cane Takeaway Bowls (750ml) - Pack of 500"
            />
          </div>


          <div class="edit-product_two-columns">

            <div class="edit-product_form-group">
              <label>PRODUCT CATEGORY</label>

              <select v-model="form.category_name">
                <option value="" disabled>
                  Select a category
                </option>

                <option value="Eco-friendly Packaging">
                  Eco-friendly Packaging
                </option>

                <option value="Food & Beverage">
                  Food & Beverage
                </option>

                <option value="Cleaning Supplies">
                  Cleaning Supplies
                </option>

                <option value="Office Supplies">
                  Office Supplies
                </option>
              </select>
            </div>


            <div class="edit-product_form-group">
              <label>STOCK KEEPING UNIT (SKU)</label>

              <input
                v-model="form.sku"
                type="text"
                placeholder="CFP-SCB-750M"
              />
            </div>

          </div>


          <div class="edit-product_form-group">

            <label>DETAILED DESCRIPTION</label>

            <textarea
              v-model="form.description"
              placeholder="Enter detailed bulk buying features (dimensions, food certifications, materials used, thermal properties, pack densities, etc.)"
            ></textarea>

          </div>

        </section>


        <!-- =============================================== PRICING ================================================ -->
        <section class="edit-product_card">

          <h2>
            Pricing (ZAR)
          </h2>


          <div class="edit-product_two-columns">

            <div class="edit-product_form-group">

              <label>BASE PRICE PER UNIT PACK (R)</label>

              <input
                v-model="form.price"
                type="number"
                min="0"
                step="0.01"
                placeholder="550.00"
              />

            </div>


            <div class="edit-product_form-group">

              <label>UNIT LABEL</label>

              <input
                v-model="form.unit"
                type="text"
                placeholder="pack"
              />

            </div>

          </div>

        </section>

      </div>


      <!-- =================================================== RIGHT COLUMN ==================================================== -->
      <div class="edit-product_right-column">

        <!-- =============================================== PRODUCT MEDIA ================================================ -->
        <section class="edit-product_card">

          <h2>Product Media</h2>


          <input
            ref="fileInput"
            type="file"
            accept="image/jpeg,image/png"
            class="edit-product_hidden-file-input"
            @change="onFileInputChange"
          />


          <div
            class="edit-product_upload-area"
            :class="{
              'edit-product_is-dragover': isDragOver
            }"
            @click="openFilePicker"
            @dragover.prevent="isDragOver = true"
            @dragleave.prevent="isDragOver = false"
            @drop.prevent="onDrop"
          >

            <img
              v-if="previewUrl"
              :src="previewUrl"
              alt="Product image"
              class="edit-product_preview-image"
            />

            <template v-else>

              <div class="edit-product_upload-icon">
                ↥
              </div>

              <strong>
                Drag a product image here
              </strong>

              <span>
                Supports JPG, PNG (Max 5MB)
              </span>

            </template>

          </div>


          <p
            v-if="uploadError"
            class="edit-product_upload-error"
          >
            {{ uploadError }}
          </p>

        </section>


        <!-- =============================================== INVENTORY ================================================ -->
        <section class="edit-product_card">

          <h2>
            Inventory
          </h2>


          <div class="edit-product_two-columns">

            <div class="edit-product_form-group">

              <label>STOCK QTY</label>

              <input
                v-model="form.quantity"
                type="number"
                min="0"
                placeholder="500"
              />

            </div>


            <div class="edit-product_form-group">

              <label>LOW STOCK ALERT</label>

              <input
                v-model="form.low_stock_threshold"
                type="number"
                min="0"
                placeholder="50"
              />

            </div>

          </div>


          <!-- SUCCESS MESSAGE -->
          <p
            v-if="successMessage"
            class="edit-product_success-message"
          >
            {{ successMessage }}
          </p>


          <!-- ERROR MESSAGE -->
          <p
            v-if="errorMessage"
            class="edit-product_error-message"
          >
            {{ errorMessage }}
          </p>


          <!-- Save -->
          <button
            type="button"
            class="edit-product_save-button"
            :disabled="isSaving"
            @click="saveProduct"
          >
            {{
              isSaving
                ? "Saving..."
                : "Save Changes"
            }}
          </button>


          <!-- Cancel -->
          <button
            type="button"
            class="edit-product_cancel-button"
            @click="cancelEdit"
          >
            Cancel
          </button>

        </section>

      </div>

    </div>

  </div>
</template>

<script>
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png"
];


export default {

  name: "EditProduct",

  data() {

    return {

      isLoading: true,

      loadError: "",

      isSaving: false,

      successMessage: "",

      errorMessage: "",

      isDragOver: false,

      uploadError: "",

      previewUrl: "",

      newImageFile: null,

      form: {

        product_name: "",

        category_name: "",

        sku: "",

        description: "",

        price: "",

        unit: "pack",

        quantity: 0,

        low_stock_threshold: 0

      }

    };

  },


  beforeUnmount() {

    if (
      this.newImageFile &&
      this.previewUrl
    ) {

      URL.revokeObjectURL(
        this.previewUrl
      );

    }

  },


  mounted() {

    this.loadProduct();

  },


  methods: {

    /* =====================================================
       LOAD PRODUCT
    ===================================================== */

    async loadProduct() {

      this.isLoading = true;

      this.loadError = "";


      const productId =
        this.$route.params.id;


      try {

        const response =
          await fetch(
            `http://localhost:5000/api/products/${productId}`
          );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.message ||
            "Failed to load product."
          );

        }


        this.form.product_name =
          data.product_name || "";

        this.form.category_name =
          data.category_name || "";

        this.form.sku =
          data.sku || "";

        this.form.description =
          data.description || "";

        this.form.price =
          data.price != null
            ? Number(data.price)
            : "";

        this.form.unit =
          data.unit || "pack";

        this.form.quantity =
          data.quantity != null
            ? Number(data.quantity)
            : 0;

        this.form.low_stock_threshold =
          data.low_stock_threshold != null
            ? Number(data.low_stock_threshold)
            : 0;


        this.previewUrl =
          data.product_image || "";


      } catch (error) {

        console.error(
          "Load product error:",
          error
        );

        this.loadError =
          error.message ||
          "Unable to load product.";

      } finally {

        this.isLoading = false;

      }

    },


    /* =====================================================
       IMAGE UPLOAD
    ===================================================== */

    openFilePicker() {

      this.$refs.fileInput.click();

    },


    onFileInputChange(event) {

      this.handleFile(
        event.target.files &&
        event.target.files[0]
      );

      event.target.value = "";

    },


    onDrop(event) {

      this.isDragOver = false;

      this.handleFile(
        event.dataTransfer.files &&
        event.dataTransfer.files[0]
      );

    },


    handleFile(file) {

      this.uploadError = "";


      if (!file) {

        return;

      }


      const isAcceptedType =
        ACCEPTED_TYPES.includes(file.type);

      const isUnderSizeLimit =
        file.size <= MAX_FILE_SIZE_BYTES;


      if (
        !isAcceptedType ||
        !isUnderSizeLimit
      ) {

        this.uploadError =
          "Only JPG/PNG under 5MB are supported.";

        return;

      }


      if (
        this.newImageFile &&
        this.previewUrl
      ) {

        URL.revokeObjectURL(
          this.previewUrl
        );

      }


      this.newImageFile = file;

      this.previewUrl =
        URL.createObjectURL(file);

    },


    /* =====================================================
       SAVE PRODUCT
    ===================================================== */

    async saveProduct() {

      this.successMessage = "";

      this.errorMessage = "";


      /* Basic validation */

      if (!this.form.product_name.trim()) {

        this.errorMessage =
          "Please enter a product name.";

        return;

      }


      if (!this.form.category_name) {

        this.errorMessage =
          "Please select a product category.";

        return;

      }


      if (
        this.form.price === "" ||
        Number(this.form.price) < 0
      ) {

        this.errorMessage =
          "Please enter a valid product price.";

        return;

      }


      this.isSaving = true;


      try {

        const productId =
          this.$route.params.id;


        /*
         * Image upload/storage isn't wired up yet
         * (same limitation as AddProducts.vue).
         *
         * Sending null keeps the existing image on
         * the server, since updateProduct() uses
         * COALESCE(?, product_image).
         */

        const response = await fetch(
          `http://localhost:5000/api/products/${productId}`,
          {

            method: "PUT",

            headers: {
              "Content-Type": "application/json"
            },

            body: JSON.stringify({

              product_name:
                this.form.product_name.trim(),

              category_name:
                this.form.category_name,

              sku:
                this.form.sku.trim() || null,

              description:
                this.form.description.trim() || null,

              price:
                Number(this.form.price),

              unit:
                this.form.unit || "pack",

              quantity:
                Number(this.form.quantity),

              low_stock_threshold:
                Number(this.form.low_stock_threshold),

              product_image: null

            })

          }
        );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.message ||
            "Failed to update product."
          );

        }


        this.successMessage =
          "Product updated successfully!";


        window.dispatchEvent(
          new CustomEvent("product-published")
        );


        setTimeout(() => {

          this.$router.push("/products");

        }, 500);


      } catch (error) {

        console.error(
          "Update product error:",
          error
        );

        this.errorMessage =
          error.message ||
          "Something went wrong while updating the product.";

      } finally {

        this.isSaving = false;

      }

    },


    /* =====================================================
       CANCEL
    ===================================================== */

    cancelEdit() {

      this.$router.push("/products");

    }

  }

};
</script>

<style scoped>

/* =========================================================
   PAGE
========================================================= */

.edit-product_page {
  width: 100%;
  min-height: 100vh;
  padding: 32px;
  box-sizing: border-box;
  background: #f7f5f2;
  font-family: Arial, sans-serif;
  color: #543b34;
  overflow-x: hidden;
}


/* =========================================================
   PAGE HEADER
========================================================= */

.edit-product_page-header {
  width: 100%;
  margin-bottom: 30px;
}

.edit-product_page-header h1 {
  margin: 0 0 8px;
  font-family: Georgia, serif;
  font-size: 30px;
  font-weight: 700;
  line-height: 1.2;
  color: #57372f;
}

.edit-product_page-header p {
  margin: 0;
  max-width: 650px;
  color: #82736d;
  font-size: 14px;
  line-height: 1.6;
}


/* =========================================================
   MESSAGES
========================================================= */

.edit-product_message,
.edit-product_error-message,
.edit-product_success-message {
  margin-bottom: 20px;
  padding: 12px 16px;
  border-radius: 9px;
  font-size: 13px;
}

.edit-product_message {
  background: #ffffff;
  border: 1px solid #e5dfda;
  color: #82736d;
  text-align: center;
}

.edit-product_success-message {
  background: #e9f7e8;
  border: 1px solid #c9e6c7;
  color: #3d7f42;
}

.edit-product_error-message {
  background: #fff0ed;
  border: 1px solid #f0cfc8;
  color: #c0392b;
}

.edit-product_error-message button {
  display: block;
  margin: 10px auto 0;
  padding: 8px 16px;
  border: none;
  border-radius: 18px;
  background: #d47b48;
  color: #ffffff;
  cursor: pointer;
}


/* =========================================================
   MAIN GRID
========================================================= */

.edit-product_content-grid {
  width: 100%;
  display: grid;

  grid-template-columns:
    minmax(0, 1.6fr) minmax(300px, 1fr);

  gap: 24px;

  box-sizing: border-box;
}

.edit-product_left-column,
.edit-product_right-column {
  min-width: 0;

  display: flex;
  flex-direction: column;

  gap: 24px;
}


/* =========================================================
   CARDS
========================================================= */

.edit-product_card {
  width: 100%;

  background: #ffffff;

  border: 1px solid #e5dfda;

  border-radius: 16px;

  padding: 26px;

  box-sizing: border-box;

  box-shadow:
    0 4px 15px rgba(84, 59, 52, 0.04);
}

.edit-product_card h2 {
  margin: 0 0 22px;

  font-family: Georgia, serif;

  font-size: 19px;

  font-weight: 700;

  line-height: 1.3;

  color: #63463c;
}


/* =========================================================
   FORM GROUP
========================================================= */

.edit-product_form-group {
  width: 100%;
  margin-bottom: 20px;
}

.edit-product_form-group:last-child {
  margin-bottom: 0;
}

.edit-product_form-group label {
  display: block;

  margin-bottom: 8px;

  font-size: 10px;

  font-weight: 700;

  letter-spacing: 0.5px;

  color: #806f68;
}

.edit-product_form-group input,
.edit-product_form-group select,
.edit-product_form-group textarea {
  width: 100%;

  box-sizing: border-box;

  padding: 13px 14px;

  border: 1px solid #e6e1dc;

  border-radius: 9px;

  background: #faf9f7;

  color: #665953;

  font-family: Arial, sans-serif;

  font-size: 13px;

  outline: none;

  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
}

.edit-product_form-group input::placeholder,
.edit-product_form-group textarea::placeholder {
  color: #aaa09b;
}

.edit-product_form-group input:focus,
.edit-product_form-group select:focus,
.edit-product_form-group textarea:focus {
  border-color: #d47b48;

  background: #ffffff;

  box-shadow:
    0 0 0 3px rgba(212, 123, 72, 0.1);
}

.edit-product_form-group textarea {
  min-height: 125px;

  resize: vertical;

  line-height: 1.5;
}


/* =========================================================
   TWO COLUMNS
========================================================= */

.edit-product_two-columns {
  width: 100%;

  display: grid;

  grid-template-columns:
    minmax(0, 1fr) minmax(0, 1fr);

  gap: 18px;
}


/* =========================================================
   HIDDEN FILE INPUT
========================================================= */

.edit-product_hidden-file-input {
  display: none;
}


/* =========================================================
   UPLOAD ERROR
========================================================= */

.edit-product_upload-error {
  margin: 12px 0 0;

  font-size: 12px;

  color: #c0392b;
}


/* =========================================================
   UPLOAD AREA
========================================================= */

.edit-product_upload-area {
  width: 100%;

  min-height: 200px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  box-sizing: border-box;

  background: #faf8f6;

  border: 2px dashed #d9d0ca;

  border-radius: 12px;

  cursor: pointer;

  overflow: hidden;

  transition:
    border-color 0.2s ease,
    background 0.2s ease;
}

.edit-product_upload-area:hover,
.edit-product_upload-area.edit-product_is-dragover {
  border-color: #d47b48;

  background: #fffaf7;
}

.edit-product_preview-image {
  width: 100%;

  height: 200px;

  object-fit: cover;

  display: block;
}

.edit-product_upload-icon {
  color: #d47b48;

  font-size: 30px;

  line-height: 1;

  margin-bottom: 10px;
}

.edit-product_upload-area strong {
  font-size: 13px;

  color: #68554e;
}

.edit-product_upload-area span {
  margin-top: 6px;

  font-size: 11px;

  color: #9a8d87;
}


/* =========================================================
   BUTTONS
========================================================= */

.edit-product_save-button,
.edit-product_cancel-button {
  width: 100%;

  box-sizing: border-box;

  padding: 14px;

  border-radius: 25px;

  font-family: Arial, sans-serif;

  font-size: 14px;

  font-weight: 600;

  cursor: pointer;

  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}


/* Save */

.edit-product_save-button {
  margin-top: 24px;

  background: #d47b48;

  border: none;

  color: #ffffff;

  box-shadow:
    0 4px 10px rgba(212, 123, 72, 0.2);
}

.edit-product_save-button:hover {
  background: #c76d3b;

  transform: translateY(-2px);

  box-shadow:
    0 6px 14px rgba(212, 123, 72, 0.25);
}

.edit-product_save-button:disabled {
  opacity: 0.65;

  cursor: not-allowed;

  transform: none;
}


/* Cancel */

.edit-product_cancel-button {
  margin-top: 10px;

  background: #ffffff;

  border: 1px solid #e4dcd6;

  color: #634c44;
}

.edit-product_cancel-button:hover {
  background: #f8f6f3;

  border-color: #d47b48;
}


/* =========================================================
   TABLET
========================================================= */

@media (max-width: 1000px) {

  .edit-product_content-grid {
    grid-template-columns: 1fr;
  }

}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 700px) {

  .edit-product_page {
    padding: 18px;
  }

  .edit-product_page-header h1 {
    font-size: 27px;
  }

  .edit-product_two-columns {
    grid-template-columns: 1fr;

    gap: 0;
  }

  .edit-product_card {
    padding: 19px;

    border-radius: 14px;
  }

}

</style>