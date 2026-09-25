<template>
  <div class="small-business-home">
    <SmallBusinessNavbar />

    <main>
      <section class="hero">
        <div class="hero-copy">
          <span class="eyebrow">WE CONNECT • SMALL BUSINESS MARKETPLACE</span>
          <h1>Everything your business needs, <em>in one place.</em></h1>
          <p>Discover quality products from trusted suppliers, shop by category, and unlock better value when you buy in bulk.</p>
          <div class="hero-actions">
            <button class="primary-btn" type="button" @click="router.push('/small-business/products')">Shop products <span>→</span></button>
            <button class="ghost-btn" type="button" @click="scrollTo('categories')">Explore categories</button>
          </div>
        </div>
        <div class="hero-visual">
          <img :src="slides[activeSlide].image" :alt="slides[activeSlide].title" />
          <div class="slide-card">
            <span>{{ slides[activeSlide].tag }}</span>
            <strong>{{ slides[activeSlide].title }}</strong>
            <p>{{ slides[activeSlide].text }}</p>
          </div>
          <button class="slide-arrow prev" type="button" aria-label="Previous slide" @click="previousSlide">‹</button>
          <button class="slide-arrow next" type="button" aria-label="Next slide" @click="nextSlide">›</button>
          <div class="dots"><button v-for="(_, i) in slides" :key="i" type="button" :class="{active:i===activeSlide}" @click="goToSlide(i)" :aria-label="'Slide '+(i+1)"></button></div>
        </div>
      </section>

      <section id="categories" class="section">
        <div class="section-heading"><div><span class="eyebrow">SHOP YOUR WAY</span><h2>Browse by category</h2></div><button class="text-btn" type="button" @click="router.push('/small-business/products')">View all products →</button></div>
        <div class="category-grid">
          <button v-for="category in categoryCards" :key="category.name" type="button" class="category-card" @click="openCategory(category.name)">
            <img :src="category.image" :alt="category.name" loading="lazy" />
            <span class="category-overlay"><strong>{{ category.name }}</strong><small>{{ category.description }}</small></span>
          </button>
        </div>
      </section>

      <section class="promo-strip">
        <div><span class="eyebrow">BUY MORE. SAVE MORE.</span><h2>Bulk discounts built for growing businesses.</h2><p>Look for products with bulk tiers and save as your order quantity increases.</p></div>
        <button type="button" class="light-btn" @click="router.push('/small-business/products')">Shop bulk deals →</button>
      </section>

      <section class="section products-section">
        <div class="section-heading"><div><span class="eyebrow">POPULAR RIGHT NOW</span><h2>Featured products</h2></div><button class="text-btn" type="button" @click="router.push('/small-business/products')">Shop the catalogue →</button></div>
        <div v-if="loading" class="product-grid"><div v-for="n in 4" :key="n" class="skeleton"></div></div>
        <div v-else-if="featuredProducts.length" class="product-grid">
          <article v-for="product in featuredProducts" :key="product.id" class="product-card" @click="router.push('/small-business/products/'+product.id)">
            <div class="product-image"><img :src="resolveImageUrl(product.image)" :alt="product.title" loading="lazy" @error="imageFallback" /><span v-if="product.discountTiers?.length" class="badge">Bulk savings</span></div>
            <div class="product-info"><span>{{ product.category }}</span><h3>{{ product.title }}</h3><strong>R {{ formatPrice(product.price) }}</strong><small v-if="product.discountTiers?.length">From {{ product.discountTiers[0].minimum_quantity }}+ units • {{ product.discountTiers[0].discount_percent }}% off</small></div>
          </article>
        </div>
        <div v-else class="empty">Products will appear here as suppliers publish their catalogue.</div>
      </section>

      <section class="feature-section">
        <div class="feature-image"><img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=85" alt="Business owner preparing an order" loading="lazy" /></div>
        <div class="feature-copy"><span class="eyebrow">MADE FOR SMALL BUSINESS</span><h2>Simple shopping. Smarter buying.</h2><div class="feature-list"><div><b>01</b><p><strong>Trusted suppliers</strong><span>Discover products from suppliers on the WeConnect marketplace.</span></p></div><div><b>02</b><p><strong>Bulk value</strong><span>See discount tiers before you buy and watch your unit price change with quantity.</span></p></div><div><b>03</b><p><strong>Easy ordering</strong><span>Build your cart quickly and keep your business moving.</span></p></div></div><button class="primary-btn" type="button" @click="router.push('/small-business/products')">Start shopping →</button></div>
      </section>

      <section class="trust-row">
        <div><strong>Curated marketplace</strong><span>Products for everyday business needs</span></div>
        <div><strong>Bulk-friendly pricing</strong><span>Save more as your quantities grow</span></div>
        <div><strong>Built for business</strong><span>Simple tools from browse to order</span></div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import SmallBusinessNavbar from '../components/SmallBusinessNavbar.vue'
import { resolveImageUrl } from '@/services/api'

