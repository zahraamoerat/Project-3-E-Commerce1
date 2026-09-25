<template>
  <div class="supplier_view_product_detail-page">
    <RouterLink to="/supplier/products" class="supplier_view_product_back-link"
      ><span aria-hidden="true">&#8592;</span> Back to products</RouterLink
    >

    <div v-if="!product" class="supplier_view_product_empty-state">
      <h1>Product not found</h1>
      <RouterLink
        to="/supplier/products"
        class="supplier_view_product_btn supplier_view_product_btn-primary"
        >Return to products</RouterLink
      >
    </div>

    <template v-else>
      <div class="supplier_view_product_detail-layout">
        <section>
          <div class="supplier_view_product_gallery-main">
            <button
              v-if="productImages.length > 1"
              type="button"
              class="supplier_view_product_gallery-arrow supplier_view_product_left"
              aria-label="Previous image"
              @click="
                activeImage =
                  activeImage === 0 ? productImages.length - 1 : activeImage - 1
              "
            >
              &#8249;
            </button>
            <img
              :src="resolveImageUrl(productImages[activeImage])"
              :alt="product.product_name"
            />
            <button
              v-if="productImages.length > 1"
              type="button"
              class="supplier_view_product_gallery-arrow supplier_view_product_right"
              aria-label="Next image"
              @click="
                activeImage =
                  activeImage === productImages.length - 1 ? 0 : activeImage + 1
              "
            >
              &#8250;
            </button>
          </div>
          <div class="supplier_view_product_thumbnail-row">
            <button
              v-for="(image, index) in productImages"
              :key="image"
              type="button"
              class="supplier_view_product_thumbnail"
              :class="{ selected: activeImage === index }"
              @click="activeImage = index"
            >
              <img
                :src="resolveImageUrl(image)"
                :alt="`${product.product_name} thumbnail ${index + 1}`"
              />
            </button>
          </div>
        </section>

        <section class="supplier_view_product_product-info">
          <span class="supplier_view_product_product-category">{{
            product.category_name
          }}</span>
          <h1>{{ product.product_name }}</h1>
          <div class="supplier_view_product_rating">
            <span
              v-if="product.compare_price"
              class="supplier_view_product_stars"
              >Pricing</span
            ><span>Product information from the supplier catalog</span>
          </div>
          <div class="supplier_view_product_price-row">
            <strong>{{ formatPrice(product.price) }}</strong
            ><del v-if="comparePrice">{{ formatPrice(comparePrice) }}</del>
          </div>
          <p class="supplier_view_product_description">
            {{
              product.description ||
              `Wholesale-grade ${product.product_name.toLowerCase()}, sourced for consistency and durability at scale.`
            }}
          </p>

          <div class="supplier_view_product_detail-block">
            <strong class="supplier_view_product_block-label"
              >Finish
              <span class="supplier_view_product_selection-note">{{
                selectedFinishLabel
              }}</span></strong
            >
            <div class="supplier_view_product_swatches">
              <button
                v-for="(color, index) in swatches"
                :key="color"
                type="button"
                class="supplier_view_product_swatch"
                :class="{ selected: selectedSwatch === index }"
                :style="{ background: color }"
                :aria-label="`Finish ${index + 1}`"
                @click="selectedSwatch = index"
              ></button>
            </div>
          </div>

          <div class="supplier_view_product_detail-block">
            <strong class="supplier_view_product_block-label"
              >Pack size
              <span class="supplier_view_product_selection-note">{{
                packSizes[selectedSize]
              }}</span
              ><a href="#" @click.prevent="showSizeGuide"
                >View size guide</a
              ></strong
            >
            <div class="supplier_view_product_size-pills">
              <button
                v-for="(size, index) in packSizes"
                :key="size"
                type="button"
                class="supplier_view_product_size-pill"
                :class="{ selected: selectedSize === index }"
                @click="selectedSize = index"
              >
                {{ size }}
              </button>
            </div>
          </div>

          <div class="supplier_view_product_quantity-row">
            <div class="supplier_view_product_quantity-stepper">
              <button
                type="button"
                aria-label="Decrease quantity"
                :disabled="quantity <= 1"
                @click="quantity = Math.max(1, quantity - 1)"
              >
                &#8722;</button
              ><span>{{ quantity }}</span
              ><button
                type="button"
                aria-label="Increase quantity"
                :disabled="quantity >= product.quantity"
                @click="quantity = Math.min(product.quantity, quantity + 1)"
              >
                +
              </button>
            </div>
            <span class="supplier_view_product_stock-note"
              >{{ product.quantity }} units in stock</span
            >
          </div>
          <div class="supplier_view_product_buy-row">
            <button
              type="button"
              class="supplier_view_product_btn supplier_view_product_btn-primary"
              :disabled="!product.quantity"
              @click="addToOrder"
            >
              <span aria-hidden="true">+</span> Add to order</button
            ><button
              type="button"
              class="supplier_view_product_btn supplier_view_product_btn-dark"
              :disabled="!product.quantity"
              @click="orderNow"
            >
              Order now</button
            ><button
              type="button"
              class="supplier_view_product_heart-button"
              :class="{ saved: isSaved }"
              aria-label="Save for later"
              :aria-pressed="isSaved"
              @click="toggleSaved"
            >
              {{ isSaved ? "&#9829;" : "&#9825;" }}
            </button>
          </div>

          <div class="supplier_view_product_meta">
            <div><b>SKU</b> {{ product.sku || "Not provided" }}</div>
            <div><b>Tags</b> {{ product.category_name }}, Wholesale, Bulk</div>
            <div class="supplier_view_product_share-row">
              <b>Share</b
              ><button
                type="button"
                aria-label="Share on Facebook"
                @click="shareProduct('Facebook')"
              >
                f</button
              ><button
                type="button"
                aria-label="Share on X"
                @click="shareProduct('X')"
              >
                x</button
              ><button
                type="button"
                aria-label="Share on Pinterest"
                @click="shareProduct('Pinterest')"
              >
                p
              </button>
            </div>
          </div>
        </section>
      </div>

      <nav
        class="supplier_view_product_detail-tabs"
        aria-label="Product information"
      >
        <button
          type="button"
          :class="{ active: activeTab === 'description' }"
          @click="activeTab = 'description'"
        >
          Description
        </button>
        <button
          type="button"
          :class="{ active: activeTab === 'info' }"
          @click="activeTab = 'info'"
        >
          Additional information
        </button>
        <button
          type="button"
          :class="{ active: activeTab === 'reviews' }"
          @click="activeTab = 'reviews'"
        >
          Reviews (97)
        </button>
      </nav>
      <div class="supplier_view_product_tab-content">
        <p v-if="activeTab === 'description'">
          {{
            product.description ||
            "This product is manufactured to consistent standards and ships in bulk-ready cartons for restaurants, retailers, and hospitality buyers."
          }}
        </p>
        <dl
          v-else-if="activeTab === 'info'"
          class="supplier_view_product_info-list"
        >
          <div>
            <dt>Category</dt>
            <dd>{{ product.category_name }}</dd>
          </div>
          <div>
            <dt>SKU</dt>
            <dd>{{ product.sku || "Not provided" }}</dd>
          </div>
          <div>
            <dt>Units in stock</dt>
            <dd>{{ product.quantity }}</dd>
          </div>
        </dl>
        <div v-else class="supplier_view_product_review-summary">
          <strong>Reviews</strong
          ><span>Customer review summaries are shown on the Reviews page.</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import Swal from "sweetalert2";
