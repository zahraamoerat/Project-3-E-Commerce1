import { ref } from 'vue'

export function buyerScopedKey(base) {
  const buyerId = localStorage.getItem('weconnect_buyer_id') || 'guest'
  return `${base}-${buyerId}`
}

export function basketKey() {
  return buyerScopedKey('weconnect-order-basket')
}

export function wishlistKey() {
  return buyerScopedKey('weconnect-wishlist')
}

const itemCount = ref(0)

export function countBasketItems(basket = {}) {
  return Object.values(basket).reduce(
    (total, item) => total + Number((item && item.quantity) || 0),
    0
  )
}

export function refreshBasketCount() {
  try {
    const stored = JSON.parse(localStorage.getItem(basketKey()) || '{}')
    itemCount.value = countBasketItems(stored)
  } catch {
    itemCount.value = 0
  }
  return itemCount.value
}

export function setBasketCount(value) {
  itemCount.value = Number(value) || 0
}

export function useBasketCount() {
  refreshBasketCount()
  return itemCount
}