const apiUrl = import.meta.env.VITE_API_URL || '/api'
const router = useRouter()
const products = ref([])
const loading = ref(true)
const activeSlide = ref(0)
let timer

const slides = [
  { tag:'DISCOVER MORE', title:'Stock your business beautifully.', text:'Find everyday essentials, fresh products and supplier deals in one marketplace.', image:'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1400&q=85' },
  { tag:'BULK SAVINGS', title:'The more you buy, the more you save.', text:'Shop products with quantity-based discounts designed for growing businesses.', image:'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1400&q=85' },
  { tag:'SUPPLIER MARKETPLACE', title:'Bring better products to your shelves.', text:'Browse a growing catalogue from suppliers ready to serve your business.', image:'https://images.unsplash.com/photo-1601598851547-4302969d0d4f?auto=format&fit=crop&w=1400&q=85' }
]
const categoryCards = [
  { name:'Groceries', description:'Everyday essentials', image:'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80' },
  { name:'Beauty & Care', description:'Products customers love', image:'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80' },
  { name:'Home & Living', description:'Useful business essentials', image:'https://images.unsplash.com/photo-1556912167-f556f1f39fdf?auto=format&fit=crop&w=900&q=80' },
  { name:'Office & Stationery', description:'Keep work moving', image:'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&w=900&q=80' }
]
const featuredProducts = computed(() => [...products.value].sort((a,b) => (b.rating||0)-(a.rating||0)).slice(0,4))

function formatPrice(v){ return Number(v||0).toFixed(2) }
function normalize(p){
  const image = p.image || p.image_url || p.product_image || 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=900&q=80'
  return { ...p, id:p.id ?? p.product_id, title:p.title ?? p.product_name ?? 'Product', category:p.category ?? p.category_name ?? 'General', price:Number(p.price||0), rating:Number(p.rating ?? p.averageRating ?? 0), image, discountTiers:Array.isArray(p.discountTiers)?p.discountTiers:[] }
}
function imageFallback(e){ e.target.src='https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=900&q=80' }
function nextSlide(){ activeSlide.value=(activeSlide.value+1)%slides.length }
function previousSlide(){ activeSlide.value=(activeSlide.value-1+slides.length)%slides.length }
function goToSlide(i){ activeSlide.value=i }
function scrollTo(id){ document.getElementById(id)?.scrollIntoView({behavior:'smooth'}) }
function openCategory(name){ router.push({path:'/small-business/products',query:{category:name}}) }
async function loadProducts(){
  try {
    const response=await fetch(apiUrl+'/products?catalog=active&_='+Date.now(),{cache:'no-store',headers:{Authorization:'Bearer '+(localStorage.getItem('weconnect_token')||'')}})
    if(!response.ok) throw new Error()
    products.value=(await response.json()).map(normalize)
  } catch { products.value=[] } finally { loading.value=false }
}
onMounted(()=>{ loadProducts(); timer=window.setInterval(nextSlide,5500) })
onBeforeUnmount(()=>clearInterval(timer))
</script>

