<template>
  <div class="shop-page">
    <SmallBusinessNavbar />

    <!-- Page hero -->
    <section class="shop-hero">
      <div class="hero-dots hero-dots-left" aria-hidden="true"></div>
      <div class="hero-dots hero-dots-right" aria-hidden="true"></div>
      <p>Home <span>/</span> Shop <span v-if="isDetailView">/</span> <strong v-if="isDetailView">Product Details</strong></p>
      <h1>Shop</h1>
      <span class="hero-rule"></span>
    </section>

    <main class="shop-main">
      <template v-if="!isDetailView">
        <section class="shop-toolbar-top">
          <div class="results-copy">
            <span>Showing <strong>{{ showingStart }}-{{ showingEnd }}</strong> of {{ sortedProducts.length }} results</span>
          </div>

          <label class="product-search" aria-label="Search products">
            <FontAwesomeIcon :icon="faMagnifyingGlass" />
            <input ref="searchInput" v-model="searchQuery" type="search" placeholder="Search products..." />
            <button v-if="searchQuery" type="button" aria-label="Clear search" @click="searchQuery = ''">×</button>
          </label>

          <div class="view-toggle" aria-label="Product view">
            <button type="button" :class="{ active: viewMode === 'grid' }" aria-label="Grid view" @click="viewMode = 'grid'">▦</button>
            <button type="button" :class="{ active: viewMode === 'list' }" aria-label="List view" @click="viewMode = 'list'">☷</button>
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

            <div v-if="errorMessage" class="shop-message error-message">
  <strong>We couldn't load the marketplace.</strong>
  <span>{{ errorMessage }}</span>
  <button type="button" class="retry-button" @click="retryProducts">Try again</button>
</div>
            <div v-else-if="isLoading" class="product-grid loading-grid" aria-label="Loading products">
  <div v-for="n in 8" :key="n" class="product-skeleton">
    <div class="skeleton-image"></div>
    <div class="skeleton-line short"></div>
    <div class="skeleton-line"></div>
    <div class="skeleton-line price"></div>
  </div>
