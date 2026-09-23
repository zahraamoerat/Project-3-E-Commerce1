<template>
  <div class="suppliers-page">
    <SmallBusinessNavbar />

    <main class="suppliers-shell">
      <section class="suppliers-hero">
        <div>
          <span class="eyebrow">WECONNECT SUPPLIER DIRECTORY</span>
          <h1>View Suppliers</h1>
          <p>Find verified suppliers, compare delivery times, and discover businesses that can support your next order.</p>
        </div>
        <div class="hero-stat">
          <strong>{{ filteredSuppliers.length }}</strong>
          <span>suppliers shown</span>
        </div>
      </section>

      <section class="toolbar" aria-label="Supplier filters">
        <label class="search-box">
          <span aria-hidden="true">⌕</span>
          <input v-model.trim="search" type="search" placeholder="Search suppliers, cities or provinces..." />
        </label>

        <select v-model="verificationFilter" aria-label="Verification filter">
          <option value="all">All suppliers</option>
          <option value="verified">Verified only</option>
          <option value="featured">Featured only</option>
          <option value="quick">Quick delivery</option>
        </select>

        <select v-model="provinceFilter" aria-label="Province filter">
          <option value="all">All provinces</option>
          <option v-for="province in provinces" :key="province" :value="province">{{ province }}</option>
        </select>

        <button v-if="hasFilters" type="button" class="clear-button" @click="clearFilters">Clear filters</button>
      </section>

      <div v-if="loading" class="state-card">
        <div v-for="n in 6" :key="n" class="skeleton-card">
          <div class="skeleton-logo"></div>
          <div class="skeleton-line wide"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line short"></div>
        </div>
      </div>

      <div v-else-if="error" class="state-card error-card">
        <strong>We couldn't load the suppliers.</strong>
        <p>{{ error }}</p>
        <button type="button" class="primary-button" @click="loadSuppliers">Try again</button>
      </div>

      <section v-else-if="filteredSuppliers.length" class="supplier-grid" aria-live="polite">
        <article v-for="supplier in filteredSuppliers" :key="supplier.supplierId" class="supplier-card">
          <div class="card-top">
            <div class="supplier-logo" :class="{ image: supplier.logoUrl }">
              <img v-if="supplier.logoUrl" :src="resolveImageUrl(supplier.logoUrl)" :alt="supplier.businessName + ' logo'" @error="supplier.logoUrl = ''" />
              <span v-else>{{ initials(supplier.businessName) }}</span>
            </div>
            <div class="badges">
              <span v-if="supplier.isVerified" class="badge verified">Verified</span>
              <span v-if="supplier.isFeatured" class="badge featured">Featured</span>
              <span v-if="supplier.quickDelivery" class="badge quick">Quick delivery</span>
            </div>
          </div>

          <div class="supplier-heading">
            <div>
              <h2>{{ supplier.businessName }}</h2>
              <p>{{ supplier.city || 'South Africa' }}<span v-if="supplier.province">, {{ supplier.province }}</span></p>
            </div>
          </div>

          <p v-if="supplier.description" class="description">{{ supplier.description }}</p>
          <p v-else class="description muted">Supplier available through the WeConnect marketplace.</p>

          <div class="supplier-details">
            <div><span>Minimum order</span><strong>{{ formatCurrency(supplier.minOrderValue) }}</strong></div>
            <div><span>Lead time</span><strong>{{ leadTime(supplier.leadTimeDays) }}</strong></div>
            <div><span>Products</span><strong>{{ supplier.productCount }}</strong></div>
          </div>

          <div class="card-footer">
            <span class="contact">{{ supplier.phone || supplier.email || 'Contact available in profile' }}</span>
            <button type="button" class="view-button" @click="viewProducts(supplier.supplierId)">View products</button>
          </div>
        </article>
      </section>

      <section v-else class="state-card empty-card">
        <div class="empty-icon">⌕</div>
        <h2>No suppliers found</h2>
        <p>Try a different search or remove one of the filters.</p>
        <button type="button" class="primary-button" @click="clearFilters">Reset filters</button>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import SmallBusinessNavbar from '@/components/SmallBusinessNavbar.vue'
