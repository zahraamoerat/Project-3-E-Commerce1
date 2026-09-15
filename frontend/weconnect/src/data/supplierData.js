import { computed, ref } from "vue";

const imagePlaceholders = {
  packaging:
    "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=640&q=80",
  coffee:
    "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=640&q=80",
  supplies:
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=640&q=80",
};

const products = ref([
  {
    product_id: 1,
    product_name: "Untitled draft",
    category_name: "Eco-friendly Packaging",
    sku: "ECO-001",
    price: 550,
    quantity: 500,
    low_stock_threshold: 80,
    stockStatus: "In stock",
    image: imagePlaceholders.packaging,
    description: "Recycled kraft packaging for growing businesses.",
  },
  {
    product_id: 2,
    product_name: "Recycled Kraft Mailer",
    category_name: "Eco-friendly Packaging",
    sku: "ECO-014",
    price: 320,
    quantity: 42,
    low_stock_threshold: 50,
    stockStatus: "Low stock",
    image: imagePlaceholders.packaging,
    description: "Durable recyclable mailers sold in wholesale packs.",
  },
  {
    product_id: 3,
    product_name: "Compostable Wrap",
    category_name: "Shipping Supplies",
    sku: "SHIP-008",
    price: 180,
    quantity: 0,
    low_stock_threshold: 30,
    stockStatus: "Out of stock",
    image: imagePlaceholders.supplies,
    description: "Plastic-free wrap for low-impact dispatches.",
  },
  {
    product_id: 4,
    product_name: "Roasted Arabica Beans",
    category_name: "Food & Beverage",
    sku: "FOOD-031",
    price: 780,
    quantity: 125,
    low_stock_threshold: 40,
    stockStatus: "In stock",
    image: imagePlaceholders.coffee,
    description: "Medium roast coffee beans for cafes and offices.",
  },
]);

const orders = ref([
  {
    id: "WC-1048",
    buyer: "Mosaic Coffee Co.",
    items: "Roasted Arabica Beans",
    total: 2340,
    status: "Ready to ship",
    date: "Today",
    accent: "coffee",
  },
  {
    id: "WC-1047",
    buyer: "Northstar Retail",
    items: "Recycled Kraft Mailer",
    total: 1600,
    status: "Processing",
    date: "Yesterday",
    accent: "packaging",
  },
  {
    id: "WC-1046",
    buyer: "Greenline Studio",
    items: "Untitled draft",
    total: 2750,
    status: "Delivered",
    date: "12 Sep 2026",
    accent: "supplies",
  },
]);

const deliveries = ref([
  {
    id: "DL-2204",
    order: "WC-1048",
    destination: "Mosaic Coffee Co.",
    eta: "Today, 16:00",
    status: "Ready for pickup",
    carrier: "SwiftShip",
  },
  {
    id: "DL-2203",
    order: "WC-1047",
    destination: "Northstar Retail",
    eta: "Tomorrow, 10:30",
    status: "In transit",
    carrier: "ParcelPro",
  },
  {
    id: "DL-2202",
    order: "WC-1046",
    destination: "Greenline Studio",
    eta: "Delivered 12 Sep",
    status: "Delivered",
    carrier: "SwiftShip",
  },
]);

const reviews = ref([
  {
    id: 1,
    buyer: "Mosaic Coffee Co.",
    rating: 5,
    title: "Consistent quality",
    text: "The packaging arrived quickly and looked exactly like the sample.",
    date: "2 days ago",
    replied: false,
  },
  {
    id: 2,
    buyer: "Northstar Retail",
    rating: 4,
    title: "Great wholesale value",
    text: "Reliable stock and a very helpful supplier team.",
    date: "6 days ago",
    replied: true,
  },
  {
    id: 3,
    buyer: "Greenline Studio",
    rating: 5,
    title: "Will order again",
    text: "The materials feel premium and the delivery updates were clear.",
    date: "1 week ago",
    replied: false,
  },
]);

const profile = ref({
  businessName: "Cedar & Finch Supply Co.",
  owner: "Amara Nkosi",
  email: "hello@cedarfinch.co.za",
  phone: "+27 11 555 0184",
  location: "Cape Town, South Africa",
  description:
    "Thoughtful wholesale goods and low-impact packaging for independent businesses.",
});

function refreshStatus(product) {
  const quantity = Number(product.quantity || 0);
  const threshold = Number(product.low_stock_threshold || 0);
  product.stockStatus =
    quantity === 0
      ? "Out of stock"
      : quantity <= threshold
        ? "Low stock"
        : "In stock";
}

function addProduct(product) {
  const nextId =
    Math.max(...products.value.map((item) => item.product_id), 0) + 1;
  const images = product.images?.length
    ? [...product.images]
    : product.image
      ? [product.image]
      : [imagePlaceholders.packaging];
  const nextProduct = {
    ...product,
    product_id: nextId,
    images,
    image: images[0],
  };
  refreshStatus(nextProduct);
  products.value.unshift(nextProduct);
  return nextProduct;
}

function updateProduct(id, changes) {
  const product = products.value.find((item) => item.product_id === Number(id));
  if (!product) return null;
  Object.assign(product, changes);
  if (changes.images) {
    product.images = [...changes.images];
    product.image = product.images[0] || imagePlaceholders.packaging;
  } else if (changes.image) {
    product.images = [changes.image];
    product.image = changes.image;
  }
  refreshStatus(product);
  return product;
}

function removeProduct(id) {
  products.value = products.value.filter(
    (product) => product.product_id !== Number(id),
  );
}

export function useSupplierData() {
  return {
    products,
    orders,
    deliveries,
    reviews,
    profile,
    imagePlaceholders,
    refreshStatus,
    addProduct,
    updateProduct,
    removeProduct,
  };
}

export const supplierStats = {
  productCount: computed(() => products.value.length),
  lowStockCount: computed(
    () =>
      products.value.filter((product) => product.stockStatus === "Low stock")
        .length,
  ),
  outOfStockCount: computed(
    () =>
      products.value.filter((product) => product.stockStatus === "Out of stock")
        .length,
  ),
  revenue: computed(() =>
    orders.value.reduce((sum, order) => sum + order.total, 0),
  ),
};
