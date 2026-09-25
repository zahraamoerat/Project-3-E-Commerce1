<template>
  <div class="supplier_add_products_form-page">
    <header class="supplier_add_products_form-header">
      <RouterLink
        to="/supplier/products"
        class="supplier_add_products_back-link"
        ><span aria-hidden="true">&#8592;</span> Back to product
        list</RouterLink
      >
      <div class="supplier_add_products_header-title-row">
        <div>
          <span class="supplier_add_products_eyebrow">PRODUCT CATALOG</span>
          <h1>Add New Product</h1>
          <p>
            Build a clear listing buyers can discover, understand, and order.
          </p>
        </div>
        <span class="supplier_add_products_required-note"
          ><b>*</b> Required fields</span
        >
      </div>
    </header>
    <div v-if="message" class="supplier_add_products_notice">{{ message }}</div>
    <div
      v-if="error"
      class="supplier_add_products_notice supplier_add_products_error"
    >
      {{ error }}
    </div>
    <form class="supplier_add_products_form-layout" @submit.prevent="publish">
      <div class="supplier_add_products_form-column">
        <section class="supplier_add_products_form-section">
          <div class="supplier_add_products_section-heading">
            <span class="supplier_add_products_section-number">01</span>
            <div>
              <h2>Description</h2>
              <p>Start with the details buyers see first.</p>
            </div>
          </div>
          <label
            >Product Name<input
              v-model.trim="form.product_name"
              placeholder="Product name"
              required
          /></label>
          <label
            >Business Description
            <span class="supplier_add_products_field-action"
              >Update .txt file</span
            >
            <textarea
              v-model.trim="form.description"
              rows="6"
              placeholder="Tell buyers about this product..."
            ></textarea>
          </label>
        </section>

        <section class="supplier_add_products_form-section">
          <div class="supplier_add_products_section-heading">
            <span class="supplier_add_products_section-number">02</span>
            <div>
              <h2>Category</h2>
              <p>Place this product in the right collection.</p>
            </div>
          </div>
          <label
            >Product Category<select
              v-model="form.category_name"
              required
              :disabled="categoriesLoading"
            >
              <option disabled value="">Select a category</option>
              <option
                v-for="category in categories"
                :key="category.category_id"
                :value="category.category_name"
              >
                {{ category.category_name }}
              </option>
            </select></label
          >
          <p v-if="categoriesError" class="supplier_add_products_field-error">
            {{ categoriesError }}
          </p>
          <label
            >Subcategory<select v-model="form.subcategory">
              <option value="">Select a subcategory</option>
              <option>Beauty</option>
              <option>Packaging</option>
              <option>Wholesale goods</option>
            </select></label
          >
        </section>

        <section class="supplier_add_products_form-section">
          <div class="supplier_add_products_section-heading">
            <span class="supplier_add_products_section-number">03</span>
            <div>
              <h2>Inventory</h2>
              <p>Set the available quantity and tracking code.</p>
            </div>
          </div>
          <div class="supplier_add_products_two-columns">
            <label
              >Quantity<input
                v-model.number="form.quantity"
                type="number"
                min="0"
                step="1"
                required
              /><small class="supplier_add_products_validation-hint"
                >Whole numbers only.</small
              ></label
            >
            <label
              >SKU (Optional)<input
                v-model.trim="form.sku"
                maxlength="40"
                pattern="[A-Za-z0-9][A-Za-z0-9._-]{2,39}"
                placeholder="UGG-BB-PUR-06"
              /><small class="supplier_add_products_validation-hint"
                >3–40 letters, numbers, dots, underscores or hyphens.</small
              ></label
            >
          </div>
        </section>

        <section
          class="supplier_add_products_form-section supplier_add_products_selling-type"
        >
          <div class="supplier_add_products_section-heading">
            <span class="supplier_add_products_section-number">04</span>
            <div>
              <h2>Selling Type</h2>
              <p>Choose where buyers can purchase this item.</p>
            </div>
          </div>
          <label class="supplier_add_products_check-label"
            ><input v-model="form.sellingType" value="online" type="radio" />
            In-store selling only</label
          >
          <label class="supplier_add_products_check-label"
            ><input
              v-model="form.sellingType"
              value="online-only"
              type="radio"
            />
            Online selling only</label
          >
          <label class="supplier_add_products_check-label"
            ><input v-model="form.sellingType" value="both" type="radio" />
            Available both in-store and online</label
          >
        </section>

        <section
          class="supplier_add_products_form-section supplier_add_products_variant-section"
        >
          <div class="supplier_add_products_section-heading">
            <span class="supplier_add_products_section-number">05</span>
            <div>
              <h2>Variant</h2>
              <p>Offer different versions of the same product.</p>
            </div>
          </div>
          <div class="supplier_add_products_variant-row">
            <span>Product variants</span
            ><button type="button" class="supplier_add_products_add-variant">
              + Add Variant
            </button>
          </div>
        </section>
      </div>

      <div class="supplier_add_products_form-column">
        <section
          class="supplier_add_products_form-section supplier_add_products_image-section"
        >
          <div class="supplier_add_products_section-heading">
            <span class="supplier_add_products_section-number">06</span>
            <div>
              <h2>
                Product Images
                <span
                  class="supplier_add_products_info-icon"
                  title="Add clear product images"
                  >i</span
                >
              </h2>
              <p>Use bright, clear images to build buyer confidence.</p>
            </div>
          </div>
          <button
            type="button"
            class="supplier_add_products_upload-zone"
            @click="$refs.fileInput.click()"
          >
            <span class="supplier_add_products_upload-icon">&#8615;</span>
            <strong>Click to upload or drag and drop</strong>
            <small>Max 10mb file size, only png and jpeg files.</small>
          </button>
          <div
            v-if="form.images.length"
            class="supplier_add_products_thumbnail-strip"
          >
            <div
              v-for="(image, index) in form.images"
              :key="image"
              class="supplier_add_products_thumbnail-tile"
            >
              <img :src="image" :alt="`Selected product image ${index + 1}`" />
              <button
                type="button"
                :aria-label="`Remove image ${index + 1}`"
                @click="removeImage(index)"
              >
                &#215;
              </button>
            </div>
          </div>
          <input
            ref="fileInput"
            type="file"
            accept="image/png,image/jpeg"
            multiple
            hidden
            @change="selectImages"
          />
        </section>

        <section class="supplier_add_products_form-section">
          <div class="supplier_add_products_section-heading">
            <span class="supplier_add_products_section-number">07</span>
            <div>
              <h2>Shipping and Delivery</h2>
              <p>Help buyers estimate handling and delivery requirements.</p>
            </div>
          </div>
          <label
            >Items Weight
            <div class="supplier_add_products_input-suffix">
              <input
                v-model.number="form.weight"
                type="number"
                min="0"
                placeholder="12.00"
              /><span>kg</span>
            </div></label
          >
          <label
            >Package Size
            <span class="supplier_add_products_hint"
              >(The package you use to ship your product)</span
            ></label
          >
          <div class="supplier_add_products_three-columns">
            <label
              >Length
              <div class="supplier_add_products_input-suffix">
                <input
                  v-model.number="form.length"
                  type="number"
                  min="0"
                  placeholder="12.00"
                /><span>in</span>
              </div></label
            >
            <label
              >Breadth
              <div class="supplier_add_products_input-suffix">
                <input
                  v-model.number="form.breadth"
                  type="number"
                  min="0"
                  placeholder="12.00"
                /><span>in</span>
              </div></label
            >
            <label
              >Width
              <div class="supplier_add_products_input-suffix">
                <input
                  v-model.number="form.width"
                  type="number"
                  min="0"
                  placeholder="12.00"
                /><span>in</span>
              </div></label
            >
          </div>
        </section>

        <section
          class="supplier_add_products_form-section supplier_add_products_pricing-section"
        >
          <div class="supplier_add_products_section-heading">
            <span class="supplier_add_products_section-number">08</span>
            <div>
              <h2>Pricing</h2>
              <p>Set your wholesale price and comparison price.</p>
            </div>
          </div>
          <div class="supplier_add_products_two-columns">
            <label
              >Price
              <div class="supplier_add_products_input-prefix">
                <span>$</span
                ><input
                  v-model.number="form.price"
                  type="number"
                  min="0"
                  required
                  placeholder="180.00"
                /></div
            ></label>
            <label
              >Compare at Price
              <span
                class="supplier_add_products_info-icon"
                title="Original price"
                >i</span
              >
              <div class="supplier_add_products_input-prefix">
                <span>$</span
                ><input
                  v-model.number="form.comparePrice"
                  type="number"
                  min="0"
                  placeholder="320.00"
                />
              </div>
            </label>
          </div>
        </section>

        <div class="supplier_add_products_form-actions">
          <button
            type="button"
            class="supplier_add_products_discard-button"
            @click="router.push('/products')"
          >
            Discard</button
          ><button
            type="button"
            class="supplier_add_products_schedule-button"
            @click="saveDraft"
          >
            Save as draft</button
          ><button
            type="submit"
            class="supplier_add_products_primary-button"
            :disabled="saving"
          >
            {{ saving ? "Saving…" : "Add Product" }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useSupplierData } from "@/data/supplierData";
