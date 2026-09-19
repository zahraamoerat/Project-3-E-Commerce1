<template>
  <div class="supplier_add_products_form-page">
    <header class="supplier_add_products_form-header">
      <RouterLink to="/products" class="supplier_add_products_back-link"><span aria-hidden="true">&#8592;</span> Back to
        product list</RouterLink>
      <div class="supplier_add_products_header-title-row">
        <div>
          <span class="supplier_add_products_eyebrow">PRODUCT CATALOG</span>
          <h1>Add New Product</h1>
          <p>Build a clear listing buyers can discover, understand, and order.</p>
        </div>
        <span class="supplier_add_products_required-note"><b>*</b> Required fields</span>
      </div>
    </header>
    <div v-if="message" class="supplier_add_products_notice">{{ message }}</div><div v-if="error" class="supplier_add_products_notice supplier_add_products_error">{{ error }}</div>
    <form class="supplier_add_products_form-layout" @submit.prevent="publish">
      <div class="supplier_add_products_form-column">
        <section class="supplier_add_products_form-section">
          <div class="supplier_add_products_section-heading"><span
              class="supplier_add_products_section-number">01</span>
            <div>
              <h2>Description</h2>
              <p>Start with the details buyers see first.</p>
            </div>
          </div>
          <label>Product Name<input v-model.trim="form.product_name" placeholder="Product name" required /></label>
          <label>Business Description
            <span class="supplier_add_products_field-action">Update .txt file</span>
            <textarea v-model.trim="form.description" rows="6"
              placeholder="Tell buyers about this product..."></textarea>
          </label>
        </section>

        <section class="supplier_add_products_form-section">
          <div class="supplier_add_products_section-heading"><span
              class="supplier_add_products_section-number">02</span>
            <div>
              <h2>Category</h2>
              <p>Place this product in the right collection.</p>
            </div>
          </div>
          <label>Product Category<select v-model="form.category_name" required>
              <option disabled value="">Select a category</option>
              <option>Health & Medicine</option>
              <option>Beauty</option>
              <option>Eco-friendly Packaging</option>
              <option>Food & Beverage</option>
              <option>Cleaning Supplies</option>
              <option>Office Supplies</option>
              <option>Shipping Supplies</option>
            </select></label>
          <label>Product Category<select v-model="form.subcategory">
              <option value="">Select a subcategory</option>
              <option>Beauty</option>
              <option>Packaging</option>
              <option>Wholesale goods</option>
            </select></label>
        </section>

        <section class="supplier_add_products_form-section">
          <div class="supplier_add_products_section-heading"><span
              class="supplier_add_products_section-number">03</span>
            <div>
              <h2>Inventory</h2>
              <p>Set the available quantity and tracking code.</p>
            </div>
          </div>
          <div class="supplier_add_products_two-columns">
            <label>Quantity<input v-model.number="form.quantity" type="number" min="0" required /></label>
            <label>SKU (Optional)<input v-model.trim="form.sku" placeholder="UGG-BB-PUR-06" /></label>
          </div>
        </section>

        <section class="supplier_add_products_form-section supplier_add_products_selling-type">
          <div class="supplier_add_products_section-heading"><span
              class="supplier_add_products_section-number">04</span>
            <div>
              <h2>Selling Type</h2>
              <p>Choose where buyers can purchase this item.</p>
            </div>
          </div>
          <label class="supplier_add_products_check-label"><input v-model="form.sellingType" value="online"
              type="radio" /> In-store selling only</label>
          <label class="supplier_add_products_check-label"><input v-model="form.sellingType" value="online-only"
              type="radio" /> Online selling only</label>
          <label class="supplier_add_products_check-label"><input v-model="form.sellingType" value="both"
              type="radio" /> Available both in-store and online</label>
        </section>

        <section class="supplier_add_products_form-section supplier_add_products_variant-section">
          <div class="supplier_add_products_section-heading"><span
              class="supplier_add_products_section-number">05</span>
            <div>
              <h2>Variant</h2>
              <p>Offer different versions of the same product.</p>
            </div>
          </div>
          <div class="supplier_add_products_variant-row"><span>Product variants</span><button type="button"
              class="supplier_add_products_add-variant">+ Add Variant</button></div>
        </section>
      </div>

      <div class="supplier_add_products_form-column">
        <section class="supplier_add_products_form-section supplier_add_products_image-section">
          <div class="supplier_add_products_section-heading"><span
              class="supplier_add_products_section-number">06</span>
            <div>
              <h2>Product Images <span class="supplier_add_products_info-icon" title="Add clear product images">i</span>
              </h2>
              <p>Use bright, clear images to build buyer confidence.</p>
            </div>
          </div>
          <button type="button" class="supplier_add_products_upload-zone" @click="$refs.fileInput.click()">
            <span class="supplier_add_products_upload-icon">&#8615;</span>
            <strong>Click to upload or drag and drop</strong>
            <small>Max 10mb file size, only png and jpeg files.</small>
          </button>
          <div v-if="form.images.length" class="supplier_add_products_thumbnail-strip">
            <div v-for="(image, index) in form.images" :key="image" class="supplier_add_products_thumbnail-tile">
              <img :src="image" :alt="`Selected product image ${index + 1}`" />
              <button type="button" :aria-label="`Remove image ${index + 1}`"
                @click="removeImage(index)">&#215;</button>
            </div>
          </div>
          <input ref="fileInput" type="file" accept="image/png,image/jpeg" multiple hidden @change="selectImages" />
        </section>

        <section class="supplier_add_products_form-section">
          <div class="supplier_add_products_section-heading"><span
              class="supplier_add_products_section-number">07</span>
            <div>
              <h2>Shipping and Delivery</h2>
              <p>Help buyers estimate handling and delivery requirements.</p>
            </div>
          </div>
          <label>Items Weight<div class="supplier_add_products_input-suffix"><input v-model.number="form.weight"
                type="number" min="0" placeholder="12.00" /><span>kg</span></div></label>
          <label>Package Size <span class="supplier_add_products_hint">(The package you use to ship your
              product)</span></label>
          <div class="supplier_add_products_three-columns">
            <label>Length<div class="supplier_add_products_input-suffix"><input v-model.number="form.length"
                  type="number" min="0" placeholder="12.00" /><span>in</span></div></label>
            <label>Breadth<div class="supplier_add_products_input-suffix"><input v-model.number="form.breadth"
                  type="number" min="0" placeholder="12.00" /><span>in</span></div></label>
            <label>Width<div class="supplier_add_products_input-suffix"><input v-model.number="form.width" type="number"
                  min="0" placeholder="12.00" /><span>in</span></div></label>
          </div>
        </section>

        <section class="supplier_add_products_form-section supplier_add_products_pricing-section">
          <div class="supplier_add_products_section-heading"><span
              class="supplier_add_products_section-number">08</span>
            <div>
              <h2>Pricing</h2>
              <p>Set your wholesale price and comparison price.</p>
            </div>
          </div>
          <div class="supplier_add_products_two-columns">
            <label>Price<div class="supplier_add_products_input-prefix"><span>$</span><input v-model.number="form.price"
                  type="number" min="0" required placeholder="180.00" /></div></label>
            <label>Compare at Price <span class="supplier_add_products_info-icon" title="Original price">i</span>
              <div class="supplier_add_products_input-prefix"><span>$</span><input v-model.number="form.comparePrice"
                  type="number" min="0" placeholder="320.00" /></div>
            </label>
          </div>
        </section>

        <div class="supplier_add_products_form-actions"><button type="button"
            class="supplier_add_products_discard-button" @click="router.push('/products')">Discard</button><button
            type="button" class="supplier_add_products_schedule-button" @click="saveDraft">Save as draft</button><button
            type="submit" class="supplier_add_products_primary-button" :disabled="saving">{{ saving ? "Saving…" : "Add Product" }}</button></div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useSupplierData } from "@/data/supplierData";
