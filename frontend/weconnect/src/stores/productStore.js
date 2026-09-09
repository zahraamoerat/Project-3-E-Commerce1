import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [
      {
        id: 1,
        title: 'Napkin Bundles',
        category: 'PAPER GOODS',
        sku: 'PG-NAP-100',
        price: 'R 145.00',
        stockQty: '450 units',
        status: 'Active',
        image: 'https://via.placeholder.com/600x200'
      }
    ]
  }),
  actions: {
    addProduct(newProduct) {
      this.products.push({
        id: Date.now(),
        status: 'Active',
        image: newProduct.image || 'https://via.placeholder.com/600x200',
        ...newProduct
      })
    },
    deleteProduct(id) {
      this.products = this.products.filter(p => p.id !== id)
    }
  }
})