import { defineStore } from "pinia";
import { api } from "@/services/api";

export const useProductStore = defineStore("product", {
  state: () => ({
    products: [],
    isLoading: false,
    error: null,
  }),
  actions: {
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
    addProduct(newProduct) {
      this.products.push({
        id: Date.now(),
        status: "Active",
        image: newProduct.image || "https://via.placeholder.com/600x200",
        ...newProduct,
      });
    },
    deleteProduct(id) {
      this.products = this.products.filter((p) => p.id !== id);
    },
  },
});
