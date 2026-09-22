<template>
  <div class="shop-page">
    <SmallBusinessNavbar />

    <!-- Page hero -->
    <section class="shop-hero">
      <div class="hero-dots hero-dots-left" aria-hidden="true"></div>
      <div class="hero-dots hero-dots-right" aria-hidden="true"></div>
      <p>Home <span>/</span> Shop</p>
      <h1>Shop</h1>
      <span class="hero-rule"></span>
    </section>

    <main class="shop-main">
      <template v-if="!isDetailView">
        <section class="shop-toolbar-top">
          <div class="results-copy">
            <span>Showing <strong>{{ showingStart }}-{{ showingEnd }}</strong> of {{ sortedProducts.length }} results</span>
          </div>

          <label class="sort-control">
            <span>Sort by :</span>
            <select v-model="sortBy" aria-label="Sort products">
              <option value="default">Default Sorting</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="name">Product Name</option>
            </select>
            <FontAwesomeIcon :icon="faChevronDown" />
          </label>
        </section>

        <section class="shop-layout">
          <!-- Filter sidebar -->
          <aside class="filter-sidebar" aria-label="Product filters">
            <div class="filter-heading">
              <h2>Filter Options</h2>
              <button type="button" @click="clearFilters">Clear all</button>
            </div>

            <div class="filter-group" id="categories">
              <h3>By Categories</h3>
              <label v-for="category in categories" :key="category" class="check-row">
                <input v-model="selectedCategory" type="radio" name="category" :value="category" />
                <span>{{ category }}</span>
              </label>
              <label class="check-row">
                <input v-model="selectedCategory" type="radio" name="category" value="All" />
                <span>All Categories</span>
              </label>
            </div>

            <div class="filter-group">
              <h3>By Availability</h3>
              <label class="check-row">
                <input v-model="selectedAvailability" type="radio" name="availability" value="All" />
                <span>All Products</span>
              </label>
              <label class="check-row">
                <input v-model="selectedAvailability" type="radio" name="availability" value="Active" />
                <span>In Stock</span>
              </label>
              <label class="check-row">
                <input v-model="selectedAvailability" type="radio" name="availability" value="Low stock" />
                <span>Low Stock</span>
              </label>
              <label class="check-row">
                <input v-model="selectedAvailability" type="radio" name="availability" value="Out of stock" />
                <span>Out of Stock</span>
              </label>
            </div>

            <div class="filter-group price-group">
              <h3>Price</h3>
              <div class="price-values">
                <span>R {{ formatPrice(0) }}</span>
                <span>R {{ formatPrice(priceCeiling) }}</span>
              </div>
              <input
                v-model.number="maxPrice"
                class="price-range"
                type="range"
                min="0"
                :max="priceCeiling"
                step="10"
                aria-label="Maximum price"
              />
              <div class="selected-price">Up to R {{ formatPrice(maxPrice) }}</div>
            </div>

            <div class="filter-group">
              <h3>Review</h3>
              <label v-for="rating in [5, 4, 3, 2, 1]" :key="rating" class="rating-row">
                <input v-model="selectedRating" type="radio" name="rating" :value="rating" />
                <span class="stars">
                  <span v-for="star in 5" :key="star" :class="{ muted: star > rating }">★</span>
                </span>
                <small>{{ rating }} Star</small>
              </label>
              <label class="rating-row">
                <input v-model="selectedRating" type="radio" name="rating" :value="0" />
                <span class="all-rating">Any rating</span>
              </label>
            </div>

            <div class="filter-group">
              <h3>By Promotions</h3>
              <label class="check-row">
                <input v-model="selectedPromotion" type="radio" name="promotion" value="all" />
                <span>All Products</span>
              </label>
              <label class="check-row">
                <input v-model="selectedPromotion" type="radio" name="promotion" value="sale" />
                <span>On Sale</span>
              </label>
              <label class="check-row">
                <input v-model="selectedPromotion" type="radio" name="promotion" value="featured" />
                <span>Featured</span>
              </label>
            </div>
          </aside>

          <!-- Product area -->
          <section class="catalog-area">
            <div class="active-filters">
              <span class="active-label">Active Filter</span>

              <button v-if="selectedCategory !== 'All'" type="button" class="filter-chip" @click="selectedCategory = 'All'">
                {{ selectedCategory }} <span>×</span>
              </button>
              <button v-if="selectedAvailability !== 'All'" type="button" class="filter-chip" @click="selectedAvailability = 'All'">
                {{ selectedAvailability === 'Active' ? 'In Stock' : selectedAvailability }} <span>×</span>
              </button>
              <button v-if="selectedRating" type="button" class="filter-chip" @click="selectedRating = 0">
                {{ selectedRating }}+ Stars <span>×</span>
              </button>
              <button v-if="selectedPromotion !== 'all'" type="button" class="filter-chip" @click="selectedPromotion = 'all'">
                {{ selectedPromotion === 'sale' ? 'On Sale' : 'Featured' }} <span>×</span>
              </button>
              <button v-if="maxPrice < priceCeiling" type="button" class="filter-chip" @click="maxPrice = priceCeiling">
                Up to R {{ formatPrice(maxPrice) }} <span>×</span>
              </button>
              <button v-if="hasActiveFilters" type="button" class="clear-inline" @click="clearFilters">Clear All</button>
            </div>

            <p v-if="errorMessage" class="shop-message error-message">{{ errorMessage }}</p>
            <p v-else-if="isLoading" class="shop-message">Loading available products...</p>

            <template v-else>
              <div v-if="filteredProducts.length" class="product-grid" :class="{ 'list-mode': viewMode === 'list' }">
                <article v-for="product in paginatedProducts" :key="product.id" class="beauty-product-card">
                  <div class="product-visual">
                    <button type="button" class="product-image-button" :aria-label="`View ${product.title}`" @click="viewProduct(product)">
                      <img :src="product.image" :alt="product.title" class="product-image" />
                    </button>

                    <span v-if="product.discountPercent > 0" class="discount-badge">{{ product.discountPercent }}% off</span>
                    <span v-else-if="product.status === 'Low stock'" class="discount-badge low-stock-badge">Low stock</span>

                    <div class="product-hover-actions">
                      <button type="button" aria-label="View product" @click="viewProduct(product)"><FontAwesomeIcon :icon="faExpand" /></button>
                      <button type="button" aria-label="Add to order" :disabled="product.status === 'Out of stock'" @click="toggleBasket(product)">
                        <FontAwesomeIcon :icon="basket[product.id] ? faCheck : faBagShopping" />
                      </button>
                    </div>
                  </div>

                  <div class="product-copy">
                    <div class="product-meta-line">
                      <span>{{ product.category }}</span>
                      <span class="product-rating"><FontAwesomeIcon :icon="faStar" /> {{ product.rating.toFixed(1) }}</span>
                    </div>
                    <h3><button type="button" @click="viewProduct(product)">{{ product.title }}</button></h3>
                    <p class="product-supplier">{{ product.supplier }}</p>
                    <div class="product-price-row">
                      <strong>R {{ formatPrice(product.price) }}</strong>
                      <span v-if="product.comparePrice && Number(product.comparePrice) > Number(product.price)" class="compare-price">R {{ formatPrice(product.comparePrice) }}</span>
                    </div>
                    <button
                      type="button"
                      class="product-add-button"
                      :class="{ selected: basket[product.id] }"
                      :disabled="product.status === 'Out of stock'"
                      @click="toggleBasket(product)"
                    >
                      <FontAwesomeIcon :icon="basket[product.id] ? faCheck : faPlus" />
                      {{ basket[product.id] ? 'Added to order' : 'Add to order' }}
                    </button>
                  </div>
                </article>
              </div>

              <div v-else class="empty-state">
                <div class="empty-icon"><FontAwesomeIcon :icon="faMagnifyingGlass" /></div>
                <h3>No products found</h3>
                <p>Try clearing a filter or searching for another product.</p>
                <button type="button" @click="clearFilters">Clear filters</button>
              </div>

              <nav v-if="filteredProducts.length" class="pagination" aria-label="Product pages">
                <button type="button" aria-label="Previous page" :disabled="currentPage === 1" @click="currentPage--">
                  <FontAwesomeIcon :icon="faChevronLeft" />
                </button>
                <button
                  v-for="page in pageNumbers"
                  :key="page"
                  type="button"
                  :class="{ active: page === currentPage }"
                  @click="currentPage = page"
                >
                  {{ page }}
                </button>
                <button type="button" aria-label="Next page" :disabled="currentPage === totalPages" @click="currentPage++">
                  <FontAwesomeIcon :icon="faChevronRight" />
                </button>
              </nav>
            </template>
          </section>
        </section>

        <!-- Benefits row -->
        <section class="shop-benefits">
          <div class="benefit-item">
            <span class="benefit-icon"><FontAwesomeIcon :icon="faTruckFast" /></span>
            <div><strong>Free Shipping</strong><small>On qualifying business orders</small></div>
          </div>
          <div class="benefit-item">
            <span class="benefit-icon"><FontAwesomeIcon :icon="faCreditCard" /></span>
            <div><strong>Flexible Payment</strong><small>Secure payment options</small></div>
          </div>
          <div class="benefit-item">
            <span class="benefit-icon"><FontAwesomeIcon :icon="faHeadset" /></span>
            <div><strong>24×7 Support</strong><small>We support your business</small></div>
          </div>
        </section>
      </template>

      <!-- Product details -->
      <section v-else-if="selectedProduct" class="detail-page">
        <button type="button" class="detail-back" @click="router.push({ name: 'small-business-products' })">
          <FontAwesomeIcon :icon="faArrowLeft" /> Back to shop
        </button>

        <div class="detail-layout">
          <div class="detail-gallery">
            <div class="detail-image-wrap"><img :src="selectedProduct.image" :alt="selectedProduct.title" /></div>
            <button type="button" class="detail-thumb active"><img :src="selectedProduct.image" :alt="`${selectedProduct.title} thumbnail`" /></button>
          </div>

          <div class="detail-copy">
            <p class="detail-category">{{ selectedProduct.category }}</p>
            <h1>{{ selectedProduct.title }}</h1>
            <p class="detail-supplier">Sold by <strong>{{ selectedProduct.supplier }}</strong> <span>Verified supplier</span></p>
            <div class="detail-rating"><span class="stars"><span v-for="star in 5" :key="star" :class="{ muted: star > Math.round(selectedProduct.rating) }">★</span></span> {{ selectedProduct.rating.toFixed(1) }}</div>
            <div class="detail-price"><strong>R {{ formatPrice(selectedProduct.price) }}</strong><span v-if="selectedProduct.comparePrice">R {{ formatPrice(selectedProduct.comparePrice) }}</span><small>per unit</small></div>
            <p class="detail-description">{{ selectedProduct.description }}</p>

            <dl class="detail-facts">
              <div><dt>SKU</dt><dd>{{ selectedProduct.sku || '—' }}</dd></div>
              <div><dt>Availability</dt><dd :class="statusClass(selectedProduct.status)">{{ selectedProduct.stockQty }} units</dd></div>
              <div><dt>Unit</dt><dd>{{ selectedProduct.unit || 'Standard' }}</dd></div>
              <div><dt>Delivery</dt><dd>Supplier delivery available</dd></div>
            </dl>

            <div class="detail-purchase">
              <label><span>Quantity</span><input v-model.number="quantity" type="number" min="1" :max="Math.max(1, selectedProduct.stockQty)" aria-label="Quantity" /></label>
              <button type="button" class="detail-primary" :disabled="selectedProduct.status === 'Out of stock'" @click="addDetailToBasket">
                {{ detailActionLabel }}
              </button>
            </div>
            <button type="button" class="detail-order-now" :disabled="selectedProduct.status === 'Out of stock'" @click="orderNow">
              Order now <FontAwesomeIcon :icon="faArrowRight" />
            </button>
            <p v-if="notice" class="detail-notice" role="status">{{ notice }}</p>
          </div>
        </div>

        <div class="detail-information">
          <div><p class="eyebrow">PRODUCT INFORMATION</p><h2>Made for your next order</h2></div>
          <p>{{ selectedProduct.description }} Browse supplier availability, choose the quantity your business needs, and continue to Orders when you are ready to consolidate your purchase.</p>
        </div>

        <section class="detail-reviews">
          <div class="reviews-head">
            <div><p class="eyebrow">RATINGS &amp; REVIEWS</p><h2>What buyers say</h2></div>
            <div class="review-summary"><strong>{{ averageRating.toFixed(1) }}</strong><span class="stars"><span v-for="star in 5" :key="star" :class="{ muted: star > Math.round(averageRating) }">★</span></span><small>{{ reviews.length }} reviews</small></div>
          </div>

          <p v-if="reviewsLoading" class="shop-message">Loading reviews...</p>
          <p v-else-if="!reviews.length" class="shop-message">No reviews yet. Be the first to share your experience.</p>
          <ul v-else class="review-list">
            <li v-for="review in reviews" :key="review.reviewId" class="review-card">
              <div><strong>{{ review.buyerName || 'WeConnect buyer' }}</strong><span class="stars">{{ starsFor(review.rating) }}</span><time>{{ formatReviewDate(review.reviewDate) }}</time></div>
              <p>{{ review.reviewText }}</p>
              <div v-if="review.supplierReply" class="supplier-reply"><strong>Supplier reply</strong><p>{{ review.supplierReply }}</p></div>
            </li>
          </ul>

          <form class="review-form" @submit.prevent="submitReview">
            <h3>Share your review</h3>
            <label><span>Rating</span><select v-model.number="reviewForm.rating"><option v-for="n in 5" :key="n" :value="n">{{ n }} star{{ n === 1 ? '' : 's' }}</option></select></label>
            <label><span>Your review</span><textarea v-model="reviewForm.reviewText" rows="3" placeholder="Tell other small businesses about this product"></textarea></label>
            <button type="submit" class="detail-primary" :disabled="reviewSubmitting">{{ reviewSubmitting ? 'Submitting...' : 'Submit review' }}</button>
            <p v-if="reviewNotice" class="detail-notice">{{ reviewNotice }}</p>
          </form>
        </section>
      </section>

      <p v-else-if="!isLoading" class="shop-message error-message">This product is no longer available.</p>
    </main>
  </div>
