<template>
  <div class="supplier_edit_product_edit-page">
    <header class="supplier_edit_product_edit-header">
      <div>
        <span class="supplier_edit_product_eyebrow">CATALOG WORKSPACE</span>
        <h1>Edit product</h1>
        <p>Keep your listing accurate so buyers can order with confidence.</p>
      </div>
      <RouterLink to="/products" class="supplier_edit_product_ghost-button">Back to products</RouterLink>
    </header>

    <div v-if="loading" class="supplier_edit_product_empty" aria-live="polite">
      <div class="supplier_edit_product_spinner" aria-hidden="true"></div>
      <h2>Loading product…</h2>
      <p>Fetching the latest catalog information.</p>
    </div>

    <div v-else-if="pageError" class="supplier_edit_product_empty supplier_edit_product_error" role="alert">
      <h2>Unable to load product</h2>
      <p>{{ pageError }}</p>
      <button type="button" class="supplier_edit_product_primary-button supplier_edit_product_empty-action" @click="reload">Try again</button>
    </div>

    <div v-else-if="!product" class="supplier_edit_product_empty">
      <h2>Product not found</h2>
      <p>The product may have been removed or is no longer available.</p>
      <RouterLink to="/products" class="supplier_edit_product_primary-button supplier_edit_product_empty-action">Return to products</RouterLink>
    </div>

    <form v-else class="supplier_edit_product_edit-grid" @submit.prevent="save">
      <section class="supplier_edit_product_edit-card">
        <span class="supplier_edit_product_eyebrow">LISTING DETAILS</span>
        <h2>{{ form.product_name || product.product_name }}</h2>

        <label :class="{ 'supplier_edit_product_invalid': fieldErrors.product_name }">
          Product name
          <input
            id="product-name"
            v-model.trim="form.product_name"
            type="text"
            autocomplete="off"
            required
            aria-describedby="product-name-help product-name-error"
            @blur="validateField('product_name')"
          />
          <small id="product-name-help" class="supplier_edit_product_hint">Use a clear name buyers will recognise.</small>
          <span v-if="fieldErrors.product_name" id="product-name-error" class="supplier_edit_product_field-error">{{ fieldErrors.product_name }}</span>
        </label>

        <div class="supplier_edit_product_two-columns">
          <label :class="{ 'supplier_edit_product_invalid': fieldErrors.category_name }">
            Category
            <select id="product-category" v-model="form.category_name" :disabled="categoriesLoading" @change="validateField('category_name')" aria-describedby="category-error">
              <option disabled value="">Select a category</option>
              <option v-for="category in categories" :key="category.category_id" :value="category.category_name">{{ category.category_name }}</option>
            </select>
            <span v-if="fieldErrors.category_name" id="category-error" class="supplier_edit_product_field-error">{{ fieldErrors.category_name }}</span>
            <span v-else-if="categoriesError" class="supplier_edit_product_field-error">{{ categoriesError }}</span>
          </label>

          <label :class="{ 'supplier_edit_product_invalid': fieldErrors.sku }">
            SKU
            <input id="product-sku" v-model.trim="form.sku" type="text" autocomplete="off" aria-describedby="sku-help sku-error" @blur="validateField('sku')" />
            <small id="sku-help" class="supplier_edit_product_hint">3–40 characters: letters, numbers, dots, underscores or hyphens.</small>
            <span v-if="fieldErrors.sku" id="sku-error" class="supplier_edit_product_field-error">{{ fieldErrors.sku }}</span>
          </label>
        </div>

        <label :class="{ 'supplier_edit_product_invalid': fieldErrors.description }">
          Description
          <textarea
            id="product-description"
            v-model="form.description"
            rows="7"
            maxlength="2000"
            aria-describedby="description-counter description-error"
            @blur="validateField('description')"
          ></textarea>
          <div class="supplier_edit_product_counter-row">
            <small id="description-counter">{{ form.description.length }}/2000 characters</small>
            <span v-if="fieldErrors.description" id="description-error" class="supplier_edit_product_field-error">{{ fieldErrors.description }}</span>
          </div>
        </label>

        <div v-if="error" class="supplier_edit_product_error supplier_edit_product_inline-error" role="alert">
          {{ error }}
        </div>
      </section>

      <aside class="supplier_edit_product_edit-side">
        <section class="supplier_edit_product_edit-card supplier_edit_product_media-card">
          <div class="supplier_edit_product_section-heading">
            <div>
              <span class="supplier_edit_product_eyebrow">PRODUCT MEDIA</span>
              <h2>Product photos</h2>
            </div>
            <span class="supplier_edit_product_media-count">{{ form.images.length }}/8</span>
          </div>

          <div
            class="supplier_edit_product_upload-zone"
            :class="{ 'supplier_edit_product_upload-zone--dragging': isDragging, 'supplier_edit_product_upload-zone--disabled': form.images.length >= 8 }"
            role="button"
            tabindex="0"
            aria-label="Upload product photos"
            @click="openFilePicker"
            @keydown.enter.prevent="openFilePicker"
            @keydown.space.prevent="openFilePicker"
            @dragenter.prevent="isDragging = true"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="handleDragLeave"
            @drop.prevent="handleDrop"
          >
            <span class="supplier_edit_product_upload-icon" aria-hidden="true">&#8615;</span>
            <strong>{{ form.images.length >= 8 ? "Maximum of 8 images reached" : "Click to upload or drag and drop" }}</strong>
            <small>PNG or JPEG only · Max 10MB each</small>
          </div>
          <input ref="fileInput" type="file" accept="image/png,image/jpeg" multiple hidden @change="selectImages" />

          <p v-if="mediaError" class="supplier_edit_product_field-error supplier_edit_product_media-error" role="alert">{{ mediaError }}</p>

          <div v-if="form.images.length" class="supplier_edit_product_thumbnail-strip" aria-label="Product images">
            <article
              v-for="(image, index) in form.images"
              :key="image + '-' + index"
              class="supplier_edit_product_thumbnail-tile"
              :class="{ 'supplier_edit_product_thumbnail-tile--primary': index === 0 }"
            >
              <img :src="resolveImageUrl(image)" :alt="`${form.product_name || 'Product'} image ${index + 1}`" />
              <span v-if="index === 0" class="supplier_edit_product_media-badge">Primary</span>
              <span v-else class="supplier_edit_product_media-type">{{ isNewImage(image) ? "New" : "Saved" }}</span>

              <div class="supplier_edit_product_image-actions">
                <button v-if="index > 0" type="button" :aria-label="`Move image ${index + 1} left`" title="Make primary / move left" @click="moveImage(index, -1)">←</button>
                <button v-if="index < form.images.length - 1" type="button" :aria-label="`Move image ${index + 1} right`" title="Move right" @click="moveImage(index, 1)">→</button>
                <button type="button" class="supplier_edit_product_remove-image" :aria-label="`Remove image ${index + 1}`" title="Remove image" @click="removeImage(index)">&#215;</button>
              </div>
            </article>
          </div>

          <p class="supplier_edit_product_media-help">The first image is the primary catalog image. Saved images are kept unless you remove them; new uploads are marked <strong>New</strong> until saved.</p>
        </section>

        <section class="supplier_edit_product_edit-card">
          <span class="supplier_edit_product_eyebrow">INVENTORY & PRICING</span>
          <h2>Commercial details</h2>

          <div class="supplier_edit_product_pricing-grid">
            <label :class="{ 'supplier_edit_product_invalid': fieldErrors.price }">
              Selling price
              <div class="supplier_edit_product_input-prefix"><span>R</span><input id="product-price" v-model.number="form.price" type="number" min="0.01" step="0.01" aria-describedby="price-error" @blur="validateField('price')" /></div>
              <span v-if="fieldErrors.price" id="price-error" class="supplier_edit_product_field-error">{{ fieldErrors.price }}</span>
            </label>

            <label :class="{ 'supplier_edit_product_invalid': fieldErrors.comparePrice }">
              Compare at price
              <div class="supplier_edit_product_input-prefix"><span>R</span><input id="product-compare-price" v-model.number="form.comparePrice" type="number" min="0" step="0.01" aria-describedby="compare-price-error" @blur="validateField('comparePrice')" /></div>
              <span v-if="fieldErrors.comparePrice" id="compare-price-error" class="supplier_edit_product_field-error">{{ fieldErrors.comparePrice }}</span>
            </label>
          </div>

          <div class="supplier_edit_product_pricing-grid">
            <label :class="{ 'supplier_edit_product_invalid': fieldErrors.quantity }">
              Stock quantity
              <input id="product-quantity" v-model.number="form.quantity" type="number" min="0" step="1" inputmode="numeric" aria-describedby="quantity-error" @blur="validateField('quantity')" />
              <span v-if="fieldErrors.quantity" id="quantity-error" class="supplier_edit_product_field-error">{{ fieldErrors.quantity }}</span>
            </label>

            <label :class="{ 'supplier_edit_product_invalid': fieldErrors.low_stock_threshold }">
              Low-stock alert
              <input id="product-threshold" v-model.number="form.low_stock_threshold" type="number" min="0" step="1" inputmode="numeric" aria-describedby="threshold-error" @blur="validateField('low_stock_threshold')" />
              <span v-if="fieldErrors.low_stock_threshold" id="threshold-error" class="supplier_edit_product_field-error">{{ fieldErrors.low_stock_threshold }}</span>
            </label>
          </div>

          <div class="supplier_edit_product_stock-callout" :class="`supplier_edit_product_stock-callout--${stockStatusClass}`">
            <div>
              <strong>{{ reactiveStockStatus }}</strong>
              <span>Preview based on the values you are editing</span>
            </div>
            <span class="supplier_edit_product_stock-dot" aria-hidden="true"></span>
          </div>

          <div class="supplier_edit_product_last-updated">
            <span>Last updated</span>
            <strong>{{ formatDate(product.updated_at) }}</strong>
          </div>
        </section>
      </aside>

      <div class="supplier_edit_product_action-bar">
        <span v-if="dirty" class="supplier_edit_product_unsaved" role="status">Unsaved changes</span>
        <span v-else class="supplier_edit_product_saved-state">No unsaved changes</span>
        <div class="supplier_edit_product_action-buttons">
          <button type="button" class="supplier_edit_product_text-button" :disabled="saving" @click="cancelEdit">Cancel</button>
          <button class="supplier_edit_product_primary-button supplier_edit_product_save-button" type="submit" :disabled="saving || !dirty">
            {{ saving ? "Saving…" : "Save changes" }}
          </button>
        </div>
      </div>

      <p v-if="message" class="supplier_edit_product_success" role="status" aria-live="polite">{{ message }}</p>
    </form>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { useSupplierData } from "@/data/supplierData";
