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
    <div v-if="error" class="supplier_edit_product_empty supplier_edit_product_error"><p>{{ error }}</p></div><div v-if="!product" class="supplier_edit_product_empty">
      <h2>Product not found</h2>
      <RouterLink to="/products" class="supplier_edit_product_primary-button">Return to products</RouterLink>
    </div>
    <form v-else class="supplier_edit_product_edit-grid" @submit.prevent="save">
      <section class="supplier_edit_product_edit-card"><span class="supplier_edit_product_eyebrow">LISTING
          DETAILS</span>
        <h2>{{ product.product_name }}</h2><label>Product name<input v-model.trim="form.product_name"
            required /></label>
        <div class="supplier_edit_product_two-columns"><label>Category<select v-model="form.category_name">
              <option>Eco-friendly Packaging</option>
              <option>Food & Beverage</option>
              <option>Cleaning Supplies</option>
              <option>Office Supplies</option>
              <option>Shipping Supplies</option>
            </select></label><label>SKU<input v-model="form.sku" /></label></div><label>Description<textarea
            v-model="form.description" rows="7"></textarea></label>
      </section>
      <aside class="supplier_edit_product_edit-side">
        <section class="supplier_edit_product_edit-card supplier_edit_product_media-card"><span
            class="supplier_edit_product_eyebrow">PRODUCT MEDIA</span>
          <h2>Product Photos</h2>
          <button type="button" class="supplier_edit_product_upload-zone" @click="$refs.fileInput.click()">
            <span class="supplier_edit_product_upload-icon">&#8615;</span>
            <strong>Click to upload or drag and drop</strong>
            <small>Max 10mb file size, only png and jpeg files.</small>
          </button>
          <div v-if="form.images.length" class="supplier_edit_product_thumbnail-strip">
            <div v-for="(image, index) in form.images" :key="image" class="supplier_edit_product_thumbnail-tile">
              <img :src="image" :alt="`${form.product_name} product image ${index + 1}`" />
              <span v-if="index === 0" class="supplier_edit_product_media-badge">Primary</span>
              <button type="button" :aria-label="`Remove image ${index + 1}`"
                @click="removeImage(index)">&#215;</button>
            </div>
          </div>
          <div class="supplier_edit_product_media-actions">
            <input ref="fileInput" type="file" accept="image/png,image/jpeg" multiple hidden @change="selectImages" />
          </div>
          <p class="supplier_edit_product_media-help">Add multiple product photos. The first image is used as the
            primary catalog image.</p>
        </section>
        <section class="supplier_edit_product_edit-card"><span class="supplier_edit_product_eyebrow">INVENTORY &
            PRICING</span>
          <div class="supplier_edit_product_two-columns"><label>Price (ZAR)<input v-model.number="form.price"
                type="number" min="0" /></label><label>Stock quantity<input v-model.number="form.quantity" type="number"
                min="0" /></label></div><label>Low-stock alert<input v-model.number="form.low_stock_threshold"
              type="number" min="0" /></label>
          <div class="supplier_edit_product_stock-callout"><strong>{{ product.stockStatus }}</strong><span>Current
              catalog status</span></div>
          <button class="supplier_edit_product_primary-button" type="submit">Save changes</button><button
            class="supplier_edit_product_text-button" type="button" @click="router.push('/products')">Cancel</button>
          <p v-if="message" class="supplier_edit_product_success">{{ message }}</p>
        </section>
      </aside>
    </form>
  </div>
</template>
<script setup>
import { computed, reactive, ref, watch } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { useSupplierData } from "@/data/supplierData";

const route = useRoute();
const router = useRouter();
const { products, updateProduct, uploadProductImages } = useSupplierData();
const product = computed(() => products.value.find((item) => item.product_id === Number(route.params.id)) || null);
const form = reactive({ product_name:"", category_name:"", sku:"", description:"", price:null, comparePrice:null, quantity:0, low_stock_threshold:10, image:"", images:[] });
const message = ref("");
const error = ref("");
const saving = ref(false);