import { useSupplierData } from "@/data/supplierData";
import { resolveImageUrl } from "@/services/api";
const route = useRoute();
const { products } = useSupplierData();
const product = computed(
  () =>
    products.value.find(
      (item) => item.product_id === Number(route.params.id),
    ) || null,
);
const productImages = computed(() =>
  product.value?.images?.length
    ? product.value.images
    : product.value?.image
      ? [product.value.image]
      : ["https://placehold.co/800x800?text=Product"],
);
const activeImage = ref(0);
const selectedSwatch = ref(0);
const selectedSize = ref(0);
const quantity = ref(1);
const activeTab = ref("description");
const isSaved = ref(false);
const packSizes = ["25 pack", "50 pack", "100 pack", "250 pack", "500 pack"];
const finishNames = ["Natural", "Espresso", "Ivory", "Sage", "Walnut"];
const swatches = ["#c9a67c", "#3c2b26", "#f2ede4", "#3f7a53", "#7c5f55"];
const selectedFinishLabel = computed(() => finishNames[selectedSwatch.value]);
const maxQuantity = computed(() =>
  Math.max(0, Number(product.value?.quantity || 0)),
);
const comparePrice = computed(() => product.value?.compare_price);
function formatPrice(price) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(Number(price || 0));
}
function showSizeGuide() {
  Swal.fire({
    title: "Pack size guide",
    html: "<p>Choose a pack size that matches your order volume.</p>",
    confirmButtonText: "Got it",
    confirmButtonColor: "#684b41",
  });
}
function addToOrder() {
  Swal.fire({
    title: "Added to order",
    text: `${quantity.value} × ${product.value.product_name} (${packSizes[selectedSize.value]})`,
    icon: "success",
    toast: true,
    position: "top-end",
    timer: 2200,
    showConfirmButton: false,
  });
}
function orderNow() {
  Swal.fire({
    title: "Start this order?",
    text: `${quantity.value} × ${product.value.product_name} will be requested from this supplier.`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Start order",
    cancelButtonText: "Keep browsing",
    confirmButtonColor: "#e0793c",
  }).then((r) => {
    if (r.isConfirmed)
      Swal.fire({
        title: "Order request ready",
        text: "Review the order before submitting it.",
        icon: "success",
        confirmButtonColor: "#684b41",
      });
  });
}
function toggleSaved() {
  isSaved.value = !isSaved.value;
  Swal.fire({
    title: isSaved.value ? "Saved for later" : "Removed from saved items",
    icon: "info",
    toast: true,
    position: "top-end",
    timer: 1600,
    showConfirmButton: false,
  });
}
async function shareProduct(network) {
  const shareData = {
    title: product.value.product_name,
    text: product.value.description || "",
    url: window.location.href,
  };
  if (network === "Share" && navigator.share) {
    await navigator.share(shareData);
    return;
  }
  if (navigator.clipboard)
    await navigator.clipboard.writeText(window.location.href);
  Swal.fire({
    title: "Link copied",
    text: "The product link has been copied to your clipboard.",
    icon: "success",
    toast: true,
    position: "top-end",
    timer: 1800,
    showConfirmButton: false,
  });
}
</script>

