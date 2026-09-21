<template>
  <div class="sb-products-page">
    <template v-if="!isDetailView">
      <header class="sb-products-header">
        <div>
          <p class="sb-products-eyebrow">SUPPLIER MARKETPLACE</p>
          <h1>Products</h1>
          <p class="sb-products-intro">Source dependable stock and wholesale essentials from the WeConnect supplier network.</p>
        </div>
        <button type="button" class="sb-products-order-link" @click="goToOrders">
          <FontAwesomeIcon :icon="faBasketShopping" />
          <span>{{ basketCount }} {{ basketCount === 1 ? 'item' : 'items' }} in order</span>
          <FontAwesomeIcon :icon="faArrowRight" class="sb-products-order-arrow" />
        </button>
      </header>

      <section class="sb-products-toolbar" aria-label="Product filters">
        <label class="sb-products-search">
          <FontAwesomeIcon :icon="faMagnifyingGlass" />
          <input v-model="searchQuery" type="search" placeholder="Search products, categories or SKU" aria-label="Search products" />
        </label>
        <label class="sb-products-filter">
          <span>Category</span>
          <select v-model="selectedCategory" aria-label="Filter by category">
            <option value="All">All categories</option>
            <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
          </select>
        </label>
        <label class="sb-products-filter">
          <span>Availability</span>
          <select v-model="selectedAvailability" aria-label="Filter by availability">
            <option value="All">All products</option>
            <option value="Active">In stock</option>
            <option value="Low stock">Low stock</option>
          </select>
        </label>
        <div class="sb-products-view-toggle" aria-label="Product view">
          <button type="button" :class="{ active: viewMode === 'list' }" aria-label="List view" @click="viewMode = 'list'"><FontAwesomeIcon :icon="faList" /></button>
          <button type="button" :class="{ active: viewMode === 'grid' }" aria-label="Grid view" @click="viewMode = 'grid'"><FontAwesomeIcon :icon="faTableCellsLarge" /></button>
        </div>
      </section>

      <p v-if="errorMessage" class="sb-products-message sb-products-error">{{ errorMessage }}</p>
      <p v-else-if="isLoading" class="sb-products-message">Loading available products...</p>
      <section v-else class="sb-products-content">
        <div class="sb-products-section-heading">
          <div>
            <p class="sb-products-eyebrow">WHOLESALE CATALOG</p>
            <h2>Available for your business</h2>
          </div>
          <span>{{ filteredProducts.length }} products</span>
        </div>

        <div v-if="filteredProducts.length" class="sb-products-catalog" :class="`is-${viewMode}`">
          <article v-for="product in filteredProducts" :key="product.id" class="sb-product-card">
            <button type="button" class="sb-product-image-link" :aria-label="`View ${product.title}`" @click="viewProduct(product)">
              <img :src="product.image" :alt="product.title" class="sb-product-image" />
              <span class="sb-product-status" :class="statusClass(product.status)">{{ product.status === 'Active' ? 'In stock' : product.status }}</span>
            </button>
            <div class="sb-product-card-body">
              <p class="sb-product-category">{{ product.category }}</p>
              <h3><button type="button" @click="viewProduct(product)">{{ product.title }}</button></h3>
              <p class="sb-product-supplier">{{ product.supplier }}</p>
              <div class="sb-product-card-meta">
                <div><span>Unit price</span><strong>R {{ formatPrice(product.price) }}</strong></div>
                <div><span>Available</span><strong>{{ product.stockQty }} units</strong></div>
              </div>
              <div class="sb-product-card-actions">
                <button type="button" class="sb-product-view" @click="viewProduct(product)">View details <FontAwesomeIcon :icon="faArrowRight" /></button>
                <button type="button" class="sb-product-add" :class="{ selected: basket[product.id] }" :disabled="product.status === 'Out of stock'" @click="toggleBasket(product)">
                  <FontAwesomeIcon :icon="basket[product.id] ? faCheck : faPlus" />
                  {{ basket[product.id] ? 'Added' : 'Add' }}
                </button>
              </div>
            </div>
          </article>
        </div>
        <p v-else class="sb-products-message">No products match your filters.</p>
      </section>
    </template>

    <section v-else-if="selectedProduct" class="sb-product-detail">
      <button type="button" class="sb-product-back" @click="router.push({ name: 'small-business-products' })"><FontAwesomeIcon :icon="faArrowLeft" /> Back to products</button>
      <div class="sb-product-detail-layout">
        <div class="sb-product-gallery">
          <div class="sb-product-gallery-main"><img :src="selectedProduct.image" :alt="selectedProduct.title" /></div>
          <div class="sb-product-thumbnails"><button type="button" class="sb-product-thumbnail active"><img :src="selectedProduct.image" :alt="`${selectedProduct.title} thumbnail`" /></button></div>
        </div>
        <div class="sb-product-detail-copy">
          <p class="sb-products-eyebrow">{{ selectedProduct.category }}</p>
          <h1>{{ selectedProduct.title }}</h1>
          <p class="sb-product-detail-supplier">Sold by <strong>{{ selectedProduct.supplier }}</strong> <span>Verified supplier</span></p>
          <div class="sb-product-detail-price"><strong>R {{ formatPrice(selectedProduct.price) }}</strong><span>per unit</span></div>
          <p class="sb-product-detail-description">{{ selectedProduct.description }}</p>
          <dl class="sb-product-facts">
            <div><dt>SKU</dt><dd>{{ selectedProduct.sku }}</dd></div>
            <div><dt>Availability</dt><dd :class="statusClass(selectedProduct.status)">{{ selectedProduct.stockQty }} units available</dd></div>
            <div><dt>Delivery</dt><dd>Supplier delivery available</dd></div>
          </dl>
          <div class="sb-product-option"><span>Pack size</span><strong>Standard pack</strong></div>
          <div class="sb-product-purchase">
            <label><span>Quantity</span><input v-model.number="quantity" type="number" min="1" :max="selectedProduct.stockQty" aria-label="Quantity" /></label>
            <button type="button" class="sb-product-primary" :disabled="selectedProduct.status === 'Out of stock'" @click="addDetailToBasket">{{ detailActionLabel }}</button>
          </div>
          <button type="button" class="sb-product-order-now" :disabled="selectedProduct.status === 'Out of stock'" @click="orderNow">Order now <FontAwesomeIcon :icon="faArrowRight" /></button>
          <p v-if="notice" class="sb-product-notice" role="status">{{ notice }}</p>
        </div>
      </div>
      <div class="sb-product-information">
        <div><p class="sb-products-eyebrow">PRODUCT INFORMATION</p><h2>Made for your next order</h2></div>
        <p>{{ selectedProduct.description }} Browse supplier availability, choose the quantity your business needs, and continue to Orders when you are ready to consolidate your purchase.</p>
      </div>

      <section class="sb-product-reviews">
        <div class="sb-product-reviews-head">
          <div>
            <p class="sb-products-eyebrow">RATINGS &amp; REVIEWS</p>
            <h2>What buyers say</h2>
          </div>
          <div class="sb-product-reviews-summary">
            <strong>{{ averageRating.toFixed(1) }}</strong>
            <span class="sb-product-review-stars">{{ starsFor(averageRating) }}</span>
            <small>{{ reviews.length }} {{ reviews.length === 1 ? 'review' : 'reviews' }}</small>
          </div>
        </div>

        <p v-if="reviewsLoading" class="sb-products-message">Loading reviews...</p>
        <p v-else-if="!reviews.length" class="sb-products-message">No reviews yet. Be the first to share your experience.</p>
        <ul v-else class="sb-product-review-list">
          <li v-for="review in reviews" :key="review.reviewId" class="sb-product-review">
            <div class="sb-product-review-top">
              <strong>{{ review.buyerName || 'WeConnect buyer' }}</strong>
              <span class="sb-product-review-stars">{{ starsFor(review.rating) }}</span>
              <time>{{ formatReviewDate(review.reviewDate) }}</time>
            </div>
            <p>{{ review.reviewText }}</p>
            <div v-if="review.supplierReply" class="sb-product-review-reply">
              <strong>Supplier reply</strong>
              <p>{{ review.supplierReply }}</p>
            </div>
          </li>
        </ul>

        <form class="sb-product-review-form" @submit.prevent="submitReview">
          <h3>Share your review</h3>
          <label>
            <span>Rating</span>
            <select v-model.number="reviewForm.rating" aria-label="Rating">
              <option v-for="n in 5" :key="n" :value="n">{{ n }} star{{ n === 1 ? '' : 's' }}</option>
            </select>
          </label>
          <label>
            <span>Your review</span>
            <textarea v-model="reviewForm.reviewText" rows="3" placeholder="Tell other small businesses about this product" aria-label="Review text"></textarea>
          </label>
          <button type="submit" class="sb-product-primary" :disabled="reviewSubmitting">{{ reviewSubmitting ? 'Submitting...' : 'Submit review' }}</button>
          <p v-if="reviewNotice" class="sb-product-notice" role="status">{{ reviewNotice }}</p>
        </form>
      </section>
    </section>
    <p v-else-if="!isLoading" class="sb-products-message sb-products-error">This product is no longer available.</p>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faArrowLeft, faArrowRight, faBasketShopping, faCheck, faList, faMagnifyingGlass, faPlus, faTableCellsLarge } from '@fortawesome/free-solid-svg-icons'