watch(product, (value) => {
  if (!value) return;
  Object.assign(form, {
    product_name:value.product_name || "", category_name:value.category_name || "", sku:value.sku || "",
    description:value.description || "", price:value.price, comparePrice:value.compare_price,
    quantity:value.quantity, low_stock_threshold:value.low_stock_threshold, image:value.image || "",
    images:value.images?.length ? [...value.images] : (value.image ? [value.image] : [])
  });
}, { immediate:true });

function validate() {
  if (form.product_name.trim().length < 3) return "Product name must be at least 3 characters.";
  if (!form.category_name) return "Select a product category.";
  if (!Number.isFinite(Number(form.price)) || Number(form.price) <= 0) return "Price must be greater than zero.";
  if (form.comparePrice !== null && form.comparePrice !== "" && Number(form.comparePrice) < Number(form.price)) return "Compare at price must be greater than or equal to the selling price.";
  if (!Number.isInteger(Number(form.quantity)) || Number(form.quantity) < 0) return "Quantity must be a non-negative whole number.";
  if (!Number.isInteger(Number(form.low_stock_threshold)) || Number(form.low_stock_threshold) < 0) return "Low-stock threshold must be a non-negative whole number.";
  if (form.sku && !/^[A-Za-z0-9][A-Za-z0-9._-]{2,39}$/.test(form.sku)) return "SKU must be 3–40 characters and use only letters, numbers, dots, underscores or hyphens.";
  return "";
}
function selectImages(event) {
  for (const file of [...(event.target.files || [])]) {
    if (!["image/png","image/jpeg"].includes(file.type) || file.size > 10*1024*1024) continue;
    form.images.push(URL.createObjectURL(file));
  }
  form.image = form.images[0] || "";
  event.target.value = "";
}
function removeImage(index) {
  const image=form.images[index];
  if(image?.startsWith("blob:")) URL.revokeObjectURL(image);
  form.images.splice(index,1);
  form.image=form.images[0] || "";
}
async function save() {
  error.value=""; message.value="";
  const validationError=validate();
  if(validationError){error.value=validationError;return;}
  saving.value=true;
  try {
    const uploadedImages = await uploadProductImages(form.images);
    await updateProduct(route.params.id, {
      ...form, product_name:form.product_name.trim(), description:form.description.trim(),
      image:uploadedImages[0] || "", images:uploadedImages
    });
    message.value="Product updated successfully.";
    setTimeout(()=>router.push("/products"),500);
  } catch(err) { error.value=err.message || "Unable to update the product."; }
  finally { saving.value=false; }
}
</script>
<style scoped>
.supplier_edit_product_edit-page {
  min-height: 100vh;
  padding: 34px 38px;
  background: #f7f5f2;
  color: #4d3933;
  font-family: Arial, sans-serif
}

.supplier_edit_product_edit-header,
.supplier_edit_product_edit-grid,
.supplier_edit_product_empty {
  max-width: 1120px;
  margin: 0 auto
}

.supplier_edit_product_edit-header {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 28px
}

.supplier_edit_product_eyebrow {
  color: #d2763d;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.8px
}

.supplier_edit_product_edit-header h1 {
  margin: 7px 0 5px;
  font: 700 34px Georgia, serif;
  color: #44312c
}

.supplier_edit_product_edit-header p {
  margin: 0;
  color: #88766e
}

.supplier_edit_product_edit-grid {
  display: grid;
  grid-template-columns: 1.45fr .8fr;
  gap: 22px
}

.supplier_edit_product_edit-side {
  display: flex;
  flex-direction: column;
  gap: 22px
}

.supplier_edit_product_edit-card {
  width: 100%;
  padding: 25px;
  border: 1px solid #e6dfda;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 6px 18px #4b38300d
}

.supplier_edit_product_edit-card h2 {
  margin: 9px 0 25px;
  font: 700 21px Georgia, serif
}

.supplier_edit_product_media-card h2 {
  margin-bottom: 16px
}