</template>

<script setup>
import SmallBusinessNavbar from '../components/SmallBusinessNavbar.vue'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faArrowLeft,
  faArrowRight,
  faBagShopping,
  faCheck,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faCreditCard,
  faExpand,
  faHeadset,
  faHeart,
  faMagnifyingGlass,
  faPlus,
  faStar,
  faTruckFast,
  faUser
} from '@fortawesome/free-solid-svg-icons'

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
const selectedRating = ref(0)
const selectedPromotion = ref('all')
const maxPrice = ref(1000)
const sortBy = ref('default')
const viewMode = ref('grid')
const currentPage = ref(1)
const pageSize = 12
const quantity = ref(1)
const notice = ref('')
const isLoading = ref(true)
const errorMessage = ref('')
let searchInput = null

function readStoredBasket() {
  try {
    return JSON.parse(localStorage.getItem('weconnect-order-basket') || '{}')
  } catch {
    return {}
  }
}

const isDetailView = computed(() => Boolean(route.params.productId))
const selectedProduct = computed(() => products.value.find((product) => String(product.id) === String(route.params.productId)))
const categories = computed(() => [...new Set(products.value.map((product) => product.category).filter(Boolean))].sort())

const priceCeiling = computed(() => {
  const highest = Math.max(...products.value.map((product) => Number(product.price) || 0), 100)
  return Math.ceil(highest / 100) * 100
})