</div>

            <template v-else>
              <div v-if="filteredProducts.length" class="product-grid" :class="{ 'list-mode': viewMode === 'list' }">
                <article v-for="product in paginatedProducts" :key="product.id" class="beauty-product-card">
                  <div class="product-visual">
                    <button type="button" class="product-image-button" :aria-label="`View ${product.title}`" @click="viewProduct(product)">
                      <img :src="product.image" :alt="product.title" class="product-image" loading="lazy" @error="imageFallback" />
                    </button>

                    <span v-if="product.discountPercent > 0" class="discount-badge">{{ product.discountPercent }}% off</span>
                    <span v-else-if="product.status === 'Low stock'" class="discount-badge low-stock-badge">Low stock</span>

                    <div class="product-hover-actions">
                      <button type="button" aria-label="View product" @click="viewProduct(product)"><FontAwesomeIcon :icon="faExpand" /></button>
                      <button type="button" aria-label="Add to order" :disabled="product.status === 'Out of stock' || basketBusy[product.id]" @click="toggleBasket(product)">
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
                    <div v-if="product.discountTiers?.length" class="bulk-discount-box">
                      <strong>Bulk savings</strong>
                      <span v-for="tier in product.discountTiers" :key="tier.discount_tier_id || tier.minimum_quantity">
                        {{ tier.minimum_quantity }}+ units: {{ Number(tier.discount_percent).toFixed(0) }}% off
                      </span>
                    </div>
                    <button
                      type="button"
                      class="product-add-button"
                      :class="{ selected: basket[product.id] }"
                      :disabled="product.status === 'Out of stock'"
                      @click="toggleBasket(product)"
                    >
                      <FontAwesomeIcon :icon="basket[product.id] ? faCheck : faPlus" />
                      {{ basketBusy[product.id] ? 'Updating...' : (basket[product.id] ? 'Added to order' : 'Add to order') }}
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
        <div class="detail-layout">
          <section class="detail-gallery" aria-label="Product gallery">
            <div class="detail-image-wrap">
              <button v-if="detailImages.length > 1" type="button" class="detail-gallery-arrow detail-gallery-arrow-left" @click="activeDetailImage = activeDetailImage === 0 ? detailImages.length - 1 : activeDetailImage - 1" aria-label="Previous product image">‹</button>
              <img :src="detailImages[activeDetailImage]" :alt="selectedProduct.title" @error="handleDetailImageError" />
              <button v-if="detailImages.length > 1" type="button" class="detail-gallery-arrow detail-gallery-arrow-right" @click="activeDetailImage = activeDetailImage === detailImages.length - 1 ? 0 : activeDetailImage + 1" aria-label="Next product image">›</button>
            </div>
            <div v-if="detailImages.length > 1" class="detail-image-count" aria-live="polite">
              {{ activeDetailImage + 1 }} / {{ detailImages.length }} images
            </div>
            <div class="detail-thumb-row">
              <button v-for="(image, index) in detailImages" :key="image + index" type="button" class="detail-thumb" :class="{ active: activeDetailImage === index }" @click="activeDetailImage = index">
                <img :src="image" :alt="selectedProduct.title + ' image ' + (index + 1)" loading="lazy" @error="imageFallback" />
              </button>
            </div>
          </section>

          <section class="detail-copy">
            <div class="detail-category-row">
              <p class="detail-category">{{ selectedProduct.category }}</p>
              <span v-if="selectedProduct.discountPercent" class="detail-discount">{{ selectedProduct.discountPercent }}% Off</span>
            </div>
            <h1>{{ selectedProduct.title }}</h1>
            <div class="detail-review-line">
              <span class="detail-stars">{{ starsFor(selectedProduct.rating) }}</span>
              <strong>{{ selectedProduct.rating.toFixed(1) }}</strong>
              <span>({{ reviews.length || 'No' }} Reviews)</span>
            </div>
            <div class="detail-price">
              <strong>R {{ formatPrice(detailUnitPrice) }}</strong>
              <span v-if="detailUnitPrice < Number(selectedProduct.price)">R {{ formatPrice(selectedProduct.price) }}</span>
              <small v-if="activeDetailDiscount > 0">{{ activeDetailDiscount }}% bulk discount applied</small>
            </div>
            <div v-if="selectedProduct.discountTiers?.length" class="detail-bulk-discounts">
              <div class="bulk-heading"><strong>Bulk Discount</strong><span>Save more when you buy more</span></div>
              <div v-for="tier in selectedProduct.discountTiers" :key="tier.discount_tier_id || tier.minimum_quantity" class="bulk-tier" :class="{ active: quantity >= tier.minimum_quantity }">
                <span>{{ tier.minimum_quantity }}+ units</span><strong>{{ Number(tier.discount_percent).toFixed(0) }}% off</strong>
              </div>
            </div>
            <p class="detail-description">{{ selectedProduct.description }}</p>

            <div class="detail-option">
              <div class="detail-option-label"><strong>Size/Volume</strong><span>{{ detailPackSizes[selectedPackSize] }}</span></div>
              <div class="detail-size-pills">
                <button v-for="(size, index) in detailPackSizes" :key="size" type="button" :class="{ selected: selectedPackSize === index }" @click="selectedPackSize = index">{{ size }}</button>
              </div>
            </div>

            <div class="detail-purchase">
              <div class="detail-quantity">
                <button type="button" :disabled="quantity <= 1" @click="quantity = Math.max(1, quantity - 1)">−</button>
                <span>{{ quantity }}</span>
                <button type="button" :disabled="quantity >= Math.max(1, selectedProduct.stockQty)" @click="quantity = Math.min(Math.max(1, selectedProduct.stockQty), quantity + 1)">+</button>
              </div>
              <button type="button" class="detail-primary" :disabled="selectedProduct.status === 'Out of stock'" @click="addDetailToBasket"><FontAwesomeIcon :icon="faBagShopping" /> {{ detailActionLabel }}</button>
              <button type="button" class="detail-buy-now" :disabled="selectedProduct.status === 'Out of stock'" @click="orderNow">Buy Now</button>
              <button type="button" class="detail-heart" :class="{ saved: detailSaved }" :aria-pressed="detailSaved" @click="toggleDetailWishlist" :aria-label="detailSaved ? 'Remove from wishlist' : 'Save product'">{{ detailSaved ? '♥' : '♡' }}</button>
            </div>

            <div class="detail-meta">
              <div><b>SKU:</b> {{ selectedProduct.sku || 'Not provided' }}</div>
              <div><b>Tags:</b> {{ selectedProduct.category }}, Wholesale, Bulk</div>
              <div class="detail-share"><b>Share:</b>
                <button type="button" @click="shareProduct('Facebook')">f</button>
                <button type="button" @click="shareProduct('X')">x</button>
                <button type="button" @click="shareProduct('Pinterest')">p</button>
              </div>
            </div>
          </section>
        </div>

        <section class="detail-review-section">
          <nav class="detail-tabs" aria-label="Product details">
            <button :class="{ active: activeDetailTab === 'description' }" @click="activeDetailTab = 'description'">Description</button>
            <button :class="{ active: activeDetailTab === 'info' }" @click="activeDetailTab = 'info'">Additional Information</button>
            <button :class="{ active: activeDetailTab === 'reviews' }" @click="activeDetailTab = 'reviews'">Review</button>
          </nav>

          <div v-if="activeDetailTab === 'description'" class="detail-tab-content">
            <p>{{ selectedProduct.description }}</p>
          </div>
          <div v-else-if="activeDetailTab === 'info'" class="detail-tab-content detail-info-grid">
            <div><span>Category</span><strong>{{ selectedProduct.category }}</strong></div>
            <div><span>SKU</span><strong>{{ selectedProduct.sku || 'Not provided' }}</strong></div>
            <div><span>Stock</span><strong>{{ selectedProduct.stockQty }} units</strong></div>
            <div><span>Supplier</span><strong>{{ selectedProduct.supplier }}</strong></div>
          </div>

          <div v-else class="detail-reviews-content">
            <div class="review-overview">
              <div class="review-score">
                <strong>{{ averageRating ? averageRating.toFixed(1) : selectedProduct.rating.toFixed(1) }}</strong>
                <span>out of 5</span>
                <div class="detail-stars">{{ starsFor(averageRating || selectedProduct.rating) }}</div>
                <small>{{ reviews.length }} Reviews</small>
              </div>
              <div class="review-bars">
                <div v-for="rating in [5,4,3,2,1]" :key="rating" class="review-bar-row">
                  <span>{{ rating }} Star</span><div><i :style="{ width: reviewBreakdown[rating] + '%' }"></i></div><small>{{ reviewBreakdown[rating] }}%</small>
                </div>
              </div>
            </div>

            <div class="review-list-heading">
              <div><strong>Review List</strong><small>Showing {{ reviews.length }} of {{ reviews.length }} results</small></div>
              <label>Sort by:
                <select v-model="reviewSort"><option value="newest">Newest</option><option value="rating">Highest rating</option></select>
              </label>
            </div>

            <form class="review-form" @submit.prevent="submitReview">
              <div class="review-form-heading">
                <div><strong>Write a Review</strong><small>Share your experience with this product.</small></div>
                <div class="review-form-stars" role="radiogroup" aria-label="Your rating">
                  <button v-for="rating in [5,4,3,2,1]" :key="rating" type="button" :class="{ selected: reviewForm.rating === rating }" @click="reviewForm.rating = rating">{{ rating }}★</button>
                </div>
              </div>
              <textarea v-model="reviewForm.reviewText" maxlength="1000" rows="3" placeholder="Tell other businesses about this product..." aria-label="Review text"></textarea>
              <div class="review-form-footer">
                <span>{{ reviewNotice }}</span>
                <button type="submit" :disabled="reviewSubmitting || !reviewForm.reviewText.trim()">
                  {{ reviewSubmitting ? 'Publishing...' : 'Publish Review' }}
                </button>
              </div>
            </form>

            <p v-if="reviewsLoading" class="shop-message">Loading reviews...</p>
            <p v-else-if="!reviews.length" class="shop-message">No reviews yet. Be the first to share your experience.</p>
            <ul v-else class="review-list">
              <li v-for="review in sortedReviews" :key="review.reviewId" class="review-card">
                <div class="review-author">
                  <span class="review-avatar">{{ initials(review.buyerName || 'Buyer') }}</span>
                  <div><strong>{{ review.buyerName || 'WeConnect buyer' }}</strong><span class="review-verified">Verified</span></div>
                  <time>{{ formatRelativeDate(review.reviewDate) }}</time>
                </div>
                <div class="detail-stars">{{ starsFor(review.rating) }}</div>
                <strong class="review-title">{{ review.rating >= 4 ? 'Absolutely love this product!' : 'Good product for our business' }}</strong>
                <p>{{ review.reviewText || 'Great quality and useful for our regular orders.' }}</p>
                <div v-if="review.supplierReply" class="supplier-reply"><strong>Supplier reply</strong><p>{{ review.supplierReply }}</p></div>
              </li>
            </ul>

            <!-- Related products -->
            <section v-if="relatedProducts.length" class="related-products-section" aria-labelledby="related-products-title">
              <div class="related-products-heading">
                <div>
                  <span class="related-eyebrow">YOU MAY ALSO NEED</span>
                  <h2 id="related-products-title">Related Products</h2>
                  <p>Explore more {{ selectedProduct.category }} products from our marketplace.</p>
                </div>
                <button type="button" class="related-view-all" @click="browseRelatedProducts">View all products</button>
              </div>

              <div class="related-products-grid">
                <article v-for="product in relatedProducts" :key="product.id" class="related-product-card">
                  <div class="related-product-image-wrap">
                    <button
                      type="button"
                      class="related-product-image-button"
                      :aria-label="`View ${product.title}`"
                      @click="viewProduct(product)"
                    >
                      <img :src="product.image" :alt="product.title" loading="lazy" @error="imageFallback" />
                    </button>

                    <span v-if="product.discountPercent > 0" class="related-discount">
                      {{ product.discountPercent }}% off
                    </span>

                    <button
                      type="button"
                      class="related-quick-add"
                      :disabled="product.status === 'Out of stock' || basketBusy[product.id]"
                      :aria-label="`Add ${product.title} to order`"
                      @click="toggleBasket(product)"
                    >
                      <FontAwesomeIcon :icon="basket[product.id] ? faCheck : faPlus" />
                    </button>
                  </div>

                  <div class="related-product-copy">
                    <div class="related-product-meta">
                      <span>{{ product.category }}</span>
                      <span><FontAwesomeIcon :icon="faStar" /> {{ product.rating.toFixed(1) }}</span>
                    </div>
                    <h3>
                      <button type="button" @click="viewProduct(product)">
                        {{ product.title }}
                      </button>
                    </h3>
                    <p>{{ product.supplier }}</p>
                    <div class="related-product-price">
                      <strong>R {{ formatPrice(product.price) }}</strong>
                      <span
                        v-if="product.comparePrice && Number(product.comparePrice) > Number(product.price)"
                      >
                        R {{ formatPrice(product.comparePrice) }}
                      </span>
                    </div>
                    <button
                      type="button"
                      class="related-add-button"
                      :class="{ selected: basket[product.id] }"
                      :disabled="product.status === 'Out of stock'"
                      @click="toggleBasket(product)"
                    >
                      <FontAwesomeIcon :icon="basket[product.id] ? faCheck : faPlus" />
                      {{ basketBusy[product.id] ? 'Updating...' : (basket[product.id] ? 'Added to order' : 'Add to order') }}
                    </button>
                  </div>
                </article>
              </div>
            </section>
          </div>
        </section>
        <p v-if="notice" class="detail-notice" role="status">{{ notice }}</p>
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
  faBagShopping,
  faCheck,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faCreditCard,
  faExpand,
  faHeadset,
  faMagnifyingGlass,
  faPlus,
  faStar,
  faTruckFast,
} from '@fortawesome/free-solid-svg-icons'

