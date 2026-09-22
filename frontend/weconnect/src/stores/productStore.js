import { defineStore } from "pinia";
import { api } from "@/services/api";

// Product state shared by marketplace features.
export const useProductStore = defineStore("product", {
  state: () => ({
    products: [],
    isLoading: false,
    error: null,
  }),
  actions: {
    // Load products from the backend and shape them for the UI.
    async fetchProducts() {
      this.isLoading = true;
      this.error = null;

      try {
        const products = await api.getProducts();
        this.products = products.map((product) => ({
          id: product.product_id,
          title: product.product_name,
          category: product.category_name || "Uncategorized",
          price: `R ${Number(product.unit_price).toFixed(2)}`,
          stockQty: `${product.stock_quantity} units`,
          status: product.status,
          image: product.image_url || "https://via.placeholder.com/600x200",
        }));
      } catch (error) {
        this.error = error.message;
      } finally {
        this.isLoading = false;
      }
    },
    // Add an item for the currently logged-in buyer.
    async addToCart(productId, quantity = 1) {
      const buyerId = localStorage.getItem("weconnect_buyer_id");
      if (!buyerId)
        throw new Error(
          "Please log in as a buyer before adding items to your cart.",
        );
      return api.addToCart(buyerId, productId, quantity);
    },
    // Keep locally created products in the same shape as API products.
    addProduct(newProduct) {
      this.products.push({
        id: Date.now(),
        status: "Active",
        image: newProduct.image || "https://via.placeholder.com/600x200",
        ...newProduct,
      });
    },
    // Remove a product from the local store.
    deleteProduct(id) {
      this.products = this.products.filter((p) => p.id !== id);
    },
  },
});