import { api, apiBaseUrl } from '@/services/api'

const router = useRouter()
const suppliers = ref([])
const search = ref('')
const verificationFilter = ref('all')
const provinceFilter = ref('all')
const loading = ref(true)
const error = ref('')

const provinces = computed(() => [...new Set(
  suppliers.value.map((supplier) => supplier.province).filter(Boolean)
)].sort())

const filteredSuppliers = computed(() => {
  const query = search.value.toLowerCase()
  return suppliers.value.filter((supplier) => {
    const matchesSearch = !query || [
      supplier.businessName,
      supplier.city,
      supplier.province,
      supplier.description
    ].filter(Boolean).join(' ').toLowerCase().includes(query)

    const matchesType =
      verificationFilter.value === 'all' ||
      (verificationFilter.value === 'verified' && supplier.isVerified) ||
      (verificationFilter.value === 'featured' && supplier.isFeatured) ||
      (verificationFilter.value === 'quick' && supplier.quickDelivery)

    const matchesProvince =
      provinceFilter.value === 'all' || supplier.province === provinceFilter.value

    return matchesSearch && matchesType && matchesProvince
  })
})

const hasFilters = computed(() =>
  Boolean(search.value || verificationFilter.value !== 'all' || provinceFilter.value !== 'all')
)

async function loadSuppliers() {
  loading.value = true
  error.value = ''
  try {
    suppliers.value = await api.getSuppliers()
  } catch (err) {
    error.value = err?.message || 'Please check that the WeConnect backend is running.'
  } finally {
    loading.value = false
  }
}

function clearFilters() {
  search.value = ''
  verificationFilter.value = 'all'
  provinceFilter.value = 'all'
}

function viewProducts(supplierId) {
  router.push({ path: '/small-business/products', query: { supplier: String(supplierId) } })
}

function initials(name) {
  return String(name || 'Supplier')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 0
  }).format(Number(value) || 0)
}

function leadTime(days) {
  const value = Number(days) || 1
  return value === 1 ? '1 day' : `1–${value} days`
}

function resolveImageUrl(url) {
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url
  return `${apiBaseUrl.replace(/\/api\/?$/, '')}${url.startsWith('/') ? url : `/${url}`}`
}

onMounted(loadSuppliers)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');

.suppliers-page {
  min-height: 100vh;
  background: #f7f1eb;
  color: #3f2d27;
  font-family: 'DM Sans', sans-serif;
}

.suppliers-shell {
  width: min(1240px, 92%);
  margin: 0 auto;
  padding: 42px 0 64px;
}

.suppliers-hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 28px;
  margin-bottom: 28px;
}

.eyebrow {
  color: #a36b4e;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 2px;
}

h1, h2, p { margin-top: 0; }
h1 {
  margin: 8px 0 10px;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(34px, 5vw, 52px);
  line-height: 1;
  color: #4d352d;
}
.suppliers-hero p {
  max-width: 680px;
  margin-bottom: 0;
  color: #806c62;
  line-height: 1.7;
  font-size: 14px;
}

.hero-stat {
  min-width: 150px;
  padding: 18px 22px;
  border: 1px solid #e6d9d0;
  border-radius: 16px;
  background: #fffdfb;
  text-align: center;
}
.hero-stat strong {
  display: block;
  color: #553c35;
  font-size: 28px;
}
.hero-stat span {
  color: #8c776d;
  font-size: 11px;
}