const filteredProducts = computed(() => products.value.filter((product) => {
  const search = searchQuery.value.trim().toLowerCase()
  const matchesSearch = !search || `${product.title} ${product.category} ${product.sku} ${product.supplier}`.toLowerCase().includes(search)
  const matchesCategory = selectedCategory.value === 'All' || product.category === selectedCategory.value
  const matchesAvailability = selectedAvailability.value === 'All' || product.status === selectedAvailability.value
  const matchesRating = !selectedRating.value || product.rating >= Number(selectedRating.value)
  const matchesPrice = Number(product.price) <= Number(maxPrice.value)
  const matchesPromotion = selectedPromotion.value === 'all'
    || (selectedPromotion.value === 'sale' && product.discountPercent > 0)
    || (selectedPromotion.value === 'featured' && product.rating >= 4.5)
  return matchesSearch && matchesCategory && matchesAvailability && matchesRating && matchesPrice && matchesPromotion
}))

const sortedProducts = computed(() => {
  const next = [...filteredProducts.value]
  if (sortBy.value === 'price-low') next.sort((a, b) => Number(a.price) - Number(b.price))
  if (sortBy.value === 'price-high') next.sort((a, b) => Number(b.price) - Number(a.price))
  if (sortBy.value === 'rating') next.sort((a, b) => b.rating - a.rating)
  if (sortBy.value === 'name') next.sort((a, b) => a.title.localeCompare(b.title))
  return next
})