const router = useRouter();
const {
  addProduct,
  uploadProductImages,
  cleanupProductImages,
  imagePlaceholders,
  categories,
  categoriesLoading,
  categoriesError,
  loadCategories,
} = useSupplierData();
loadCategories();
const message = ref("");
const error = ref("");
const saving = ref(false);
const form = reactive({
  product_name: "",
  category_name: "",
  subcategory: "",
  sku: "",
  description: "",
  price: null,
  comparePrice: null,
  quantity: 0,
  low_stock_threshold: 10,
  unit: "pack",
  sellingType: "online",
  weight: null,
  length: null,
  breadth: null,
  width: null,
  images: [],
});
function imageKey(source) {
  return `${source}-${Math.random()}`;
}
function selectImages(event) {
  const files = [...(event.target.files || [])];
  const rejected = [];
  for (const file of files) {
    if (form.images.length >= 8) {
      rejected.push("Maximum of 8 product images allowed.");
      break;
    }
    if (!["image/png", "image/jpeg"].includes(file.type))
      rejected.push(`${file.name}: PNG/JPEG only`);
    else if (file.size > 10 * 1024 * 1024)
      rejected.push(`${file.name}: larger than 10MB`);
    else form.images.push(URL.createObjectURL(file));
  }
  if (rejected.length) error.value = rejected.join(" • ");
  event.target.value = "";
}
function removeImage(index) {
  const image = form.images[index];
  if (image?.startsWith("blob:")) URL.revokeObjectURL(image);
  form.images.splice(index, 1);
}
function validate() {
  if (form.description.length > 2000)
    return "Description must be 2000 characters or fewer.";
  if (
    [form.weight, form.length, form.breadth, form.width].some(
      (v) =>
        v !== null &&
        v !== "" &&
        (!Number.isFinite(Number(v)) || Number(v) < 0),
    )
  )
    return "Weight and package dimensions must be non-negative numbers.";
  if (form.product_name.trim().length < 3)
    return "Product name must be at least 3 characters.";
  if (!form.category_name) return "Select a product category.";
  if (!Number.isFinite(Number(form.price)) || Number(form.price) <= 0)
    return "Price must be greater than zero.";
  if (
    form.comparePrice !== null &&
    form.comparePrice !== "" &&
    Number(form.comparePrice) < Number(form.price)
  )
    return "Compare at price must be greater than or equal to the selling price.";
  if (!Number.isInteger(Number(form.quantity)) || Number(form.quantity) < 0)
    return "Quantity must be a non-negative whole number.";
  if (
    !Number.isInteger(Number(form.low_stock_threshold)) ||
    Number(form.low_stock_threshold) < 0
  )
    return "Low-stock threshold must be a non-negative whole number.";
  if (form.sku && !/^[A-Za-z0-9][A-Za-z0-9._-]{2,39}$/.test(form.sku))
    return "SKU must be 3–40 characters and use only letters, numbers, dots, underscores or hyphens.";
  return "";
}
async function publish() {
  error.value = "";
  const validation = validate();
  if (validation) {
    error.value = validation;
    return;
  }
  saving.value = true;
  let uploadedUrls = [];
  try {
    const images = await uploadProductImages(form.images, (urls) => {
      uploadedUrls = urls;
    });
    await addProduct({
      ...form,
      product_name: form.product_name.trim(),
      description: form.description.trim(),
      image: images[0] || imagePlaceholders.packaging,
      images,
    });
    message.value = "Product published successfully.";
    setTimeout(() => router.push("/products"), 500);
  } catch (e) {
    if (uploadedUrls.length) await cleanupProductImages(uploadedUrls);
    error.value = e.message || "Unable to publish the product.";
  } finally {
    saving.value = false;
  }
}
async function saveDraft() {
  error.value = "";
  if (!form.category_name)
    return (error.value = "Select a product category before saving a draft.");
  if (form.product_name) {
    const validation = validate();
    if (validation) {
      error.value = validation;
      return;
    }
  }
  saving.value = true;
  let uploadedUrls = [];
  try {
    const images = await uploadProductImages(form.images, (urls) => {
      uploadedUrls = urls;
    });
    await addProduct({
      ...form,
      product_name: form.product_name.trim() || "Untitled draft",
      category_name: form.category_name,
      image: images[0] || imagePlaceholders.packaging,
      images,
    });
    message.value = "Draft saved.";
    setTimeout(() => router.push("/products"), 500);
  } catch (e) {
    if (uploadedUrls.length) await cleanupProductImages(uploadedUrls);
    error.value = e.message || "Unable to save the draft.";
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.supplier_add_products_form-page {
  min-height: 100vh;
  padding: 34px 38px 64px;
  background: #f6f1ed;
  color: #49352e;
}

.supplier_add_products_form-header,
.supplier_add_products_form-layout {
  width: min(1180px, 100%);
  margin-inline: auto;
}

.supplier_add_products_form-header {
  margin-bottom: 28px;
}

.supplier_add_products_back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  color: #866f65;
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;
}
.supplier_add_products_back-link:hover {
  color: #bd6836;
}

.supplier_add_products_header-title-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
}
.supplier_add_products_eyebrow {
  display: block;
  margin-bottom: 8px;
  color: #bd6836;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.8px;
}
.supplier_add_products_form-header h1 {
  margin: 0;
  color: #3f2d27;
  font-size: clamp(26px, 3vw, 34px);
  line-height: 1.1;
  letter-spacing: -0.6px;
}
.supplier_add_products_form-header p {
  margin: 9px 0 0;
  color: #8e7970;
  font-size: 13px;
}
.supplier_add_products_required-note {
  padding-bottom: 4px;
  color: #907c73;
  font-size: 12px;
  white-space: nowrap;
}
.supplier_add_products_required-note b {
  color: #c76c38;
}