<style scoped>
:global(*){box-sizing:border-box}:global(body){margin:0;font-family:var(--sb-font-body)}
.small-business-home{min-height:100vh;background:var(--sb-bg);color:var(--sb-ink)}
.hero{min-height:620px;display:grid;grid-template-columns:1fr 1.05fr;gap:50px;align-items:center;padding:55px max(6vw,28px);background:linear-gradient(135deg,#f8efe5,#fffaf5)}
.hero-copy{max-width:620px}.eyebrow{display:inline-block;letter-spacing:2px;font-size:11px;font-weight:800;color:var(--sb-accent);margin-bottom:14px}.hero h1{font:600 clamp(42px,5vw,76px)/1.02 Georgia,serif;margin:0;color:var(--sb-ink)}.hero h1 em{color:var(--sb-accent);font-style:italic}.hero p{font-size:17px;line-height:1.7;color:var(--sb-muted);max-width:560px;margin:24px 0}.hero-actions{display:flex;gap:12px;flex-wrap:wrap}.primary-btn,.ghost-btn,.light-btn,.text-btn{border:0;cursor:pointer;font-weight:800}.primary-btn{background:var(--sb-brown);color:#fff;padding:14px 22px;border-radius:999px}.ghost-btn{background:transparent;border:1px solid var(--sb-border);padding:13px 21px;border-radius:999px;color:var(--sb-brown)}.hero-visual{height:500px;position:relative;overflow:hidden;border-radius:28px;box-shadow:0 25px 60px #68483224}.hero-visual>img{width:100%;height:100%;object-fit:cover}.slide-card{position:absolute;left:24px;bottom:24px;max-width:350px;padding:18px 20px;border-radius:18px;background:#fffdf9e8;backdrop-filter:blur(10px)}.slide-card span{font-size:9px;font-weight:800;letter-spacing:1.5px;color:var(--sb-accent)}.slide-card strong{display:block;font:600 25px Georgia,serif;margin:5px 0;color:var(--sb-ink)}.slide-card p{font-size:12px;line-height:1.5;margin:0;color:#76665b}.slide-arrow{position:absolute;top:50%;border:0;width:40px;height:40px;border-radius:50%;background:#fff;color:var(--sb-brown);font-size:28px;cursor:pointer}.slide-arrow.prev{left:18px}.slide-arrow.next{right:18px}.dots{position:absolute;right:24px;bottom:25px;display:flex;gap:6px}.dots button{width:8px;height:8px;border:0;border-radius:50%;background:#fff8}.dots button.active{background:#fff;width:22px;border-radius:10px}
.section{padding:90px max(6vw,28px)}.section-heading{display:flex;justify-content:space-between;align-items:end;gap:20px;margin-bottom:30px}.section-heading h2,.feature-copy h2,.promo-strip h2{font:600 clamp(32px,4vw,48px) Georgia,serif;margin:0;color:var(--sb-ink)}.text-btn{background:none;color:var(--sb-accent)}.category-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}.category-card{position:relative;height:300px;padding:0;border:0;overflow:hidden;border-radius:18px;cursor:pointer;background:#ddd}.category-card img{width:100%;height:100%;object-fit:cover;transition:transform .4s}.category-card:hover img{transform:scale(1.06)}.category-overlay{position:absolute;inset:auto 0 0;padding:60px 20px 20px;text-align:left;color:#fff;background:linear-gradient(transparent,#38271fcc)}.category-overlay strong{display:block;font:600 25px Georgia,serif}.category-overlay small{opacity:.85}
.promo-strip{margin:0 max(6vw,28px) 20px;padding:42px 48px;border-radius:24px;background:var(--sb-brown);color:#fff;display:flex;justify-content:space-between;align-items:center;gap:30px}.promo-strip h2{color:#fff;max-width:700px}.promo-strip p{color:#eaded4}.light-btn{background:var(--sb-brown-soft);color:var(--sb-brown);padding:14px 22px;border-radius:999px;white-space:nowrap}
.products-section{background:var(--sb-surface)}.product-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}.product-card{background:var(--sb-surface);border:1px solid var(--sb-border);border-radius:18px;overflow:hidden;cursor:pointer;transition:transform .2s,box-shadow .2s}.product-card:hover{transform:translateY(-5px);box-shadow:0 16px 35px #68483214}.product-image{height:250px;position:relative;background:#f2e8df}.product-image img{width:100%;height:100%;object-fit:cover}.badge{position:absolute;top:12px;left:12px;padding:7px 10px;border-radius:999px;background:#fff;color:var(--sb-brown);font-size:10px;font-weight:800}.product-info{padding:18px}.product-info>span{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#a47b60}.product-info h3{font:600 20px Georgia,serif;margin:7px 0;color:var(--sb-ink)}.product-info strong{display:block;font-size:18px;color:var(--sb-brown)}.product-info small{display:block;margin-top:7px;color:var(--sb-muted)}.skeleton{height:350px;border-radius:18px;background:linear-gradient(90deg,#eee3da,#f9f1eb,#eee3da);animation:pulse 1.5s infinite}@keyframes pulse{50%{opacity:.6}}.empty{padding:60px;text-align:center;color:#8b7768}
.feature-section{display:grid;grid-template-columns:1fr 1fr;min-height:620px}.feature-image img{width:100%;height:100%;min-height:500px;object-fit:cover}.feature-copy{padding:80px max(6vw,40px);background:var(--sb-brown-soft)}.feature-list{margin:35px 0}.feature-list>div{display:flex;gap:18px;padding:18px 0;border-bottom:1px solid var(--sb-border)}.feature-list b{font-size:12px;color:var(--sb-accent)}.feature-list p{margin:0}.feature-list strong,.feature-list span{display:block}.feature-list span{color:var(--sb-muted);margin-top:5px;line-height:1.5}.trust-row{display:grid;grid-template-columns:repeat(3,1fr);padding:38px max(6vw,28px);gap:20px;background:var(--sb-brown-dark);color:#fff}.trust-row div{padding:8px 20px;border-right:1px solid #ffffff26}.trust-row div:last-child{border:0}.trust-row strong,.trust-row span{display:block}.trust-row span{color:#d9c8bb;font-size:12px;margin-top:5px}
@media(max-width:900px){.hero{grid-template-columns:1fr;padding-top:35px}.hero-visual{height:430px}.category-grid,.product-grid{grid-template-columns:repeat(2,1fr)}.feature-section{grid-template-columns:1fr}.promo-strip{align-items:flex-start;flex-direction:column}.trust-row{grid-template-columns:1fr}.trust-row div{border-right:0;border-bottom:1px solid #ffffff26}}
@media(max-width:560px){.hero{padding:30px 18px}.hero h1{font-size:42px}.hero-visual{height:360px}.section{padding:60px 18px}.section-heading{align-items:flex-start;flex-direction:column}.category-grid,.product-grid{grid-template-columns:1fr}.promo-strip{margin:0 18px 10px;padding:30px 24px}.feature-copy{padding:55px 24px}.slide-card{left:14px;right:14px;bottom:14px}.dots{right:18px;bottom:16px}}
</style>