import { resolveImageUrl } from "@/services/api";

const route = useRoute();
const router = useRouter();
const {
  products,
  updateProduct,
  uploadProductImages,
  cleanupProductImages,
  categories,
  categoriesLoading,
  categoriesError,
  loading,
  error: supplierError,
  loadCategories,
  loadSupplierData,
} = useSupplierData();

const form = reactive({
  product_name: "",
  category_name: "",
  sku: "",
  description: "",
  price: null,
  comparePrice: null,
  quantity: 0,
  low_stock_threshold: 10,
  image: "",
  images: [],
});

const original = ref(null);
const message = ref("");
const error = ref("");
const mediaError = ref("");
const pageError = ref("");
const saving = ref(false);
const isDragging = ref(false);
const fileInput = ref(null);
const fieldErrors = reactive({});

const productId = computed(() => Number(route.params.id));
const product = computed(() => products.value.find((item) => item.product_id === productId.value) || null);
const dirty = computed(() => JSON.stringify(snapshot(form)) !== JSON.stringify(original.value));
const reactiveStockStatus = computed(() => {
  const quantity = Number(form.quantity);
  const threshold = Number(form.low_stock_threshold);
  if (quantity === 0) return "Out of stock";
  if (Number.isInteger(quantity) && Number.isInteger(threshold) && quantity <= threshold) return "Low stock";
  return "In stock";
});
const stockStatusClass = computed(() => reactiveStockStatus.value.toLowerCase().replaceAll(" ", "-"));