const apiUrl = import.meta.env.VITE_API_URL || '/api'
const buyerId = computed(() => localStorage.getItem('weconnect_buyer_id') || '')
const route = useRoute()
const router = useRouter()

const products = ref([])
const basket = ref(readStoredBasket())
const basketBusy = ref({})
const savedProducts = ref(readStoredWishlist())
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
const activeDetailImage = ref(0)
const activeDetailTab = ref('reviews')
const selectedPackSize = ref(0)
const detailSaved = ref(false)
const reviewSort = ref('newest')
const detailPackSizes = ['30 ml', '60 ml', '80 ml', '100 ml']
const notice = ref('')
const isLoading = ref(true)
const errorMessage = ref('')
const searchInput = ref(null)

function readStoredBasket() {
  try {
    return JSON.parse(localStorage.getItem('weconnect-order-basket') || '{}')
  } catch {
    return {}
  }
}

function readStoredWishlist() {
  try {
    return JSON.parse(localStorage.getItem('weconnect-wishlist') || '{}')
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
const detailActionLabel = computed(() => basket.value[selectedProduct.value?.id] ? 'Add to cart' : 'Add to cart')
const activeDetailDiscount = computed(() => { const tiers = selectedProduct.value?.discountTiers || []; return [...tiers].reverse().find(t => quantity.value >= Number(t.minimum_quantity))?.discount_percent || 0 })
const detailUnitPrice = computed(() => { const base = Number(selectedProduct.value?.price || 0); return base * (1 - Number(activeDetailDiscount.value || 0) / 100) })
const relatedProducts = computed(() => {
  const current = selectedProduct.value
  if (!current) return []

  // Related products are all other products in the same category.
  return products.value
    .filter((product) => String(product.id) !== String(current.id))
    .filter((product) => String(product.category).toLowerCase() === String(current.category).toLowerCase())
})
const averageRating = computed(() => reviews.value.length ? reviews.value.reduce((total, review) => total + Number(review.rating), 0) / reviews.value.length : 0)
const detailImages = computed(() => {
  const product = selectedProduct.value
  if (!product) return []
  const images = normalizeProductImages(product)
  return images.length ? images : [product.image].filter(Boolean)
})
const sortedReviews = computed(() => {
  const list = [...reviews.value]
  if (reviewSort.value === 'rating') return list.sort((a, b) => Number(b.rating) - Number(a.rating))
  return list.sort((a, b) => new Date(b.reviewDate || 0) - new Date(a.reviewDate || 0))
})
const reviewBreakdown = computed(() => {
  const total = reviews.value.length || 1
  return [5,4,3,2,1].reduce((result, rating) => {
    result[rating] = Math.round((reviews.value.filter(review => Math.round(Number(review.rating)) === rating).length / total) * 100)
    return result
  }, {})
})
const hasActiveFilters = computed(() => selectedCategory.value !== 'All' || selectedAvailability.value !== 'All' || selectedRating.value || selectedPromotion.value !== 'all' || maxPrice.value < priceCeiling.value)

function normalizeProductImages(product) {
  const candidates = [
    ...(Array.isArray(product.images) ? product.images : []),
    ...(typeof product.images === 'string' ? (() => { try { return JSON.parse(product.images) } catch { return [] } })() : []),
    ...(Array.isArray(product.product_images) ? product.product_images : []),
    ...(Array.isArray(product.productImages) ? product.productImages : []),
    ...(Array.isArray(product.gallery) ? product.gallery : []),
    ...(Array.isArray(product.media) ? product.media.map(item => typeof item === 'string' ? item : item?.media_url || item?.url || item?.src) : []),
    product.image,
    product.image_url,
    product.product_image,
    product.productImage
  ]

  return [...new Set(
    candidates
      .map(item => typeof item === 'string' ? item : item?.media_url || item?.url || item?.src)
      .filter(url => typeof url === 'string' && url.trim())
      .map(url => url.trim())
  )]
}
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
    discountTiers: Array.isArray(product.discountTiers) ? product.discountTiers.map(t => ({ ...t, minimum_quantity: Number(t.minimum_quantity), discount_percent: Number(t.discount_percent) })).sort((a,b) => a.minimum_quantity - b.minimum_quantity) : [],
    stockQty,
    status: product.status ?? (stockQty > 0 ? 'Active' : 'Out of stock'),
    image: product.image ?? product.image_url ?? product.product_image ?? product.productImage ?? 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=900&q=80',
    images: normalizeProductImages(product),
    supplier: product.supplier ?? product.supplier_name ?? 'WeConnect supplier',
    unit: product.unit ?? 'Standard',
    rating: Number(product.rating ?? product.averageRating ?? 4.8),
    description: product.description ?? 'A dependable wholesale essential selected for small businesses. Review availability and add the quantity you need to your next order.'
  }
}