.supplier_add_products_notice {
  width: min(1180px, calc(100% - 76px));
  margin: 0 auto 18px;
  padding: 12px 15px;
  border: 1px solid #cfe1d0;
  border-radius: 10px;
  background: #f3faf3;
  color: #397244;
  font-size: 12px;
}
.supplier_add_products_error {
  border-color: #edc8c1;
  background: #fff3f1;
  color: #a4473c;
}
.supplier_add_products_field-error {
  margin: -8px 0 12px;
  color: #a4473c;
  font-size: 11px;
}

.supplier_add_products_form-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(380px, 0.9fr);
  gap: 24px;
  align-items: start;
}
.supplier_add_products_form-column {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.supplier_add_products_form-section {
  padding: 24px;
  border: 1px solid #e7ddd7;
  border-radius: 16px;
  background: #fffdfb;
  box-shadow: 0 5px 18px rgba(77, 48, 35, 0.045);
}
.supplier_add_products_section-heading {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 21px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee5df;
}
.supplier_add_products_section-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 30px;
  width: 30px;
  height: 30px;
  border: 1px solid #ead2c3;
  border-radius: 9px;
  background: #fbede4;
  color: #bc6637;
  font-size: 10px;
  font-weight: 800;
}
.supplier_add_products_form-section h2 {
  margin: 0;
  color: #4b3730;
  font-size: 16px;
  line-height: 1.25;
}
.supplier_add_products_section-heading p {
  margin: 5px 0 0;
  color: #9a877f;
  font-size: 11px;
  line-height: 1.45;
}
.supplier_add_products_form-section label {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-bottom: 16px;
  color: #66534b;
  font-size: 11px;
  font-weight: 700;
}
.supplier_add_products_form-section label:last-child {
  margin-bottom: 0;
}