<style scoped>
.supplier_view_product_detail-page {
  min-height: 100vh;
  padding: 28px 34px 60px;
  background: #f7f5f2;
  color: #2c211d;
  font-family: Arial, Helvetica, sans-serif;
}
.supplier_view_product_detail-page > * {
  max-width: 1120px;
  margin-left: auto;
  margin-right: auto;
}
.supplier_view_product_back-link {
  display: inline-flex;
  gap: 7px;
  align-items: center;
  margin-bottom: 16px;
  color: #6b5d56;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
}
.supplier_view_product_detail-layout {
  display: grid;
  grid-template-columns: 1fr 1.05fr;
  gap: 32px;
  align-items: start;
}
.supplier_view_product_gallery-main {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 380px;
  overflow: hidden;
  border-radius: 14px;
  background: #f0ebe4;
}
.supplier_view_product_gallery-main img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.supplier_view_product_gallery-arrow {
  position: absolute;
  top: 50%;
  z-index: 1;
  width: 34px;
  height: 34px;
  transform: translateY(-50%);
  border: 1px solid #e7e0d8;
  border-radius: 50%;
  background: #fff;
  color: #3c2b26;
  font-size: 24px;
  line-height: 1;
  box-shadow: 0 4px 16px #3c2b2614;
  cursor: pointer;
}
.supplier_view_product_gallery-arrow.left {
  left: 14px;
}
.supplier_view_product_gallery-arrow.right {
  right: 14px;
}
.supplier_view_product_thumbnail-row {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}
.supplier_view_product_thumbnail {
  width: 64px;
  height: 64px;
  padding: 0;
  overflow: hidden;
  border: 2px solid transparent;
  border-radius: 10px;
  background: #f0ebe4;
  cursor: pointer;
}
.supplier_view_product_thumbnail.selected {
  border-color: #e0793c;
}
.supplier_view_product_thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.82;
}
.supplier_view_product_product-category {
  color: #a89a92;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
.supplier_view_product_product-info h1 {
  margin: 6px 0 8px;
  color: #3c2b26;
  font:
    600 28px Georgia,
    "Times New Roman",
    serif;
}
.supplier_view_product_rating {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 12px;
  color: #a89a92;
  font-size: 12px;
}
.supplier_view_product_stars {
  color: #e0793c;
  letter-spacing: 1px;
}
.supplier_view_product_price-row {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 14px;
}
.supplier_view_product_price-row strong {
  color: #3c2b26;
  font-size: 25px;
}
.supplier_view_product_price-row del {
  color: #a89a92;
  font-size: 15px;
}
.supplier_view_product_description {
  margin: 0 0 18px;
  color: #6b5d56;
  font-size: 13.5px;
  line-height: 1.7;
}
.supplier_view_product_detail-block {
  margin-bottom: 18px;
}
.supplier_view_product_block-label {
  display: block;
  margin-bottom: 9px;
  color: #3c2b26;
  font-size: 12.5px;
}
.supplier_view_product_block-label a {
  margin-left: 8px;
  color: #c9631f;
  text-decoration: none;
}
.supplier_view_product_swatches {
  display: flex;
  gap: 9px;
}
.supplier_view_product_swatch {
  width: 26px;
  height: 26px;
  border: 2px solid transparent;
  border-radius: 50%;
  box-shadow: 0 0 0 1px #e7e0d8;
  cursor: pointer;
}
.supplier_view_product_swatch.selected {
  border-color: #e0793c;
}
.supplier_view_product_size-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.supplier_view_product_size-pill {
  padding: 8px 15px;
  border: 1px solid #e7e0d8;
  border-radius: 8px;
  background: #fff;
  color: #6b5d56;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}
.supplier_view_product_size-pill.selected {
  border-color: #523a33;
  background: #523a33;
  color: #fff;
}
.supplier_view_product_quantity-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  margin-bottom: 18px;
}
.supplier_view_product_quantity-stepper {
  display: flex;
  align-items: center;
  overflow: hidden;
  border: 1px solid #e7e0d8;
  border-radius: 9px;
}
.supplier_view_product_quantity-stepper button {
  width: 34px;
  height: 36px;
  border: 0;
  background: #fff;
  color: #3c2b26;
  font-size: 16px;
  cursor: pointer;
}
.supplier_view_product_quantity-stepper button:disabled,
.supplier_view_product_btn:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}
.supplier_view_product_quantity-stepper span {
  width: 38px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
}
.supplier_view_product_stock-note {
  color: #3f7a53;
  font-size: 12.5px;
  font-weight: 600;
}
.supplier_view_product_buy-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.supplier_view_product_btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 12px 22px;
  border: 1px solid transparent;
  border-radius: 9px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
}
.supplier_view_product_btn-primary {
  background: #e0793c;
  color: #fff;
}
.supplier_view_product_btn-dark {
  border-color: #523a33;
  background: #523a33;
  color: #fff;
}
.supplier_view_product_heart-button {
  width: 44px;
  height: 44px;
  border: 1px solid #e7e0d8;
  border-radius: 9px;
  background: #fff;
  color: #6b5d56;
  font-size: 20px;
  cursor: pointer;
}
.supplier_view_product_heart-button.saved {
  border-color: #e0793c;
  background: #fff3eb;
  color: #c9631f;
}
.supplier_view_product_meta {
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding-top: 14px;
  border-top: 1px solid #f0ebe4;
  color: #6b5d56;
  font-size: 12.5px;
}
.supplier_view_product_meta b {
  margin-right: 6px;
  color: #3c2b26;
}
.supplier_view_product_selection-note {
  margin-left: 5px;
  color: #c9631f;
  font-weight: 400;
}
.supplier_view_product_share-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.supplier_view_product_share-row button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 7px;
  background: #f0ebe4;
  color: #6b5d56;
  cursor: pointer;
}
.supplier_view_product_share-row button:hover {
  background: #ead9ce;
}
.supplier_view_product_detail-tabs {
  display: flex;
  gap: 28px;
  margin-top: 36px;
  border-bottom: 1px solid #e7e0d8;
}
.supplier_view_product_detail-tabs button {
  padding: 0 0 14px;
  border: 0;
  border-bottom: 2px solid transparent;
  background: none;
  color: #a89a92;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
.supplier_view_product_detail-tabs button.active {
  border-color: #e0793c;
  color: #3c2b26;
}
.supplier_view_product_tab-content {
  min-height: 100px;
  padding-top: 20px;
  color: #6b5d56;
  font-size: 13.5px;
  line-height: 1.7;
}
.supplier_view_product_info-list {
  max-width: 480px;
  margin: 0;
}
.supplier_view_product_info-list div {
  display: flex;
  justify-content: space-between;
  padding: 9px 0;
  border-bottom: 1px solid #f0ebe4;
}
.supplier_view_product_info-list dt {
  color: #6b5d56;
}
.supplier_view_product_info-list dd {
  margin: 0;
  color: #3c2b26;
  font-weight: 600;
}
.supplier_view_product_review-summary {
  display: flex;
  align-items: baseline;
  gap: 12px;
}
.supplier_view_product_review-summary strong {
  color: #3c2b26;
  font-size: 40px;
}
.supplier_view_product_empty-state {
  padding: 70px 20px;
  text-align: center;
}
.supplier_view_product_empty-state h1 {
  font:
    24px Georgia,
    serif;
}
.supplier_view_product_empty-state .supplier_view_product_btn {
  margin-top: 12px;
}
@media (max-width: 880px) {
  .supplier_view_product_detail-page {
    padding: 22px 16px 42px;
  }
  .supplier_view_product_detail-layout {
    grid-template-columns: 1fr;
  }
  .supplier_view_product_gallery-main {
    height: 300px;
  }
}
@media (max-width: 520px) {
  .supplier_view_product_detail-tabs {
    gap: 16px;
    overflow-x: auto;
  }
  .supplier_view_product_detail-tabs button {
    white-space: nowrap;
  }
  .supplier_view_product_buy-row .supplier_view_product_btn {
    flex: 1;
    padding: 12px 10px;
  }
}
</style>