const totalPages = computed(() => Math.max(1, Math.ceil(sortedProducts.value.length / pageSize)))
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return sortedProducts.value.slice(start, start + pageSize)
})
const pageNumbers = computed(() => Array.from({ length: totalPages.value }, (_, index) => index + 1))
const showingStart = computed(() => sortedProducts.value.length ? ((currentPage.value - 1) * pageSize) + 1 : 0)
const showingEnd = computed(() => Math.min(currentPage.value * pageSize, sortedProducts.value.length))
const basketCount = computed(() => Object.values(basket.value).reduce((total, item) => total + Number(item.quantity || 0), 0))
const detailActionLabel = computed(() => basket.value[selectedProduct.value?.id] ? 'Update order' : 'Add to order')
const averageRating = computed(() => reviews.value.length ? reviews.value.reduce((total, review) => total + Number(review.rating), 0) / reviews.value.length : 0)
const hasActiveFilters = computed(() => selectedCategory.value !== 'All' || selectedAvailability.value !== 'All' || selectedRating.value || selectedPromotion.value !== 'all' || maxPrice.value < priceCeiling.value)

function normalizeProduct(product) {
  const stockQty = Number(product.stockQty ?? product.quantity ?? 0)
  const price = Number(product.price ?? 0)
  const comparePrice = Number(product.comparePrice ?? product.compare_price ?? 0)
  const discountPercent = comparePrice > price && price > 0
    ? Math.round(((comparePrice - price) / comparePrice) * 100)
    : Number(product.discountPercent ?? 0)

  return {
    ...product,
    id: product.id ?? product.product_id,
    title: product.title ?? product.product_name ?? 'Unnamed product',
    category: product.category ?? product.category_name ?? 'General supplies',
    sku: product.sku ?? '',
    price,
    comparePrice,
    discountPercent,
    stockQty,
    status: product.status ?? (stockQty > 0 ? 'Active' : 'Out of stock'),
    image: product.image ?? product.image_url ?? 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=900&q=80',
    supplier: product.supplier ?? product.supplier_name ?? 'WeConnect supplier',
    unit: product.unit ?? 'Standard',
    rating: Number(product.rating ?? product.averageRating ?? 4.8),
    description: product.description ?? 'A dependable wholesale essential selected for small businesses. Review availability and add the quantity you need to your next order.'
  }
}

function formatPrice(price) { return Number(price || 0).toFixed(2) }
function statusClass(status) { return String(status || '').toLowerCase().replace(/\s+/g, '-') }
function persistBasket() { localStorage.setItem('weconnect-order-basket', JSON.stringify(basket.value)) }
function starsFor(rating) {
  const filled = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)))
  return '★'.repeat(filled) + '☆'.repeat(5 - filled)
}
function formatReviewDate(value) {
  return value ? new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : ''
}

