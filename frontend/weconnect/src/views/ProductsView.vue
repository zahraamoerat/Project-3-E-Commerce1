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
        <a href="#" class="active">Products</a>
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
          <h1>Products</h1>
          <p>Manage your wholesale catalog, pricing, and stock levels.</p>
        </div>
        <div class="header-actions">
          <input type="text" placeholder="Search wholesale items..." class="search-input" />
          <router-link to="/add-product" class="btn-primary">Add Product</router-link>
        </div>
      </header>

      <!-- Filters -->
      <div class="filter-bar">
        <select class="select-input">
          <option>Category: All</option>
        </select>
        <select class="select-input">
          <option>Stock Status: Active</option>
        </select>
      </div>

      <!-- Product Cards List -->
      <div class="product-list">
        <div v-for="product in store.products" :key="product.id" class="product-card">
          <div class="card-image-wrapper">
            <img :src="product.image" :alt="product.title" class="card-image" />
          </div>
          <div class="card-body">
            <div class="card-header-row">
              <span class="category-badge">{{ product.category }}</span>
              <span class="status-badge" :class="product.status.toLowerCase()">{{ product.status }}</span>
            </div>
            <h3 class="product-title">{{ product.title }}</h3>
            <div class="card-meta">
              <div>
                <small>Unit price</small>
                <div class="price">{{ product.price }}</div>
              </div>
              <div class="text-right">
                <small>Stock qty</small>
                <div class="stock">{{ product.stockQty }}</div>
              </div>
            </div>
            <div class="card-actions">
              <button class="btn-secondary">Edit</button>
              <button @click="store.deleteProduct(product.id)" class="btn-danger">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useProductStore } from '@/stores/productStore'
const store = useProductStore()
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
.header-actions { display: flex; gap: 12px; }
.search-input { padding: 10px 16px; border-radius: 20px; border: 1px solid #ddd; width: 220px; }
.btn-primary { background: #d97746; color: #fff; border: none; padding: 10px 20px; border-radius: 20px; text-decoration: none; font-weight: 600; }
.filter-bar { display: flex; gap: 10px; margin-bottom: 25px; }
.select-input { padding: 8px 14px; border-radius: 20px; border: 1px solid #ddd; background: #fff; }
.product-card { background: #fff; border-radius: 12px; overflow: hidden; max-width: 700px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.card-image { width: 100%; height: 180px; object-fit: cover; }
.card-body { padding: 20px; }
.card-header-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
.category-badge { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #777; }
.status-badge { background: #e8f5e9; color: #2e7d32; padding: 2px 8px; border-radius: 10px; font-size: 12px; font-weight: 600; }
.product-title { margin: 0 0 15px; font-family: serif; font-size: 20px; }
.card-meta { display: flex; justify-content: space-between; margin-bottom: 20px; }
.card-meta small { color: #888; font-size: 12px; }
.price, .stock { font-weight: bold; margin-top: 4px; }
.text-right { text-align: right; }
.card-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.btn-secondary { background: #f0f0f0; border: none; padding: 10px; border-radius: 6px; cursor: pointer; }
.btn-danger { background: #fff; border: 1px solid #eee; color: #d32f2f; padding: 10px; border-radius: 6px; cursor: pointer; }
</style>