const router=useRouter(); const {addProduct,uploadProductImages,imagePlaceholders}=useSupplierData();
const message=ref(""); const error=ref(""); const saving=ref(false);
const form=reactive({product_name:"",category_name:"",subcategory:"",sku:"",description:"",price:null,comparePrice:null,quantity:0,low_stock_threshold:10,unit:"pack",sellingType:"online",weight:null,length:null,breadth:null,width:null,images:[]});
function selectImages(event){const files=[...(event.target.files||[])];const rejected=[];for(const file of files){if(!["image/png","image/jpeg"].includes(file.type))rejected.push(`${file.name}: PNG/JPEG only`);else if(file.size>10*1024*1024)rejected.push(`${file.name}: larger than 10MB`);else form.images.push(URL.createObjectURL(file));}if(rejected.length)error.value=rejected.join(" • ");event.target.value="";}
function removeImage(index){const image=form.images[index];if(image?.startsWith("blob:"))URL.revokeObjectURL(image);form.images.splice(index,1);}
function validate(){if(form.product_name.trim().length<3)return"Product name must be at least 3 characters.";if(!form.category_name)return"Select a product category.";if(!Number.isFinite(Number(form.price))||Number(form.price)<=0)return"Price must be greater than zero.";if(form.comparePrice!==null&&form.comparePrice!==""&&Number(form.comparePrice)<Number(form.price))return"Compare at price must be greater than or equal to the selling price.";if(!Number.isInteger(Number(form.quantity))||Number(form.quantity)<0)return"Quantity must be a non-negative whole number.";if(!Number.isInteger(Number(form.low_stock_threshold))||Number(form.low_stock_threshold)<0)return"Low-stock threshold must be a non-negative whole number.";if(form.sku&&!/^[A-Za-z0-9][A-Za-z0-9._-]{2,39}$/.test(form.sku))return"SKU must be 3–40 characters and use only letters, numbers, dots, underscores or hyphens.";return"";}
async function publish(){error.value="";const validation=validate();if(validation){error.value=validation;return;}saving.value=true;try{const images=await uploadProductImages(form.images);await addProduct({...form,product_name:form.product_name.trim(),description:form.description.trim(),image:images[0]||imagePlaceholders.packaging,images});message.value="Product published successfully.";setTimeout(()=>router.push("/products"),500);}catch(e){error.value=e.message||"Unable to publish the product.";}finally{saving.value=false;}}
async function saveDraft(){error.value="";if(form.product_name){const validation=validate();if(validation){error.value=validation;return;}}saving.value=true;try{const images=await uploadProductImages(form.images);await addProduct({...form,product_name:form.product_name.trim()||"Untitled draft",category_name:form.category_name||"Eco-friendly Packaging",image:images[0]||imagePlaceholders.packaging,images});message.value="Draft saved.";setTimeout(()=>router.push("/products"),500);}catch(e){error.value=e.message||"Unable to save the draft.";}finally{saving.value=false;}}
</script>

