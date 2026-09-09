<template>
  <div class="app-layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="logo">
        <span class="icon">🔗</span>
        <div>
          <h3>WeConnect</h3>
          <small>SUPPLIER</small>
        </div>
      </div>
      <nav class="nav-menu">
        <a href="#">Dashboard</a>
        <router-link to="/" class="active">Products</router-link>
        <a href="#">Orders</a>
        <a href="#">Stock</a>
        <a href="#">Deliveries</a>
        <a href="#">Reviews</a>
        <a href="#">Business Profile</a>
      </nav>
      <div class="sidebar-footer">
        <a href="#">Log out</a>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <header class="top-header">
        <div>
          <h1>Add New Product</h1>
          <p>List a new product or wholesale bundle to make it available for custom business buying.</p>
        </div>
        <input type="text" placeholder="Search catalog structures..." class="search-input" />
      </header>

      <form @submit.prevent="handlePublish" class="form-grid">
        <!-- Left Column -->
        <div class="form-column">
          <!-- Details Card -->
          <div class="form-card">
            <h2>Product Details & Cataloging</h2>
            
            <div class="form-group">
              <label>Wholesale Product Title</label>
              <input v-model="form.title" type="text" placeholder="e.g. Sugar Cane Takeaway Bowls (750ml) - Pack of 500" required />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Product Category</label>
                <select v-model="form.category">
                  <option>Eco-friendly Packaging</option>
                  <option>Paper Goods</option>
                </select>
              </div>
              <div class="form-group">
                <label>Stock Keeping Unit (SKU)</label>
                <input v-model="form.sku" type="text" placeholder="CFP-SCB-750M" />
              </div>
            </div>

            <div class="form-group">
              <label>Detailed Description</label>
              <textarea v-model="form.description" rows="4" placeholder="Enter detailed bulk buying features..."></textarea>
            </div>
          </div>

          <!-- Pricing Card -->
          <div class="form-card">
            <h2>Pricing & Bulk Discount Tiers (ZAR)</h2>
            <div class="form-row">
              <div class="form-group">
                <label>Base Price Per Unit Pack (R)</label>
                <input v-model="form.price" type="text" placeholder="R 550.00" required />
              </div>
              <div class="form-group">
                <label>Minimum Order Quantity (MOQ)</label>
                <input v-model="form.moq" type="text" placeholder="10 packs" />
              </div>
            </div>

            <label class="section-label">Bulk Discount Tiers</label>
            <div class="tier-grid">
              <div class="tier-box">
                <div class="tier-range">10 - 49 packs</div>
                <div class="tier-desc">Base price (R 550)</div>
              </div>
              <div class="tier-box highlight">
                <div class="tier-range">50 - 99 packs</div>
                <div class="tier-desc discount">5% off (R 522.50)</div>
              </div>
              <div class="tier-box highlight">
                <div class="tier-range">100+ packs</div>
                <div class="tier-desc discount">10% off (R 495.00)</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="form-column">
          <!-- Media Card -->
          <div class="form-card">
            <h2>Product Media</h2>
            <div class="upload-dropzone">
              <span class="upload-icon">☁️</span>
              <p>Drag product images here</p>
              <small>Supports JPG, PNG (Max 5MB)</small>
            </div>
          </div>

          <!-- Inventory Card -->
          <div class="form-card">
            <h2>Inventory & Logistics</h2>
            <div class="form-row">
              <div class="form-group">
                <label>Initial Stock Qty</label>
                <input v-model="form.stockQty" type="text" placeholder="500 packs" required />
              </div>
              <div class="form-group">
                <label>Low Stock Alert</label>
                <input type="text" placeholder="50 packs" />
              </div>
            </div>

            <div class="form-group">
              <label>Shipping Weight (Per Pack)</label>
              <input type="text" placeholder="2.5 kg" />
            </div>

            <div class="action-buttons">
              <button type="submit" class="btn-submit">Publish Product</button>
              <button type="button" @click="router.push('/')" class="btn-cancel">Save as Draft</button>
            </div>
          </div>
        </div>
      </form>
    </main>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '@/stores/productStore'

const router = useRouter()
const store = useProductStore()

const form = reactive({
  title: '',
  category: 'Eco-friendly Packaging',
  sku: '',
  description: '',
  price: '',
  moq: '',
  stockQty: ''
})

const handlePublish = () => {
  store.addProduct({ ...form })
  router.push('/')
}
</script>

<style scoped>
.app-layout { display: flex; min-height: 100vh; background: #f7f6f2; font-family: sans-serif; color: #333; }
.sidebar { width: 240px; background: #4a2e2b; color: #fff; padding: 20px; display: flex; flex-direction: column; }
.logo { display: flex; gap: 10px; align-items: center; margin-bottom: 30px; }
.nav-menu a { display: block; color: #d3c5c1; padding: 10px; text-decoration: none; border-radius: 6px; }
.nav-menu a.active, .nav-menu a:hover { background: #5c3b37; color: #fff; }
.sidebar-footer { margin-top: auto; border-top: 1px solid #5c3b37; padding-top: 15px; }
.sidebar-footer a { color: #d3c5c1; text-decoration: none; }
.main-content { flex: 1; padding: 40px; }
.top-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px; }
.top-header h1 { margin: 0; font-family: serif; font-size: 28px; }
.top-header p { margin: 5px 0 0; color: #666; font-size: 14px; }
.search-input { padding: 10px 16px; border-radius: 20px; border: 1px solid #ddd; width: 220px; }
.form-grid { display: grid; grid-template-columns: 1.6fr 1fr; gap: 20px; }
.form-card { background: #fff; padding: 24px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.03); }
.form-card h2 { font-family: serif; font-size: 18px; margin: 0 0 20px; }
.form-group { margin-bottom: 16px; display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 11px; font-weight: bold; text-transform: uppercase; color: #666; }
.form-group input, .form-group select, .form-group textarea { padding: 12px; border-radius: 8px; border: 1px solid #eee; background: #f9f8f6; font-size: 14px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
.tier-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 8px; }
.tier-box { border: 1px solid #eee; padding: 12px; border-radius: 8px; background: #faf9f7; font-size: 12px; }
.tier-box.highlight { border-color: #ffd8cc; background: #fff8f5; }
.tier-range { font-weight: bold; margin-bottom: 4px; }
.tier-desc.discount { color: #d97746; font-weight: 600; }
.upload-dropzone { border: 2px dashed #eee; border-radius: 8px; padding: 30px; text-align: center; background: #faf9f7; }
.upload-icon { font-size: 24px; }
.action-buttons { display: flex; flex-direction: column; gap: 10px; margin-top: 20px; }
.btn-submit { background: #d97746; color: #fff; border: none; padding: 14px; border-radius: 25px; font-weight: bold; cursor: pointer; }
.btn-cancel { background: #fff; border: 1px solid #ddd; padding: 12px; border-radius: 25px; cursor: pointer; color: #555; }
</style>