function snapshot(value) {
  return {
    product_name: value.product_name,
    category_name: value.category_name,
    sku: value.sku,
    description: value.description,
    price: value.price,
    comparePrice: value.comparePrice,
    quantity: value.quantity,
    low_stock_threshold: value.low_stock_threshold,
    image: value.image,
    images: [...value.images],
  };
}

function hydrateProduct(value) {
  if (!value) return;
  Object.assign(form, {
    product_name: value.product_name || "",
    category_name: value.category_name || "",
    sku: value.sku || "",
    description: value.description || "",
    price: value.price,
    comparePrice: value.compare_price,
    quantity: Number(value.quantity ?? 0),
    low_stock_threshold: Number(value.low_stock_threshold ?? 10),
    image: value.image || "",
    images: value.images?.length ? [...value.images] : (value.image ? [value.image] : []),
  });
  original.value = snapshot(form);
  Object.keys(fieldErrors).forEach((key) => delete fieldErrors[key]);
  error.value = "";
  mediaError.value = "";
}

watch(product, hydrateProduct, { immediate: true });

async function reload() {
  pageError.value = "";
  try {
    await Promise.all([loadSupplierData(true), loadCategories()]);
    if (!product.value) pageError.value = "The product could not be found.";
  } catch (e) {
    pageError.value = e.message || "Unable to load the product.";
  }
}