.toolbar {
  display: grid;
  grid-template-columns: minmax(240px, 1fr) 190px 190px auto;
  gap: 10px;
  margin-bottom: 26px;
}
.search-box, .toolbar select {
  min-height: 46px;
  border: 1px solid #dfd0c7;
  border-radius: 10px;
  background: #fffdfb;
}
.search-box {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0 14px;
}
.search-box span { color: #9b7b69; font-size: 21px; }
.search-box input {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: #3f2d27;
  font: inherit;
  font-size: 12px;
}
.toolbar select {
  padding: 0 12px;
  color: #5d463c;
  font: inherit;
  font-size: 12px;
}
.clear-button {
  border: 0;
  background: transparent;
  color: #9b654a;
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  font-weight: 700;
}

.supplier-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}
.supplier-card {
  min-width: 0;
  padding: 22px;
  border: 1px solid #e5d8cf;
  border-radius: 18px;
  background: #fffdfb;
  box-shadow: 0 10px 26px rgba(76, 49, 39, .06);
}
.card-top, .card-footer, .supplier-details {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.card-top { align-items: flex-start; gap: 12px; }
.supplier-logo {
  width: 58px;
  height: 58px;
  flex: 0 0 58px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: #ead8cb;
  color: #65483b;
  font-weight: 800;
  font-size: 16px;
  overflow: hidden;
}
.supplier-logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.badges {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 5px;
}
.badge {
  padding: 5px 8px;
  border-radius: 999px;
  font-size: 9px;
  font-weight: 800;
}
.verified { background: #e7f1e8; color: #3d6c48; }
.featured { background: #f8eadc; color: #98603e; }
.quick { background: #f1e6e1; color: #765047; }

.supplier-heading { margin: 20px 0 8px; }
.supplier-heading h2 {
  margin-bottom: 4px;
  color: #4d352d;
  font-size: 18px;
}
.supplier-heading p, .description {
  margin-bottom: 0;
  color: #88756c;
  font-size: 11px;
}
.description {
  min-height: 36px;
  line-height: 1.55;
}
.muted { color: #a29188; }

.supplier-details {
  align-items: stretch;
  gap: 8px;
  margin: 20px 0;
  padding: 13px 0;
  border-top: 1px solid #eee4de;
  border-bottom: 1px solid #eee4de;
}
.supplier-details div { flex: 1; }
.supplier-details span {
  display: block;
  margin-bottom: 4px;
  color: #9a867c;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: .6px;
}
.supplier-details strong { color: #5b4036; font-size: 12px; }
.card-footer { gap: 10px; }
.contact {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #927d73;
  font-size: 9px;
}
.view-button, .primary-button {
  border: 0;
  border-radius: 8px;
  background: #553c35;
  color: #fff;
  cursor: pointer;
  font: inherit;
  font-size: 10px;
  font-weight: 700;
}
.view-button { padding: 10px 13px; white-space: nowrap; }
.primary-button { padding: 11px 17px; }

.state-card {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}
.skeleton-card, .error-card, .empty-card {
  border: 1px solid #e5d8cf;
  border-radius: 18px;
  background: #fffdfb;
}
.skeleton-card { padding: 22px; }
.skeleton-logo, .skeleton-line {
  border-radius: 8px;
  background: #eadfd8;
  animation: pulse 1.3s ease-in-out infinite;
}
.skeleton-logo { width: 58px; height: 58px; margin-bottom: 20px; }
.skeleton-line { height: 11px; width: 70%; margin: 10px 0; }
.skeleton-line.wide { width: 90%; }
.skeleton-line.short { width: 45%; }
.error-card, .empty-card {
  grid-column: 1 / -1;
  padding: 48px 24px;
  text-align: center;
}
.error-card p, .empty-card p { color: #88756c; font-size: 12px; }
.empty-icon {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  margin: 0 auto 14px;
  border-radius: 50%;
  background: #ead8cb;
  color: #65483b;
  font-size: 22px;
}
.empty-card h2 { color: #4d352d; font-size: 22px; }

@keyframes pulse { 50% { opacity: .45; } }

@media (max-width: 980px) {
  .supplier-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .toolbar { grid-template-columns: 1fr 1fr; }
  .clear-button { justify-self: start; }
}
@media (max-width: 650px) {
  .suppliers-shell { padding-top: 28px; }
  .suppliers-hero { align-items: flex-start; flex-direction: column; }
  .hero-stat { width: 100%; box-sizing: border-box; }
  .toolbar, .supplier-grid, .state-card { grid-template-columns: 1fr; }
  .toolbar select { width: 100%; }
  .supplier-card { padding: 18px; }
}
</style>
