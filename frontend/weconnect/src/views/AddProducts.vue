<template>
  <div class="add-product_page">

    <!-- ===================================================== PAGE HEADER ====================================================== -->
    <header class="add-product_page-header">

      <div class="add-product_page-header-content">
        <h1>Add New Product</h1>

        <p>
          List a new product or wholesale bundle to make it available
          for custom business buying.
        </p>
      </div>

      <!-- Search -->
      <div class="add-product_search-box">
        <span class="add-product_search-icon">⌕</span>

        <input
          type="text"
          placeholder="Search catalog structures..."
        />
      </div>

    </header>


    <!-- SUCCESS MESSAGE -->
    <div
      v-if="successMessage"
      class="add-product_success-message"
    >
      {{ successMessage }}
    </div>

    <!-- ERROR MESSAGE -->
    <div
      v-if="errorMessage"
      class="add-product_error-message"
    >
      {{ errorMessage }}
    </div>


    <!-- ===================================================== MAIN CONTENT ====================================================== -->
    <div class="add-product_content-grid">

      <!-- =================================================== LEFT COLUMN ==================================================== -->
      <div class="add-product_left-column">

        <!-- =============================================== PRODUCT DETAILS ================================================ -->
        <section class="add-product_card">

          <h2>Product Details &amp; Cataloging</h2>

          <div class="add-product_form-group">
            <label>WHOLESALE PRODUCT TITLE</label>

            <input
              v-model="form.product_name"
              type="text"
              placeholder="e.g. Sugar Cane Takeaway Bowls (750ml) - Pack of 500"
            />
          </div>


          <div class="add-product_two-columns">

            <div class="add-product_form-group">
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


            <div class="add-product_form-group">
              <label>STOCK KEEPING UNIT (SKU)</label>

              <input
                v-model="form.sku"
                type="text"
                placeholder="CFP-SCB-750M"
              />
            </div>

          </div>


          <div class="add-product_form-group">

            <label>DETAILED DESCRIPTION</label>

            <textarea
              v-model="form.description"
              placeholder="Enter detailed bulk buying features (dimensions, food certifications, materials used, thermal properties, pack densities, etc.)"
            ></textarea>

          </div>

        </section>


        <!-- =============================================== PRICING ================================================ -->
        <section class="add-product_card">

          <h2>
            Pricing &amp; Bulk Discount Tiers (ZAR)
          </h2>


          <div class="add-product_two-columns">

            <div class="add-product_form-group">

              <label>BASE PRICE PER UNIT PACK (R)</label>

              <input
                v-model="form.price"
                type="number"
                min="0"
                step="0.01"
                placeholder="550.00"
              />

            </div>


            <div class="add-product_form-group">

              <label>MINIMUM ORDER QUANTITY (MOQ)</label>

              <input
                v-model="form.moq"
                type="number"
                min="1"
                placeholder="10"
              />

            </div>

          </div>


          <div class="add-product_form-group">

            <label>BULK DISCOUNT TIERS</label>

            <div class="add-product_discount-grid">

              <!-- Tier 1 -->
              <div class="add-product_discount-card">

                <strong>10 - 49 packs</strong>

                <span>
                  Base price (R 550)
                </span>

              </div>


              <!-- Tier 2 -->
              <div class="add-product_discount-card">

                <strong>50 - 99 packs</strong>

                <span>
                  5% off (R 522.50)
                </span>

              </div>


              <!-- Tier 3 -->
              <div class="add-product_discount-card">

                <strong>100+ packs</strong>

                <span>
                  10% off (R 495.00)
                </span>

              </div>

            </div>

          </div>

        </section>

      </div>


      <!-- =================================================== RIGHT COLUMN ==================================================== -->
      <div class="add-product_right-column">

        <!-- =============================================== PRODUCT MEDIA ================================================ -->
        <section class="add-product_card">

          <h2>Product Media</h2>


          <input
            ref="fileInput"
            type="file"
            accept="image/jpeg,image/png"
            multiple
            class="add-product_hidden-file-input"
            @change="onFileInputChange"
          />


          <div
            class="add-product_upload-area"
            :class="{
              'add-product_is-dragover': isDragOver
            }"
            @click="openFilePicker"
            @dragover.prevent="isDragOver = true"
            @dragleave.prevent="isDragOver = false"
            @drop.prevent="onDrop"
          >

            <div class="add-product_upload-icon">
              ↥
            </div>

            <strong>
              Drag product images here
            </strong>

            <span>
              Supports JPG, PNG (Max 5MB)
            </span>

          </div>


          <p
            v-if="uploadError"
            class="add-product_upload-error"
          >
            {{ uploadError }}
          </p>


          <div class="add-product_image-preview">

            <div
              class="add-product_thumbnail"
              v-for="(image, index) in images"
              :key="image.id"
            >

              <img
                :src="image.url"
                :alt="image.name"
              />

              <button
                type="button"
                class="add-product_remove-image"
                title="Remove image"
                @click.stop="removeImage(index)"
              >
                ×
              </button>

            </div>


            <button
              type="button"
              class="add-product_add-image"
              title="Add image"
              @click="openFilePicker"
            >
              +
            </button>

          </div>

        </section>


        <!-- =============================================== INVENTORY ================================================ -->
        <section class="add-product_card">

          <h2>
            Inventory &amp; Logistics
          </h2>


          <div class="add-product_two-columns">

            <div class="add-product_form-group">

              <label>INITIAL STOCK QTY</label>

              <input
                v-model="form.quantity"
                type="number"
                min="0"
                placeholder="500"
              />

            </div>


            <div class="add-product_form-group">

              <label>LOW STOCK ALERT</label>

              <input
                v-model="form.low_stock_threshold"
                type="number"
                min="0"
                placeholder="50"
              />

            </div>

          </div>


          <div class="add-product_form-group">

            <label>SHIPPING WEIGHT (PER PACK)</label>

            <input
              v-model="form.shipping_weight"
              type="text"
              placeholder="2.5 kg"
            />

          </div>


          <!-- SUCCESS MESSAGE -->
          <p
            v-if="successMessage"
            class="add-product_success-message"
          >
            {{ successMessage }}
          </p>


          <!-- ERROR MESSAGE -->
          <p
            v-if="errorMessage"
            class="add-product_error-message"
          >
            {{ errorMessage }}
          </p>


          <!-- Publish -->
          <button
            type="button"
            class="add-product_publish-button"
            :disabled="isPublishing"
            @click="publishProduct"
          >
            {{
              isPublishing
                ? "Publishing..."
                : "Publish Product"
            }}
          </button>


          <!-- Draft -->
          <button
            type="button"
            class="add-product_draft-button"
            @click="saveDraft"
          >
            Save as Draft
          </button>

        </section>

      </div>

    </div>

  </div>