.supplier_add_products_field-action {
  position: absolute;
  top: 0;
  right: 0;
  color: #bf6b3d;
  font-size: 10px;
  font-weight: 700;
}
.supplier_add_products_form-section
  label:has(.supplier_add_products_field-action) {
  position: relative;
}

input,
select,
textarea {
  width: 100%;
  min-height: 42px;
  padding: 10px 12px;
  border: 1px solid #ded4ce;
  border-radius: 9px;
  outline: none;
  background: #fff;
  color: #49352e;
  font:
    400 12px/1.4 Arial,
    sans-serif;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
  box-sizing: border-box;
}
input::placeholder,
textarea::placeholder {
  color: #b0a19a;
}
textarea {
  min-height: 132px;
  resize: vertical;
  line-height: 1.55;
}
input:hover,
select:hover,
textarea:hover {
  border-color: #cdbdb4;
}
input:focus,
select:focus,
textarea:focus {
  border-color: #d2875d;
  box-shadow: 0 0 0 3px rgba(210, 135, 93, 0.13);
}
input:disabled,
select:disabled {
  cursor: not-allowed;
  opacity: 0.65;
  background: #f5f0ed;
}

.supplier_add_products_two-columns {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}
.supplier_add_products_three-columns {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}
.supplier_add_products_hint,
.supplier_add_products_validation-hint {
  color: #9f8d84;
  font-size: 10px;
  font-weight: 400;
}
.supplier_add_products_validation-hint {
  margin-top: -2px;
}

