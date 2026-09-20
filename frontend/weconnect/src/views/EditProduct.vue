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
        <div class="supplier_edit_product_two-columns"><label>Category<select v-model="form.category_name" :disabled="categoriesLoading">
              <option disabled value="">Select a category</option>
              <option v-for="category in categories" :key="category.category_id" :value="category.category_name">{{ category.category_name }}</option>
            </select></label>
            <p v-if="categoriesError" class="supplier_edit_product_field-error">{{ categoriesError }}</p><label>SKU<input v-model="form.sku" /></label></div><label>Description<textarea
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
          <div class="supplier_edit_product_two-columns"><label>Price (ZAR)<input v-model.number="form.price" step="0.01"
                type="number" min="0" /></label><label>Stock quantity<input v-model.number="form.quantity" type="number"
                min="0" /></label></div><label>Compare at price<input v-model.number="form.comparePrice" type="number" min="0" step="0.01" /></label><label>Low-stock alert<input v-model.number="form.low_stock_threshold"
              type="number" min="0" /></label>
          <div class="supplier_edit_product_stock-callout"><strong>{{ product.stockStatus }}</strong><span>Current
              catalog status</span></div>
          <button class="supplier_edit_product_primary-button" type="submit" :disabled="saving">{{ saving ? "Saving…" : "Save changes" }}</button><button
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
const route=useRoute();const router=useRouter();const {products,updateProduct,uploadProductImages,categories,categoriesLoading,categoriesError,loadCategories}=useSupplierData();
loadCategories();const product=computed(()=>products.value.find(i=>i.product_id===Number(route.params.id))||null);
const form=reactive({product_name:"",category_name:"",sku:"",description:"",price:null,comparePrice:null,quantity:0,low_stock_threshold:10,image:"",images:[]});const message=ref("");const error=ref("");const saving=ref(false);
watch(product,v=>{if(!v)return;Object.assign(form,{product_name:v.product_name||"",category_name:v.category_name||"",sku:v.sku||"",description:v.description||"",price:v.price,comparePrice:v.compare_price,quantity:v.quantity,low_stock_threshold:v.low_stock_threshold,image:v.image||"",images:v.images?.length?[...v.images]:(v.image?[v.image]:[])})},{immediate:true});
function validate(){if(form.description.length>2000)return"Description must be 2000 characters or fewer.";if(form.product_name.trim().length<3)return"Product name must be at least 3 characters.";if(!form.category_name)return"Select a product category.";if(!Number.isFinite(Number(form.price))||Number(form.price)<=0)return"Price must be greater than zero.";if(form.comparePrice!==null&&form.comparePrice!==""&&Number(form.comparePrice)<Number(form.price))return"Compare at price must be greater than or equal to the selling price.";if(!Number.isInteger(Number(form.quantity))||Number(form.quantity)<0)return"Quantity must be a non-negative whole number.";if(!Number.isInteger(Number(form.low_stock_threshold))||Number(form.low_stock_threshold)<0)return"Low-stock threshold must be a non-negative whole number.";if(form.sku&&!/^[A-Za-z0-9][A-Za-z0-9._-]{2,39}$/.test(form.sku))return"SKU must be 3–40 characters and use only letters, numbers, dots, underscores or hyphens.";return"";}
function selectImages(e){const files=[...(e.target.files||[])];const rejected=[];for(const file of files){if(form.images.length>=8){rejected.push("Maximum of 8 product images allowed.");break;}if(!["image/png","image/jpeg"].includes(file.type)){rejected.push(file.name+": PNG/JPEG only");continue;}if(file.size>10*1024*1024){rejected.push(file.name+": larger than 10MB");continue;}form.images.push(URL.createObjectURL(file));}if(rejected.length)error.value=rejected.join(" • ");form.image=form.images[0]||"";e.target.value="";}
function removeImage(i){const image=form.images[i];if(image?.startsWith("blob:"))URL.revokeObjectURL(image);form.images.splice(i,1);form.image=form.images[0]||"";}
async function save(){error.value="";const validation=validate();if(validation){error.value=validation;return;}saving.value=true;try{const images=await uploadProductImages(form.images);await updateProduct(route.params.id,{...form,product_name:form.product_name.trim(),description:form.description.trim(),image:images[0]||"",images});message.value="Product updated successfully.";setTimeout(()=>router.push("/products"),500);}catch(e){error.value=e.message||"Unable to update the product.";}finally{saving.value=false;}}
</script>
<style scoped>
.supplier_edit_product_edit-page {
  min-height: 100vh;
  padding: 32px clamp(18px, 4vw, 48px) 56px;
  background: #f7f4f1;
  color: #4d3933;
  font-family: Arial, Helvetica, sans-serif;
}