</template>

<script>
import { api } from "@/services/api";

export default {
  name: "AddProducts",

  data() {
    return {
      /* =====================================================
         FORM DATA
         ===================================================== */

      form: {
        product_name: "",
        category_name: "",
        sku: "",
        description: "",
        price: "",
        unit: "pack",
        quantity: "",
        low_stock_threshold: "",
        moq: "",
        shipping_weight: "",
        product_image: null
      },

      /* =====================================================
         IMAGE
         ===================================================== */

      selectedImage: null,
      imagePreview: null,

      /* =====================================================
         BULK DISCOUNTS
         ===================================================== */

      bulkDiscounts: [
        {
          min_quantity: 10,
          max_quantity: 49,
          discount_percentage: 5
        },
        {
          min_quantity: 50,
          max_quantity: 99,
          discount_percentage: 10
        },
        {
          min_quantity: 100,
          max_quantity: null,
          discount_percentage: 15
        }
      ],

      /* =====================================================
         FORM STATE
         ===================================================== */

      loading: false,
      savingDraft: false,

      error: "",
      successMessage: "",

      /* =====================================================
         VALIDATION ERRORS
         ===================================================== */

      validationErrors: {}
    };
  },

  computed: {
    /* =====================================================
       SUPPLIER ID
       ===================================================== */

    supplierId() {
      return Number(
        import.meta.env.VITE_SUPPLIER_ID
      );
    },

    /* =====================================================
       FORM VALID
       ===================================================== */

    isFormValid() {
      return (
        this.form.product_name.trim() !== "" &&
        this.form.category_name.trim() !== "" &&
        this.form.price !== "" &&
        Number(this.form.price) >= 0 &&
        this.form.quantity !== "" &&
        Number.isInteger(
          Number(this.form.quantity)
        ) &&
        Number(this.form.quantity) >= 0
      );
    }
  },

  methods: {
    /* =====================================================
       CLEAR MESSAGES
       ===================================================== */

    clearMessages() {
      this.error = "";
      this.successMessage = "";
    },

    /* =====================================================
       HANDLE IMAGE
       ===================================================== */

    handleImageUpload(event) {
      this.clearMessages();

      const file =
        event.target.files?.[0];

      if (!file) {
        this.selectedImage = null;
        this.imagePreview = null;
        return;
      }

      /* ---------------------------------------------------
         FILE TYPE
         --------------------------------------------------- */

      const allowedTypes = [
        "image/jpeg",
        "image/png"
      ];

      if (
        !allowedTypes.includes(
          file.type
        )
      ) {
        this.error =
          "Only JPG and PNG images are allowed.";

        event.target.value = "";

        return;
      }

      /* ---------------------------------------------------
         FILE SIZE
         --------------------------------------------------- */

      const maxSize =
        5 * 1024 * 1024;

      if (file.size > maxSize) {
        this.error =
          "Image size must be 5MB or less.";

        event.target.value = "";

        return;
      }

      /* ---------------------------------------------------
         SAVE FILE
         --------------------------------------------------- */

      this.selectedImage = file;

      /*
       * At this stage the backend does not yet
       * support multipart image uploads.
       *
       * Therefore the image is previewed here,
       * but product_image will remain null when
       * the product is submitted.
       */

      const reader =
        new FileReader();

      reader.onload = (e) => {
        this.imagePreview =
          e.target.result;
      };

      reader.readAsDataURL(file);
    },

    /* =====================================================
       REMOVE IMAGE
       ===================================================== */

    removeImage() {
      this.selectedImage = null;
      this.imagePreview = null;

      const input =
        this.$refs.imageInput;

      if (input) {
        input.value = "";
      }

      this.form.product_image =
        null;
    },

    /* =====================================================
       VALIDATE FORM
       ===================================================== */

    validateForm() {
      this.validationErrors = {};

      let valid = true;

      /* ---------------------------------------------------
         PRODUCT NAME
         --------------------------------------------------- */

      if (
        !this.form.product_name.trim()
      ) {
        this.validationErrors.product_name =
          "Product name is required.";

        valid = false;
      }

      /* ---------------------------------------------------
         CATEGORY
         --------------------------------------------------- */

      if (
        !this.form.category_name.trim()
      ) {
        this.validationErrors.category_name =
          "Category is required.";

        valid = false;
      }

      /* ---------------------------------------------------
         PRICE
         --------------------------------------------------- */

      if (
        this.form.price === "" ||
        this.form.price === null
      ) {
        this.validationErrors.price =
          "Price is required.";

        valid = false;
      } else if (
        Number(this.form.price) < 0
      ) {
        this.validationErrors.price =
          "Price cannot be negative.";

        valid = false;
      }

      /* ---------------------------------------------------
         QUANTITY
         --------------------------------------------------- */

      if (
        this.form.quantity === "" ||
        this.form.quantity === null
      ) {
        this.validationErrors.quantity =
          "Quantity is required.";

        valid = false;
      } else if (
        !Number.isInteger(
          Number(this.form.quantity)
        ) ||
        Number(this.form.quantity) < 0
      ) {
        this.validationErrors.quantity =
          "Quantity must be a non-negative whole number.";

        valid = false;
      }

      /* ---------------------------------------------------
         LOW STOCK THRESHOLD
         --------------------------------------------------- */

      if (
        this.form.low_stock_threshold !==
          "" &&
        (
          !Number.isInteger(
            Number(
              this.form
                .low_stock_threshold
            )
          ) ||
          Number(
            this.form
              .low_stock_threshold
          ) < 0
        )
      ) {
        this.validationErrors.low_stock_threshold =
          "Low stock threshold must be a non-negative whole number.";

        valid = false;
      }

      /* ---------------------------------------------------
         MOQ
         --------------------------------------------------- */

      if (
        this.form.moq !== "" &&
        (
          !Number.isInteger(
            Number(this.form.moq)
          ) ||
          Number(this.form.moq) < 0
        )
      ) {
        this.validationErrors.moq =
          "MOQ must be a non-negative whole number.";

        valid = false;
      }

      /* ---------------------------------------------------
         SHIPPING WEIGHT
         --------------------------------------------------- */

      if (
        this.form.shipping_weight !==
          "" &&
        Number(
          this.form.shipping_weight
        ) < 0
      ) {
        this.validationErrors.shipping_weight =
          "Shipping weight cannot be negative.";

        valid = false;
      }

      return valid;
    },

    /* =====================================================
       BUILD PRODUCT PAYLOAD
       ===================================================== */

    buildProductPayload() {
      /*
       * These are the fields currently supported
       * by the backend product API.
       *
       * MOQ, shipping weight and bulk discount
       * information are intentionally not included
       * because the current backend/database does
       * not persist those values yet.
       */

      return {
        supplier_id:
          this.supplierId,

        product_name:
          this.form.product_name.trim(),

        category_name:
          this.form.category_name.trim(),

        sku:
          this.form.sku.trim() ||
          null,

        description:
          this.form.description.trim() ||
          null,

        price:
          Number(this.form.price),

        unit:
          this.form.unit ||
          "pack",

        quantity:
          Number(this.form.quantity),

        low_stock_threshold:
          this.form
            .low_stock_threshold ===
          ""
            ? 0
            : Number(
                this.form
                  .low_stock_threshold
              ),

        /*
         * Image upload has not yet been
         * connected to the backend.
         */
        product_image:
          null
      };
    },

    /* =====================================================
       ADD PRODUCT
       ===================================================== */

    async submitProduct() {
      this.clearMessages();

      /* ---------------------------------------------------
         VALIDATE
         --------------------------------------------------- */

      if (!this.validateForm()) {
        this.error =
          "Please correct the highlighted fields.";

        return;
      }

      /* ---------------------------------------------------
         SUPPLIER
         --------------------------------------------------- */

      if (!this.supplierId) {
        this.error =
          "Supplier ID is not configured. Please set VITE_SUPPLIER_ID in your frontend .env file.";

        return;
      }

      this.loading = true;

      try {
        /* -------------------------------------------------
           CREATE PRODUCT
           ------------------------------------------------- */

        const data =
          await api.createProduct(
            this.buildProductPayload()
          );

        console.log(
          "Product created:",
          data
        );

        this.successMessage =
          data.message ||
          "Product created successfully.";

        /* -------------------------------------------------
           RESET FORM
           ------------------------------------------------- */

        this.resetForm();

        /*
         * Keep the success message visible
         * briefly so the user knows that the
         * product was saved.
         */

        setTimeout(() => {
          this.successMessage = "";
        }, 4000);

      } catch (err) {
        console.error(
          "Failed to create product:",
          err
        );

        this.error =
          err.message ||
          "Failed to create product. Please try again.";
      } finally {
        this.loading = false;
      }
    },

    /* =====================================================
       SAVE DRAFT
       ===================================================== */

    async saveDraft() {
      this.clearMessages();

      /*
       * Draft functionality is not currently
       * supported by the backend.
       *
       * Do not send a fake request.
       */

      this.error =
        "Draft saving is not connected to the backend yet. Please use Add Product to save the product.";
    },

    /* =====================================================
       RESET FORM
       ===================================================== */

    resetForm() {
      this.form = {
        product_name: "",
        category_name: "",
        sku: "",
        description: "",
        price: "",
        unit: "pack",
        quantity: "",
        low_stock_threshold: "",
        moq: "",
        shipping_weight: "",
        product_image: null
      };

      this.removeImage();

      this.validationErrors = {};
    },

    /* =====================================================
       ADD DISCOUNT TIER
       ===================================================== */

    addDiscountTier() {
      this.bulkDiscounts.push({
        min_quantity: "",
        max_quantity: "",
        discount_percentage: ""
      });
    },

    /* =====================================================
       REMOVE DISCOUNT TIER
       ===================================================== */

    removeDiscountTier(index) {
      if (
        this.bulkDiscounts.length <= 1
      ) {
        return;
      }

      this.bulkDiscounts.splice(
        index,
        1
      );
    }
  }
};
</script>

