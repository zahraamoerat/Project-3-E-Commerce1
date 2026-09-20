<template>
  <div class="stock-page">
    <header class="stock-header">
      <div><span class="eyebrow">INVENTORY OPERATIONS</span><h1>Stock management</h1><p>Monitor inventory levels, identify shortages and restock products quickly.</p></div>
      <div class="header-actions"><label class="search"><span>⌕</span><input v-model="query" aria-label="Search inventory" placeholder="Search products or SKU..." /></label><RouterLink to="/products/add" class="primary">+ Add product</RouterLink></div>
    </header>
    <section class="metrics">
      <article><span>Total products</span><strong>{{ products.length }}</strong><small>In your catalogue</small></article>
      <article><span>Healthy stock</span><strong class="green">{{ inStock }}</strong><small>Above reorder level</small></article>
      <article><span>Low stock</span><strong class="amber">{{ lowStock }}</strong><small>Needs attention</small></article>
      <article><span>Out of stock</span><strong class="red">{{ outOfStock }}</strong><small>Restock immediately</small></article>
    </section>
    <section class="inventory-card">
      <div class="toolbar">
        <div><h2>Inventory</h2><p>{{ filteredProducts.length }} of {{ products.length }} products</p></div>
        <div class="filters"><button v-for="filter in filters" :key="filter" :class="{active: statusFilter===filter}" @click="statusFilter=filter">{{ filter }}</button></div>
      </div>
      <div class="table-head"><span>Product</span><span>Stock</span><span>Status</span><span>Price</span><span>Action</span></div>
      <div v-for="product in filteredProducts" :key="product.product_id" class="inventory-row">
        <div class="product"><img :src="product.image" :alt="product.product_name" /><div><strong>{{ product.product_name }}</strong><span>{{ product.sku }} · {{ product.category_name || "Uncategorised" }}</span></div></div>
        <div class="quantity"><strong>{{ product.quantity }}</strong><span>units</span></div>
        <span class="badge" :class="statusClass(product.stockStatus)">{{ product.stockStatus }}</span>
        <strong class="price">{{ money(product.price) }}</strong>
        <button class="restock" type="button" @click="restock(product)">Update stock</button>
      </div>
      <div v-if="!filteredProducts.length" class="empty"><strong>No products found</strong><span>Try another search or filter.</span></div>
    </section>
  </div>