const apiUrl = import.meta.env.VITE_API_URL || '/api'
const buyerId = 1
const route = useRoute()
const router = useRouter()
const products = ref([])
const basket = ref(readStoredBasket())
const reviews = ref([])
const reviewsLoading = ref(false)
const reviewSubmitting = ref(false)
const reviewNotice = ref('')
const reviewForm = ref({ rating: 5, reviewText: '' })
const searchQuery = ref('')
const selectedCategory = ref('All')
const selectedAvailability = ref('All')
const viewMode = ref('list')
const quantity = ref(1)
const notice = ref('')
const isLoading = ref(true)
const errorMessage = ref('')

function readStoredBasket() {
  try {
    return JSON.parse(localStorage.getItem('weconnect-order-basket') || '{}')
  } catch {
    return {}
  }
}

const isDetailView = computed(() => Boolean(route.params.productId))
const selectedProduct = computed(() => products.value.find((product) => String(product.id) === String(route.params.productId)))
const categories = computed(() => [...new Set(products.value.map((product) => product.category))].sort())
const filteredProducts = computed(() => products.value.filter((product) => {
  const search = searchQuery.value.trim().toLowerCase()
  const matchesSearch = !search || `${product.title} ${product.category} ${product.sku} ${product.supplier}`.toLowerCase().includes(search)
  const matchesCategory = selectedCategory.value === 'All' || product.category === selectedCategory.value
  const matchesAvailability = selectedAvailability.value === 'All' || product.status === selectedAvailability.value
  return matchesSearch && matchesCategory && matchesAvailability
}))
const basketCount = computed(() => Object.values(basket.value).reduce((total, item) => total + item.quantity, 0))
const detailActionLabel = computed(() => basket.value[selectedProduct.value?.id] ? 'Update order' : 'Add to order')
const averageRating = computed(() => reviews.value.length ? reviews.value.reduce((total, review) => total + Number(review.rating), 0) / reviews.value.length : 0)

