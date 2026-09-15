<template>
  <div class="detail-page">
    <RouterLink to="/products" class="back-link"><span aria-hidden="true">&#8592;</span> Back to products</RouterLink>

    <div v-if="!product" class="empty-state">
      <h1>Product not found</h1>
      <RouterLink to="/products" class="btn btn-primary">Return to products</RouterLink>
    </div>

    <template v-else>
      <div class="detail-layout">
        <section>
          <div class="gallery-main">
            <button v-if="productImages.length > 1" type="button" class="gallery-arrow left" aria-label="Previous image" @click="activeImage = activeImage === 0 ? productImages.length - 1 : activeImage - 1">&#8249;</button>
            <img :src="productImages[activeImage]" :alt="product.product_name" />
            <button v-if="productImages.length > 1" type="button" class="gallery-arrow right" aria-label="Next image" @click="activeImage = activeImage === productImages.length - 1 ? 0 : activeImage + 1">&#8250;</button>
          </div>
          <div class="thumbnail-row">
            <button v-for="(image, index) in productImages" :key="image" type="button" class="thumbnail"
              :class="{ selected: activeImage === index }" @click="activeImage = index">
              <img :src="image" :alt="`${product.product_name} thumbnail ${index + 1}`" />
            </button>
          </div>
        </section>

        <section class="product-info">
          <span class="product-category">{{ product.category_name }}</span>
          <h1>{{ product.product_name }}</h1>
          <div class="rating"><span class="stars">*****</span><span>4.8 (245 reviews)</span></div>
          <div class="price-row"><strong>{{ formatPrice(product.price) }}</strong><del>{{ formatPrice(Math.round(product.price * 1.3)) }}</del></div>
          <p class="description">{{ product.description || `Wholesale-grade ${product.product_name.toLowerCase()}, sourced for consistency and durability at scale.` }}</p>

          <div class="detail-block">
            <strong class="block-label">Finish</strong>
            <div class="swatches"><button v-for="(color, index) in swatches" :key="color" type="button" class="swatch"
              :class="{ selected: selectedSwatch === index }" :style="{ background: color }" :aria-label="`Finish ${index + 1}`" @click="selectedSwatch = index"></button></div>
          </div>

          <div class="detail-block">
            <strong class="block-label">Pack size <a href="#" @click.prevent>View size guide</a></strong>
            <div class="size-pills"><button v-for="(size, index) in packSizes" :key="size" type="button" class="size-pill"
              :class="{ selected: selectedSize === index }" @click="selectedSize = index">{{ size }}</button></div>
          </div>

          <div class="quantity-row"><div class="quantity-stepper"><button type="button" aria-label="Decrease quantity" @click="quantity = Math.max(1, quantity - 1)">&#8722;</button><span>{{ quantity }}</span><button type="button" aria-label="Increase quantity" @click="quantity += 1">+</button></div><span class="stock-note">{{ product.quantity }} units in stock</span></div>
          <div class="buy-row"><button type="button" class="btn btn-primary" @click="message = 'Added to order'">Add to order</button><button type="button" class="btn btn-dark" @click="message = 'Order started'">Order now</button><button type="button" class="heart-button" aria-label="Save for later" @click="message = 'Saved for later'">&#9825;</button></div>
          <p v-if="message" class="action-message">{{ message }}</p>

          <div class="meta"><div><b>SKU</b> {{ product.sku || 'Not provided' }}</div><div><b>Tags</b> {{ product.category_name }}, Wholesale, Bulk</div><div class="share-row"><b>Share</b><span>f</span><span>x</span><span>p</span></div></div>
        </section>
      </div>

      <nav class="detail-tabs" aria-label="Product information">
        <button type="button" :class="{ active: activeTab === 'description' }" @click="activeTab = 'description'">Description</button>
        <button type="button" :class="{ active: activeTab === 'info' }" @click="activeTab = 'info'">Additional information</button>
        <button type="button" :class="{ active: activeTab === 'reviews' }" @click="activeTab = 'reviews'">Reviews (97)</button>
      </nav>
      <div class="tab-content">
        <p v-if="activeTab === 'description'">{{ product.description || 'This product is manufactured to consistent standards and ships in bulk-ready cartons for restaurants, retailers, and hospitality buyers.' }}</p>
        <dl v-else-if="activeTab === 'info'" class="info-list"><div><dt>Category</dt><dd>{{ product.category_name }}</dd></div><div><dt>SKU</dt><dd>{{ product.sku || 'Not provided' }}</dd></div><div><dt>Units in stock</dt><dd>{{ product.quantity }}</dd></div></dl>
        <div v-else class="review-summary"><strong>4.8</strong><span class="stars">*****</span><span>out of 5 from 97 reviews</span></div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { useSupplierData } from "@/data/supplierData";

