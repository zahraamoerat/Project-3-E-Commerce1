// Keep the API URL configurable for different environments.
const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:28794/api";

const getToken = () => localStorage.getItem("weconnect_token");

// Send all requests through one place so headers and errors stay consistent.
const request = async (path, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const token = getToken();
  // Add the saved login token when the request needs authentication.
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
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

  getProducts: () => request("/products"),

  getCart: (buyerId) => request(`/cart?buyerId=${encodeURIComponent(buyerId)}`),

  addToCart: (buyerId, productId, quantity = 1) =>
    request("/cart", {
      method: "POST",
      body: JSON.stringify({ buyerId, productId, quantity }),
    }),

  updateCartItem: (buyerId, cartItemId, quantity) =>
    request(`/cart/${cartItemId}`, {
      method: "PATCH",
      body: JSON.stringify({ buyerId, quantity }),
    }),

  removeCartItem: (buyerId, cartItemId) =>
    request(`/cart/${cartItemId}?buyerId=${encodeURIComponent(buyerId)}`, {
      method: "DELETE",
    }),
};

export { apiBaseUrl };