<style scoped>
.supplier_add_products_form-page {
  min-height: 100vh;
  padding: 30px 34px 56px;
  background: #f7f5f2;
  color: #4d3933;
  font-family: Arial, sans-serif;
}

.supplier_add_products_form-header {
  max-width: 1080px;
  margin: 0 auto 30px;
}

.supplier_add_products_back-link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 18px;
  color: #8e786d;
  font-size: 11px;
  font-weight: 600;
  text-decoration: none;
}

.supplier_add_products_header-title-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
}

.supplier_add_products_eyebrow {
  display: block;
  margin-bottom: 8px;
  color: #d2763d;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.6px;
}

.supplier_add_products_form-header h1 {
  margin: 0 0 7px;
  color: #44312c;
  font-size: 22px;
  font-weight: 700;
}

.supplier_add_products_form-header p {
  margin: 0;
  color: #917e74;
  font-size: 12px;
}

.supplier_add_products_required-note {
  padding-bottom: 3px;
  color: #99867d;
  font-size: 11px;
}

.supplier_add_products_required-note b {
  color: #c86e38;
}

.supplier_add_products_form-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.04fr) minmax(360px, .96fr);
  gap: 28px;
  max-width: 1080px;
  margin: auto;
}

.supplier_add_products_form-column {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.supplier_add_products_form-section {
  padding: 20px 20px 22px;
  border: 1px solid #e6dfda;
  border-radius: 12px;
  background: rgba(255, 253, 250, 0.72);
  box-shadow: 0 3px 12px rgba(91, 62, 48, 0.025);
}

.supplier_add_products_section-heading {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  margin-bottom: 20px;
  padding-bottom: 13px;
  border-bottom: 1px solid #eee6e0;
}

.supplier_add_products_section-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 25px;
  height: 25px;
  flex: 0 0 25px;
  border-radius: 8px;
  background: #f3e5dc;
  color: #c86e38;
  font-size: 10px;
  font-weight: 700;
}

.supplier_add_products_form-section h2 {
  margin: 0;
  color: #4d3730;
  font-size: 14px;
  font-weight: 700;
}

.supplier_add_products_section-heading p {
  margin: 4px 0 0;
  color: #a08d84;
  font-size: 11px;
  font-weight: 400;
}

.supplier_add_products_form-section label {
  position: relative;
}

.supplier_add_products_image-section,
.supplier_add_products_pricing-section {
  padding-bottom: 22px;
}

.supplier_add_products_image-section h2 {
  display: flex;
  align-items: center;
  gap: 5px;
}

.supplier_add_products_info-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 13px;
  height: 13px;
  border: 1px solid #b49b8e;
  border-radius: 50%;
  color: #9b8175;
  font-size: 9px;
  font-style: normal;
}

.supplier_add_products_field-action {
  position: absolute;
  top: 0;
  right: 0;
  color: #c86e38;
  font-size: 10px;
  font-weight: 700;
}

label {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 15px;
  color: #7d6c64;
  font-size: 10px;
  font-weight: 600;
}

input,
select,
textarea {
  width: 100%;
  min-height: 36px;
  padding: 9px 11px;
  border: 1px solid #e4ddd8;
  border-radius: 6px;
  outline: 0;
  background: #fffdfa;
  color: #4d3933;
  font: 400 11px Arial;
}