const route = useRoute();
const { products } = useSupplierData();
const product = products.value.find((item) => item.product_id === Number(route.params.id));
const productImages = computed(() => product?.images?.length ? product.images : product?.image ? [product.image] : []);
const activeImage = ref(0);
const selectedSwatch = ref(0);
const selectedSize = ref(2);
const quantity = ref(1);
const activeTab = ref("reviews");
const message = ref("");
const swatches = ["#c9a67c", "#3c2b26", "#f2ede4", "#3f7a53", "#7c5f55"];
const packSizes = ["25 pack", "50 pack", "100 pack", "250 pack", "500 pack"];

function formatPrice(price) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(price);
}
</script>

<style scoped>
.detail-page { min-height: 100vh; padding: 28px 34px 60px; background: #f7f5f2; color: #2c211d; font-family: Arial, Helvetica, sans-serif; }
.detail-page > * { max-width: 1120px; margin-left: auto; margin-right: auto; }
.back-link { display: inline-flex; gap: 7px; align-items: center; margin-bottom: 16px; color: #6b5d56; font-size: 13px; font-weight: 600; text-decoration: none; }
.detail-layout { display: grid; grid-template-columns: 1fr 1.05fr; gap: 32px; align-items: start; }
.gallery-main { position: relative; display: flex; align-items: center; justify-content: center; height: 380px; overflow: hidden; border-radius: 14px; background: #f0ebe4; }
.gallery-main img { width: 100%; height: 100%; object-fit: cover; }
.gallery-arrow { position: absolute; top: 50%; z-index: 1; width: 34px; height: 34px; transform: translateY(-50%); border: 1px solid #e7e0d8; border-radius: 50%; background: #fff; color: #3c2b26; font-size: 24px; line-height: 1; box-shadow: 0 4px 16px #3c2b2614; cursor: pointer; }
.gallery-arrow.left { left: 14px; }.gallery-arrow.right { right: 14px; }
.thumbnail-row { display: flex; gap: 10px; margin-top: 12px; }
.thumbnail { width: 64px; height: 64px; padding: 0; overflow: hidden; border: 2px solid transparent; border-radius: 10px; background: #f0ebe4; cursor: pointer; }.thumbnail.selected { border-color: #e0793c; }.thumbnail img { width: 100%; height: 100%; object-fit: cover; opacity: .82; }
.product-category { color: #a89a92; font-size: 12px; font-weight: 600; letter-spacing: .5px; text-transform: uppercase; }.product-info h1 { margin: 6px 0 8px; color: #3c2b26; font: 600 28px Georgia, 'Times New Roman', serif; }.rating { display: flex; gap: 8px; align-items: center; margin-bottom: 12px; color: #a89a92; font-size: 12px; }.stars { color: #e0793c; letter-spacing: 1px; }.price-row { display: flex; align-items: baseline; gap: 10px; margin-bottom: 14px; }.price-row strong { color: #3c2b26; font-size: 25px; }.price-row del { color: #a89a92; font-size: 15px; }.description { margin: 0 0 18px; color: #6b5d56; font-size: 13.5px; line-height: 1.7; }.detail-block { margin-bottom: 18px; }.block-label { display: block; margin-bottom: 9px; color: #3c2b26; font-size: 12.5px; }.block-label a { margin-left: 8px; color: #c9631f; text-decoration: none; }.swatches { display: flex; gap: 9px; }.swatch { width: 26px; height: 26px; border: 2px solid transparent; border-radius: 50%; box-shadow: 0 0 0 1px #e7e0d8; cursor: pointer; }.swatch.selected { border-color: #e0793c; }.size-pills { display: flex; flex-wrap: wrap; gap: 8px; }.size-pill { padding: 8px 15px; border: 1px solid #e7e0d8; border-radius: 8px; background: #fff; color: #6b5d56; font-size: 13px; font-weight: 600; cursor: pointer; }.size-pill.selected { border-color: #523a33; background: #523a33; color: #fff; }
.quantity-row { display: flex; flex-wrap: wrap; align-items: center; gap: 16px; margin-bottom: 18px; }.quantity-stepper { display: flex; align-items: center; overflow: hidden; border: 1px solid #e7e0d8; border-radius: 9px; }.quantity-stepper button { width: 34px; height: 36px; border: 0; background: #fff; color: #3c2b26; font-size: 16px; cursor: pointer; }.quantity-stepper span { width: 38px; text-align: center; font-size: 14px; font-weight: 600; }.stock-note { color: #3f7a53; font-size: 12.5px; font-weight: 600; }.buy-row { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-bottom: 10px; }.btn { display: inline-flex; align-items: center; justify-content: center; padding: 12px 22px; border: 1px solid transparent; border-radius: 9px; font-size: 13.5px; font-weight: 600; cursor: pointer; }.btn-primary { background: #e0793c; color: #fff; }.btn-dark { border-color: #523a33; background: #523a33; color: #fff; }.heart-button { width: 44px; height: 44px; border: 1px solid #e7e0d8; border-radius: 9px; background: #fff; color: #6b5d56; font-size: 20px; cursor: pointer; }.action-message { margin: 0 0 10px; color: #3f7a53; font-size: 12px; }.meta { display: flex; flex-direction: column; gap: 7px; padding-top: 14px; border-top: 1px solid #f0ebe4; color: #6b5d56; font-size: 12.5px; }.meta b { margin-right: 6px; color: #3c2b26; }.share-row { display: flex; align-items: center; gap: 10px; }.share-row span { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 7px; background: #f0ebe4; }
.detail-tabs { display: flex; gap: 28px; margin-top: 36px; border-bottom: 1px solid #e7e0d8; }.detail-tabs button { padding: 0 0 14px; border: 0; border-bottom: 2px solid transparent; background: none; color: #a89a92; font-size: 14px; font-weight: 600; cursor: pointer; }.detail-tabs button.active { border-color: #e0793c; color: #3c2b26; }.tab-content { min-height: 100px; padding-top: 20px; color: #6b5d56; font-size: 13.5px; line-height: 1.7; }.info-list { max-width: 480px; margin: 0; }.info-list div { display: flex; justify-content: space-between; padding: 9px 0; border-bottom: 1px solid #f0ebe4; }.info-list dt { color: #6b5d56; }.info-list dd { margin: 0; color: #3c2b26; font-weight: 600; }.review-summary { display: flex; align-items: baseline; gap: 12px; }.review-summary strong { color: #3c2b26; font-size: 40px; }.empty-state { padding: 70px 20px; text-align: center; }.empty-state h1 { font: 24px Georgia, serif; }.empty-state .btn { margin-top: 12px; }
@media (max-width: 880px) { .detail-page { padding: 22px 16px 42px; }.detail-layout { grid-template-columns: 1fr; }.gallery-main { height: 300px; } }
@media (max-width: 520px) { .detail-tabs { gap: 16px; overflow-x: auto; }.detail-tabs button { white-space: nowrap; }.buy-row .btn { flex: 1; padding: 12px 10px; } }
</style>