.supplier_edit_product_edit-page,
.supplier_edit_product_edit-page * {
  box-sizing: border-box;
}

.supplier_edit_product_edit-header {
  max-width: 1180px;
  margin: 0 auto 24px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
}

.supplier_edit_product_eyebrow {
  display: inline-block;
  color: #b9683d;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.7px;
  text-transform: uppercase;
}

.supplier_edit_product_edit-header h1 {
  margin: 7px 0 5px;
  color: #3f2d27;
  font: 700 clamp(28px, 3vw, 36px)/1.15 Georgia, "Times New Roman", serif;
}

.supplier_edit_product_edit-header p {
  margin: 0;
  color: #87756d;
  font-size: 14px;
}

.supplier_edit_product_ghost-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 0 17px;
  border: 1px solid #d9cdc5;
  border-radius: 9px;
  background: #fff;
  color: #60483e;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(63,45,39,.04);
  transition: .2s ease;
}

.supplier_edit_product_ghost-button:hover {
  border-color: #c58a67;
  background: #fffaf7;
  transform: translateY(-1px);
}

.supplier_edit_product_edit-grid {
  max-width: 1180px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(320px, .85fr);
  gap: 22px;
  align-items: start;
}

.supplier_edit_product_edit-side {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.supplier_edit_product_edit-card {
  padding: 26px;
  border: 1px solid #e5ddd7;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(63,45,39,.06);
}

.supplier_edit_product_edit-card h2 {
  margin: 8px 0 24px;
  color: #44322c;
  font: 700 21px/1.25 Georgia, "Times New Roman", serif;
}

.supplier_edit_product_media-card h2 {
  margin-bottom: 15px;
}

.supplier_edit_product_edit-card label {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-bottom: 17px;
  color: #66534b;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: .15px;
}

.supplier_edit_product_edit-card input,
.supplier_edit_product_edit-card select,
.supplier_edit_product_edit-card textarea {
  width: 100%;
  padding: 12px 13px;
  border: 1px solid #ded5cf;
  border-radius: 8px;
  outline: none;
  background: #fcfaf8;
  color: #493730;
  font: 14px/1.45 Arial, Helvetica, sans-serif;
  transition: border-color .18s ease, box-shadow .18s ease, background .18s ease;
}

.supplier_edit_product_edit-card textarea {
  min-height: 155px;
  resize: vertical;
}

.supplier_edit_product_edit-card input::placeholder,
.supplier_edit_product_edit-card textarea::placeholder {
  color: #ad9c93;
}

.supplier_edit_product_edit-card input:focus,
.supplier_edit_product_edit-card select:focus,
.supplier_edit_product_edit-card textarea:focus {
  border-color: #c77a4e;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(199,122,78,.12);
}

.supplier_edit_product_edit-card input:disabled,
.supplier_edit_product_edit-card select:disabled {
  cursor: not-allowed;
  opacity: .65;
}

.supplier_edit_product_two-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.supplier_edit_product_field-error {
  margin: -8px 0 14px;
  color: #a8473d;
  font-size: 11px;
}

.supplier_edit_product_upload-zone {
  width: 100%;
  min-height: 142px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border: 1.5px dashed #d9a17e;
  border-radius: 10px;
  background: #fffaf7;
  color: #ad643d;
  cursor: pointer;
  transition: .2s ease;
}

.supplier_edit_product_upload-zone:hover {
  border-color: #c87548;
  background: #fff6f0;
}

.supplier_edit_product_upload-zone:focus-visible {
  outline: 3px solid rgba(199,122,78,.18);
  outline-offset: 2px;
}

.supplier_edit_product_upload-icon {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  margin-bottom: 4px;
  border-radius: 50%;
  background: #f5e3d7;
  color: #a9603d;
  font-size: 20px;
}

.supplier_edit_product_upload-zone strong {
  color: #644a40;
  font-size: 12px;
}

.supplier_edit_product_upload-zone small {
  color: #a38d82;
  font-size: 11px;
}

.supplier_edit_product_thumbnail-strip {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 9px;
  margin-top: 12px;
}

.supplier_edit_product_thumbnail-tile {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  border: 1px solid #e1d8d1;
  border-radius: 9px;
  background: #f2e9e3;
}

.supplier_edit_product_thumbnail-tile img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.supplier_edit_product_thumbnail-tile > button {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 23px;
  height: 23px;
  display: grid;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: rgba(255,255,255,.94);
  color: #a8473d;
  font-size: 16px;
  line-height: 1;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,.12);
}

