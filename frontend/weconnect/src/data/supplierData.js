import { computed, ref } from "vue";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const categories = ref([]);
const categoriesLoading = ref(false);
const categoriesError = ref("");

const imagePlaceholders = {
  packaging: "https://placehold.co/800x800?text=Product",
  coffee: "https://placehold.co/800x800?text=Product",
  supplies: "https://placehold.co/800x800?text=Product",
};

const products = ref([]);
const orders = ref([]);
const deliveries = ref([]);
const reviews = ref([]);
const profile = ref({ businessName: "", owner: "", email: "", phone: "", location: "", description: "" });
const loading = ref(true);
const error = ref("");
let loaded = false;

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const rawBody = await response.text();
  let body = {};
  try { body = rawBody ? JSON.parse(rawBody) : {}; } catch { body = {}; }
  if (!response.ok) {
    const detail = body.message || rawBody?.trim();
    throw new Error(detail ? `Request failed (${response.status}): ${detail}` : `Request failed (${response.status}): ${response.statusText || "The server request failed."}`);
  }
  return body;
}

function refreshStatus(product) {
  const quantity = Number(product.quantity || 0);
  const threshold = Number(product.low_stock_threshold || 0);
  product.stockStatus = quantity === 0 ? "Out of stock" : quantity <= threshold ? "Low stock" : "In stock";
}

export async function loadCategories(force = false) {
  if (categories.value.length && !force) return categories.value;
  categoriesLoading.value = true;
  try {
    categories.value = await request("/categories");
    categoriesError.value = "";
  } catch (requestError) {
    categoriesError.value = requestError.message;
  } finally {
    categoriesLoading.value = false;
  }
  return categories.value;
}

export async function loadSupplierData(force = false) {
  if (loaded && !force) return;
  loading.value = true;
  try {
    const productData = await request("/products");
    products.value = productData || [];
    error.value = "";

    try {
      const data = await request("/supplier/overview");
      orders.value = data.orders || [];
      deliveries.value = data.deliveries || [];
      reviews.value = data.reviews || [];
      if (data.profile) Object.assign(profile.value, data.profile);
    } catch (overviewError) {
      console.error("Supplier overview could not be loaded:", overviewError);
    }

    loaded = true;
  } catch (requestError) {
    error.value = requestError.message;
    console.error("Unable to load products:", requestError);
  } finally {
    loading.value = false;
  }
}

loadCategories();
loadSupplierData();

async function addProduct(product) {
  const result = await request("/products", { method: "POST", body: JSON.stringify(product) });
  const created = await request(`/products/${result.product_id}`);
  products.value.unshift(created);
  return created;
}

async function updateProduct(id, changes) {
  const payload = { ...changes, category_name: changes.category_name || products.value.find((item) => item.product_id === Number(id))?.category_name };
  const result = await request(`/products/${id}`, { method: "PUT", body: JSON.stringify(payload) });
  const updated = await request(`/products/${id}`);
  const index = products.value.findIndex((item) => item.product_id === Number(id));
  if (index !== -1) products.value[index] = updated;
  return result;
}

async function duplicateProduct(id) {
  const result = await request(`/products/${id}/duplicate`, { method: "POST" });
  const created = await request(`/products/${result.product_id}`);
  products.value.unshift(created);
  return created;
}

async function updateProductStock(id, quantity) {
  await request(`/products/${id}/stock`, { method: "PATCH", body: JSON.stringify({ quantity }) });
  const updated = await request(`/products/${id}`);
  const index = products.value.findIndex((item) => item.product_id === Number(id));
  if (index !== -1) products.value[index] = updated;
  return updated;
}

async function removeProduct(id) {
  await request(`/products/${id}`, { method: "DELETE" });
  products.value = products.value.filter((product) => product.product_id !== Number(id));
}

async function updateOrderStatus(id, status) {
  const apiStatus = status === "Ready to ship" ? "Shipped" : status;
  await request(`/supplier/orders/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify({ status: apiStatus }) });
  const order = orders.value.find((item) => item.id === id);
  if (order) order.status = status;
  return order;
}

async function updateDeliveryStatus(id, status) {
  await request(`/supplier/deliveries/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
  const delivery = deliveries.value.find((item) => String(item.id) === String(id));
  if (delivery) delivery.status = status;
  return delivery;
}

async function replyToReview(id, reply_text = "Thank you for your feedback.") {
  await request(`/supplier/reviews/${id}/replies`, { method: "POST", body: JSON.stringify({ reply_text }) });
  const review = reviews.value.find((item) => item.id === id);
  if (review) review.replied = true;
  return review;
}

async function updateProfile(changes) {
  const updated = await request("/supplier/profile", { method: "PATCH", body: JSON.stringify(changes) });
  Object.assign(profile.value, updated);
  return updated;
}

async function uploadProductImages(imageSources) {
  if (imageSources.length > 8) throw new Error("A product can have a maximum of 8 images.");
  const blobs = imageSources.filter((source) => String(source).startsWith("blob:"));
  if (!blobs.length) return imageSources;
  const formData = new FormData();
  for (let index = 0; index < blobs.length; index += 1) {
    const blob = await (await fetch(blobs[index])).blob();
    formData.append("images", blob, `product-${Date.now()}-${index}.${blob.type === "image/png" ? "png" : "jpg"}`);
  }
  const response = await fetch(`${API_URL}/uploads/products`, { method: "POST", body: formData });
  const rawBody = await response.text();
  let body = {};
  try { body = rawBody ? JSON.parse(rawBody) : {}; } catch { body = {}; }
  if (!response.ok) throw new Error(body.message || rawBody?.trim() || "Unable to upload product images.");
  return [...imageSources.filter((source) => !String(source).startsWith("blob:")), ...(body.urls || [])];
}

export function useSupplierData() {
  return { products, orders, deliveries, reviews, profile, categories, categoriesLoading, categoriesError, loading, error, imagePlaceholders, refreshStatus, loadCategories, loadSupplierData, uploadProductImages, addProduct, updateProduct, duplicateProduct, updateProductStock, removeProduct, updateOrderStatus, updateDeliveryStatus, replyToReview, updateProfile };
}

export const supplierStats = {
  productCount: computed(() => products.value.length),
  lowStockCount: computed(() => products.value.filter((product) => product.stockStatus === "Low stock").length),
  outOfStockCount: computed(() => products.value.filter((product) => product.stockStatus === "Out of stock").length),
  revenue: computed(() => orders.value.reduce((sum, order) => sum + Number(order.total || 0), 0)),
};
