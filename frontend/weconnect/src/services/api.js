const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const request = async (path, options = {}) => {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || "The request failed.");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export const api = {
  health: () => request("/health"),
  getProducts: () => request("/products"),
  getCart: (buyerId) => request(`/cart?buyerId=${buyerId}`),
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
    request(`/cart/${cartItemId}?buyerId=${buyerId}`, {
      method: "DELETE",
    }),
};

export { apiBaseUrl };
