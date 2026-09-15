<template>
  <div class="edit-page">
    <header class="edit-header">
      <div><span class="eyebrow">CATALOG WORKSPACE</span>
        <h1>Edit product</h1>
        <p>Keep your listing accurate so buyers can order with confidence.</p>
      </div>
      <RouterLink to="/products" class="ghost-button">Back to products</RouterLink>
    </header>
    <div v-if="!product" class="empty">
      <h2>Product not found</h2>
      <RouterLink to="/products" class="primary-button">Return to products</RouterLink>
    </div>
    <form v-else class="edit-grid" @submit.prevent="save">
      <section class="edit-card"><span class="eyebrow">LISTING DETAILS</span>
        <h2>{{ product.product_name }}</h2><label>Product name<input v-model.trim="form.product_name"
            required /></label>
        <div class="two-columns"><label>Category<select v-model="form.category_name">
              <option>Eco-friendly Packaging</option>
              <option>Food & Beverage</option>
              <option>Cleaning Supplies</option>
              <option>Office Supplies</option>
              <option>Shipping Supplies</option>
            </select></label><label>SKU<input v-model="form.sku" /></label></div><label>Description<textarea
            v-model="form.description" rows="7"></textarea></label>
      </section>
      <aside class="edit-side">
        <section class="edit-card media-card"><span class="eyebrow">PRODUCT MEDIA</span>
          <h2>Product Photos</h2>
          <button type="button" class="upload-zone" @click="$refs.fileInput.click()">
            <span class="upload-icon">&#8615;</span>
            <strong>Click to upload or drag and drop</strong>
            <small>Max 10mb file size, only png and jpeg files.</small>
          </button>
          <div v-if="form.images.length" class="thumbnail-strip">
            <div v-for="(image, index) in form.images" :key="image" class="thumbnail-tile">
              <img :src="image" :alt="`${form.product_name} product image ${index + 1}`" />
              <span v-if="index === 0" class="media-badge">Primary</span>
              <button type="button" :aria-label="`Remove image ${index + 1}`" @click="removeImage(index)">&#215;</button>
            </div>
          </div>
          <div class="media-actions">
            <input ref="fileInput" type="file" accept="image/png,image/jpeg" multiple hidden @change="selectImages" />
          </div>
          <p class="media-help">Add multiple product photos. The first image is used as the primary catalog image.</p>
        </section>
        <section class="edit-card"><span class="eyebrow">INVENTORY & PRICING</span>
          <div class="two-columns"><label>Price (ZAR)<input v-model.number="form.price" type="number"
                min="0" /></label><label>Stock quantity<input v-model.number="form.quantity" type="number"
                min="0" /></label></div><label>Low-stock alert<input v-model.number="form.low_stock_threshold"
              type="number" min="0" /></label>
          <div class="stock-callout"><strong>{{ product.stockStatus }}</strong><span>Current catalog status</span></div>
          <button class="primary-button" type="submit">Save changes</button><button class="text-button" type="button"
            @click="router.push('/products')">Cancel</button>
          <p v-if="message" class="success">{{ message }}</p>
        </section>
      </aside>
    </form>
  </div>
</template>
<script setup>
import { computed, reactive, ref, watch } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { useSupplierData } from "@/data/supplierData";
const route = useRoute(); const router = useRouter(); const { products, updateProduct } = useSupplierData();
const product = computed(() => products.value.find((item) => item.product_id === Number(route.params.id)) || null);
const form = reactive({ product_name: "", category_name: "", sku: "", description: "", price: 0, quantity: 0, low_stock_threshold: 10, image: "", images: [] });
watch(product, (value) => {
  if (!value) return;
  Object.assign(form, { product_name: value.product_name, category_name: value.category_name, sku: value.sku, description: value.description, price: value.price, quantity: value.quantity, low_stock_threshold: value.low_stock_threshold, image: value.image || "", images: value.images?.length ? [...value.images] : (value.image ? [value.image] : []) });
}, { immediate: true });
const message = ref("");
function selectImages(event) { const files = [...(event.target.files || [])]; form.images.push(...files.map((file) => URL.createObjectURL(file))); event.target.value = ""; }
function removeImage(index) { form.images.splice(index, 1); form.image = form.images[0] || ""; }
function save() { updateProduct(route.params.id, { ...form, image: form.images[0] || "", images: [...form.images] }); message.value = "Changes saved locally."; setTimeout(() => router.push("/products"), 650); }
</script>
<style scoped>
.edit-page {
  min-height: 100vh;
  padding: 34px 38px;
  background: #f7f5f2;
  color: #4d3933;
  font-family: Arial, sans-serif
}