input:focus,
select:focus,
textarea:focus {
  border-color: #e0a078;
  box-shadow: 0 0 0 2px #f8e5d9;
}

textarea {
  resize: vertical;
  min-height: 112px;
  line-height: 1.45;
}

.supplier_add_products_two-columns,
.supplier_add_products_three-columns {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.supplier_add_products_form-section>label:last-child,
.supplier_add_products_form-section>.supplier_add_products_two-columns:last-child,
.supplier_add_products_form-section>.supplier_add_products_three-columns:last-child,
.supplier_add_products_form-section>.supplier_add_products_variant-row:last-child {
  margin-bottom: 0;
}

.supplier_add_products_three-columns {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.supplier_add_products_hint {
  color: #aa968d;
  font-weight: 400;
}

.supplier_add_products_input-suffix,
.supplier_add_products_input-prefix {
  display: flex;
  align-items: center;
  min-height: 36px;
  overflow: hidden;
  border: 1px solid #e4ddd8;
  border-radius: 6px;
}

.supplier_add_products_input-suffix input,
.supplier_add_products_input-prefix input {
  min-width: 0;
  border: 0;
  box-shadow: none;
}

.supplier_add_products_input-suffix span,
.supplier_add_products_input-prefix span {
  padding: 0 9px;
  color: #a48f85;
  font-size: 10px;
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
  min-height: 112px;
  padding: 16px;
  border: 1px dashed #e0a078;
  border-radius: 8px;
  background: #fffdfa;
  color: #b86a43;
  cursor: pointer;
}

.supplier_add_products_upload-icon {
  margin-bottom: 6px;
  color: #c17a51;
  font-size: 21px;
}

.supplier_add_products_upload-zone strong,
.supplier_add_products_upload-zone small {
  font-size: 10px;
  font-weight: 600;
}

.supplier_add_products_upload-zone small {
  margin-top: 4px;
  color: #a8958c;
  font-weight: 400;
}

.supplier_add_products_thumbnail-strip {
  display: flex;
  gap: 7px;
  margin-top: 8px;
  overflow-x: auto;
}

.supplier_add_products_thumbnail-tile {
  position: relative;
  flex: 0 0 54px;
  height: 54px;
  overflow: hidden;
  border: 1px solid #e6dfda;
  border-radius: 6px;
  background: #f1e6df;
}

.supplier_add_products_thumbnail-tile img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.supplier_add_products_thumbnail-tile button {
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

.supplier_add_products_check-label {
  flex-direction: row;
  align-items: center;
  gap: 6px;
  margin: 0 0 5px;
  color: #6e5a51;
  font-size: 10px;
  font-weight: 400;
}

.supplier_add_products_check-label input {
  min-height: auto;
  width: 12px;
  height: 12px;
  accent-color: #d2763d;
}

.supplier_add_products_variant-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 36px;
  padding: 0 10px;
  border: 1px solid #e4ddd8;
  border-radius: 6px;
  color: #806d64;
  font-size: 10px;
}

.supplier_add_products_add-variant {
  border: 0;
  background: none;
  color: #c86e38;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
}

.supplier_add_products_form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  gap: 10px;
  margin-top: 2px;
  padding: 17px 4px 0;
  border-top: 1px solid #e6dfda;
}

.supplier_add_products_discard-button,
.supplier_add_products_schedule-button,
.supplier_add_products_primary-button {
  min-height: 36px;
  padding: 0 14px;
  border: 0;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
}

.supplier_add_products_discard-button {
  border: 1px solid #e1d8d2;
  background: #fff;
  color: #735d52;
}

.supplier_add_products_schedule-button {
  background: #fff3eb;
  color: #c16b39;
}

.supplier_add_products_primary-button {
  background: #d2763d;
  color: #fff;
}

.supplier_add_products_notice {
  margin: 0 auto 18px;
  padding: 10px 12px;
  border: 1px solid #cfe4d1;
  border-radius: 5px;
  background: #f1faf2;
  color: #407b47;
  font-size: 11px;
}

.supplier_add_products_error { background:#fff0ee; border-color:#efc7c1; color:#a8473d; }

@media(max-width:850px) {
  .supplier_add_products_form-page {
    padding: 20px 16px 35px;
  }

  .supplier_add_products_form-layout {
    grid-template-columns: 1fr;
  }

  .supplier_add_products_header-title-row {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }
}

@media(max-width:520px) {
  .supplier_add_products_two-columns {
    grid-template-columns: 1fr;
  }

  .supplier_add_products_three-columns {
    grid-template-columns: 1fr;
  }

  .supplier_add_products_form-actions {
    justify-content: stretch;
  }

  .supplier_add_products_form-actions button {
    flex: 1;
    padding: 0 8px;
  }
}
</style>