</template>
<script setup>
import { computed, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useSupplierData } from "@/data/supplierData";
const { products } = useSupplierData();
const router = useRouter(), query = ref(""), statusFilter = ref("All");
const filters = ["All","In stock","Low stock","Out of stock"];
const filteredProducts = computed(() => products.value.filter(p => {
  const text = `${p.product_name||""} ${p.sku||""} ${p.category_name||""}`.toLowerCase();
  const matchesSearch = text.includes(query.value.trim().toLowerCase());
  const matchesStatus = statusFilter.value === "All" || p.stockStatus?.toLowerCase() === statusFilter.value.toLowerCase();
  return matchesSearch && matchesStatus;
}));
const inStock = computed(() => products.value.filter(p => p.stockStatus === "In stock").length);
const lowStock = computed(() => products.value.filter(p => p.stockStatus === "Low stock").length);
const outOfStock = computed(() => products.value.filter(p => p.stockStatus === "Out of stock").length);
function money(value){return new Intl.NumberFormat("en-ZA",{style:"currency",currency:"ZAR",maximumFractionDigits:0}).format(Number(value)||0)}
function statusClass(status){return String(status||"").toLowerCase().replaceAll(" ","-")}
function restock(product){router.push({name:"RestockPage",params:{id:String(product.product_id)}})}
</script>
<style scoped>
.stock-page{min-height:100vh;padding:34px clamp(16px,4vw,42px) 56px;background:#f6f3ef;color:#4d3933}.stock-header,.metrics,.inventory-card{max-width:1180px;margin-left:auto;margin-right:auto}.stock-header{display:flex;justify-content:space-between;align-items:end;gap:24px;margin-bottom:24px}.eyebrow{color:#c96d38;font-size:10px;font-weight:800;letter-spacing:2px}.stock-header h1{margin:6px 0 4px;font:700 clamp(28px,4vw,38px) Georgia,serif;color:#3f302b}.stock-header p{margin:0;color:#8d7b72}.header-actions{display:flex;gap:10px;align-items:center}.search{display:flex;align-items:center;gap:9px;width:280px;padding:11px 13px;border:1px solid #e1d8d1;border-radius:12px;background:#fff;box-shadow:0 4px 16px rgba(70,50,40,.05)}.search input{width:100%;border:0;outline:0;background:transparent}.primary,.restock{border:0;border-radius:10px;padding:11px 15px;background:#725247;color:#fff;font-weight:700;text-decoration:none;white-space:nowrap}.metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:22px}.metrics article{padding:19px;border:1px solid #e4dcd5;border-radius:14px;background:#fff;box-shadow:0 5px 20px rgba(70,50,40,.045)}.metrics span,.metrics small{display:block;color:#8d7b72;font-size:11px}.metrics strong{display:block;margin:7px 0 2px;font:700 28px Georgia,serif;color:#4d3933}.metrics .green{color:#3f8060}.metrics .amber{color:#b77935}.metrics .red{color:#b9584f}.inventory-card{border:1px solid #e4dcd5;border-radius:16px;background:#fff;overflow:hidden;box-shadow:0 10px 35px rgba(70,50,40,.055)}.toolbar{display:flex;justify-content:space-between;align-items:center;gap:18px;padding:21px 24px;border-bottom:1px solid #eee8e3}.toolbar h2{margin:0;font:700 20px Georgia,serif;color:#3f302b}.toolbar p{margin:3px 0 0;color:#99877f;font-size:12px}.filters{display:flex;gap:6px;flex-wrap:wrap}.filters button{border:1px solid #e2d9d2;border-radius:999px;padding:7px 11px;background:#fff;color:#725f57;font-size:11px;font-weight:700}.filters button.active{background:#725247;border-color:#725247;color:#fff}.table-head,.inventory-row{display:grid;grid-template-columns:minmax(260px,1.7fr) 100px 125px 110px 130px;gap:18px;align-items:center}.table-head{padding:10px 24px;background:#faf8f6;color:#9a8981;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.8px}.inventory-row{padding:14px 24px;border-top:1px solid #f1ece8}.product{display:flex;align-items:center;gap:13px;min-width:0}.product img{width:52px;height:52px;object-fit:cover;border-radius:11px;background:#eee7e1}.product strong,.product span{display:block}.product strong{color:#4d3933;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.product span,.quantity span{margin-top:3px;color:#9a8981;font-size:11px}.quantity strong{font-size:14px}.quantity span{display:block}.badge{justify-self:start;padding:6px 9px;border-radius:999px;font-size:10px;font-weight:800}.in-stock{background:#e7f3ea;color:#3f8060}.low-stock{background:#fff1da;color:#a97028}.out-of-stock{background:#fae5e1;color:#b9584f}.price{font-size:12px;color:#5d4840}.restock{font-size:11px;background:#e17b3d}.empty{padding:55px 20px;text-align:center;color:#8d7b72}.empty strong,.empty span{display:block}.empty strong{color:#5a453d;margin-bottom:4px}.empty span{font-size:12px}@media(max-width:950px){.stock-header{align-items:flex-start;flex-direction:column}.header-actions,.search{width:100%}.header-actions .primary{width:auto}.metrics{grid-template-columns:repeat(2,1fr)}.table-head{display:none}.inventory-row{grid-template-columns:minmax(0,1fr) auto auto;gap:12px}.quantity,.price{display:none}.restock{grid-column:3;grid-row:1}.badge{grid-column:2;grid-row:1}}@media(max-width:620px){.stock-page{padding:24px 14px 40px}.header-actions{flex-direction:column;align-items:stretch}.primary{text-align:center}.metrics{gap:9px}.metrics article{padding:14px}.metrics strong{font-size:22px}.toolbar{align-items:flex-start;flex-direction:column;padding:17px}.filters{width:100%;overflow:auto;flex-wrap:nowrap;padding-bottom:2px}.filters button{white-space:nowrap}.inventory-row{padding:13px 15px}.product img{width:44px;height:44px}.product strong{font-size:12px}.restock{padding:9px 10px}}@media(max-width:430px){.metrics{grid-template-columns:1fr 1fr}.inventory-row{grid-template-columns:minmax(0,1fr) auto}.badge{grid-column:2}.restock{grid-column:1 / -1;justify-self:start}}
</style>