.supplier_add_products_input-suffix,
.supplier_add_products_input-prefix {
  display: flex;
  align-items: center;
  min-height: 42px;
  overflow: hidden;
  border: 1px solid #ded4ce;
  border-radius: 9px;
  background: #fff;
}
.supplier_add_products_input-suffix:focus-within,
.supplier_add_products_input-prefix:focus-within {
  border-color: #d2875d;
  box-shadow: 0 0 0 3px rgba(210, 135, 93, 0.13);
}
.supplier_add_products_input-suffix input,
.supplier_add_products_input-prefix input {
  min-width: 0;
  min-height: 40px;
  border: 0;
  box-shadow: none;
  background: transparent;
}
.supplier_add_products_input-suffix span,
.supplier_add_products_input-prefix span {
  flex: 0 0 auto;
  padding: 0 11px;
  color: #99867d;
  font-size: 11px;
  font-weight: 700;
}
.supplier_add_products_input-prefix span {
  border-right: 1px solid #eee5df;
}

.supplier_add_products_upload-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 190px;
  padding: 24px;
  border: 1.5px dashed #dba27f;
  border-radius: 13px;
  background: linear-gradient(180deg, #fffdfa 0%, #fff8f3 100%);
  color: #bc693b;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    transform 0.2s ease;
}
.supplier_add_products_upload-zone:hover {
  border-color: #c97848;
  background: #fff5ee;
  transform: translateY(-1px);
}
.supplier_add_products_upload-icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  margin-bottom: 12px;
  border-radius: 50%;
  background: #f8e4d7;
  color: #bd6c3e;
  font-size: 23px;
}
.supplier_add_products_upload-zone strong {
  font-size: 12px;
}
.supplier_add_products_upload-zone small {
  margin-top: 7px;
  color: #9e8a81;
  font-size: 10px;
  font-weight: 400;
}

