import { computed, ref } from "vue";
import { isProductUploadReference } from "@/services/api";

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
const businessPicture = ref(localStorage.getItem(`weconnect_business_picture_${localStorage.getItem("weconnect_supplier_id") || "self"}`) || "");
const loading = ref(true);
const error = ref("");
let loaded = false;
let loadedForToken = null;
let activeLoadId = 0;

async function request(path, options = {}) {
  const token = localStorage.getItem("weconnect_token");
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) },
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

export async function refreshSupplierProducts() {
  try {
    await loadSupplierData(true);
    error.value = "";
    return products.value;
  } catch (requestError) {
    error.value = requestError.message;
    console.error("Unable to refresh products:", requestError);
    throw requestError;
  }
}

export function resetSupplierData() {
  activeLoadId += 1;
  loaded = false;
  loadedForToken = null;
  products.value = [];
  orders.value = [];
  deliveries.value = [];
  reviews.value = [];
  profile.value = { businessName: "", owner: "", email: "", phone: "", location: "", description: "" };
  businessPicture.value = "";
  loading.value = false;
  error.value = "";
}

export function setBusinessPicture(url) {
  businessPicture.value = url;
  const supplierId = localStorage.getItem("weconnect_supplier_id") || "self";
  localStorage.setItem(`weconnect_business_picture_${supplierId}`, url || "");
}

async function loadProfileForToken(currentToken, loadId) {
  try {
    const data = await request("/profile");
    if (
      loadId === activeLoadId &&
      localStorage.getItem("weconnect_token") === currentToken &&
      data?.profile
    ) {
      Object.assign(profile.value, data.profile);
      return true;
    }
  } catch (requestError) {
    console.error("Supplier profile could not be loaded:", requestError);
  }
  return false;
}

async function loadSupplierData(force = false) {
  const currentToken = localStorage.getItem("weconnect_token");
  if (!currentToken) {
    resetSupplierData();
    return;
  }

  const tokenChanged = loadedForToken !== currentToken;
  if (loaded && !force && !tokenChanged) return;
  if (tokenChanged) resetSupplierData();

  const loadId = ++activeLoadId;
  loadedForToken = currentToken;
  loading.value = true;
  const isCurrent = () =>
    loadId === activeLoadId &&
    localStorage.getItem("weconnect_token") === currentToken;

  try {
    const productData = await request("/supplier/products");
    if (!isCurrent()) return;
    products.value = productData || [];
    error.value = "";

    let profileLoaded = false;
    try {
      const data = await request("/supplier/overview");
      if (!isCurrent()) return;
      orders.value = data.orders || [];
      deliveries.value = data.deliveries || [];
      reviews.value = data.reviews || [];
      if (data.profile) {
        Object.assign(profile.value, data.profile);
        profileLoaded = Boolean(String(data.profile.businessName || "").trim());
      }
    } catch (overviewError) {
      if (isCurrent()) {
        console.error("Supplier overview could not be loaded:", overviewError);
      }
    }

    if (isCurrent() && !profileLoaded) {
      await loadProfileForToken(currentToken, loadId);
    }
    if (isCurrent()) loaded = true;
  } catch (requestError) {
    if (!isCurrent()) return;
    error.value = requestError.message;
    console.error("Unable to load products:", requestError);
    await loadProfileForToken(currentToken, loadId);
  } finally {
    if (isCurrent()) loading.value = false;
  }
}

loadCategories();
if (localStorage.getItem("weconnect_token")) loadSupplierData();

async function addProduct(product) {
  const result = await request("/supplier/products", { method: "POST", body: JSON.stringify(product) });
  const created = await request(`/supplier/products/${result.product_id}`);
  products.value.unshift(created);
  return created;
}

async function updateProduct(id, changes) {
  const payload = { ...changes, category_name: changes.category_name || products.value.find((item) => item.product_id === Number(id))?.category_name };
  const result = await request(`/supplier/products/${id}`, { method: "PUT", body: JSON.stringify(payload) });
  const updated = await request(`/supplier/products/${id}`);
  const index = products.value.findIndex((item) => item.product_id === Number(id));
  if (index !== -1) products.value[index] = updated;
  return result;
}