.supplier_edit_product_thumbnail-tile > button:hover {
  background: #fff0ed;
}

.supplier_edit_product_media-badge {
  position: absolute;
  left: 6px;
  bottom: 6px;
  padding: 4px 6px;
  border-radius: 5px;
  background: rgba(255,255,255,.94);
  color: #70564b;
  font-size: 8px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .4px;
}

.supplier_edit_product_media-help {
  margin: 12px 0 0;
  color: #9a887f;
  font-size: 11px;
  line-height: 1.55;
}

.supplier_edit_product_stock-callout {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 14px 15px;
  margin: 3px 0 19px;
  border: 1px solid #eaded5;
  border-radius: 9px;
  background: #f8f0eb;
  color: #654b40;
}

.supplier_edit_product_stock-callout strong {
  font-size: 13px;
}

.supplier_edit_product_stock-callout span {
  color: #9b877d;
  font-size: 11px;
}

.supplier_edit_product_primary-button,
.supplier_edit_product_text-button {
  min-height: 43px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  transition: .2s ease;
}

.supplier_edit_product_primary-button {
  border: 0;
  background: #d2763d;
  color: #fff;
  box-shadow: 0 5px 12px rgba(180,91,43,.18);
}

.supplier_edit_product_primary-button:hover:not(:disabled) {
  background: #bd6330;
  transform: translateY(-1px);
}

.supplier_edit_product_primary-button:disabled {
  cursor: wait;
  opacity: .65;
}

.supplier_edit_product_text-button {
  margin-top: 8px;
  border: 1px solid transparent;
  background: transparent;
  color: #896b5d;
}

.supplier_edit_product_text-button:hover {
  background: #f7f0ec;
}

.supplier_edit_product_success {
  margin: 12px 0 0;
  padding: 10px 12px;
  border: 1px solid #cfe2d2;
  border-radius: 8px;
  background: #f1f8f2;
  color: #397044;
  font-size: 12px;
}

.supplier_edit_product_empty {
  max-width: 1180px;
  margin: 0 auto;
  padding: 64px 24px;
  border: 1px solid #e5ddd7;
  border-radius: 14px;
  background: #fff;
  text-align: center;
  box-shadow: 0 8px 24px rgba(63,45,39,.05);
}

.supplier_edit_product_empty h2 {
  margin: 0 0 18px;
  color: #44322c;
  font: 700 24px Georgia, "Times New Roman", serif;
}

.supplier_edit_product_error {
  margin-bottom: 16px;
  padding: 12px 15px;
  border-color: #efc8c3;
  background: #fff4f2;
  color: #a8473d;
  text-align: left;
}

.supplier_edit_product_error p {
  margin: 0;
  font-size: 13px;
}

@media (max-width: 900px) {
  .supplier_edit_product_edit-grid {
    grid-template-columns: 1fr;
  }

  .supplier_edit_product_edit-side {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }
}

@media (max-width: 680px) {
  .supplier_edit_product_edit-page {
    padding: 22px 14px 40px;
  }

  .supplier_edit_product_edit-header {
    align-items: stretch;
    flex-direction: column;
    gap: 14px;
  }

  .supplier_edit_product_ghost-button {
    width: 100%;
  }

  .supplier_edit_product_edit-card {
    padding: 20px 17px;
  }

  .supplier_edit_product_edit-side {
    display: flex;
  }

  .supplier_edit_product_two-columns {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .supplier_edit_product_thumbnail-strip {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 420px) {
  .supplier_edit_product_thumbnail-strip {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>