.supplier_add_products_thumbnail-strip {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 9px;
  margin-top: 12px;
}
.supplier_add_products_thumbnail-tile {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  border: 1px solid #e3d8d1;
  border-radius: 10px;
  background: #f4ebe6;
}
.supplier_add_products_thumbnail-tile img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.supplier_add_products_thumbnail-tile button {
  position: absolute;
  top: 6px;
  right: 6px;
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.94);
  color: #a84b40;
  font-size: 17px;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(50, 30, 20, 0.12);
}

.supplier_add_products_check-label {
  flex-direction: row !important;
  align-items: center;
  gap: 9px !important;
  margin: 0 0 10px !important;
  color: #66534b !important;
  font-size: 12px !important;
  font-weight: 500 !important;
}
.supplier_add_products_check-label input {
  width: 16px;
  height: 16px;
  min-height: auto;
  margin: 0;
  accent-color: #c66e3c;
}
.supplier_add_products_variant-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 46px;
  padding: 0 13px;
  border: 1px solid #e3d9d2;
  border-radius: 9px;
  background: #fff;
  color: #735f56;
  font-size: 11px;
}
.supplier_add_products_add-variant {
  border: 0;
  background: transparent;
  color: #bd6836;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}

.supplier_add_products_form-actions {
  position: sticky;
  bottom: 16px;
  z-index: 10;
  display: flex;
  justify-content: flex-end;
  gap: 9px;
  margin-top: 2px;
  padding: 13px;
  border: 1px solid #e4d9d2;
  border-radius: 13px;
  background: rgba(255, 253, 251, 0.94);
  box-shadow: 0 8px 24px rgba(64, 41, 30, 0.1);
  backdrop-filter: blur(10px);
}
.supplier_add_products_discard-button,
.supplier_add_products_schedule-button,
.supplier_add_products_primary-button {
  min-height: 40px;
  padding: 0 17px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    background 0.15s ease;
}
.supplier_add_products_discard-button {
  border: 1px solid #ded3cc;
  background: #fff;
  color: #705c53;
}
.supplier_add_products_schedule-button {
  border: 1px solid #efd2c1;
  background: #fff4ed;
  color: #b96235;
}
.supplier_add_products_primary-button {
  border: 1px solid #c46b39;
  background: #bd6836;
  color: #fff;
  box-shadow: 0 4px 10px rgba(189, 104, 54, 0.2);
}
.supplier_add_products_primary-button:hover:not(:disabled) {
  background: #a9572b;
  transform: translateY(-1px);
}
.supplier_add_products_discard-button:hover,
.supplier_add_products_schedule-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 9px rgba(70, 45, 32, 0.08);
}
.supplier_add_products_primary-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

@media (max-width: 1000px) {
  .supplier_add_products_form-page {
    padding-inline: 22px;
  }
  .supplier_add_products_form-layout {
    grid-template-columns: 1fr;
  }
  .supplier_add_products_form-column:last-child {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: start;
  }
  .supplier_add_products_form-actions {
    grid-column: 1 / -1;
  }
}
@media (max-width: 700px) {
  .supplier_add_products_form-page {
    padding: 22px 15px 42px;
  }
  .supplier_add_products_form-header {
    margin-bottom: 22px;
  }
  .supplier_add_products_header-title-row {
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
  }
  .supplier_add_products_form-header h1 {
    font-size: 27px;
  }
  .supplier_add_products_form-column:last-child {
    display: flex;
  }
  .supplier_add_products_form-section {
    padding: 19px;
    border-radius: 13px;
  }
  .supplier_add_products_two-columns,
  .supplier_add_products_three-columns {
    grid-template-columns: 1fr;
  }
  .supplier_add_products_thumbnail-strip {
    grid-template-columns: repeat(4, 1fr);
  }
}
@media (max-width: 480px) {
  .supplier_add_products_form-actions {
    flex-direction: column;
  }
  .supplier_add_products_form-actions button {
    width: 100%;
  }
  .supplier_add_products_required-note {
    white-space: normal;
  }
  .supplier_add_products_upload-zone {
    min-height: 155px;
  }
}
</style>