function formatPrice(price) { return Number(price || 0).toFixed(2) }
function statusClass(status) { return String(status || '').toLowerCase().replace(/\s+/g, '-') }
function persistBasket() { localStorage.setItem('weconnect-order-basket', JSON.stringify(basket.value)) }
function persistWishlist() { localStorage.setItem('weconnect-wishlist', JSON.stringify(savedProducts.value)) }
function toggleWishlist(productId) {
  const next = { ...savedProducts.value }
  if (next[productId]) delete next[productId]
  else next[productId] = true
  savedProducts.value = next
  persistWishlist()
}
function imageFallback(event) {
  event.target.src = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=80'
}

function handleDetailImageError(event) {
  event.target.src = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80'
}
function starsFor(rating) {
  const filled = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)))
  return '★'.repeat(filled) + '☆'.repeat(5 - filled)
}
function formatReviewDate(value) {
  return value ? new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : ''
}

function initials(name) {
  return String(name || 'Buyer').split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0].toUpperCase()).join('')
}
function formatRelativeDate(value) {
  if (!value) return 'Recently'
  const date = new Date(value)
  const days = Math.max(0, Math.floor((Date.now() - date.getTime()) / 86400000))
  if (days < 1) return 'Today'
  if (days < 30) return days + ' days ago'
  if (days < 365) return Math.floor(days / 30) + ' month' + (Math.floor(days / 30) === 1 ? '' : 's') + ' ago'
  return Math.floor(days / 365) + ' year' + (Math.floor(days / 365) === 1 ? '' : 's') + ' ago'
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
  if (!buyerId.value) throw new Error('Please sign in as a buyer before using the shop.')
  const response = await fetch(`${apiUrl}/cart${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('weconnect_token') || ''}`,
      ...(options.headers || {})
    }
  })
  if (!response.ok) throw new Error('Cart service unavailable')
  return response.json()
}