async function duplicateProduct(id) {
  const result = await request(`/supplier/products/${id}/duplicate`, { method: "POST" });
  const created = await request(`/supplier/products/${result.product_id}`);
  products.value.unshift(created);
  return created;
}

async function updateProductStock(id, quantity, reason = "Manual adjustment") {
  await request(`/supplier/products/${id}/stock`, { method: "PATCH", body: JSON.stringify({ quantity, reason }) });
  const updated = await request(`/supplier/products/${id}`);
  const index = products.value.findIndex((item) => item.product_id === Number(id));
  if (index !== -1) products.value[index] = updated;
  return updated;
}

async function removeProduct(id) {
  await request(`/supplier/products/${id}`, { method: "DELETE" });
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

async function cleanupProductImages(urls) {
  const safeUrls = Array.isArray(urls) ? urls.filter((url) => isProductUploadReference(url)) : [];
  if (!safeUrls.length) return;
  try {
    await request("/uploads/products", { method: "DELETE", body: JSON.stringify({ urls: safeUrls }) });
  } catch (cleanupError) {
    console.warn("Product image cleanup could not be completed:", cleanupError);
  }
}

async function uploadProductImages(imageSources, onUploaded = null) {
  if (!Array.isArray(imageSources) || imageSources.length > 8) {
    throw new Error("A product can have a maximum of 8 images.");
  }

  const result = [...imageSources];
  const blobs = imageSources
    .map((source, index) => ({ source: String(source), index }))
    .filter(({ source }) => source.startsWith("blob:"));

  if (!blobs.length) return result;

  const formData = new FormData();

  for (let index = 0; index < blobs.length; index += 1) {
    const { source } = blobs[index];
    const blob = await (await fetch(source)).blob();
    const extension = blob.type === "image/png" ? "png" : "jpg";
    formData.append("images", blob, `product-${Date.now()}-${index}.${extension}`);
  }

  const response = await fetch(`${API_URL}/uploads/products`, {
    method: "POST",
    headers: localStorage.getItem("weconnect_token")
      ? { Authorization: `Bearer ${localStorage.getItem("weconnect_token")}` }
      : {},
    body: formData,
  });

  const rawBody = await response.text();
  let body = {};
  try {
    body = rawBody ? JSON.parse(rawBody) : {};
  } catch {
    body = {};
  }

  if (!response.ok) {
    throw new Error(body.message || rawBody?.trim() || "Unable to upload product images.");
  }

  const uploadedUrls = Array.isArray(body.urls) ? body.urls : [];
  if (uploadedUrls.length !== blobs.length) {
    throw new Error("The server did not return all uploaded image URLs.");
  }

  if (onUploaded) onUploaded(uploadedUrls);

  // Replace each temporary blob URL in its original position. This preserves
  // the user's image order and therefore preserves which image is primary.
  blobs.forEach(({ index }, uploadIndex) => {
    result[index] = uploadedUrls[uploadIndex];
  });

  return result;
}

export function useSupplierData() {
  return { products, orders, deliveries, reviews, profile, categories, categoriesLoading, categoriesError, loading, error, imagePlaceholders, refreshStatus, loadCategories, loadSupplierData, refreshSupplierProducts, uploadProductImages, cleanupProductImages, addProduct, updateProduct, duplicateProduct, updateProductStock, removeProduct, updateOrderStatus, updateDeliveryStatus, replyToReview, updateProfile };
}

export const supplierStats = {
  productCount: computed(() => products.value.length),
  lowStockCount: computed(() => products.value.filter((product) => product.stockStatus === "Low stock").length),
  outOfStockCount: computed(() => products.value.filter((product) => product.stockStatus === "Out of stock").length),
  revenue: computed(() => orders.value.reduce((sum, order) => sum + Number(order.total || 0), 0)),
};
