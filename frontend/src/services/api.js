const apiBaseUrl = import.meta.env.VITE_API_URL || "/api";
const backendBaseUrl = apiBaseUrl.replace(/\/api\/?$/, "");

function isLocalUploadOrigin(parsed) {
  const origins = new Set([window.location.origin]);
  if (backendBaseUrl) {
    try {
      origins.add(new URL(backendBaseUrl, window.location.origin).origin);
    } catch {}
  }
  if (["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname)) {
    origins.add("http://localhost:5000");
    origins.add("http://127.0.0.1:5000");
  }
  return origins.has(parsed.origin);
}

function getUploadPath(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  if (text.startsWith("/api/uploads/")) return text.slice(4);
  if (text.startsWith("/uploads/") || text.startsWith("uploads/")) {
    return text.startsWith("/") ? text : `/${text}`;
  }

  let parsed;
  try {
    parsed = text.startsWith("//") ? new URL(`https:${text}`) : new URL(text);
  } catch {
    return "";
  }
  if (!isLocalUploadOrigin(parsed)) return "";
  if (parsed.pathname.startsWith("/api/uploads/")) return parsed.pathname.slice(4);
  if (parsed.pathname.startsWith("/uploads/")) return parsed.pathname;
  return "";
}

export function resolveImageUrl(value) {
  const source = String(value || "").trim();
  if (!source) return "";
  if (/^(data:|blob:)/i.test(source)) return source;

  const uploadPath = getUploadPath(source);
  if (uploadPath) return `${backendBaseUrl}${uploadPath}`;

  if (/^https?:\/\//i.test(source)) return source;
  if (source.startsWith("//")) return source;
  return source.startsWith("/") ? source : `/${source}`;
}

export function isProductUploadReference(value) {
  return Boolean(getUploadPath(value));
}

const getToken = () => localStorage.getItem("weconnect_token");

// Send all requests through one place so headers and errors stay consistent.
const request = async (path, options = {}) => {
  const { authToken, ...requestOptions } = options;
  const headers = {
    "Content-Type": "application/json",
    ...requestOptions.headers,
  };

  const token = authToken || getToken();
  // Add the saved login token when the request needs authentication.
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...requestOptions,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || "The request failed.");
  }

  if (response.status === 204) return null;
  return response.json();
};

export const api = {
  health: () => request("/health"),

  getSubscriptionPlans: () => request("/auth/plans"),

  login: (email, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  changePassword: (newPassword) =>
    request("/auth/password/change", {
      method: "POST",
      authToken: localStorage.getItem("weconnect_password_change_token"),
      body: JSON.stringify({ new_password: newPassword }),
    }),

  registerBuyer: (data) =>
    request("/auth/register-buyer", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  registerSupplier: (data) =>
    request("/auth/register-supplier", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getProfile: () => request("/profile"),

  updateProfile: (data) =>
    request("/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  getProducts: () => request("/products"),

  getSuppliers: () => request("/suppliers"),

  getCart: (buyerId) => request(`/cart?buyerId=${encodeURIComponent(buyerId)}`),

  addToCart: (buyerId, productId, quantity = 1) =>
    request("/cart", {
      method: "POST",
      body: JSON.stringify({ buyerId, productId, quantity }),
    }),

  updateCartItem: (buyerId, cartItemId, quantity) =>
    request(`/cart/${cartItemId}`, {
      method: "PUT",
      body: JSON.stringify({ buyerId, quantity }),
    }),

  checkoutCart: (buyerId, paymentMethod = "invoice") =>
    request("/orders/checkout", {
      method: "POST",
      body: JSON.stringify({ buyerId, paymentMethod }),
    }),

  removeCartItem: (buyerId, cartItemId) =>
    request(`/cart/${cartItemId}?buyerId=${encodeURIComponent(buyerId)}`, {
      method: "DELETE",
    }),
};

export { apiBaseUrl };
