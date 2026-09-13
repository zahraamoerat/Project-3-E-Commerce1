const API_URL = (
  import.meta.env.VITE_API_URL || ""
).replace(/\/+$/, "");

/* =========================================================
   GENERIC REQUEST FUNCTION
   ========================================================= */

async function request(
  endpoint,
  options = {}
) {
  const response =
    await fetch(
      `${API_URL}${endpoint}`,
      {
        ...options,

        headers: {
          Accept:
            "application/json",

          ...(options.body
            ? {
                "Content-Type":
                  "application/json"
              }
            : {}),

          ...(options.headers || {})
        }
      }
    );

  const data =
    await response
      .json()
      .catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message ||
      `Request failed with status ${response.status}`
    );
  }

  return data;
}

/* =========================================================
   PRODUCT API
   ========================================================= */

export const api = {
  /* -------------------------------------------------------
     GET ALL PRODUCTS
     ------------------------------------------------------- */

  getProducts() {
    return request(
      "/api/products"
    );
  },

  /* -------------------------------------------------------
     GET ONE PRODUCT
     ------------------------------------------------------- */

  getProduct(id) {
    return request(
      `/api/products/${id}`
    );
  },

  /* -------------------------------------------------------
     CREATE PRODUCT
     ------------------------------------------------------- */

  createProduct(product) {
    return request(
      "/api/products",
      {
        method: "POST",

        body: JSON.stringify(
          product
        )
      }
    );
  },

  /* -------------------------------------------------------
     UPDATE PRODUCT
     ------------------------------------------------------- */

  updateProduct(
    id,
    product
  ) {
    return request(
      `/api/products/${id}`,
      {
        method: "PUT",

        body: JSON.stringify(
          product
        )
      }
    );
  },

  /* -------------------------------------------------------
     UPDATE STOCK
     ------------------------------------------------------- */

  updateProductStock(
    id,
    quantity
  ) {
    return request(
      `/api/products/${id}/stock`,
      {
        method: "PATCH",

        body: JSON.stringify({
          quantity
        })
      }
    );
  },

  /* -------------------------------------------------------
     DELETE PRODUCT
     ------------------------------------------------------- */

  deleteProduct(id) {
    return request(
      `/api/products/${id}`,
      {
        method: "DELETE"
      }
    );
  }
};