.edit-header,
.edit-grid,
.empty {
  max-width: 1120px;
  margin: 0 auto
}

.edit-header {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 28px
}

.eyebrow {
  color: #d2763d;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.8px
}

.edit-header h1 {
  margin: 7px 0 5px;
  font: 700 34px Georgia, serif;
  color: #44312c
}

.edit-header p {
  margin: 0;
  color: #88766e
}

.edit-grid {
  display: grid;
  grid-template-columns: 1.45fr .8fr;
  gap: 22px
}

.edit-side {
  display: flex;
  flex-direction: column;
  gap: 22px
}

.edit-card {
  width: 100%;
  padding: 25px;
  border: 1px solid #e6dfda;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 6px 18px #4b38300d
}

.edit-card h2 {
  margin: 9px 0 25px;
  font: 700 21px Georgia, serif
}

.media-card h2 {
  margin-bottom: 16px
}

.upload-zone {
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

.upload-zone:hover {
  background: #fff8f3;
  border-color: #d2763d;
}

.upload-icon {
  margin-bottom: 6px;
  color: #c17a51;
  font-size: 21px;
}

.upload-zone strong,
.upload-zone small {
  font-size: 10px;
  font-weight: 600;
}

.upload-zone small {
  margin-top: 4px;
  color: #a8958c;
  font-weight: 400;
}

.thumbnail-strip {
  display: flex;
  gap: 7px;
  margin-top: 8px;
  overflow-x: auto;
}

.thumbnail-tile {
  position: relative;
  flex: 0 0 54px;
  height: 54px;
  overflow: hidden;
  border: 1px solid #e6dfda;
  border-radius: 6px;
  background: #f1e6df;
}

.thumbnail-tile img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-tile > button {
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

.thumbnail-tile > button:hover {
  background: #fae5e1;
}

.media-badge {
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

.media-help {
  margin: 10px 0 0;
  color: #a38c80;
  font-size: 12px;
  line-height: 1.5;
}

.edit-card label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 18px;
  color: #7d6c64;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .4px
}

.edit-card input,
.edit-card select,
.edit-card textarea {
  padding: 12px 13px;
  border: 1px solid #e4ddd8;
  border-radius: 8px;
  outline: 0;
  background: #fbfaf8;
  color: #4d3933;
  font: 14px Arial
}

.two-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px
}

.ghost-button,
.primary-button,
.text-button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  padding: 11px 15px;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer
}

.ghost-button {
  border: 1px solid #e1d8d2;
  background: #fff;
  color: #644c42
}

.primary-button {
  width: 100%;
  border: 0;
  background: #e17b3d;
  color: #fff
}

.text-button {
  width: 100%;
  margin-top: 8px;
  border: 0;
  background: transparent;
  color: #8e6b5b
}

.stock-callout {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 13px;
  margin: 5px 0 20px;
  border-radius: 8px;
  background: #f5eee8;
  color: #76594c
}

.stock-callout span {
  font-size: 12px;
  color: #a38c80
}

.success {
  margin-bottom: 0;
  color: #418049;
  font-size: 13px
}

.empty {
  text-align: center;
  padding: 80px 20px
}

.empty h2 {
  font: 24px Georgia, serif
}

@media(max-width:800px) {
  .edit-page {
    padding: 24px 16px
  }

  .edit-header {
    flex-direction: column
  }

  .edit-grid {
    grid-template-columns: 1fr
  }

  .two-columns {
    grid-template-columns: 1fr
  }
}
</style>