function clearFilters() {
  selectedCategory.value = 'All'
  selectedAvailability.value = 'All'
  selectedRating.value = 0
  selectedPromotion.value = 'all'
  maxPrice.value = priceCeiling.value
  sortBy.value = 'default'
  currentPage.value = 1
}

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
    // Keep the locally stored basket when the cart service is unreachable.
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
      const created = await cartRequest('', {
        method: 'POST',
        body: JSON.stringify({ buyerId, productId: product.id, quantity: 1 })
      })
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
  const nextQuantity = Math.max(1, Math.min(quantity.value || 1, Math.max(1, product.stockQty)))
  const existing = basket.value[product.id]
  try {
    let cartItemId = existing?.cartItemId
    if (cartItemId) {
      await cartRequest(`/${cartItemId}`, { method: 'PUT', body: JSON.stringify({ quantity: nextQuantity }) })
    } else {
      const created = await cartRequest('', {
        method: 'POST',
        body: JSON.stringify({ buyerId, productId: product.id, quantity: nextQuantity })
      })
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

function orderNow() {
  addDetailToBasket()
  router.push({ name: 'small-business-orders' })
}

function goToOrders() {
  router.push({ name: 'small-business-orders' })
}

function viewProduct(product) {
  router.push({ name: 'small-business-product', params: { productId: product.id } })
}

async function focusSearch() {
  await nextTick()
  searchInput?.focus()
}

watch(searchQuery, () => { currentPage.value = 1 })
watch([selectedCategory, selectedAvailability, selectedRating, selectedPromotion, maxPrice, sortBy], () => {
  currentPage.value = 1
})
watch(priceCeiling, (value) => {
  if (maxPrice.value > value) maxPrice.value = value
})

watch(() => route.params.productId, (productId) => {
  quantity.value = 1
  notice.value = ''
  if (productId) loadReviews(productId)
})

let productRefreshTimer = null

async function loadMarketplaceProducts({ silent = false } = {}) {
  try {
    const response = await fetch(`${apiUrl}/products?catalog=active&_=${Date.now()}`, { cache: 'no-store' })
    if (!response.ok) throw new Error('Products could not be loaded.')
    products.value = (await response.json()).map(normalizeProduct)
    if (!silent) errorMessage.value = ''
  } catch (error) {
    if (!silent) errorMessage.value = error.message
  }
}

onMounted(async () => {
  await loadMarketplaceProducts()
  isLoading.value = false
  if (maxPrice.value === 1000) maxPrice.value = priceCeiling.value
  await syncBasketFromCart()
  if (isDetailView.value) loadReviews(route.params.productId)

  productRefreshTimer = window.setInterval(() => {
    if (!document.hidden) loadMarketplaceProducts({ silent: true })
  }, 5000)
})

onBeforeUnmount(() => {
  if (productRefreshTimer) window.clearInterval(productRefreshTimer)
})
</script>

<style scoped>
:global(*) { box-sizing: border-box; }
:global(body) { margin: 0; background: #fff; color: #403b38; font-family: "Inter", "Segoe UI", Arial, sans-serif; }
:global(button), :global(input), :global(select), :global(textarea) { font: inherit; }

.shop-page { min-height: 100vh; background: #fff; color: #403b38; }
.shop-announcement { min-height: 34px; padding: 0 5%; display: flex; align-items: center; justify-content: space-between; gap: 20px; background: #5c3d24; color: #fff; font-size: 10px; }
.shop-announcement button { border: 0; padding: 0; background: transparent; color: #e0b184; text-decoration: underline; cursor: pointer; font-size: 10px; }
.shop-announcement button svg { margin-left: 5px; font-size: 8px; }
.announcement-message { opacity: .92; }
.announcement-social { display: flex; gap: 7px; align-items: center; }
.announcement-social span { display: grid; place-items: center; width: 17px; height: 17px; border: 1px solid rgba(255,255,255,.65); border-radius: 50%; font-size: 7px; }

.shop-nav { min-height: 70px; padding: 0 5%; display: flex; align-items: center; gap: 35px; border-bottom: 1px solid #eeeae7; background: #fff; }
.shop-brand { display: inline-flex; align-items: center; gap: 8px; min-width: 145px; color: #263a2d; text-decoration: none; }
.brand-mark { display: grid; place-items: center; width: 28px; height: 28px; border-radius: 50%; background: #5c3d24; color: #fff; font-size: 16px; }
.brand-name { font-family: Georgia, serif; font-size: 17px; font-weight: 700; }
.shop-links { display: flex; align-items: center; justify-content: center; gap: clamp(18px, 2.4vw, 32px); flex: 1; }
.shop-links a { position: relative; color: #514c48; text-decoration: none; font-size: 11px; }
.shop-links a:hover, .shop-links a.active { color: #5c3d24; }
.shop-links a.active::after { content: ""; position: absolute; left: 0; right: 0; bottom: -25px; height: 2px; background: #c48b5b; }
.shop-actions { display: flex; align-items: center; gap: 17px; }
.shop-actions button { position: relative; border: 0; padding: 5px; background: transparent; color: #4f4a47; cursor: pointer; font-size: 13px; }
.basket-count { position: absolute; top: -4px; right: -5px; display: grid; place-items: center; width: 15px; height: 15px; border-radius: 50%; background: #5c3d24; color: #fff; font-size: 8px; font-weight: 700; }

.shop-hero { position: relative; display: grid; place-items: center; padding: 42px 20px 35px; min-height: 145px; overflow: hidden; background: #f6f6f4; text-align: center; }
.shop-hero h1 { z-index: 1; margin: 0; color: #30302e; font-family: Georgia, serif; font-size: clamp(30px, 4vw, 40px); font-weight: 500; }
.shop-hero p { z-index: 1; order: 2; margin: 9px 0 0; color: #77736f; font-size: 10px; }
.shop-hero p span { margin: 0 7px; color: #b5b0ab; }
.hero-rule { position: absolute; top: 50%; left: 50%; width: 50px; height: 1px; transform: translate(-50%, 30px); background: #d6d0ca; opacity: .65; }
.hero-dots { position: absolute; width: 110px; height: 65px; opacity: .25; background-image: radial-gradient(#c4c0ba 1.3px, transparent 1.3px); background-size: 10px 10px; }
.hero-dots-left { top: 5px; left: 8%; transform: rotate(-8deg); }
.hero-dots-right { right: 7%; bottom: 5px; transform: rotate(8deg); }

.shop-main { width: min(1180px, 90%); margin: 0 auto; padding: 43px 0 70px; }
.shop-toolbar-top { display: flex; justify-content: space-between; align-items: center; gap: 20px; margin-bottom: 18px; }
.results-copy { color: #77716c; font-size: 11px; }
.results-copy strong { color: #3e3935; }
.sort-control { position: relative; display: inline-flex; align-items: center; gap: 7px; color: #77716c; font-size: 11px; }
.sort-control select { appearance: none; min-width: 145px; padding: 8px 27px 8px 12px; border: 1px solid #e6e1dc; border-radius: 3px; background: #fff; color: #514b47; outline: none; font-size: 10px; }
.sort-control svg { position: absolute; right: 9px; pointer-events: none; font-size: 8px; }

.shop-layout { display: grid; grid-template-columns: 190px minmax(0, 1fr); gap: 35px; }
.filter-sidebar { border-right: 1px solid #eeeae6; padding-right: 20px; }
.filter-heading { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; padding-bottom: 12px; border-bottom: 1px solid #eeeae6; }
.filter-heading h2 { margin: 0; color: #403c39; font-size: 14px; }
.filter-heading button { border: 0; padding: 0; background: transparent; color: #a36f48; font-size: 9px; cursor: pointer; }
.filter-group { padding: 17px 0; border-bottom: 1px solid #eeeae6; }
.filter-group h3 { margin: 0 0 10px; color: #494440; font-size: 11px; }
.check-row, .rating-row { display: flex; align-items: center; gap: 7px; min-height: 21px; color: #77716c; font-size: 9px; cursor: pointer; }
.check-row input, .rating-row input { width: 10px; height: 10px; margin: 0; accent-color: #214b2d; }
.rating-row { gap: 6px; }
.rating-row small { color: #77716c; font-size: 9px; }
.stars { color: #e2b11d; letter-spacing: 1px; white-space: nowrap; }
.stars .muted { color: #d8d4cf; }
.all-rating { color: #77716c; font-size: 9px; }
.price-values { display: flex; justify-content: space-between; color: #8b8580; font-size: 8px; margin-bottom: 7px; }
.price-range { width: 100%; accent-color: #5c3d24; }
.selected-price { margin-top: 5px; color: #4d4743; font-size: 9px; }

.active-filters { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; min-height: 30px; margin-bottom: 15px; }
.active-label { color: #807a75; font-size: 10px; }
.filter-chip { border: 0; border-radius: 20px; padding: 7px 10px; background: #5c3d24; color: #fff; font-size: 9px; cursor: pointer; }
.filter-chip span { margin-left: 5px; opacity: .75; }
.clear-inline { margin-left: 3px; border: 0; padding: 4px; background: transparent; color: #a36f48; font-size: 9px; text-decoration: underline; cursor: pointer; }

.product-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px 15px; }
.beauty-product-card { min-width: 0; background: #fff; }
.product-visual { position: relative; height: 205px; overflow: hidden; border-radius: 14px; background: #f1e8dc; }
.product-image-button { display: block; width: 100%; height: 100%; padding: 0; border: 0; cursor: pointer; background: #f1e8dc; }
.product-image { width: 100%; height: 100%; object-fit: cover; transition: transform .3s ease; }
.product-image-button:hover .product-image { transform: scale(1.035); }
.discount-badge { position: absolute; top: 10px; left: 10px; padding: 7px 9px; border-radius: 20px; background: #5c3d24; color: #fff; font-size: 9px; font-weight: 700; text-transform: uppercase; }
.low-stock-badge { background: #b7773b; }
.product-hover-actions { position: absolute; top: 10px; right: 10px; display: grid; gap: 6px; opacity: 0; transform: translateX(6px); transition: .2s ease; }
.product-visual:hover .product-hover-actions { opacity: 1; transform: translateX(0); }
.product-hover-actions button { display: grid; place-items: center; width: 29px; height: 29px; border: 0; border-radius: 50%; background: rgba(255,255,255,.95); color: #5d5651; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,.08); }
.product-hover-actions button:disabled { opacity: .4; cursor: not-allowed; }

.product-copy { padding: 9px 1px 0; }
.product-meta-line { display: flex; justify-content: space-between; align-items: center; gap: 10px; color: #8d857f; font-size: 9px; }
.product-rating { display: inline-flex; align-items: center; gap: 4px; color: #4d4743; }
.product-rating svg { color: #e3b421; font-size: 9px; }
.product-copy h3 { margin: 5px 0 3px; }
.product-copy h3 button { padding: 0; border: 0; background: transparent; color: #393531; font-size: 12px; font-weight: 700; text-align: left; cursor: pointer; }
.product-supplier { margin: 0 0 6px; color: #9b938d; font-size: 9px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.product-price-row { display: flex; align-items: baseline; gap: 8px; }
.product-price-row strong { color: #8a603f; font-size: 13px; }
.compare-price { color: #aaa39d; font-size: 10px; text-decoration: line-through; }
.product-add-button { margin-top: 8px; border: 1px solid #d9c8bb; border-radius: 5px; padding: 6px 9px; background: #fff; color: #5c3d24; font-size: 9px; font-weight: 700; cursor: pointer; }
.product-add-button:hover, .product-add-button.selected { border-color: #5c3d24; background: #5c3d24; color: #fff; }
.product-add-button:disabled { cursor: not-allowed; opacity: .45; }

.list-mode { grid-template-columns: 1fr; }
.list-mode .beauty-product-card { display: grid; grid-template-columns: 210px 1fr; gap: 18px; }
.list-mode .product-visual { height: 175px; }
.list-mode .product-copy { padding-top: 15px; }

.shop-message { padding: 35px 0; color: #77716c; font-size: 12px; }
.error-message { color: #b44d43; }
.empty-state { display: grid; place-items: center; min-height: 320px; padding: 30px; border: 1px dashed #ddd5ce; text-align: center; }
.empty-icon { display: grid; place-items: center; width: 48px; height: 48px; margin-bottom: 10px; border-radius: 50%; background: #f2eee9; color: #7c6c61; }
.empty-state h3 { margin: 0 0 5px; color: #4b4541; font-size: 16px; }
.empty-state p { margin: 0 0 15px; color: #918983; font-size: 11px; }
.empty-state button { border: 1px solid #5c3d24; border-radius: 4px; padding: 8px 14px; background: #5c3d24; color: #fff; font-size: 10px; cursor: pointer; }

.pagination { display: flex; justify-content: center; align-items: center; gap: 8px; margin-top: 45px; }
.pagination button { display: grid; place-items: center; width: 29px; height: 29px; border: 0; border-radius: 50%; background: transparent; color: #5e5955; font-size: 10px; cursor: pointer; }
.pagination button:hover:not(:disabled) { background: #eee9e3; }
.pagination button.active { background: #5c3d24; color: #fff; }
.pagination button:disabled { opacity: .25; cursor: not-allowed; }

.shop-benefits { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; margin-top: 70px; padding: 24px 0 5px; border-top: 1px solid #eeeae6; }
.benefit-item { display: flex; align-items: center; gap: 13px; }
.benefit-icon { display: grid; place-items: center; width: 37px; height: 37px; border: 1px solid #bba87e; border-radius: 50%; color: #5c3d24; font-size: 14px; }
.benefit-item strong { display: block; margin-bottom: 3px; color: #4a4541; font-size: 11px; }
.benefit-item small { color: #96908a; font-size: 9px; }

.detail-page { padding-top: 5px; }
.detail-back { display: inline-flex; align-items: center; gap: 7px; margin-bottom: 25px; border: 0; background: transparent; color: #5c3d24; font-size: 11px; font-weight: 700; cursor: pointer; }
.detail-layout { display: grid; grid-template-columns: minmax(300px, .95fr) minmax(320px, 1fr); gap: clamp(35px, 7vw, 85px); max-width: 1080px; margin: 0 auto; }
.detail-image-wrap { height: min(520px, 48vw); overflow: hidden; border-radius: 14px; background: #f1e8dc; }
.detail-image-wrap img { width: 100%; height: 100%; object-fit: cover; }
.detail-thumb { width: 65px; height: 65px; margin-top: 12px; padding: 3px; border: 2px solid #5c3d24; border-radius: 7px; background: #fff; }
.detail-thumb img { width: 100%; height: 100%; object-fit: cover; border-radius: 4px; }
.detail-copy { padding-top: 7px; }
.detail-category, .eyebrow { margin: 0 0 8px; color: #9a6b45; font-size: 9px; font-weight: 800; letter-spacing: 1.4px; text-transform: uppercase; }
.detail-copy h1 { margin: 0 0 12px; color: #403b38; font-family: Georgia, serif; font-size: clamp(34px, 4.5vw, 52px); font-weight: 500; }
.detail-supplier { margin: 0; color: #89817b; font-size: 11px; }
.detail-supplier span { margin-left: 9px; color: #765036; font-weight: 700; }
.detail-rating { margin-top: 13px; color: #716963; font-size: 10px; }
.detail-price { display: flex; align-items: baseline; gap: 9px; margin: 24px 0 16px; }
.detail-price strong { color: #8a603f; font-size: 26px; }
.detail-price > span { color: #aaa19b; font-size: 11px; text-decoration: line-through; }
.detail-price small { color: #8d857f; font-size: 9px; }
.detail-description { color: #77706a; line-height: 1.7; font-size: 12px; }
.detail-facts { display: grid; grid-template-columns: 1fr 1fr; gap: 13px; margin: 24px 0; padding: 16px 0; border-top: 1px solid #eee7e1; border-bottom: 1px solid #eee7e1; }
.detail-facts div { display: grid; gap: 4px; }
.detail-facts dt { color: #958d87; font-size: 8px; font-weight: 800; letter-spacing: .8px; text-transform: uppercase; }
.detail-facts dd { margin: 0; color: #4b4541; font-size: 11px; font-weight: 700; }
.detail-facts dd.low-stock { color: #b7773b; }
.detail-purchase { display: grid; grid-template-columns: 105px 1fr; gap: 9px; }
.detail-purchase label { display: grid; gap: 5px; color: #918983; font-size: 9px; font-weight: 700; text-transform: uppercase; }
.detail-purchase input { min-height: 43px; width: 100%; border: 1px solid #ddd4cd; border-radius: 5px; padding: 0 10px; outline: 0; }
.detail-primary, .detail-order-now { min-height: 43px; border-radius: 5px; font-size: 11px; font-weight: 800; cursor: pointer; }
.detail-primary { align-self: end; border: 1px solid #5c3d24; background: #5c3d24; color: #fff; }
.detail-primary:disabled, .detail-order-now:disabled { opacity: .45; cursor: not-allowed; }
.detail-order-now { width: 100%; margin-top: 9px; border: 1px solid #5c3d24; background: #fff; color: #5c3d24; }
.detail-order-now svg { margin-left: 7px; }
.detail-notice { color: #765036; font-size: 10px; font-weight: 700; }

.detail-information { display: grid; grid-template-columns: .7fr 1fr; gap: 65px; max-width: 1080px; margin: 70px auto 0; padding-top: 25px; border-top: 1px solid #eee7e1; }
.detail-information h2, .detail-reviews h2 { margin: 0; color: #403b38; font-family: Georgia, serif; font-size: 26px; font-weight: 500; }
.detail-information > p { margin: 0; color: #77706a; line-height: 1.7; font-size: 12px; }
.detail-reviews { max-width: 1080px; margin: 55px auto 0; padding-top: 30px; border-top: 1px solid #eee7e1; }
.reviews-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 20px; margin-bottom: 20px; }
.review-summary { display: grid; justify-items: end; gap: 3px; }
.review-summary strong { color: #403b38; font-size: 28px; }
.review-summary small { color: #8d857f; font-size: 9px; }
.review-list { display: grid; gap: 12px; margin: 0 0 25px; padding: 0; list-style: none; }
.review-card { padding: 16px 18px; border: 1px solid #e8e0da; border-radius: 8px; background: #fffdfb; }
.review-card > div:first-child { display: flex; align-items: center; gap: 10px; }
.review-card time { margin-left: auto; color: #9a918b; font-size: 9px; }
.review-card > p { margin: 9px 0 0; color: #756e68; font-size: 11px; line-height: 1.6; }
.supplier-reply { margin-top: 11px; padding: 10px 13px; border-left: 2px solid #9a6b45; background: #fbf7f2; }
.supplier-reply strong { color: #a47645; font-size: 9px; text-transform: uppercase; }
.supplier-reply p { margin: 4px 0 0; color: #776f69; font-size: 10px; }
.review-form { display: grid; gap: 12px; max-width: 560px; padding: 20px; border: 1px solid #e8e0da; border-radius: 8px; background: #fbf9f6; }
.review-form h3 { margin: 0; color: #403b38; font-size: 16px; }
.review-form label { display: grid; gap: 5px; }
.review-form label span { color: #8c837c; font-size: 9px; font-weight: 800; text-transform: uppercase; }
.review-form select, .review-form textarea { width: 100%; border: 1px solid #ddd4cd; border-radius: 5px; padding: 9px 10px; background: #fff; color: #403b38; outline: 0; }
.review-form textarea { resize: vertical; }

@media (max-width: 1050px) {
  .shop-nav { gap: 20px; }
  .shop-links { gap: 16px; }
  .shop-layout { grid-template-columns: 170px minmax(0, 1fr); gap: 25px; }
  .product-grid { gap: 18px 12px; }
  .product-visual { height: 185px; }
}

@media (max-width: 800px) {
  .shop-announcement { padding: 0 20px; }
  .announcement-call, .announcement-social { display: none; }
  .shop-nav { padding: 0 20px; }
  .shop-brand { min-width: auto; }
  .shop-links { gap: 12px; overflow-x: auto; justify-content: flex-start; }
  .shop-links a { white-space: nowrap; }
  .shop-links a.active::after { bottom: -21px; }
  .shop-actions { gap: 8px; }
  .shop-main { width: calc(100% - 32px); padding-top: 28px; }
  .shop-layout { grid-template-columns: 1fr; }
  .filter-sidebar { border-right: 0; border-bottom: 1px solid #eeeae6; padding: 0 0 10px; }
  .filter-group { display: inline-flex; flex-direction: column; width: 48%; vertical-align: top; padding-right: 15px; }
  .product-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .shop-benefits { gap: 18px; }
  .benefit-item { align-items: flex-start; }
  .detail-layout { grid-template-columns: 1fr; }
  .detail-image-wrap { height: 70vw; max-height: 470px; }
  .detail-information { grid-template-columns: 1fr; gap: 18px; }
}

@media (max-width: 560px) {
  .shop-announcement { justify-content: center; }
  .announcement-message { font-size: 9px; }
  .shop-nav { min-height: 62px; gap: 10px; }
  .brand-name { font-size: 15px; }
  .shop-links { display: none; }
  .shop-actions { margin-left: auto; }
  .shop-hero { min-height: 125px; padding: 34px 15px 28px; }
  .shop-hero h1 { font-size: 30px; }
  .shop-main { width: calc(100% - 24px); }
  .shop-toolbar-top { align-items: flex-start; flex-direction: column; }
  .sort-control { width: 100%; justify-content: space-between; }
  .sort-control select { flex: 1; }
  .filter-group { width: 100%; }
  .product-grid { grid-template-columns: 1fr 1fr; gap: 22px 10px; }
  .product-visual { height: 150px; border-radius: 11px; }
  .product-hover-actions { opacity: 1; transform: none; }
  .product-copy h3 button { font-size: 10px; }
  .product-supplier, .product-meta-line, .product-add-button { font-size: 8px; }
  .product-price-row strong { font-size: 11px; }
  .compare-price { font-size: 8px; }
  .shop-benefits { grid-template-columns: 1fr; margin-top: 45px; }
  .detail-facts { grid-template-columns: 1fr 1fr; }
  .reviews-head { align-items: flex-start; flex-direction: column; }
  .review-summary { justify-items: start; }
  .review-card time { display: none; }
}
</style>

<style scoped>
/* Shared sticky navbar supplies navigation on this page. */
.shop-page { --sb-brown: #5c3d24; --sb-brown-dark: #4e342e; --sb-accent: #c48b5b; }
</style>