function normalizeProduct(product) {
  const stockQty = Number(product.stockQty ?? product.quantity ?? 0)
  return {
    ...product,
    id: product.id ?? product.product_id,
    title: product.title ?? product.product_name,
    category: product.category ?? product.category_name ?? 'General supplies',
    stockQty,
    status: product.status ?? (stockQty > 0 ? 'Active' : 'Out of stock'),
    image: product.image ?? product.image_url ?? 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=900&q=80',
    supplier: product.supplier ?? product.supplier_name ?? 'WeConnect supplier',
    description: product.description ?? 'A dependable wholesale essential selected for small businesses. Review availability and add the quantity you need to your next order.'
  }
}

function formatPrice(price) { return Number(price).toFixed(2) }
function statusClass(status) { return status.toLowerCase().replace(/\s+/g, '-') }
function persistBasket() { localStorage.setItem('weconnect-order-basket', JSON.stringify(basket.value)) }
function starsFor(rating) { const filled = Math.max(0, Math.min(5, Math.round(Number(rating) || 0))); return '★'.repeat(filled) + '☆'.repeat(5 - filled) }
function formatReviewDate(value) { return value ? new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '' }

async function cartRequest(path, options = {}) {
  const response = await fetch(`${apiUrl}/cart${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  })
  if (!response.ok) throw new Error('Cart service unavailable')
  return response.json()
}

async function syncBasketFromCart() {
  try {
    const items = await cartRequest(`?buyerId=${buyerId}`)
    const next = {}
    for (const item of items) {
      next[item.productId] = {
        cartItemId: item.cartItemId,
        quantity: item.quantity,
        product: normalizeProduct({
          id: item.productId,
          title: item.title,
          price: item.price,
          image: item.image,
          stockQty: item.stockQty,
          supplier: item.supplier,
          status: item.status,
          unit: item.unit
        })
      }
    }
    basket.value = next
    persistBasket()
  } catch {
    // keep the locally stored basket when the cart service is unreachable
  }
}

async function toggleBasket(product) {
  const existing = basket.value[product.id]
  try {
    if (existing) {
      if (existing.cartItemId) await cartRequest(`/${existing.cartItemId}`, { method: 'DELETE' })
      const next = { ...basket.value }
      delete next[product.id]
      basket.value = next
    } else {
      const created = await cartRequest('', { method: 'POST', body: JSON.stringify({ buyerId, productId: product.id, quantity: 1 }) })
      basket.value = { ...basket.value, [product.id]: { product, quantity: 1, cartItemId: created.cartItemId } }
    }
  } catch {
    const next = { ...basket.value }
    if (existing) delete next[product.id]
    else next[product.id] = { product, quantity: 1 }
    basket.value = next
  }
  persistBasket()
}

async function addDetailToBasket() {
  const product = selectedProduct.value
  if (!product) return
  const nextQuantity = Math.max(1, Math.min(quantity.value || 1, product.stockQty))
  const existing = basket.value[product.id]
  try {
    let cartItemId = existing?.cartItemId
    if (cartItemId) {
      await cartRequest(`/${cartItemId}`, { method: 'PUT', body: JSON.stringify({ quantity: nextQuantity }) })
    } else {
      const created = await cartRequest('', { method: 'POST', body: JSON.stringify({ buyerId, productId: product.id, quantity: nextQuantity }) })
      cartItemId = created.cartItemId
    }
    basket.value = { ...basket.value, [product.id]: { product, quantity: nextQuantity, cartItemId } }
  } catch {
    basket.value = { ...basket.value, [product.id]: { product, quantity: nextQuantity } }
  }
  persistBasket()
  notice.value = `${product.title} added to your order.`
}

async function loadReviews(productId) {
  reviewsLoading.value = true
  reviewNotice.value = ''
  try {
    const response = await fetch(`${apiUrl}/products/${productId}/reviews`)
    if (!response.ok) throw new Error('Reviews could not be loaded.')
    reviews.value = await response.json()
  } catch {
    reviews.value = []
  } finally {
    reviewsLoading.value = false
  }
}

async function submitReview() {
  const product = selectedProduct.value
  if (!product) return
  const reviewText = reviewForm.value.reviewText.trim()
  if (!reviewText) {
    reviewNotice.value = 'Please write a short review before submitting.'
    return
  }
  reviewSubmitting.value = true
  reviewNotice.value = ''
  try {
    const response = await fetch(`${apiUrl}/products/${product.id}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ buyerId, rating: reviewForm.value.rating, reviewText })
    })
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}))
      throw new Error(payload.message || 'Review could not be submitted.')
    }
    reviewForm.value = { rating: 5, reviewText: '' }
    await loadReviews(product.id)
    reviewNotice.value = 'Thank you. Your review has been published.'
  } catch (error) {
    reviewNotice.value = error.message
  } finally {
    reviewSubmitting.value = false
  }
}
function orderNow() { addDetailToBasket(); router.push({ name: 'small-business-orders' }) }
function goToOrders() { router.push({ name: 'small-business-orders' }) }
function viewProduct(product) { router.push({ name: 'small-business-product', params: { productId: product.id } }) }