async function syncBasketFromCart() {
  try {
    const items = await cartRequest(`?buyerId=${encodeURIComponent(buyerId.value)}`)
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
  if (basketBusy.value[product.id]) return

  basketBusy.value = { ...basketBusy.value, [product.id]: true }
  const existing = basket.value[product.id]

  try {
    let cartItemId = existing?.cartItemId
    const nextQuantity = Number(existing?.quantity || 0) + 1

    if (cartItemId) {
      await cartRequest(`/${cartItemId}`, {
        method: 'PUT',
        body: JSON.stringify({ buyerId: buyerId.value, quantity: nextQuantity })
      })
    } else {
      const created = await cartRequest('', {
        method: 'POST',
        body: JSON.stringify({ buyerId: buyerId.value, productId: product.id, quantity: 1 })
      })
      cartItemId = created.cartItemId
    }

    basket.value = {
      ...basket.value,
      [product.id]: {
        product,
        quantity: nextQuantity,
        cartItemId
      }
    }

    persistBasket()
    notice.value = `${product.title} added to cart.`

    // Immediately take the small-business user to their cart.
    router.push('/small-business/cart')
  } catch (error) {
    notice.value = error.message || 'The product could not be added to the cart.'
  } finally {
    const nextBusy = { ...basketBusy.value }
    delete nextBusy[product.id]
    basketBusy.value = nextBusy
  }
}
async function addDetailToBasket({ goToCart = false } = {}) {
  const product = selectedProduct.value
  if (!product || basketBusy.value[product.id]) return
  basketBusy.value = { ...basketBusy.value, [product.id]: true }
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
  notice.value = `${product.title} added to cart.`
  const nextBusy = { ...basketBusy.value }
  delete nextBusy[product.id]
  basketBusy.value = nextBusy
  if (goToCart) router.push('/small-business/cart')
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
      body: JSON.stringify({ buyerId: buyerId.value, rating: reviewForm.value.rating, reviewText })
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

async function orderNow() {
  await addDetailToBasket({ goToCart: true })
}

async function shareProduct(platform) {
  const product = selectedProduct.value
  if (!product) return
  const shareUrl = window.location.href
  const shareText = `${product.title} — R ${formatPrice(product.price)}`
  try {
    if (navigator.share) {
      await navigator.share({ title: product.title, text: shareText, url: shareUrl })
      return
    }
    await navigator.clipboard.writeText(shareUrl)
    notice.value = `${platform} link copied. You can paste it anywhere to share.`
  } catch {
    notice.value = 'Sharing was cancelled.'
  }
}

function goToOrders() {
  router.push({ name: 'small-business-orders' })
}

function viewProduct(product) {
  router.push({ name: 'small-business-product', params: { productId: product.id } })
}

function toggleDetailWishlist() {
  if (!selectedProduct.value) return
  toggleWishlist(selectedProduct.value.id)
  detailSaved.value = Boolean(savedProducts.value[selectedProduct.value.id])
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function browseRelatedProducts() {
  router.push({ name: 'small-business-products' })
}

async function focusSearch() {
  await nextTick()
  searchInput.value?.focus()
}

watch(searchQuery, () => { currentPage.value = 1 })
watch([selectedCategory, selectedAvailability, selectedRating, selectedPromotion, maxPrice, sortBy], () => {
  currentPage.value = 1
})
watch(priceCeiling, (value) => {
  if (!isDetailView.value && (maxPrice.value === 1000 || maxPrice.value > value)) maxPrice.value = value
})

watch(() => route.params.productId, (productId) => {
  quantity.value = 1
  activeDetailImage.value = 0
  activeDetailTab.value = 'reviews'
  selectedPackSize.value = 0
  detailSaved.value = Boolean(savedProducts.value[productId])
  reviewNotice.value = ''
  notice.value = ''
  if (productId) {
    loadReviews(productId)
    const current = products.value.find(product => String(product.id) === String(productId))
    if (current && (!Array.isArray(current.images) || current.images.length === 0)) {
      loadMarketplaceProducts({ silent: true })
    }
    scrollToTop()
  }
})

let productRefreshTimer = null
let refreshInProgress = false
const PRODUCT_REFRESH_MS = 2000
const PRODUCT_SYNC_KEY = "weconnect-product-catalog-updated"

async function retryProducts() {
  isLoading.value = true
  errorMessage.value = ''
  await loadMarketplaceProducts()
  isLoading.value = false
}

async function loadMarketplaceProducts({ silent = false } = {}) {
  if (refreshInProgress) return
  refreshInProgress = true
  try {
    const response = await fetch(`${apiUrl}/products?catalog=active&_=${Date.now()}`, { cache: 'no-store', headers: { Authorization: `Bearer ${localStorage.getItem('weconnect_token') || ''}` } })
    if (!response.ok) throw new Error('Products could not be loaded.')
    products.value = (await response.json()).map(normalizeProduct)
    if (!silent) errorMessage.value = ''
  } catch (error) {
    if (!silent) errorMessage.value = error.message
  } finally {
    refreshInProgress = false
  }
}

onMounted(async () => {
  if (!buyerId.value) errorMessage.value = 'Please sign in as a buyer to add products to your order.'
  await loadMarketplaceProducts()
  isLoading.value = false
  if (maxPrice.value === 1000) maxPrice.value = priceCeiling.value
  await syncBasketFromCart()
  if (isDetailView.value) loadReviews(route.params.productId)

  const refreshProductsWhenVisible = () => {
    if (!document.hidden) loadMarketplaceProducts({ silent: true })
  }
  window.addEventListener("focus", refreshProductsWhenVisible)
  window.addEventListener("storage", (event) => {
    if (event.key === PRODUCT_SYNC_KEY) refreshProductsWhenVisible()
  })
  document.addEventListener("visibilitychange", refreshProductsWhenVisible)

  productRefreshTimer = window.setInterval(refreshProductsWhenVisible, PRODUCT_REFRESH_MS)

  onBeforeUnmount(() => {
    window.removeEventListener("focus", refreshProductsWhenVisible)
    document.removeEventListener("visibilitychange", refreshProductsWhenVisible)
  })
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
.product-search { display: flex; align-items: center; gap: 7px; width: min(260px, 25vw); min-width: 170px; padding: 7px 9px; border: 1px solid #e6e1dc; border-radius: 4px; background: #fff; color: #8d857f; }
.product-search input { width: 100%; min-width: 0; border: 0; outline: 0; background: transparent; color: #403b38; font-size: 10px; }
.product-search button { border: 0; background: transparent; color: #8d857f; cursor: pointer; font-size: 15px; line-height: 1; }
.view-toggle { display: flex; border: 1px solid #e6e1dc; border-radius: 4px; overflow: hidden; }
.view-toggle button { width: 29px; height: 29px; border: 0; background: #fff; color: #8d857f; cursor: pointer; }
.view-toggle button.active { background: #5c3d24; color: #fff; }

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
.beauty-product-card {
  position: relative;
  min-width: 0;
  overflow: hidden;
  border: 1px solid #e6ddd7;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 6px 20px rgba(62, 43, 29, .045);
  transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
}
.beauty-product-card:hover {
  transform: translateY(-5px);
  border-color: #d9c5b6;
  box-shadow: 0 14px 32px rgba(62, 43, 29, .11);
}
.beauty-product-card:hover .product-visual { box-shadow: none; }

.product-visual {
  position: relative;
  height: 215px;
  overflow: hidden;
  border-radius: 0;
  background: #f1e8dc;
}
.product-image-button { display: block; width: 100%; height: 100%; padding: 0; border: 0; cursor: pointer; background: #f1e8dc; }
.product-image { width: 100%; height: 100%; object-fit: cover; transition: transform .3s ease; }
.product-image-button:hover .product-image { transform: scale(1.035); }
.discount-badge { position: absolute; top: 10px; left: 10px; padding: 7px 9px; border-radius: 20px; background: #5c3d24; color: #fff; font-size: 9px; font-weight: 700; text-transform: uppercase; }
.low-stock-badge { background: #b7773b; }
.product-hover-actions { position: absolute; top: 10px; right: 10px; display: grid; gap: 6px; opacity: 0; transform: translateX(6px); transition: .2s ease; }
.product-visual:hover .product-hover-actions { opacity: 1; transform: translateX(0); }
.product-hover-actions button { display: grid; place-items: center; width: 29px; height: 29px; border: 0; border-radius: 50%; background: rgba(255,255,255,.95); color: #5d5651; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,.08); }
.product-hover-actions button:disabled { opacity: .4; cursor: not-allowed; }

 .product-copy { padding: 13px 14px 15px; background: #fff; }
 .product-meta-line { display: flex; justify-content: space-between; align-items: center; gap: 10px; color: #8d857f; font-size: 9px; padding-bottom: 2px; }
.product-rating { display: inline-flex; align-items: center; gap: 4px; color: #4d4743; }
.product-rating svg { color: #e3b421; font-size: 9px; }
 .product-copy h3 { margin: 7px 0 4px; min-height: 30px; display: flex; align-items: flex-start; }
 .product-copy h3 button { padding: 0; border: 0; background: transparent; color: #393531; font-size: 12px; line-height: 1.35; font-weight: 700; text-align: left; cursor: pointer; }
 .product-supplier { margin: 0 0 9px; color: #8d8179; font-size: 9px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
 .product-price-row { display: flex; align-items: baseline; gap: 8px; padding-top: 8px; border-top: 1px solid #f0e9e4; }
.product-price-row strong { color: #8a603f; font-size: 13px; }
.compare-price { color: #aaa39d; font-size: 10px; text-decoration: line-through; }
 .product-add-button { width: 100%; margin-top: 11px; border: 1px solid #d9c8bb; border-radius: 8px; padding: 9px 10px; background: #faf7f4; color: #5c3d24; font-size: 9px; font-weight: 700; cursor: pointer; transition: .2s ease; }
.product-add-button:hover, .product-add-button.selected { border-color: #5c3d24; background: #5c3d24; color: #fff; }
.product-add-button:disabled { cursor: not-allowed; opacity: .45; }

.list-mode { grid-template-columns: 1fr; }
.list-mode .beauty-product-card { display: grid; grid-template-columns: 210px 1fr; gap: 18px; }
.list-mode .product-visual { height: 175px; }
.list-mode .product-copy { padding-top: 15px; }

.shop-message { display: grid; gap: 7px; padding: 35px 0; color: #77716c; font-size: 12px; }
.retry-button { width: fit-content; margin-top: 6px; border: 0; border-radius: 5px; padding: 8px 13px; background: #5c3d24; color: #fff; font-size: 10px; cursor: pointer; }
.retry-button:hover { background: #755036; }

.loading-grid { pointer-events: none; }
.product-skeleton { min-width: 0; }
.skeleton-image, .skeleton-line { position: relative; overflow: hidden; background: #eee7e1; }
.skeleton-image::after, .skeleton-line::after { content: ""; position: absolute; inset: 0; transform: translateX(-100%); background: linear-gradient(90deg, transparent, rgba(255,255,255,.6), transparent); animation: skeleton-shimmer 1.25s infinite; }
.skeleton-image { height: 205px; border-radius: 12px; }
.skeleton-line { height: 8px; margin-top: 9px; border-radius: 5px; }
.skeleton-line.short { width: 38%; }
.skeleton-line.price { width: 28%; }
@keyframes skeleton-shimmer { 100% { transform: translateX(100%); } }
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

.detail-page { padding-top: 28px; }
.detail-layout { display: grid; grid-template-columns: minmax(330px, .95fr) minmax(330px, 1fr); gap: clamp(35px, 6vw, 72px); max-width: 1080px; margin: 0 auto; }
.detail-gallery { position: relative; min-width: 0; }
.detail-image-wrap { position: relative; box-shadow: 0 18px 45px rgba(75, 49, 31, .10); height: 390px; overflow: hidden; border-radius: 13px; background: #eee4d8; }
.detail-image-wrap img { width: 100%; height: 100%; object-fit: cover; }
.detail-gallery-arrow { position: absolute; top: 50%; z-index: 2; width: 31px; height: 31px; transform: translateY(-50%); border: 0; border-radius: 50%; background: rgba(255,255,255,.95); color: #5c3d24; font-size: 25px; cursor: pointer; box-shadow: 0 3px 10px rgba(60,43,38,.12); }
.detail-gallery-arrow-left { left: 10px; }.detail-gallery-arrow-right { right: 10px; }
.detail-image-count { margin: 8px 0 7px; color: #8e8177; font-size: 8px; text-align: right; }
.detail-thumb-row { display: flex; gap: 7px; margin-top: 8px; }
.detail-thumb { width: 66px; height: 66px; padding: 2px; border: 2px solid transparent; border-radius: 7px; background: #eee4d8; cursor: pointer; overflow: hidden; }
.detail-thumb.active { border-color: #5c3d24; }.detail-thumb img { width: 100%; height: 100%; object-fit: cover; border-radius: 4px; }
.detail-copy { padding-top: 8px; }.detail-category-row { display: flex; align-items: center; gap: 8px; }.detail-category { margin: 0; color: #8e8178; font-size: 9px; font-weight: 700; }.detail-discount { padding: 3px 7px; border-radius: 8px; background: #e7f2e9; color: #3e7650; font-size: 8px; font-weight: 800; }
.detail-copy h1 { margin: 5px 0 8px; color: #3d332d; font: 600 25px Georgia, serif; }.detail-review-line { display: flex; align-items: center; gap: 6px; color: #8c837c; font-size: 9px; }.detail-stars { color: #e2b21b; letter-spacing: 1px; font-size: 11px; }
.detail-price { display: flex; align-items: baseline; gap: 9px; margin: 9px 0 12px; }.detail-price strong { color: #6d4a32; font-size: 18px; }.detail-price span { color: #aaa19b; font-size: 10px; text-decoration: line-through; }
.detail-description { margin: 0 0 13px; color: #756d67; line-height: 1.55; font-size: 10px; }.detail-option { margin: 12px 0; }.detail-option-label { display: flex; gap: 8px; margin-bottom: 6px; color: #5b514b; font-size: 9px; }.detail-option-label span { color: #9a6b45; }
.detail-size-pills { display: flex; gap: 6px; }.detail-size-pills button { padding: 5px 11px; border: 1px solid #ded5cd; border-radius: 6px; background: #fff; color: #756d67; font-size: 8px; cursor: pointer; }.detail-size-pills button.selected { border-color: #5c3d24; background: #5c3d24; color: #fff; }
.detail-purchase { display: grid; grid-template-columns: 82px 1fr 82px 32px; gap: 6px; align-items: center; margin-top: 14px; }.detail-quantity { display: flex; align-items: center; justify-content: space-between; height: 35px; border: 1px solid #ded5cd; border-radius: 6px; background: #fff; }.detail-quantity button { width: 25px; height: 100%; border: 0; background: transparent; color: #5c3d24; cursor: pointer; }.detail-quantity button:disabled { opacity: .35; }.detail-quantity span { font-size: 10px; font-weight: 700; }
.detail-primary,.detail-buy-now { height: 35px; border-radius: 6px; font-size: 9px; font-weight: 800; cursor: pointer; }.detail-primary { border: 1px solid #5c3d24; background: #5c3d24; color: #fff; }.detail-buy-now { border: 1px solid #c48b5b; background: #c48b5b; color: #fff; }.detail-primary:disabled,.detail-buy-now:disabled { opacity: .45; }
.detail-heart { width: 32px; height: 35px; border: 1px solid #ded5cd; border-radius: 6px; background: #fff; color: #6d4a32; font-size: 18px; cursor: pointer; }.detail-heart.saved { background: #f2e7dc; }
.detail-meta { display: grid; gap: 5px; margin-top: 13px; padding-top: 10px; border-top: 1px solid #eee7e1; color: #857b74; font-size: 8px; }.detail-meta b { color: #4d433d; }.detail-share { display: flex; align-items: center; gap: 5px; }.detail-share button { width: 17px; height: 17px; border: 0; border-radius: 50%; background: #eee7e1; color: #5c3d24; font-size: 8px; cursor: pointer; }
.detail-review-section { max-width: 1080px; margin: 55px auto 0; }.detail-tabs { display: flex; justify-content: center; gap: 30px; border-bottom: 1px solid #eee7e1; }.detail-tabs button { padding: 0 0 11px; border: 0; border-bottom: 2px solid transparent; background: transparent; color: #9b928b; font-size: 10px; font-weight: 700; cursor: pointer; }.detail-tabs button.active { border-color: #c48b5b; color: #4d433d; }
.detail-tab-content { min-height: 90px; padding: 18px 8px; color: #746b65; font-size: 10px; line-height: 1.7; }.detail-info-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }.detail-info-grid div { display: grid; gap: 4px; padding: 10px; background: #fbf8f4; border-radius: 6px; }.detail-info-grid span { color: #9a9089; font-size: 8px; }.detail-info-grid strong { color: #4d433d; font-size: 9px; }
.detail-reviews-content { padding-top: 18px; }
.detail-notice { max-width: 1080px; margin: 15px auto 0; padding: 10px 13px; border-radius: 7px; background: #f3e7d9; color: #6d4a32; font-size: 9px; }
.review-form { margin: 0 0 25px; box-shadow: 0 10px 28px rgba(75, 49, 31, .05); padding: 15px; border: 1px solid #e7ded6; border-radius: 9px; background: #fbf8f4; }
.review-form-heading { display: flex; justify-content: space-between; gap: 15px; align-items: center; margin-bottom: 10px; }
.review-form-heading div:first-child { display: grid; gap: 3px; }
.review-form-heading strong { color: #4d433d; font-size: 11px; }.review-form-heading small { color: #9b928b; font-size: 8px; }
.review-form-stars { display: flex; gap: 3px; }.review-form-stars button { border: 0; background: transparent; color: #bdb5ae; cursor: pointer; font-size: 10px; }.review-form-stars button.selected { color: #e2b21b; }
.review-form textarea { width: 100%; box-sizing: border-box; resize: vertical; min-height: 65px; border: 1px solid #e1d8d0; border-radius: 6px; padding: 9px; outline: none; background: #fff; color: #4d433d; font-size: 9px; }.review-form textarea:focus { border-color: #c48b5b; }
.review-form-footer { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: 8px; }.review-form-footer span { color: #8a603f; font-size: 8px; }.review-form-footer button { border: 0; border-radius: 5px; padding: 7px 11px; background: #5c3d24; color: #fff; font-size: 8px; font-weight: 700; cursor: pointer; }.review-form-footer button:disabled { opacity: .45; cursor: not-allowed; }
.review-overview { display: grid; grid-template-columns: 180px 1fr; gap: 50px; align-items: center; max-width: 700px; margin: 0 auto 35px; padding-bottom: 25px; border-bottom: 1px solid #eee7e1; }.review-score { display: grid; justify-items: center; gap: 3px; }.review-score strong { color: #4d433d; font-size: 24px; }.review-score span:not(.detail-stars) { color: #999089; font-size: 8px; }.review-score small { color: #999089; font-size: 7px; }.review-bars { display: grid; gap: 5px; }.review-bar-row { display: grid; grid-template-columns: 45px 1fr 25px; gap: 6px; align-items: center; color: #817870; font-size: 8px; }.review-bar-row > div { height: 3px; background: #ece8e3; overflow: hidden; }.review-bar-row i { display: block; height: 100%; background: #e6b51e; }.review-bar-row small { color: #a09790; text-align: right; font-size: 7px; }
.review-list-heading { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }.review-list-heading div { display: grid; gap: 3px; }.review-list-heading strong { color: #4d433d; font-size: 11px; }.review-list-heading small { color: #9b928b; font-size: 7px; }.review-list-heading label { color: #8e857e; font-size: 8px; }.review-list-heading select { margin-left: 5px; border: 1px solid #e1d9d2; border-radius: 12px; padding: 5px 8px; background: #fff; color: #5c514a; font-size: 8px; }
.review-list { display: grid; gap: 0; margin: 0; padding: 0; list-style: none; }.related-products-section {
  margin-top: 58px;
  padding-top: 35px;
  border-top: 1px solid #eee7e1;
}

.related-products-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 22px;
}

.related-eyebrow {
  display: block;
  margin-bottom: 5px;
  color: #a36f48;
  font-size: 7px;
  font-weight: 800;
  letter-spacing: 1.4px;
}

.related-products-heading h2 {
  margin: 0;
  color: #403833;
  font: 600 22px Georgia, serif;
}

.related-products-heading p {
  margin: 5px 0 0;
  color: #918983;
  font-size: 9px;
}

.related-view-all {
  flex: 0 0 auto;
  border: 1px solid #d8c6b7;
  border-radius: 5px;
  padding: 8px 13px;
  background: #fff;
  color: #5c3d24;
  font-size: 8px;
  font-weight: 700;
  cursor: pointer;
}

.related-view-all:hover {
  background: #5c3d24;
  color: #fff;
}

.related-products-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

.related-product-card {
  min-width: 0;
  transition: transform .25s ease;
}
.related-product-card:hover { transform: translateY(-4px); }

.related-product-image-wrap {
  position: relative;
  height: 190px;
  overflow: hidden;
  border-radius: 11px;
  background: #f1e8dc;
}

.related-product-image-button {
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  background: #f1e8dc;
  cursor: pointer;
}

.related-product-image-button img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .3s ease;
}

.related-product-image-button:hover img {
  transform: scale(1.04);
}

.related-discount {
  position: absolute;
  top: 9px;
  left: 9px;
  padding: 5px 8px;
  border-radius: 15px;
  background: #5c3d24;
  color: #fff;
  font-size: 8px;
  font-weight: 700;
}

.related-quick-add {
  position: absolute;
  top: 9px;
  right: 9px;
  display: grid;
  place-items: center;
  width: 29px;
  height: 29px;
  border: 0;
  border-radius: 50%;
  background: rgba(255,255,255,.95);
  color: #5c3d24;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,.09);
}

.related-quick-add:hover {
  background: #5c3d24;
  color: #fff;
}

.related-quick-add:disabled {
  opacity: .45;
  cursor: not-allowed;
}

.related-product-copy {
  padding: 9px 1px 0;
}

.related-product-meta {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  color: #918983;
  font-size: 8px;
}

.related-product-meta span:last-child {
  color: #4d4743;
}

.related-product-meta svg {
  color: #e3b421;
  margin-right: 2px;
}

.related-product-copy h3 {
  margin: 5px 0 3px;
}

.related-product-copy h3 button {
  padding: 0;
  border: 0;
  background: transparent;
  color: #393531;
  font-size: 11px;
  font-weight: 700;
  text-align: left;
  cursor: pointer;
}

.related-product-copy > p {
  margin: 0 0 6px;
  overflow: hidden;
  color: #9b938d;
  font-size: 8px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.related-product-price {
  display: flex;
  align-items: baseline;
  gap: 7px;
}

.related-product-price strong {
  color: #8a603f;
  font-size: 12px;
}

.related-product-price span {
  color: #aaa39d;
  font-size: 8px;
  text-decoration: line-through;
}

.related-add-button {
  width: 100%;
  margin-top: 8px;
  border: 1px solid #d9c8bb;
  border-radius: 5px;
  padding: 7px 8px;
  background: #fff;
  color: #5c3d24;
  font-size: 8px;
  font-weight: 700;
  cursor: pointer;
}

.related-add-button:hover,
.related-add-button.selected {
  border-color: #5c3d24;
  background: #5c3d24;
  color: #fff;
}

.related-add-button:disabled {
  cursor: not-allowed;
  opacity: .45;
}

.review-card { padding: 15px 0; border-bottom: 1px solid #eee7e1; }.review-author { display: flex; align-items: center; gap: 7px; }.review-avatar { display: grid; place-items: center; width: 25px; height: 25px; border-radius: 50%; background: #eadfd5; color: #5c3d24; font-size: 7px; font-weight: 800; }.review-author > div { display: grid; gap: 2px; }.review-author strong { color: #4d433d; font-size: 8px; }.review-verified { color: #9a9089; font-size: 7px; }.review-author time { margin-left: auto; color: #9a9089; font-size: 7px; }.review-card > .detail-stars { margin: 5px 0; }.review-title { display: block; color: #554a43; font-size: 9px; }.review-card > p { margin: 4px 0 0; color: #817870; font-size: 8px; line-height: 1.6; }.supplier-reply { margin-top: 8px; padding: 7px 9px; border-left: 2px solid #c48b5b; background: #fbf7f2; }.supplier-reply strong { color: #8b6345; font-size: 7px; text-transform: uppercase; }.supplier-reply p { margin: 3px 0 0; color: #776f69; font-size: 8px; }
@media (max-width: 1050px) {
  .shop-nav { gap: 20px; }
  .product-search { width: 190px; min-width: 150px; }
  .shop-links { gap: 16px; }
  .shop-layout { grid-template-columns: 170px minmax(0, 1fr); gap: 25px; }
  .product-grid { gap: 18px 12px; }
  .product-visual { height: 185px; }
}

@media (max-width: 800px) {
  .shop-toolbar-top { flex-wrap: wrap; }
  .product-search { order: 3; width: 100%; min-width: 0; }
  .view-toggle { margin-left: auto; }
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
  .detail-layout { grid-template-columns: 1fr; gap: 28px; }
  .detail-image-wrap { height: 70vw; max-height: 470px; }
  .detail-review-section { margin-top: 38px; }
  .review-overview { grid-template-columns: 1fr; gap: 20px; max-width: 560px; }
  .related-products-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
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
  .detail-image-wrap { height: 82vw; max-height: 360px; }
  .detail-copy h1 { font-size: 22px; }
  .detail-purchase { grid-template-columns: 1fr 1fr 1fr 32px; }
  .detail-primary, .detail-buy-now { font-size: 8px; padding: 0 5px; }
  .detail-size-pills { flex-wrap: wrap; }
  .detail-thumb-row { overflow-x: auto; padding-bottom: 3px; }
  .review-form-heading { align-items: flex-start; flex-direction: column; }
  .review-form-footer { align-items: flex-start; flex-direction: column; }
  .review-form-footer button { width: 100%; }
  .detail-tabs { gap: 18px; overflow-x: auto; justify-content: flex-start; }
  .detail-tabs button { white-space: nowrap; }
  .detail-info-grid { grid-template-columns: 1fr 1fr; }
  .review-list-heading { align-items: flex-start; gap: 10px; flex-direction: column; }
  .review-author time { display: none; }
  .related-products-heading { align-items: flex-start; flex-direction: column; }
  .related-products-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px 10px; }
  .related-product-image-wrap { height: 150px; }
}

/* Shared small-business visual system */
:global(body) { margin: 0; background: #f7f5f2; }
:global(*) { box-sizing: border-box; }
.shop-page { min-height: 100vh; background: #f7f5f2; color: #2f211d; }
.shop-hero { background: #ead9cf; color: #553c35; }
.shop-hero h1 { font-family: Georgia, "Times New Roman", serif; color: #553c35; }
.shop-hero p { color: #6b5147; }
.shop-hero .hero-rule { background: #e79b63; }
.shop-main { width: min(1280px, 94%); margin: 0 auto; }
.beauty-product-card, .filter-sidebar { border-color: #e6ddd7; box-shadow: 0 8px 24px rgba(62,43,29,.05); }
@media (max-width: 760px) { .shop-main { width: calc(100% - 24px); } }

.bulk-discount-box,.detail-bulk-discounts{margin-top:10px;padding:10px 12px;border:1px solid rgba(120,78,45,.18);border-radius:12px;background:#faf4ec;display:flex;flex-wrap:wrap;gap:7px;align-items:center}.bulk-discount-box strong{width:100%;font-size:.78rem;color:#5b3824}.bulk-discount-box span{font-size:.72rem;padding:4px 7px;border-radius:999px;background:#fff;color:#6b4730}.detail-bulk-discounts{display:block;margin:16px 0}.bulk-heading{display:flex;justify-content:space-between;gap:12px;margin-bottom:9px}.bulk-heading span{font-size:.78rem;color:#806654}.bulk-tier{display:flex;justify-content:space-between;padding:8px 10px;border-top:1px solid rgba(120,78,45,.1);font-size:.84rem}.bulk-tier.active{font-weight:700;background:#efe1d2;border-radius:8px}.detail-price small{display:block;color:#7a4b2a;font-size:.78rem;margin-top:4px}</style>

<style scoped>
/* Shared sticky navbar supplies navigation on this page. */
.shop-page { --sb-brown: #5c3d24; --sb-brown-dark: #4e342e; --sb-accent: #c48b5b; }
</style>