.supplier_edit_product_upload-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 112px;
  padding: 16px;
  border: 1px dashed #e0a078;
  border-radius: 8px;
  background: #fffdfa;
  color: #b86a43;
  cursor: pointer;
}

.supplier_edit_product_upload-zone:hover {
  background: #fff8f3;
  border-color: #d2763d;
}

.supplier_edit_product_upload-icon {
  margin-bottom: 6px;
  color: #c17a51;
  font-size: 21px;
}

.supplier_edit_product_upload-zone strong,
.supplier_edit_product_upload-zone small {
  font-size: 10px;
  font-weight: 600;
}

.supplier_edit_product_upload-zone small {
  margin-top: 4px;
  color: #a8958c;
  font-weight: 400;
}

.supplier_edit_product_thumbnail-strip {
  display: flex;
  gap: 7px;
  margin-top: 8px;
  overflow-x: auto;
}

.supplier_edit_product_thumbnail-tile {
  position: relative;
  flex: 0 0 54px;
  height: 54px;
  overflow: hidden;
  border: 1px solid #e6dfda;
  border-radius: 6px;
  background: #f1e6df;
}

.supplier_edit_product_thumbnail-tile img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.supplier_edit_product_thumbnail-tile>button {
  position: absolute;
  top: 2px;
  right: 2px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: #fff;
  color: #b85043;
  font-size: 13px;
  line-height: 1;
  font-weight: 700;
  cursor: pointer;
}

.supplier_edit_product_thumbnail-tile>button:hover {
  background: #fae5e1;
}

.supplier_edit_product_media-badge {
  position: absolute;
  bottom: 3px;
  left: 3px;
  padding: 2px 4px;
  border-radius: 4px;
  background: #fff;
  color: #76594c;
  font-size: 7px;
  font-weight: 700;
}

.supplier_edit_product_media-help {
  margin: 10px 0 0;
  color: #a38c80;
  font-size: 12px;
  line-height: 1.5;
}

.supplier_edit_product_edit-card label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 18px;
  color: #7d6c64;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .4px
}

.supplier_edit_product_edit-card input,
.supplier_edit_product_edit-card select,
.supplier_edit_product_edit-card textarea {
  padding: 12px 13px;
  border: 1px solid #e4ddd8;
  border-radius: 8px;
  outline: 0;
  background: #fbfaf8;
  color: #4d3933;
  font: 14px Arial
}

.supplier_edit_product_two-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px
}

.supplier_edit_product_ghost-button,
.supplier_edit_product_primary-button,
.supplier_edit_product_text-button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  padding: 11px 15px;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer
}

.supplier_edit_product_ghost-button {
  border: 1px solid #e1d8d2;
  background: #fff;
  color: #644c42
}

.supplier_edit_product_primary-button {
  width: 100%;
  border: 0;
  background: #e17b3d;
  color: #fff
}

.supplier_edit_product_text-button {
  width: 100%;
  margin-top: 8px;
  border: 0;
  background: transparent;
  color: #8e6b5b
}

.supplier_edit_product_stock-callout {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 13px;
  margin: 5px 0 20px;
  border-radius: 8px;
  background: #f5eee8;
  color: #76594c
}

.supplier_edit_product_stock-callout span {
  font-size: 12px;
  color: #a38c80
}

.supplier_edit_product_success {
  margin-bottom: 0;
  color: #418049;
  font-size: 13px
}

.supplier_edit_product_empty {
  text-align: center;
  padding: 80px 20px
}

.supplier_edit_product_empty h2 {
  font: 24px Georgia, serif
}

@media(max-width:800px) {
  .supplier_edit_product_edit-page {
    padding: 24px 16px
  }

  .supplier_edit_product_edit-header {
    flex-direction: column
  }

  .supplier_edit_product_edit-grid {
    grid-template-columns: 1fr
  }

  .supplier_edit_product_two-columns {
    grid-template-columns: 1fr
  }
}
</style>