watch(() => route.params.productId, (productId) => {
  quantity.value = 1
  notice.value = ''
  if (productId) loadReviews(productId)
})

onMounted(async () => {
  try {
    const response = await fetch(`${apiUrl}/products`)
    if (!response.ok) throw new Error('Products could not be loaded.')
    products.value = (await response.json()).map(normalizeProduct)
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }

  await syncBasketFromCart()
  if (isDetailView.value) loadReviews(route.params.productId)
})
</script>

<style scoped>
.sb-products-page { min-height: 100vh; padding: 42px 48px 72px; color: var(--color-text); }
.sb-products-header { display: flex; justify-content: space-between; align-items: flex-end; gap: 28px; padding-bottom: 30px; border-bottom: 1px solid var(--color-border); }
.sb-products-eyebrow { margin: 0 0 9px; color: var(--color-accent); font-size: 10px; font-weight: 800; letter-spacing: 1.7px; text-transform: uppercase; }
.sb-products-header h1, .sb-product-detail h1 { color: #4e342e; font-size: clamp(38px, 5vw, 58px); line-height: 1; }
.sb-products-intro { max-width: 520px; margin: 13px 0 0; color: var(--color-text-muted); font-size: 15px; line-height: 1.6; }
.sb-products-order-link { display: flex; align-items: center; gap: 10px; padding: 13px 16px; border: 1px solid #e2c9bc; border-radius: var(--radius); background: #fffaf7; color: var(--color-accent); font-size: 13px; font-weight: 700; white-space: nowrap; }
.sb-products-order-arrow { margin-left: 5px; font-size: 11px; }
.sb-products-toolbar { display: grid; grid-template-columns: minmax(230px, 1fr) 190px 190px auto; gap: 12px; padding: 24px 0 32px; }
.sb-products-search, .sb-products-filter { min-height: 48px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); background: var(--color-surface); }
.sb-products-search { display: flex; align-items: center; gap: 11px; padding: 0 14px; color: var(--color-text-muted); }
.sb-products-search input, .sb-products-filter select { width: 100%; border: 0; outline: 0; background: transparent; color: var(--color-text); font: inherit; }
.sb-products-filter { display: block; padding: 7px 12px; }
.sb-products-filter span { display: block; color: var(--color-text-muted); font-size: 10px; font-weight: 800; letter-spacing: .8px; text-transform: uppercase; }
.sb-products-filter select { padding-top: 2px; }
.sb-products-view-toggle { display: flex; align-items: center; gap: 3px; padding: 4px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); background: #f1eeea; }
.sb-products-view-toggle button { width: 39px; height: 38px; border: 0; border-radius: 4px; background: transparent; color: var(--color-text-muted); }
.sb-products-view-toggle button.active { background: white; color: var(--color-accent); box-shadow: 0 2px 7px rgba(78, 52, 46, .08); }
.sb-products-section-heading { display: flex; justify-content: space-between; align-items: end; margin-bottom: 18px; }
.sb-products-section-heading h2 { color: #4e342e; font-size: 27px; }
.sb-products-section-heading > span { color: var(--color-text-muted); font-size: 13px; }
.sb-products-catalog { display: grid; gap: 18px; }
.sb-products-catalog.is-grid { grid-template-columns: repeat(auto-fit, minmax(245px, 1fr)); }
.sb-products-catalog.is-list .sb-product-card { display: grid; grid-template-columns: 210px 1fr; }
.sb-product-card { overflow: hidden; border: 1px solid var(--color-border); border-radius: var(--radius); background: #fffefa; box-shadow: 0 5px 18px rgba(78, 52, 46, .035); }
.sb-product-image-link { position: relative; display: block; width: 100%; height: 190px; padding: 0; border: 0; background: #f2e9e3; cursor: pointer; }
.is-list .sb-product-image-link { height: 100%; min-height: 188px; }
.sb-product-image { width: 100%; height: 100%; object-fit: cover; transition: transform .25s ease; }
.sb-product-image-link:hover .sb-product-image { transform: scale(1.03); }
.sb-product-status { position: absolute; top: 13px; right: 13px; padding: 6px 9px; border-radius: 99px; background: #edf7ef; color: var(--color-success); font-size: 10px; font-weight: 800; }
.sb-product-status.low-stock { background: #fff4df; color: var(--color-warning); }
.sb-product-status.out-of-stock { background: #fceceb; color: #b44943; }
.sb-product-card-body { padding: 19px 20px 20px; }
.sb-product-category { margin: 0; color: var(--color-accent); font-size: 10px; font-weight: 800; letter-spacing: 1.1px; text-transform: uppercase; }
.sb-product-card h3 { margin: 8px 0 4px; font-size: 22px; }
.sb-product-card h3 button { padding: 0; border: 0; background: transparent; color: inherit; font: inherit; text-align: left; }
.sb-product-supplier { margin: 0 0 17px; color: var(--color-text-muted); font-size: 12px; }
.sb-product-card-meta { display: flex; justify-content: space-between; gap: 14px; padding: 13px 0; border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border); }
.sb-product-card-meta div { display: grid; gap: 4px; }.sb-product-card-meta div:last-child { text-align: right; }.sb-product-card-meta span { color: var(--color-text-muted); font-size: 11px; }.sb-product-card-meta strong { font-size: 14px; }
.sb-product-card-actions { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-top: 16px; }
.sb-product-view, .sb-product-add { border: 0; background: transparent; font-size: 12px; font-weight: 800; }.sb-product-view { padding: 7px 0; color: var(--color-accent); }.sb-product-view svg { margin-left: 5px; font-size: 10px; }.sb-product-add { min-width: 86px; padding: 10px 12px; border: 1px solid var(--color-accent); border-radius: var(--radius-sm); color: var(--color-accent); }.sb-product-add.selected, .sb-product-add:hover { background: var(--color-accent); color: white; }.sb-product-add:disabled { cursor: not-allowed; opacity: .45; }
.sb-products-message { padding: 32px 0; color: var(--color-text-muted); }.sb-products-error { color: #b44943; }
.sb-product-back { display: inline-flex; align-items: center; gap: 8px; margin-bottom: 28px; padding: 0; border: 0; background: transparent; color: var(--color-accent); font-size: 13px; font-weight: 800; }
.sb-product-detail-layout { display: grid; grid-template-columns: minmax(300px, .95fr) minmax(320px, 1fr); gap: clamp(34px, 7vw, 90px); align-items: start; max-width: 1080px; margin: 0 auto; }.sb-product-gallery-main { overflow: hidden; height: min(520px, 47vw); border-radius: var(--radius); background: #f2e9e3; }.sb-product-gallery-main img { width: 100%; height: 100%; object-fit: cover; }.sb-product-thumbnails { display: flex; gap: 10px; margin-top: 13px; }.sb-product-thumbnail { width: 66px; height: 66px; padding: 3px; border: 2px solid var(--color-accent); border-radius: var(--radius-sm); background: white; }.sb-product-thumbnail img { width: 100%; height: 100%; object-fit: cover; border-radius: 3px; }.sb-product-detail-copy { padding-top: 12px; }.sb-product-detail-copy h1 { margin-bottom: 14px; font-size: clamp(38px, 4.3vw, 56px); }.sb-product-detail-supplier { margin: 0; color: var(--color-text-muted); font-size: 13px; }.sb-product-detail-supplier span { margin-left: 10px; color: var(--color-success); font-size: 11px; }.sb-product-detail-price { display: flex; align-items: baseline; gap: 9px; margin: 28px 0 19px; }.sb-product-detail-price strong { color: #4e342e; font-size: 29px; }.sb-product-detail-price span { color: var(--color-text-muted); font-size: 12px; }.sb-product-detail-description { color: var(--color-text-muted); line-height: 1.7; }.sb-product-facts { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 25px 0; padding: 18px 0; border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border); }.sb-product-facts div { display: grid; gap: 5px; }.sb-product-facts dt { color: var(--color-text-muted); font-size: 10px; font-weight: 800; letter-spacing: .8px; text-transform: uppercase; }.sb-product-facts dd { margin: 0; font-size: 13px; font-weight: 700; }.sb-product-facts dd.low-stock { color: var(--color-warning); }.sb-product-option { display: flex; justify-content: space-between; padding: 13px 0; font-size: 13px; }.sb-product-option span { color: var(--color-text-muted); }.sb-product-purchase { display: grid; grid-template-columns: 112px 1fr; gap: 10px; margin-top: 10px; }.sb-product-purchase label { display: grid; gap: 6px; color: var(--color-text-muted); font-size: 11px; font-weight: 800; text-transform: uppercase; }.sb-product-purchase input { width: 100%; min-height: 46px; padding: 0 10px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); font: inherit; }.sb-product-primary, .sb-product-order-now { min-height: 46px; border-radius: var(--radius-sm); font-weight: 800; }.sb-product-primary { align-self: end; border: 1px solid var(--color-accent); background: var(--color-accent); color: white; }.sb-product-primary:disabled, .sb-product-order-now:disabled { cursor: not-allowed; opacity: .45; }.sb-product-order-now { width: 100%; margin-top: 10px; border: 1px solid var(--color-accent); background: transparent; color: var(--color-accent); }.sb-product-order-now svg { margin-left: 8px; }.sb-product-notice { color: var(--color-success); font-size: 12px; font-weight: 700; }.sb-product-information { display: grid; grid-template-columns: .7fr 1fr; gap: 70px; margin: 74px auto 0; padding-top: 28px; border-top: 1px solid var(--color-border); max-width: 1080px; }.sb-product-information h2 { color: #4e342e; font-size: 27px; }.sb-product-information > p { margin: 0; color: var(--color-text-muted); line-height: 1.7; }
@media (max-width: 900px) { .sb-products-page { padding: 32px 28px 56px; }.sb-products-toolbar { grid-template-columns: 1fr 1fr auto; }.sb-products-search { grid-column: 1 / -1; }.sb-product-detail-layout { gap: 32px; }.sb-product-information { gap: 30px; } }
@media (max-width: 680px) { .sb-products-page { padding: 26px 18px 48px; }.sb-products-header { align-items: flex-start; flex-direction: column; }.sb-products-order-link { width: 100%; justify-content: center; }.sb-products-toolbar { grid-template-columns: 1fr; }.sb-products-search { grid-column: auto; }.sb-products-view-toggle { justify-content: center; }.sb-products-catalog.is-list .sb-product-card { display: block; }.sb-products-catalog.is-list .sb-product-image-link { height: 190px; }.sb-products-section-heading { align-items: flex-start; flex-direction: column; gap: 8px; }.sb-product-detail-layout { grid-template-columns: 1fr; }.sb-product-gallery-main { height: 72vw; max-height: 390px; }.sb-product-detail-copy { padding-top: 0; }.sb-product-information { grid-template-columns: 1fr; gap: 18px; margin-top: 52px; }.sb-product-facts { grid-template-columns: 1fr 1fr; } }
.sb-product-reviews { max-width: 1080px; margin: 64px auto 0; padding-top: 40px; border-top: 1px solid var(--color-border); }
.sb-product-reviews-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; margin-bottom: 26px; }
.sb-product-reviews-head h2 { color: #4e342e; font-size: 27px; }
.sb-product-reviews-summary { display: grid; justify-items: end; gap: 3px; text-align: right; }
.sb-product-reviews-summary strong { color: #4e342e; font-size: 30px; line-height: 1; }
.sb-product-reviews-summary small { color: var(--color-text-muted); font-size: 12px; }
.sb-product-review-stars { color: #d99b3f; font-size: 13px; letter-spacing: 1px; }
.sb-product-review-list { display: grid; gap: 16px; margin: 0 0 30px; padding: 0; list-style: none; }
.sb-product-review { padding: 18px 20px; border: 1px solid var(--color-border); border-radius: var(--radius); background: #fffefa; }
.sb-product-review-top { display: flex; align-items: center; gap: 12px; }
.sb-product-review-top time { margin-left: auto; color: var(--color-text-muted); font-size: 12px; }
.sb-product-review p { margin: 10px 0 0; color: var(--color-text-muted); line-height: 1.6; }
.sb-product-review-reply { margin-top: 13px; padding: 12px 15px; border-left: 3px solid var(--color-accent); border-radius: 0 var(--radius-sm) var(--radius-sm) 0; background: #fffaf7; }
.sb-product-review-reply strong { color: var(--color-accent); font-size: 11px; letter-spacing: .8px; text-transform: uppercase; }
.sb-product-review-reply p { margin-top: 4px; }
.sb-product-review-form { display: grid; gap: 14px; max-width: 560px; padding: 22px; border: 1px solid var(--color-border); border-radius: var(--radius); background: var(--color-surface); }
.sb-product-review-form h3 { margin: 0; color: #4e342e; font-size: 20px; }
.sb-product-review-form label { display: grid; gap: 6px; }
.sb-product-review-form label span { color: var(--color-text-muted); font-size: 10px; font-weight: 800; letter-spacing: .8px; text-transform: uppercase; }
.sb-product-review-form select, .sb-product-review-form textarea { width: 100%; padding: 11px 12px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); background: white; color: var(--color-text); font: inherit; outline: 0; }
.sb-product-review-form select:focus, .sb-product-review-form textarea:focus { border-color: var(--color-accent); }
.sb-product-review-form textarea { resize: vertical; }
@media (max-width: 680px) { .sb-product-reviews-head { align-items: flex-start; flex-direction: column; }.sb-product-reviews-summary { justify-items: start; text-align: left; } }
</style>