<style scoped>

/* =========================================================
   PRODUCTS PAGE
========================================================= */

.add-product_page {
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

.add-product_page-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
  margin-bottom: 30px;
}

.add-product_page-header-content {
  min-width: 0;
}

.add-product_page-header h1 {
  margin: 0 0 8px;
  font-family: Georgia, serif;
  font-size: 30px;
  font-weight: 700;
  line-height: 1.2;
  color: #57372f;
}

.add-product_page-header p {
  margin: 0;
  max-width: 650px;
  color: #82736d;
  font-size: 14px;
  line-height: 1.6;
}


/* =========================================================
   SEARCH
========================================================= */

.add-product_search-box {
  width: 280px;
  min-width: 220px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 15px;
  background: #ffffff;
  border: 1px solid #e5dfda;
  border-radius: 25px;
  box-sizing: border-box;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.add-product_search-box:focus-within {
  border-color: #d47b48;
  box-shadow:
    0 0 0 3px rgba(212, 123, 72, 0.1);
}

.add-product_search-icon {
  font-size: 19px;
  color: #806f68;
  flex-shrink: 0;
}

.add-product_search-box input {
  width: 100%;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-size: 13px;
  color: #543b34;
}

.add-product_search-box input::placeholder {
  color: #aaa09b;
}


/* =========================================================
   MESSAGES
========================================================= */

.add-product_success-message {
  margin-bottom: 20px;
  padding: 12px 16px;
  background: #e9f7e8;
  border: 1px solid #c9e6c7;
  border-radius: 9px;
  color: #3d7f42;
  font-size: 13px;
}

.add-product_error-message {
  margin-bottom: 20px;
  padding: 12px 16px;
  background: #fff0ed;
  border: 1px solid #f0cfc8;
  border-radius: 9px;
  color: #c0392b;
  font-size: 13px;
}


/* =========================================================
   MAIN GRID
========================================================= */

.add-product_content-grid {
  width: 100%;
  display: grid;

  grid-template-columns:
    minmax(0, 1.6fr) minmax(300px, 1fr);

  gap: 24px;

  box-sizing: border-box;
}

.add-product_left-column,
.add-product_right-column {
  min-width: 0;

  display: flex;
  flex-direction: column;

  gap: 24px;
}


/* =========================================================
   CARDS
========================================================= */

.add-product_card {
  width: 100%;

  background: #ffffff;

  border: 1px solid #e5dfda;

  border-radius: 16px;

  padding: 26px;

  box-sizing: border-box;

  box-shadow:
    0 4px 15px rgba(84, 59, 52, 0.04);
}

.add-product_card h2 {
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

.add-product_form-group {
  width: 100%;
  margin-bottom: 20px;
}

.add-product_form-group:last-child {
  margin-bottom: 0;
}

.add-product_form-group label {
  display: block;

  margin-bottom: 8px;

  font-size: 10px;

  font-weight: 700;

  letter-spacing: 0.5px;

  color: #806f68;
}

.add-product_form-group input,
.add-product_form-group select,
.add-product_form-group textarea {
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

.add-product_form-group input::placeholder,
.add-product_form-group textarea::placeholder {
  color: #aaa09b;
}

.add-product_form-group input:focus,
.add-product_form-group select:focus,
.add-product_form-group textarea:focus {
  border-color: #d47b48;

  background: #ffffff;

  box-shadow:
    0 0 0 3px rgba(212, 123, 72, 0.1);
}

.add-product_form-group textarea {
  min-height: 125px;

  resize: vertical;

  line-height: 1.5;
}


/* =========================================================
   TWO COLUMNS
========================================================= */

.add-product_two-columns {
  width: 100%;

  display: grid;

  grid-template-columns:
    minmax(0, 1fr) minmax(0, 1fr);

  gap: 18px;
}


/* =========================================================
   DISCOUNT GRID
========================================================= */

.add-product_discount-grid {
  width: 100%;

  display: grid;

  grid-template-columns:
    repeat(3, minmax(0, 1fr));

  gap: 12px;
}

.add-product_discount-card {
  min-width: 0;

  padding: 15px;

  background: #faf8f6;

  border: 1px solid #e7e1dc;

  border-radius: 10px;

  box-sizing: border-box;

  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.add-product_discount-card:hover {
  transform: translateY(-2px);

  border-color: #d47b48;

  box-shadow:
    0 4px 12px rgba(84, 59, 52, 0.08);
}

.add-product_discount-card strong {
  display: block;

  margin-bottom: 6px;

  font-size: 13px;

  line-height: 1.3;

  color: #63463c;
}

.add-product_discount-card span {
  display: block;

  font-size: 11px;

  line-height: 1.4;

  color: #8b5a43;
}


/* =========================================================
   HIDDEN FILE INPUT
========================================================= */

.add-product_hidden-file-input {
  display: none;
}


/* =========================================================
   UPLOAD ERROR
========================================================= */

.add-product_upload-error {
  margin: -8px 0 18px;

  font-size: 12px;

  color: #c0392b;
}


/* =========================================================
   UPLOAD AREA
========================================================= */

.add-product_upload-area {
  width: 100%;

  min-height: 155px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  box-sizing: border-box;

  background: #faf8f6;

  border: 2px dashed #d9d0ca;

  border-radius: 12px;

  margin-bottom: 18px;

  cursor: pointer;

  transition:
    border-color 0.2s ease,
    background 0.2s ease;
}

.add-product_upload-area:hover,
.add-product_upload-area.add-product_is-dragover {
  border-color: #d47b48;

  background: #fffaf7;
}

.add-product_upload-icon {
  color: #d47b48;

  font-size: 30px;

  line-height: 1;

  margin-bottom: 10px;
}

.add-product_upload-area strong {
  font-size: 13px;

  color: #68554e;
}

.add-product_upload-area span {
  margin-top: 6px;

  font-size: 11px;

  color: #9a8d87;
}


/* =========================================================
   IMAGE PREVIEW
========================================================= */

.add-product_image-preview {
  display: flex;

  align-items: center;

  gap: 12px;

  flex-wrap: wrap;
}

.add-product_thumbnail,
.add-product_add-image {
  width: 68px;

  height: 68px;

  border-radius: 10px;

  border: 1px solid #e3ddd7;

  display: flex;

  align-items: center;

  justify-content: center;

  box-sizing: border-box;

  background: #f8f6f3;
}

.add-product_thumbnail {
  position: relative;

  overflow: hidden;

  font-size: 27px;
}

.add-product_thumbnail img {
  width: 100%;

  height: 100%;

  object-fit: cover;

  display: block;
}


/* =========================================================
   REMOVE IMAGE
========================================================= */

.add-product_remove-image {
  position: absolute;

  top: 2px;

  right: 2px;

  width: 18px;

  height: 18px;

  padding: 0;

  border: none;

  border-radius: 50%;

  background: rgba(84, 59, 52, 0.65);

  color: #ffffff;

  font-size: 12px;

  line-height: 1;

  cursor: pointer;

  display: flex;

  align-items: center;

  justify-content: center;

  transition:
    background 0.2s ease;
}

.add-product_remove-image:hover {
  background: #c0392b;
}


/* =========================================================
   ADD IMAGE
========================================================= */

.add-product_add-image {
  cursor: pointer;

  font-size: 27px;

  color: #806f68;

  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}

.add-product_add-image:hover {
  background: #fffaf7;

  border-color: #d47b48;

  color: #d47b48;
}


/* =========================================================
   BUTTONS
========================================================= */

.add-product_publish-button,
.add-product_draft-button {
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


/* Publish */

.add-product_publish-button {
  margin-top: 24px;

  background: #d47b48;

  border: none;

  color: #ffffff;

  box-shadow:
    0 4px 10px rgba(212, 123, 72, 0.2);
}

.add-product_publish-button:hover {
  background: #c76d3b;

  transform: translateY(-2px);

  box-shadow:
    0 6px 14px rgba(212, 123, 72, 0.25);
}

.add-product_publish-button:disabled {
  opacity: 0.65;

  cursor: not-allowed;

  transform: none;
}


/* Draft */

.add-product_draft-button {
  margin-top: 10px;

  background: #ffffff;

  border: 1px solid #e4dcd6;

  color: #634c44;
}

.add-product_draft-button:hover {
  background: #f8f6f3;

  border-color: #d47b48;
}


/* =========================================================
   LARGE TABLET
========================================================= */

@media (max-width: 1200px) {

  .add-product_page {
    padding: 28px;
  }

  .add-product_content-grid {
    grid-template-columns:
      minmax(0, 1.4fr) minmax(280px, 1fr);

    gap: 20px;
  }

  .add-product_card {
    padding: 22px;
  }

}


/* =========================================================
   TABLET
========================================================= */

@media (max-width: 1000px) {

  .add-product_page {
    padding: 24px;
  }

  .add-product_page-header {
    align-items: flex-start;
  }

  .add-product_search-box {
    width: 240px;

    min-width: 200px;
  }

  .add-product_content-grid {
    grid-template-columns: 1fr;
  }

  .add-product_right-column {
    display: grid;

    grid-template-columns:
      minmax(0, 1fr) minmax(0, 1fr);

    gap: 20px;
  }

}


/* =========================================================
   SMALL TABLET
========================================================= */

@media (max-width: 800px) {

  .add-product_page-header {
    flex-direction: column;

    align-items: stretch;

    gap: 18px;
  }

  .add-product_search-box {
    width: 100%;

    max-width: none;
  }

  .add-product_right-column {
    display: flex;

    flex-direction: column;
  }

  .add-product_discount-grid {
    grid-template-columns:
      repeat(3, minmax(0, 1fr));
  }

}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 700px) {

  .add-product_page {
    padding: 18px;
  }

  .add-product_page-header {
    margin-bottom: 22px;
  }

  .add-product_page-header h1 {
    font-size: 27px;
  }

  .add-product_page-header p {
    font-size: 13px;
  }

  .add-product_content-grid {
    grid-template-columns: 1fr;

    gap: 18px;
  }

  .add-product_left-column,
  .add-product_right-column {
    gap: 18px;
  }

  .add-product_card {
    padding: 19px;

    border-radius: 14px;
  }

  .add-product_card h2 {
    font-size: 17px;

    margin-bottom: 18px;
  }

  .add-product_two-columns {
    grid-template-columns: 1fr;

    gap: 0;
  }

  .add-product_discount-grid {
    grid-template-columns: 1fr;

    gap: 10px;
  }

  .add-product_upload-area {
    min-height: 140px;
  }

}


/* =========================================================
   SMALL MOBILE
========================================================= */

@media (max-width: 450px) {

  .add-product_page {
    padding: 12px;
  }

  .add-product_page-header h1 {
    font-size: 24px;
  }

  .add-product_page-header p {
    font-size: 12px;
  }

  .add-product_card {
    padding: 16px;

    border-radius: 12px;
  }

  .add-product_card h2 {
    font-size: 16px;
  }

  .add-product_form-group input,
  .add-product_form-group select,
  .add-product_form-group textarea {
    font-size: 12px;

    padding: 12px;
  }

  .add-product_thumbnail,
  .add-product_add-image {
    width: 60px;

    height: 60px;
  }

  .add-product_publish-button,
  .add-product_draft-button {
    padding: 13px;
  }

}

</style>