onMounted(async () => {
  try {
    await Promise.all([loadSupplierData(), loadCategories()]);
    if (!product.value && !supplierError.value) pageError.value = "The product could not be found.";
    if (supplierError.value) pageError.value = supplierError.value;
  } catch (e) {
    pageError.value = e.message || "Unable to load the product.";
  }
  window.addEventListener("beforeunload", handleBeforeUnload);
});

function handleBeforeUnload(event) {
  if (!dirty.value || saving.value) return;
  event.preventDefault();
  event.returnValue = "";
}

onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", handleBeforeUnload);
  form.images.filter(isNewImage).forEach((image) => URL.revokeObjectURL(image));
});

function validateField(field) {
  const value = form[field];
  let result = "";

  if (field === "product_name" && String(value || "").trim().length < 3) result = "Product name must be at least 3 characters.";
  if (field === "category_name" && !value) result = "Select a product category.";
  if (field === "sku" && value && !/^[A-Za-z0-9][A-Za-z0-9._-]{2,39}$/.test(String(value).trim())) result = "SKU must be 3–40 characters using letters, numbers, dots, underscores or hyphens.";
  if (field === "description" && String(value || "").length > 2000) result = "Description must be 2000 characters or fewer.";
  if (field === "price" && (!Number.isFinite(Number(value)) || Number(value) <= 0)) result = "Price must be greater than zero.";
  if (field === "comparePrice" && value !== null && value !== "" && (!Number.isFinite(Number(value)) || Number(value) < Number(form.price))) result = "Compare at price must be greater than or equal to the selling price.";
  if (field === "quantity" && (!Number.isInteger(Number(value)) || Number(value) < 0)) result = "Quantity must be a non-negative whole number.";
  if (field === "low_stock_threshold" && (!Number.isInteger(Number(value)) || Number(value) < 0)) result = "Low-stock threshold must be a non-negative whole number.";

  if (result) fieldErrors[field] = result;
  else delete fieldErrors[field];
  return result;
}

