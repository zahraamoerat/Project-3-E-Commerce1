<template>
  <main class="sb-profile-page">
    <div class="profile-shell">
      <header class="profile-header">
        <button type="button" class="back-button" @click="router.push('/small-business')">← Back to Small Business</button>
        <div>
          <span class="eyebrow">SMALL BUSINESS</span>
          <h1>Business Profile</h1>
          <p>Manage your small business account, shopping activity and preferences.</p>
        </div>
      </header>

      <section class="profile-grid">
        <article class="profile-card identity-card">
          <div class="avatar">{{ initials }}</div>
          <div>
            <span class="role-badge">Small Business Buyer</span>
            <h2>{{ businessName }}</h2>
            <p>{{ email || 'Buyer account' }}</p>
            <small v-if="buyerId">Buyer ID: {{ buyerId }}</small>
          </div>
        </article>

        <article class="profile-card">
          <span class="section-kicker">ACCOUNT</span>
          <h2>Account details</h2>
          <div class="details-grid">
            <div><span>Email</span><strong>{{ email || 'Not available' }}</strong></div>
            <div><span>User ID</span><strong>{{ userId || 'Not available' }}</strong></div>
            <div><span>Buyer ID</span><strong>{{ buyerId || 'Not available' }}</strong></div>
            <div><span>Status</span><strong class="status">● Active</strong></div>
          </div>
        </article>

        <article class="profile-card">
          <span class="section-kicker">BUSINESS</span>
          <h2>Small Business tools</h2>
          <div class="quick-actions">
            <button @click="router.push('/small-business/dashboard')"><span>▦</span><div><strong>Dashboard</strong><small>Business overview</small></div><b>→</b></button>
            <button @click="router.push('/small-business/orders')"><span>▤</span><div><strong>Order history</strong><small>View and track orders</small></div><b>→</b></button>
            <button @click="router.push('/small-business/cart')"><span>🛒</span><div><strong>Shopping cart</strong><small>Review your current cart</small></div><b>→</b></button>
            <button @click="router.push('/small-business/suppliers')"><span>♧</span><div><strong>Suppliers</strong><small>Find and view suppliers</small></div><b>→</b></button>
          </div>
        </article>

        <article class="profile-card session-card">
          <span class="section-kicker">SESSION</span>
          <h2>Account actions</h2>
          <p>Your Small Business profile is separate from the supplier profile and uses the buyer session on this device.</p>
          <button class="logout-button" @click="logout">Sign out</button>
        </article>
      </section>
    </div>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = localStorage.getItem('weconnect_email') || ''
const userId = localStorage.getItem('weconnect_user_id') || ''
const buyerId = localStorage.getItem('weconnect_buyer_id') || ''

const businessName = computed(() => {
  const raw = email.split('@')[0].replace(/[._-]+/g, ' ').trim()
  return raw ? raw.replace(/\b\w/g, (letter) => letter.toUpperCase()) : 'My Small Business'
})

const initials = computed(() => {
  const parts = businessName.value.split(/\s+/).filter(Boolean)
  return (parts.slice(0, 2).map((part) => part[0]).join('') || 'SB').toUpperCase()
})

function logout() {
  ;[
    'weconnect_token',
    'weconnect_role',
    'weconnect_user_id',
    'weconnect_buyer_id',
    'weconnect_email',
  ].forEach((key) => localStorage.removeItem(key))
  router.push('/login')
}
</script>

<style scoped>
.sb-profile-page{min-height:100vh;padding:32px 20px 60px;background:#f5efe7;color:#3f2b24}
.profile-shell{width:min(1100px,100%);margin:auto}
.profile-header{display:flex;gap:22px;align-items:flex-start;margin-bottom:28px}
.back-button{border:1px solid #d9c8b9;background:#fffaf5;color:#63473a;border-radius:10px;padding:10px 14px;font-weight:700;cursor:pointer}
.back-button:hover{background:#eadbce}
.eyebrow,.section-kicker{display:block;margin-bottom:7px;color:#9a6248;font-size:11px;font-weight:800;letter-spacing:1.7px}
.profile-header h1{margin:0;font:700 clamp(30px,5vw,46px)/1.05 Georgia,serif;color:#4b3128}
.profile-header p{margin:9px 0 0;color:#806f65}
.profile-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}
.profile-card{padding:24px;border:1px solid #e4d7cc;border-radius:18px;background:#fffdf9;box-shadow:0 8px 25px rgba(83,55,40,.07)}
.identity-card{grid-column:1/-1;display:flex;align-items:center;gap:20px;background:#5a3d32;color:#fffaf5;border-color:#5a3d32}
.avatar{display:grid;place-items:center;width:82px;height:82px;flex:0 0 82px;border-radius:50%;background:#d39a73;color:#fff;font-size:27px;font-weight:800}
.role-badge{display:inline-flex;padding:5px 9px;border-radius:999px;background:rgba(255,255,255,.13);color:#f8e9df;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1px}
.identity-card h2{margin:8px 0 5px;font:700 28px Georgia,serif}
.identity-card p{margin:0;color:#eadbd1;overflow-wrap:anywhere}
.identity-card small{display:block;margin-top:10px;color:#d9c1b1}
.profile-card>h2{margin:0 0 18px;font:700 23px Georgia,serif;color:#4b3128}
.details-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:13px}
.details-grid>div{padding:15px;border-radius:12px;background:#f7f0e9}
.details-grid span{display:block;margin-bottom:5px;color:#8b776b;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.7px}
.details-grid strong{display:block;color:#51372c;font-size:14px;overflow-wrap:anywhere}
.status{color:#557a58!important}
.quick-actions{display:grid;gap:9px}
.quick-actions button{width:100%;display:grid;grid-template-columns:34px 1fr auto;align-items:center;gap:11px;padding:13px;border:1px solid #e5d8ce;border-radius:12px;background:#fffaf6;color:#52372c;text-align:left;cursor:pointer}
.quick-actions button:hover{border-color:#c58a68;background:#f8eee7}
.quick-actions button>span{display:grid;place-items:center;width:34px;height:34px;border-radius:9px;background:#ead8ca}
.quick-actions strong,.quick-actions small{display:block}.quick-actions small{margin-top:2px;color:#8a766b}.quick-actions b{color:#a06a50}
.session-card p{margin:0 0 20px;color:#806f65;line-height:1.6}
.logout-button{padding:11px 18px;border:1px solid #b75f4c;border-radius:10px;background:transparent;color:#a84f3d;font-weight:800;cursor:pointer}
.logout-button:hover{background:#a84f3d;color:#fff}
@media(max-width:760px){.sb-profile-page{padding:22px 14px 40px}.profile-header{flex-direction:column}.profile-grid{grid-template-columns:1fr}.identity-card{grid-column:auto}.details-grid{grid-template-columns:1fr}}
@media(max-width:480px){.profile-card{padding:18px}.identity-card{align-items:flex-start;flex-direction:column}.avatar{width:70px;height:70px;flex-basis:70px}}
</style>