function validateAll() {
  const fields = ["product_name", "category_name", "sku", "description", "price", "comparePrice", "quantity", "low_stock_threshold"];
  return fields.map(validateField).find(Boolean) || "";
}

function isNewImage(source) {
  return String(source).startsWith("blob:");
}

function openFilePicker() {
  if (form.images.length >= 8 || saving.value) return;
  fileInput.value?.click();
}

function addImageFiles(files) {
  mediaError.value = "";
  const rejected = [];

  for (const file of files) {
    if (form.images.length >= 8) {
      rejected.push("Maximum of 8 product images allowed.");
      break;
    }
    if (!["image/png", "image/jpeg"].includes(file.type)) {
      rejected.push(`${file.name}: PNG/JPEG only.`);
      continue;
    }
    if (file.size > 10 * 1024 * 1024) {
      rejected.push(`${file.name}: larger than 10MB.`);
      continue;
    }
    form.images.push(URL.createObjectURL(file));
  }

  form.image = form.images[0] || "";
  if (rejected.length) mediaError.value = rejected.join(" • ");
}

function selectImages(event) {
  addImageFiles([...(event.target.files || [])]);
  event.target.value = "";
}

function handleDragLeave(event) {
  if (!event.currentTarget.contains(event.relatedTarget)) isDragging.value = false;
}

function handleDrop(event) {
  isDragging.value = false;
  addImageFiles([...(event.dataTransfer?.files || [])]);
}

function moveImage(index, direction) {
  const target = index + direction;
  if (target < 0 || target >= form.images.length) return;
  const [image] = form.images.splice(index, 1);
  form.images.splice(target, 0, image);
  form.image = form.images[0] || "";
}

function removeImage(index) {
  const image = form.images[index];
  if (isNewImage(image)) URL.revokeObjectURL(image);
  form.images.splice(index, 1);
  form.image = form.images[0] || "";
}

function formatDate(value) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return new Intl.DateTimeFormat("en-ZA", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

async function save() {
  error.value = "";
  message.value = "";
  const validation = validateAll();
  if (validation) {
    error.value = validation;
    return;
  }

  saving.value = true;
  let uploadedUrls = [];
  try {
    const images = await uploadProductImages(form.images, (urls) => { uploadedUrls = urls; });
    const result = await updateProduct(productId.value, {
      ...form,
      product_name: form.product_name.trim(),
      category_name: form.category_name,
      sku: form.sku.trim(),
      description: form.description.trim(),
      image: images[0] || "",
      images,
    });
    await cleanupProductImages(result.removedMediaUrls || []);
    message.value = "Product updated successfully.";
    original.value = snapshot(form);
    Object.assign(form, { images: [...images], image: images[0] || "" });
    setTimeout(() => router.push("/products"), 650);
  } catch (e) {
    if (uploadedUrls.length) await cleanupProductImages(uploadedUrls);
    error.value = e.message || "Unable to update the product.";
  } finally {
    saving.value = false;
  }
}

function cancelEdit() {
  if (!dirty.value || window.confirm("Discard your unsaved changes?")) router.push("/products");
}
</script>

<style scoped>
.supplier_edit_product_edit-page{min-height:100vh;padding:32px clamp(18px,4vw,48px) 120px;background:#f7f4f1;color:#4d3933;font-family:Arial,Helvetica,sans-serif}
.supplier_edit_product_edit-page,.supplier_edit_product_edit-page *{box-sizing:border-box}
.supplier_edit_product_edit-header{max-width:1180px;margin:0 auto 24px;display:flex;align-items:flex-end;justify-content:space-between;gap:24px}
.supplier_edit_product_eyebrow{display:inline-block;color:#b9683d;font-size:10px;font-weight:800;letter-spacing:1.7px;text-transform:uppercase}
.supplier_edit_product_edit-header h1{margin:7px 0 5px;color:#3f2d27;font:700 clamp(28px,3vw,36px)/1.15 Georgia,"Times New Roman",serif}
.supplier_edit_product_edit-header p{margin:0;color:#87756d;font-size:14px}
.supplier_edit_product_ghost-button{display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:0 17px;border:1px solid #d9cdc5;border-radius:9px;background:#fff;color:#60483e;font-size:13px;font-weight:700;text-decoration:none;box-shadow:0 2px 8px rgba(63,45,39,.04);transition:.2s ease}
.supplier_edit_product_ghost-button:hover{border-color:#c58a67;background:#fffaf7;transform:translateY(-1px)}
.supplier_edit_product_edit-grid{max-width:1180px;margin:0 auto;display:grid;grid-template-columns:minmax(0,1.55fr) minmax(320px,.85fr);gap:22px;align-items:start}
.supplier_edit_product_edit-side{display:flex;flex-direction:column;gap:22px}
.supplier_edit_product_edit-card{padding:26px;border:1px solid #e5ddd7;border-radius:14px;background:#fff;box-shadow:0 8px 24px rgba(63,45,39,.06)}
.supplier_edit_product_edit-card h2{margin:8px 0 24px;color:#44322c;font:700 21px/1.25 Georgia,"Times New Roman",serif}
.supplier_edit_product_edit-card label{display:flex;flex-direction:column;gap:7px;margin-bottom:17px;color:#66534b;font-size:12px;font-weight:700}
.supplier_edit_product_edit-card input,.supplier_edit_product_edit-card select,.supplier_edit_product_edit-card textarea{width:100%;padding:12px 13px;border:1px solid #ded5cf;border-radius:8px;outline:none;background:#fcfaf8;color:#493730;font:14px/1.45 Arial,Helvetica,sans-serif;transition:border-color .18s,box-shadow .18s,background .18s}
.supplier_edit_product_edit-card textarea{min-height:155px;resize:vertical}
.supplier_edit_product_edit-card input:focus,.supplier_edit_product_edit-card select:focus,.supplier_edit_product_edit-card textarea:focus{border-color:#c77a4e;background:#fff;box-shadow:0 0 0 3px rgba(199,122,78,.12)}
.supplier_edit_product_edit-card input:disabled,.supplier_edit_product_edit-card select:disabled{cursor:not-allowed;opacity:.65}
.supplier_edit_product_two-columns,.supplier_edit_product_pricing-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.supplier_edit_product_hint{color:#9a887f;font-size:10px;font-weight:400;line-height:1.4}
.supplier_edit_product_field-error{color:#a8473d;font-size:11px;font-weight:600;line-height:1.35}
.supplier_edit_product_invalid input,.supplier_edit_product_invalid select,.supplier_edit_product_invalid textarea{border-color:#d88980;background:#fff8f7}
.supplier_edit_product_counter-row{display:flex;justify-content:space-between;gap:12px;min-height:16px;color:#9a887f;font-size:10px;font-weight:400}
.supplier_edit_product_section-heading{display:flex;justify-content:space-between;align-items:flex-start;gap:16px}
.supplier_edit_product_section-heading h2{margin-bottom:15px}
.supplier_edit_product_media-count{padding:5px 8px;border-radius:999px;background:#f5e3d7;color:#8c573f;font-size:10px;font-weight:800}
.supplier_edit_product_upload-zone{width:100%;min-height:142px;padding:20px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;border:1.5px dashed #d9a17e;border-radius:10px;background:#fffaf7;color:#ad643d;cursor:pointer;transition:.2s ease}
.supplier_edit_product_upload-zone:hover,.supplier_edit_product_upload-zone--dragging{border-color:#c87548;background:#fff2e9;transform:translateY(-1px)}
.supplier_edit_product_upload-zone--disabled{opacity:.6;cursor:not-allowed}
.supplier_edit_product_upload-zone:focus-visible{outline:3px solid rgba(199,122,78,.18);outline-offset:2px}
.supplier_edit_product_upload-icon{width:38px;height:38px;display:grid;place-items:center;margin-bottom:4px;border-radius:50%;background:#f5e3d7;color:#a9603d;font-size:20px}
.supplier_edit_product_upload-zone strong{color:#644a40;font-size:12px}.supplier_edit_product_upload-zone small{color:#a38d82;font-size:11px}
.supplier_edit_product_media-error{display:block;margin-top:10px}
.supplier_edit_product_thumbnail-strip{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px;margin-top:12px}
.supplier_edit_product_thumbnail-tile{position:relative;aspect-ratio:1;overflow:hidden;border:2px solid #e1d8d1;border-radius:9px;background:#f2e9e3}
.supplier_edit_product_thumbnail-tile--primary{border-color:#d2763d}
.supplier_edit_product_thumbnail-tile img{width:100%;height:100%;display:block;object-fit:cover}
.supplier_edit_product_media-badge,.supplier_edit_product_media-type{position:absolute;left:6px;bottom:6px;padding:4px 6px;border-radius:5px;background:rgba(255,255,255,.94);color:#70564b;font-size:8px;font-weight:800;text-transform:uppercase;letter-spacing:.4px}
.supplier_edit_product_media-type{left:auto;right:6px;color:#8a634e}
.supplier_edit_product_image-actions{position:absolute;left:5px;right:5px;top:5px;display:flex;gap:4px}
.supplier_edit_product_image-actions button{width:25px;height:25px;display:grid;place-items:center;padding:0;border:0;border-radius:6px;background:rgba(255,255,255,.95);color:#644a40;font-weight:800;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,.1)}
.supplier_edit_product_image-actions button:hover{background:#fff2e9}.supplier_edit_product_image-actions .supplier_edit_product_remove-image{margin-left:auto;color:#a8473d}
.supplier_edit_product_media-help{margin:12px 0 0;color:#9a887f;font-size:11px;line-height:1.55}
.supplier_edit_product_input-prefix{display:flex;align-items:center;border:1px solid #ded5cf;border-radius:8px;background:#fcfaf8;overflow:hidden}
.supplier_edit_product_input-prefix:focus-within{border-color:#c77a4e;box-shadow:0 0 0 3px rgba(199,122,78,.12);background:#fff}
.supplier_edit_product_input-prefix span{padding-left:13px;color:#9a887f;font-weight:800}.supplier_edit_product_input-prefix input{border:0;box-shadow:none;background:transparent}
.supplier_edit_product_stock-callout{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:14px 15px;margin:4px 0 15px;border:1px solid #eaded5;border-radius:9px;background:#f8f0eb;color:#654b40}
.supplier_edit_product_stock-callout div{display:flex;flex-direction:column;gap:3px}.supplier_edit_product_stock-callout strong{font-size:13px}.supplier_edit_product_stock-callout span{color:#9b877d;font-size:11px}
.supplier_edit_product_stock-callout--in-stock{border-color:#cfe2d2;background:#f1f8f2;color:#397044}.supplier_edit_product_stock-callout--low-stock{border-color:#ead7b0;background:#fff9ed;color:#8a6728}.supplier_edit_product_stock-callout--out-of-stock{border-color:#efc8c3;background:#fff4f2;color:#a8473d}
.supplier_edit_product_stock-dot{width:10px;height:10px;border-radius:50%;background:currentColor}
.supplier_edit_product_last-updated{display:flex;justify-content:space-between;gap:16px;padding-top:12px;border-top:1px solid #eee6e0;color:#9a887f;font-size:10px}.supplier_edit_product_last-updated strong{color:#70564b}
.supplier_edit_product_error{border:1px solid #efc8c3;background:#fff4f2;color:#a8473d}.supplier_edit_product_inline-error{margin-top:8px;padding:11px 13px;border-radius:8px;font-size:12px}
.supplier_edit_product_empty{max-width:1180px;margin:0 auto;padding:64px 24px;border:1px solid #e5ddd7;border-radius:14px;background:#fff;text-align:center;box-shadow:0 8px 24px rgba(63,45,39,.05)}
.supplier_edit_product_empty h2{margin:10px 0;color:#44322c;font:700 24px Georgia,"Times New Roman",serif}.supplier_edit_product_empty p{color:#87756d;font-size:13px}
.supplier_edit_product_empty-action{max-width:220px;margin:14px auto 0;text-decoration:none}
.supplier_edit_product_spinner{width:34px;height:34px;margin:0 auto;border:3px solid #eaded5;border-top-color:#d2763d;border-radius:50%;animation:supplierEditSpin .8s linear infinite}
@keyframes supplierEditSpin{to{transform:rotate(360deg)}}
.supplier_edit_product_action-bar{position:sticky;bottom:16px;grid-column:1/-1;z-index:10;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:13px 16px;border:1px solid #dfd3ca;border-radius:12px;background:rgba(255,255,255,.96);box-shadow:0 10px 30px rgba(63,45,39,.14);backdrop-filter:blur(8px)}
.supplier_edit_product_unsaved,.supplier_edit_product_saved-state{font-size:11px;font-weight:800}.supplier_edit_product_unsaved{color:#a95d34}.supplier_edit_product_saved-state{color:#8f8179}
.supplier_edit_product_action-buttons{display:flex;gap:9px;min-width:260px}.supplier_edit_product_primary-button,.supplier_edit_product_text-button{min-height:43px;display:inline-flex;align-items:center;justify-content:center;border-radius:9px;font-size:13px;font-weight:800;cursor:pointer;transition:.2s ease}
.supplier_edit_product_primary-button{border:0;background:#d2763d;color:#fff;box-shadow:0 5px 12px rgba(180,91,43,.18);text-decoration:none}.supplier_edit_product_primary-button:hover:not(:disabled){background:#bd6330;transform:translateY(-1px)}.supplier_edit_product_primary-button:disabled{cursor:not-allowed;opacity:.6}
.supplier_edit_product_save-button{flex:1}.supplier_edit_product_text-button{flex:0 0 100px;border:1px solid #ded5cf;background:#fff;color:#896b5d}.supplier_edit_product_text-button:hover:not(:disabled){background:#f7f0ec}.supplier_edit_product_success{grid-column:1/-1;margin:-8px auto 0;padding:10px 12px;border:1px solid #cfe2d2;border-radius:8px;background:#f1f8f2;color:#397044;font-size:12px}
@media(max-width:900px){.supplier_edit_product_edit-grid{grid-template-columns:1fr}.supplier_edit_product_edit-side{display:grid;grid-template-columns:1fr 1fr;align-items:start}}
@media(max-width:680px){.supplier_edit_product_edit-page{padding:22px 14px 100px}.supplier_edit_product_edit-header{align-items:stretch;flex-direction:column;gap:14px}.supplier_edit_product_ghost-button{width:100%}.supplier_edit_product_edit-card{padding:20px 17px}.supplier_edit_product_edit-side{display:flex}.supplier_edit_product_two-columns,.supplier_edit_product_pricing-grid{grid-template-columns:1fr;gap:0}.supplier_edit_product_thumbnail-strip{grid-template-columns:repeat(4,1fr)}.supplier_edit_product_action-bar{align-items:stretch;flex-direction:column;bottom:8px}.supplier_edit_product_action-buttons{width:100%;min-width:0}.supplier_edit_product_saved-state,.supplier_edit_product_unsaved{text-align:center}}
@media(max-width:420px){.supplier_edit_product_thumbnail-strip{grid-template-columns:repeat(3,1fr)}.supplier_edit_product_action-buttons{flex-direction:column}.supplier_edit_product_text-button{flex:auto;width:100%}}
</style>