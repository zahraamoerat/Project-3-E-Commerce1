<template>
  <div class="dashboard-page">
    <SmallBusinessNavbar />
    <main class="dashboard-main">
    <section class="hero-card">
      <div class="hero-copy">
        <span class="eyebrow">Small Business Hub</span>
        <h1>Welcome back, {{ business.name || "your business" }}</h1>
        <p>Everything you need to keep orders, suppliers and deliveries moving in one place.</p>
        <div class="hero-actions">
          <button class="primary-btn" type="button" @click="scrollToOrders">View recent orders</button>
          <button class="secondary-btn" type="button" @click="openTracking">Track delivery</button>
        </div>
      </div>
      <div class="hero-visual" aria-hidden="true">
        <div class="hero-gallery">
          <div class="placeholder-image image-main"><span>PRODUCT<br>IMAGE</span></div>
          <div class="placeholder-image image-top"><span>NEW<br>STOCK</span></div>
          <div class="placeholder-image image-bottom"><span>FARM<br>SUPPLIES</span></div>
        </div>
        <div class="hero-product-card">
          <div class="hero-icon">▦</div>
          <strong>Business overview</strong>
          <span>Live order activity</span>
          <div class="hero-mini-stats">
            <span><b>{{ stats.activeOrders }}</b> Active</span>
            <span v-if="stats.inTransit"><b>{{ stats.inTransit }}</b> Transit</span>
          </div>
        </div>
      </div>
    </section>

    <section class="trust-row">
      <div><span class="trust-icon">✓</span><span><strong>Orders</strong> tracked in one place</span></div>
      <div><span class="trust-icon">R</span><span><strong>Payments</strong> kept visible</span></div>
      <div><span class="trust-icon">↗</span><span><strong>Deliveries</strong> monitored live</span></div>
      <div><span class="trust-icon">★</span><span><strong>Suppliers</strong> at your fingertips</span></div>
    </section>

    <section class="section-heading">
      <div>
        <span class="section-kicker">Your business at a glance</span>
        <h2>Today's overview</h2>
        <p v-if="lastUpdated" class="last-updated">Updated {{ lastUpdated }}</p>
      </div>
      <div class="section-tools">
        <button type="button" class="refresh-btn" :disabled="isLoading" @click="loadDashboard">
          {{ isLoading ? "Refreshing..." : "Refresh" }}
        </button>
        <div class="search-box">
        <span class="search-icon">⌕</span>
          <input v-model="searchQuery" type="search" placeholder="Search orders or suppliers..." />
        </div>
      </div>
    </section>

    <div v-if="errorMessage" class="dashboard-alert" role="alert">
      <strong>Some live data could not be loaded.</strong>
      <span>{{ errorMessage }}</span>
      <button type="button" @click="loadDashboard">Try again</button>
    </div>

    <section class="stats-grid">
      <article class="metric-card">
        <div class="metric-top"><span class="metric-icon green">↗</span><span class="metric-caption">Orders</span></div>
        <strong>{{ stats.activeOrders }}</strong>
        <p><span class="positive">{{ stats.activeOrders }}</span> active orders</p>
      </article>
      <article class="metric-card featured">
        <div class="metric-top"><span class="metric-icon cream">R</span><span class="metric-caption">Pending payment</span></div>
        <strong>R{{ formatMoney(stats.pendingPayment) }}</strong>
        <p><span class="warning">{{ stats.pendingInvoices }}</span> invoice{{ stats.pendingInvoices === 1 ? "" : "s" }} due</p>
      </article>
      <article class="metric-card">
        <div class="metric-top"><span class="metric-icon cream">R</span><span class="metric-caption">Monthly spend</span></div>
        <strong>R{{ formatMoney(stats.totalSpend) }}</strong>
        <p><span class="positive">{{ stats.spendChangePercent }}%</span> vs last month</p>
      </article>
      <article class="metric-card">
        <div class="metric-top"><span class="metric-icon green">↗</span><span class="metric-caption">In transit</span></div>
        <strong>{{ stats.inTransit }}</strong>
        <p><span class="positive">{{ stats.inTransit }}</span> {{ stats.inTransit === 1 ? "delivery" : "deliveries" }} in transit</p>
      </article>
    </section>

    <section class="category-strip">
      <button type="button" @click="scrollToOrders"><span class="category-icon orders">▤</span><strong>Orders</strong><small>Recent activity</small></button>
      <button type="button" @click="openTracking"><span class="category-icon delivery">⌁</span><strong>Deliveries</strong><small>Track shipments</small></button>
      <button type="button" @click="scrollToSuppliers"><span class="category-icon suppliers">♧</span><strong>Suppliers</strong><small>Suggested partners</small></button>
      <button type="button" @click="scrollToNotifications"><span class="category-icon alerts">!</span><strong>Notifications</strong><small>{{ unreadNotifications }} unread</small></button>
    </section>

    <div class="content-grid">
      <section id="orders" class="panel orders-panel">
        <div class="panel-heading">
          <div><span class="section-kicker">Latest activity</span><h2>Recent orders</h2></div>
          <span class="panel-badge">{{ filteredOrders.length }} shown</span>
        </div>
        <div v-if="filteredOrders.length" class="orders-list">
          <article v-for="order in filteredOrders" :key="order.orderId" class="order-row">
            <div class="order-number">
              <span class="order-avatar">{{ initials(order.supplierName) }}</span>
              <div><strong>#{{ order.orderId }}</strong><span>{{ order.supplierName }}</span></div>
            </div>
            <div class="order-items"><span>Items</span><strong>{{ order.itemsSummary }}</strong></div>
            <div><span class="status-pill" :class="order.status">{{ statusLabel(order.status) }}</span></div>
            <div class="eta"><span>ETA</span><strong>{{ order.eta || "—" }}</strong></div>
          </article>
        </div>
        <div v-else class="empty-state"><strong>No matching orders</strong><span>Try a different order or supplier search.</span></div>
      </section>

      <section class="panel tracking-panel">
        <div class="panel-heading">
          <div><span class="section-kicker">Delivery monitor</span><h2>Track your order</h2></div>
          <span class="live-badge" :class="{ offline: !trackedOrder.deliveryId }"><i></i>{{ trackedOrder.deliveryId ? "Live" : "Waiting" }}</span>
        </div>
        <div class="tracking-order">
          <div><span>Order</span><strong>#{{ trackedOrder.orderId }}</strong></div>
          <div class="tracking-destination"><span>Destination</span><strong>{{ trackedOrder.destinationCity || "—" }}</strong></div>
        </div>
        <div class="tracking-steps">
          <div v-for="step in trackingSteps" :key="step.key" :class="{ active: isTrackingStepActive(step.key) }">
            <span class="step-dot"></span><span>{{ step.label }}</span>
          </div>
        </div>
        <div class="dashboard-map-preview" :class="{ clickable: trackedOrder.deliveryId }" @click="openTracking">
          <TrackingMap v-if="trackedOrder.deliveryId" :gps-location="trackedOrder.gpsLocation" />
          <div v-else class="dashboard-map-empty">
            <span class="map-pin">⌖</span><strong>GPS tracking waiting</strong>
            <span>Live tracking will appear when a delivery is assigned.</span>
          </div>
          <div v-if="trackedOrder.deliveryId" class="dashboard-map-action">View live tracking <span>→</span></div>
        </div>
      </section>

      <section id="suppliers" class="panel suppliers-panel">
        <div class="panel-heading">
          <div><span class="section-kicker">Keep growing</span><h2>Suggested suppliers</h2></div>
          <span class="panel-badge">For you</span>
        </div>
        <div class="supplier-cards">
          <article v-for="supplier in suggestedSuppliers" :key="supplier.supplierId" class="supplier-card">
            <div class="supplier-avatar">{{ initials(supplier.companyName) }}</div>
            <div class="supplier-copy"><strong>{{ supplier.companyName }}</strong><span>{{ supplier.description }}</span></div>
            <button type="button" aria-label="Browse supplier products" @click="browseSupplier(supplier)">→</button>
          </article>
        </div>
      </section>

      <section id="notifications" class="panel notifications-panel">
        <div class="panel-heading">
          <div><span class="section-kicker">Stay informed</span><h2>Notifications</h2></div>
          <span v-if="unreadNotifications" class="unread-badge">{{ unreadNotifications }} new</span>
        </div>
        <ul class="notifications-list">
          <li v-for="notification in notifications" :key="notification.notificationId" :class="{ unread: !notification.isRead }">
            <span class="notification-icon" :class="notification.type">{{ notificationIcon(notification.type) }}</span>
            <div><strong>{{ notificationTitle(notification.type) }}</strong><p>{{ notification.message }}</p></div>
            <button v-if="!notification.isRead" type="button" class="notification-read" @click="markNotificationRead(notification)" aria-label="Mark notification as read">✓</button>
          </li>
        </ul>
      </section>
    </div>

    <section class="bottom-promo">
      <div>
        <span class="section-kicker">Small business, simplified</span>
        <h2>Keep every part of your operation connected.</h2>
        <p>Use your dashboard as the daily starting point for orders, payments, deliveries and supplier relationships.</p>
      </div>
      <div class="promo-stat"><strong>{{ stats.activeOrders }}</strong><span>active orders</span></div>
      <div v-if="stats.inTransit > 0" class="promo-stat"><strong>{{ stats.inTransit }}</strong><span>deliveries in transit</span></div>
      <div class="promo-leaf">✦</div>
    </section>
    </main>
  </div>
</template>

<script setup>
import SmallBusinessNavbar from '../components/SmallBusinessNavbar.vue'
import { computed, onMounted, ref } from "vue";
import TrackingMap from "../components/tracking/TrackingMap.vue";
import { api } from "@/services/api";

const business = ref({ name: "" });
const searchQuery = ref("");
const isLoading = ref(true);
const errorMessage = ref("");
const lastUpdated = ref("");

const stats = ref({
  activeOrders: 0,
  pendingPayment: 0,
  pendingInvoices: 0,
  inTransit: 0,
  totalSpend: 0,
  spendChangePercent: 0,
});

const recentOrders = ref([]);

const suggestedSuppliers = ref([]);

const trackedOrder = ref({
  orderId: "—",
  status: "",
  etaMinutes: null,
  destinationCity: "",
  deliveryId: null,
  gpsLocation: null,
});

const notifications = ref([]);

const trackingSteps = [
  { key: "placed", label: "Placed" },
  { key: "dispatched", label: "Dispatched" },
  { key: "in_transit", label: "In transit" },
  { key: "delivered", label: "Delivered" },
];

const filteredOrders = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return recentOrders.value;
  return recentOrders.value.filter((order) =>
    [order.orderId, order.supplierName, order.itemsSummary, statusLabel(order.status)]
      .some((value) => String(value).toLowerCase().includes(query))
  );
});

const unreadNotifications = computed(
  () => notifications.value.filter((notification) => !notification.isRead).length
);

function formatMoney(value) {
  return Number(value || 0).toLocaleString("en-ZA", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function statusLabel(status) {
  return {
    out_for_delivery: "Out for delivery",
    in_transit: "In transit",
    dispatched: "Dispatched",
    delivered: "Delivered",
    processing: "Processing",
    preparing_dispatch: "Preparing dispatch",
    pending: "Pending",
    cancelled: "Cancelled",
    delayed: "Delayed",
  }[status] || status;
}

function notificationTitle(type) {
  return {
    order_update: "Order confirmed",
    payment_reminder: "Payment reminder",
    rating_request: "Rating available",
    message: "New message",
    system: "Notice",
  }[type] || "Notification";
}

function notificationIcon(type) {
  return {
    order_update: "✓",
    payment_reminder: "R",
    rating_request: "★",
    message: "•",
    system: "!",
  }[type] || "•";
}

function initials(name) {
  return String(name || "").split(" ").filter(Boolean).map((word) => word[0]).slice(0, 2).join("").toUpperCase();
}

function mapOrderStatus(status) {
  const normalized = String(status || "").toLowerCase();
  const known = {
    pending: "processing",
    processing: "processing",
    dispatched: "dispatched",
    "in transit": "in_transit",
    "out for delivery": "out_for_delivery",
    delivered: "delivered",
  };
  return known[normalized] || normalized.replace(/\s+/g, "_");
}

function mapDeliveryStatus(status) {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "preparing dispatch") return "awaiting_pickup";
  if (normalized === "dispatched") return "dispatched";
  if (["in transit", "out for delivery", "delayed"].includes(normalized)) return "in_transit";
  if (normalized === "delivered") return "delivered";
  return normalized.replace(/\s+/g, "_");
}

function isTrackingStepActive(step) {
  const current = trackedOrder.value.status;
  const order = { awaiting_pickup: 0, placed: 0, processing: 0, dispatched: 1, in_transit: 2, out_for_delivery: 2, delivered: 3 };
  return order[current] >= order[step];
}

const apiUrl = import.meta.env.VITE_API_URL || "/api";

async function fetchJson(path) {
  const url = apiUrl + path;
  try {
    const response = await fetch(url, {
      headers: {
        ...(localStorage.getItem("weconnect_token")
          ? { Authorization: `Bearer ${localStorage.getItem("weconnect_token")}` }
          : {}),
      },
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.message || `Request failed (${response.status}) for ${path}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(`Unable to reach the WeConnect backend at ${url}. Make sure the backend is running on port 5000.`);
    }
    throw error;
  }
}

async function loadDashboard() {
  isLoading.value = true;
  errorMessage.value = "";
  try {
    const buyerId = localStorage.getItem("weconnect_buyer_id") || "";
    if (!buyerId) {
      throw new Error("Your session has expired. Please sign in again.");
    }

    const [orders, payments, deliveries, profileResult] = await Promise.all([
      fetchJson(`/orders?buyerId=${encodeURIComponent(buyerId)}`),
      fetchJson(`/payments?buyerId=${encodeURIComponent(buyerId)}`),
      fetchJson(`/deliveries?buyerId=${encodeURIComponent(buyerId)}`),
      api.getProfile().catch(() => null),
    ]);

    if (profileResult?.profile?.businessName) {
      business.value.name = profileResult.profile.businessName;
    }

    const orderList = Array.isArray(orders) ? orders : [];
    const paymentList = Array.isArray(payments) ? payments : [];
    const deliveryList = Array.isArray(deliveries) ? deliveries : [];
    const activeStatuses = ["pending", "processing", "in transit", "out for delivery"];

    const unpaid = paymentList.filter(
      (payment) => String(payment.payment_status || "").toLowerCase() !== "completed"
    );

    const pendingPayment = unpaid.reduce(
      (total, payment) => total + Number(payment.amount || 0), 0
    );

    const totalSpend = orderList.reduce(
      (total, order) => total + Number(order.total_amount || 0), 0
    );

    stats.value = {
      activeOrders: orderList.filter((order) =>
        activeStatuses.includes(String(order.order_status || "").toLowerCase())
      ).length,
      pendingPayment,
      pendingInvoices: unpaid.length,
      inTransit: deliveryList.filter((delivery) =>
        ["in transit", "out for delivery"].includes(String(delivery.current_status || "").toLowerCase())
      ).length,
      totalSpend,
      spendChangePercent: 0,
    };

    recentOrders.value = await Promise.all(
      orderList.slice(0, 4).map(async (order) => {
        let itemsSummary = "Order items";
        try {
          const items = await fetchJson("/orders/" + order.order_id + "/items");
          if (Array.isArray(items) && items.length) {
            itemsSummary = items
              .map((item) => (item.product_name || "Product") + " ×" + item.quantity)
              .join(", ");
          }
        } catch {
          // Keep the fallback summary when item lines cannot be loaded.
        }

        return {
          orderId: order.order_number || order.order_id,
          supplierName: order.supplier_name || "Supplier",
          itemsSummary,
          status: mapOrderStatus(order.delivery_status || order.order_status),
          eta: order.estimated_arrival || "—",
        };
      })
    );

    const trackedDelivery =
      deliveryList.find((delivery) =>
        ["in transit", "out for delivery"].includes(String(delivery.current_status || "").toLowerCase())
      ) || deliveryList[0];

    if (trackedDelivery) {
      const order = orderList.find(
        (entry) => String(entry.order_id) === String(trackedDelivery.order_id)
      );

      trackedOrder.value = {
        orderId: order?.order_number || trackedDelivery.order_number || trackedDelivery.order_id,
        status: mapDeliveryStatus(trackedDelivery.current_status),
        etaMinutes: null,
        destinationCity: order?.buyer_city || "",
        deliveryId: trackedDelivery.delivery_id,
        gpsLocation: null,
      };

      try {
        trackedOrder.value.gpsLocation = await fetchJson(
          "/deliveries/" + trackedDelivery.delivery_id + "/location"
        );
      } catch {
        trackedOrder.value.gpsLocation = null;
      }
    }
    lastUpdated.value = new Date().toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" });
  } catch (error) {
    console.error("Dashboard API unavailable:", error);
    errorMessage.value =
      error?.message || "Unable to load live dashboard data. Check that the backend is running, then refresh.";
    // Do not restore sample/mock values here. Keep the dashboard truthful to the API state.
  } finally {
    isLoading.value = false;
  }
}

function browseSupplier(supplier) {
  window.location.href = "/small-business/products";
}

function markNotificationRead(notification) {
  notification.isRead = true;
}

function openTracking() {
  if (!trackedOrder.value.deliveryId) {
    scrollToOrders();
    return;
  }
  window.location.href = "/tracking/" + trackedOrder.value.deliveryId;
}

function scrollToOrders() {
  document.getElementById("orders")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function scrollToSuppliers() {
  document.getElementById("suppliers")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function scrollToNotifications() {
  document.getElementById("notifications")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

onMounted(loadDashboard);
</script>

<style scoped>
.dashboard-page {
  width: 100%;
  margin: 0;
  --dashboard-green: var(--sb-brown);
  --dashboard-green-dark: var(--sb-brown-dark);
  --dashboard-green-soft: var(--sb-brown-soft);
  --dashboard-cream: #f8f2ed;
  --dashboard-ink: var(--sb-brown-dark);
  --dashboard-muted: #7a665b;
  --dashboard-border: var(--sb-border);
  --dashboard-white: var(--sb-surface);
  color: var(--dashboard-ink);
  padding: 0 0 40px;
}

.dashboard-main {
  width: min(1280px, 94%);
  margin: 0 auto;
  padding: 6px 0 40px;
}

.hero-card {
  min-height: 270px;
  display: grid;
  grid-template-columns: 1.15fr .85fr;
  overflow: hidden;
  border-radius: 28px;
  background: radial-gradient(circle at 83% 25%, rgba(255,255,255,.62), transparent 23%), linear-gradient(115deg, #f3e7d9 0%, #f8f2ed 55%, #eee7e2 100%);
  border: 1px solid #e2d7cf;
  position: relative;
}

.hero-copy {
  padding: 42px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 2;
}

.eyebrow, .section-kicker {
  color: var(--dashboard-green);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .13em;
  text-transform: uppercase;
}

.hero-copy h1 {
  margin: 10px 0;
  font-size: clamp(28px, 3vw, 42px);
  line-height: 1.05;
  letter-spacing: -.035em;
  color: #4e342e;
}

.hero-copy p {
  max-width: 530px;
  margin: 0;
  color: #7a665b;
  font-size: 14px;
  line-height: 1.7;
}

.hero-actions { display: flex; gap: 10px; margin-top: 22px; }

.primary-btn, .secondary-btn {
  border: 0;
  border-radius: 999px;
  padding: 11px 17px;
  font-size: 12px;
  font-weight: 750;
  cursor: pointer;
  transition: transform .18s ease, box-shadow .18s ease;
}

.primary-btn {
  background: var(--dashboard-green);
  color: white;
  box-shadow: 0 8px 18px rgba(62,43,29,.18);
}

.secondary-btn {
  background: rgba(255,255,255,.74);
  color: var(--dashboard-green);
  border: 1px solid rgba(62,43,29,.14);
}

.primary-btn:hover, .secondary-btn:hover { transform: translateY(-1px); }

 .hero-visual {
  position: relative;
  min-height: 270px;
  overflow: hidden;
  background: linear-gradient(135deg, #f3e7d9, #eee7e2);
}

.hero-gallery { position: absolute; inset: 0; }

.placeholder-image {
  position: absolute;
  display: grid;
  place-items: center;
  overflow: hidden;
  border: 8px solid rgba(255,253,250,.88);
  border-radius: 22px;
  background: linear-gradient(145deg, rgba(92,61,36,.9), rgba(62,43,29,.48));
  color: rgba(255,255,255,.92);
  box-shadow: 0 18px 35px rgba(62,43,29,.14);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: .14em;
  text-align: center;
  line-height: 1.35;
}
.image-main { width: 180px; height: 145px; right: 14%; top: 52px; transform: rotate(4deg); }
.image-top { width: 88px; height: 72px; right: 5%; top: 16px; transform: rotate(10deg); background: linear-gradient(145deg, rgba(155,112,63,.9), rgba(155,112,63,.5)); }
.image-bottom { width: 100px; height: 82px; right: 5%; bottom: 12px; transform: rotate(-8deg); background: linear-gradient(145deg, rgba(111,86,55,.9), rgba(111,86,55,.5)); }

.hero-product-card {
  position: absolute;
  left: 7%;
  top: 52px;
  width: 240px;
  min-height: 164px;
  padding: 20px;
  border-radius: 24px;
  background: rgba(255,253,250,.9);
  border: 1px solid rgba(255,255,255,.8);
  box-shadow: 0 18px 45px rgba(62,43,29,.13);
  transform: rotate(-2deg);
}

.hero-icon {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: var(--dashboard-green);
  color: white;
  font-size: 20px;
  margin-bottom: 15px;
}

.hero-product-card strong { display: block; font-size: 17px; margin-bottom: 4px; }
.hero-product-card > span { color: var(--dashboard-muted); font-size: 11px; }

.hero-mini-stats { display: flex; gap: 18px; margin-top: 18px; color: var(--dashboard-muted); font-size: 10px; }
.hero-mini-stats b { display: block; color: var(--dashboard-green); font-size: 17px; }

.leaf {
  position: absolute;
  border-radius: 100% 0 100% 0;
  background: rgba(62,43,29,.16);
  transform: rotate(35deg);
}

.leaf-one { width: 110px; height: 55px; right: 12%; top: 8%; }
.leaf-two { width: 145px; height: 70px; right: -1%; bottom: 7%; transform: rotate(-25deg); }
.leaf-three { width: 80px; height: 40px; left: 8%; bottom: 2%; transform: rotate(65deg); }

.trust-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  padding: 13px 4px 23px;
}

.trust-row > div {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  color: var(--dashboard-muted);
  font-size: 10px;
  text-align: center;
}

.trust-row strong { color: var(--dashboard-ink); font-weight: 750; }

.trust-icon {
  width: 25px;
  height: 25px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--dashboard-green-soft);
  color: var(--dashboard-green);
  font-size: 11px;
  font-weight: 800;
}

.section-heading, .panel-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 15px;
}

.section-heading { margin: 4px 2px 15px; }
.last-updated { margin: 4px 0 0; color: var(--dashboard-muted); font-size: 9px; }
.section-tools { display: flex; align-items: center; gap: 8px; width: min(430px, 100%); }
.refresh-btn { border: 1px solid #d8ccc4; border-radius: 999px; padding: 8px 12px; background: #fffefa; color: #5c3d24; font-size: 10px; font-weight: 800; cursor: pointer; white-space: nowrap; }
.refresh-btn:hover:not(:disabled) { background: #f8f2ed; }
.refresh-btn:disabled { opacity: .55; cursor: wait; }
.section-heading h2, .panel-heading h2 { margin: 4px 0 0; font-size: 21px; letter-spacing: -.025em; }

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  width: min(310px, 100%);
  height: 38px;
  border: 1px solid var(--dashboard-border);
  border-radius: 999px;
  background: var(--dashboard-white);
  padding: 0 13px;
}

.search-icon { color: var(--dashboard-muted); font-size: 19px; line-height: 1; }
.search-box input {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--dashboard-ink);
  font-size: 12px;
  padding-left: 7px;
}

.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }

.metric-card {
  min-height: 126px;
  padding: 18px;
  border-radius: 20px;
  background: var(--dashboard-white);
  border: 1px solid var(--dashboard-border);
  box-shadow: 0 6px 20px rgba(62,43,29,.035);
}

.metric-card.featured { background: var(--dashboard-green); color: white; border-color: var(--dashboard-green); }
.metric-top { display: flex; align-items: center; gap: 8px; }

.metric-icon {
  width: 31px;
  height: 31px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 800;
}

.metric-icon.green { color: var(--dashboard-green); background: var(--dashboard-green-soft); }
.metric-icon.cream { color: #8c6d3c; background: var(--dashboard-cream); }
.metric-caption { font-size: 11px; color: var(--dashboard-muted); font-weight: 650; }

.featured .metric-caption, .featured .metric-top .metric-icon { color: rgba(255,255,255,.82); }
.featured .metric-icon { background: rgba(255,255,255,.13); }

.metric-card > strong { display: block; margin-top: 10px; font-size: 25px; letter-spacing: -.035em; }
.metric-card p { margin: 3px 0 0; color: var(--dashboard-muted); font-size: 10px; }
.featured p { color: rgba(255,255,255,.7); }

.positive { color: #8a5a32; font-weight: 750; }
.warning { color: #a06b3b; font-weight: 750; }
.featured .positive, .featured .warning { color: #f1d6a2; }

.category-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin: 16px 0 24px;
}

.category-strip button {
  border: 1px solid var(--dashboard-border);
  background: var(--dashboard-white);
  border-radius: 18px;
  padding: 14px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  cursor: pointer;
  color: var(--dashboard-ink);
  transition: transform .18s ease, border-color .18s ease;
}

.category-strip button:hover { transform: translateY(-2px); border-color: #ddc9bc; }

.category-icon {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  margin-bottom: 3px;
  font-size: 15px;
  font-weight: 800;
}

.category-icon.orders, .category-icon.suppliers { background: #f3e7d9; color: var(--dashboard-green); }
.category-icon.delivery { background: #f3ecdf; color: #8a6d3f; }
.category-icon.alerts { background: #f5e5dd; color: #9a4938; }
.category-strip strong { font-size: 12px; }
.category-strip small { color: var(--dashboard-muted); font-size: 9px; }

.content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(310px, .85fr);
  gap: 14px;
  align-items: start;
}

.panel {
  border: 1px solid var(--dashboard-border);
  border-radius: 22px;
  background: var(--dashboard-white);
  padding: 20px;
  box-shadow: 0 7px 22px rgba(62,43,29,.035);
}

.orders-panel { min-width: 0; }
.panel-heading { margin-bottom: 16px; }

.panel-badge, .unread-badge {
  background: var(--dashboard-green-soft);
  color: var(--dashboard-green);
  border-radius: 999px;
  padding: 6px 9px;
  font-size: 9px;
  font-weight: 800;
  white-space: nowrap;
}

.orders-list { display: flex; flex-direction: column; }

.order-row {
  display: grid;
  grid-template-columns: 1.35fr 1.3fr auto .7fr;
  gap: 12px;
  align-items: center;
  padding: 13px 0;
  border-top: 1px solid #eeeae2;
}

.order-number { display: flex; align-items: center; gap: 10px; min-width: 0; }
.order-avatar, .supplier-avatar {
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  border-radius: 13px;
  background: var(--dashboard-cream);
  color: #8a5a32;
  font-size: 10px;
  font-weight: 800;
}

.order-avatar { width: 38px; height: 38px; }
.order-number div, .order-items, .eta { min-width: 0; }
.order-number strong, .order-number span, .order-items span, .order-items strong, .eta span, .eta strong { display: block; }
.order-number strong { font-size: 12px; }
.order-number div > span { margin-top: 2px; color: var(--dashboard-muted); font-size: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.order-items span, .eta span {
  color: #9a9f9b;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: .07em;
}

.order-items strong, .eta strong {
  margin-top: 3px;
  font-size: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-pill {
  display: inline-block;
  padding: 5px 8px;
  border-radius: 999px;
  font-size: 9px;
  font-weight: 750;
  white-space: nowrap;
  background: #eee;
  color: #68716b;
}

.status-pill.out_for_delivery, .status-pill.in_transit { background: #e6f0e7; color: #8a5a32; }
.status-pill.dispatched { background: #e7eef4; color: #3f6685; }
.status-pill.delivered { background: #e9efe9; color: #8a5a32; }
.status-pill.processing { background: #f3ecdf; color: #8a5a32; }
.eta { text-align: right; }

.tracking-order {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 11px 13px;
  background: #f7f5ef;
  border-radius: 14px;
  margin-bottom: 15px;
}

.tracking-order span, .tracking-order strong { display: block; }
.tracking-order span { color: #949a95; font-size: 9px; text-transform: uppercase; letter-spacing: .08em; }
.tracking-order strong { margin-top: 2px; font-size: 11px; }
.tracking-destination { text-align: right; }

.live-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border-radius: 999px;
  background: #f3e7d9;
  color: #8a5a32;
  padding: 6px 9px;
  font-size: 9px;
  font-weight: 800;
}

.live-badge i { width: 6px; height: 6px; border-radius: 50%; background: #4e9c67; }
.live-badge.offline { background: #f0eee9; color: #7c817d; }
.live-badge.offline i { background: #9a9e9a; }

.tracking-steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 3px;
  margin-bottom: 14px;
}

.tracking-steps > div {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  color: #a0a49f;
  font-size: 8px;
  text-align: center;
}

.tracking-steps > div:not(:last-child)::after {
  content: "";
  position: absolute;
  top: 4px;
  left: calc(50% + 6px);
  width: calc(100% - 12px);
  height: 1px;
  background: #deded8;
}

.step-dot { width: 9px; height: 9px; border-radius: 50%; background: #deded8; position: relative; z-index: 1; }
.tracking-steps > div.active { color: var(--dashboard-green); font-weight: 750; }
.tracking-steps > div.active .step-dot { background: var(--dashboard-green); box-shadow: 0 0 0 4px #f3e7d9; }
.tracking-steps > div.active:not(:last-child)::after { background: #d1b39b; }

.dashboard-map-preview {
  position: relative;
  height: 170px;
  overflow: hidden;
  border-radius: 17px;
  background: #edf0ea;
}

.dashboard-map-preview.clickable { cursor: pointer; }
.dashboard-alert { display: flex; align-items: center; gap: 10px; margin: 0 2px 14px; padding: 11px 13px; border: 1px solid #e2d7cf; border-radius: 12px; background: #f8f2ed; color: #5c3d24; font-size: 10px; }
.dashboard-alert span { color: #7a665b; flex: 1; }
.dashboard-alert button { border: 0; background: transparent; color: #d17a4a; font-weight: 800; cursor: pointer; }

.dashboard-map-empty {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 18px;
  text-align: center;
  background: radial-gradient(circle at 25% 35%, rgba(255,255,255,.85) 0 8%, transparent 9%), radial-gradient(circle at 72% 62%, rgba(255,255,255,.8) 0 10%, transparent 11%), linear-gradient(135deg, #e6eee6, #f1ede3);
}

.map-pin {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--dashboard-green);
  color: white;
  font-size: 17px;
}

.dashboard-map-empty strong { margin-top: 2px; font-size: 11px; }
.dashboard-map-empty > span:last-child { color: var(--dashboard-muted); font-size: 9px; max-width: 190px; }

.dashboard-map-action {
  position: absolute;
  left: 9px;
  right: 9px;
  bottom: 9px;
  padding: 8px 10px;
  border-radius: 10px;
  background: rgba(255,253,250,.94);
  color: var(--dashboard-green);
  font-size: 10px;
  font-weight: 800;
  text-align: center;
}

.dashboard-map-action span { margin-left: 4px; }

.suppliers-panel, .notifications-panel { min-height: 300px; }

.supplier-cards { display: flex; flex-direction: column; gap: 9px; }

.supplier-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 11px;
  align-items: center;
  padding: 11px;
  border-radius: 15px;
  background: #f8f6f1;
  border: 1px solid #eee9df;
}

.supplier-avatar { width: 40px; height: 40px; background: #f3e7d9; color: var(--dashboard-green); }
.supplier-copy { min-width: 0; }
.supplier-copy strong, .supplier-copy span { display: block; }
.supplier-copy strong { font-size: 11px; }
.supplier-copy span { margin-top: 3px; color: var(--dashboard-muted); font-size: 9px; line-height: 1.35; }

.supplier-card button {
  width: 29px;
  height: 29px;
  border: 0;
  border-radius: 50%;
  background: white;
  color: var(--dashboard-green);
  cursor: pointer;
}

.notifications-list { list-style: none; margin: 0; padding: 0; }
.notifications-list li {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 9px;
  align-items: start;
  padding: 11px 0;
  border-top: 1px solid #eeeae2;
}

.notification-icon {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: 9px;
  background: #f1eee7;
  color: #7e725d;
  font-size: 10px;
  font-weight: 800;
}

.notification-icon.order_update { background: #e8f1e8; color: #8a5a32; }
.notification-icon.payment_reminder { background: #f5ecdf; color: #8a5a32; }
.notification-icon.rating_request { background: #efe8ef; color: #795c7b; }
.notifications-list strong { font-size: 10px; }
.notifications-list p { margin: 3px 0 0; color: var(--dashboard-muted); font-size: 9px; line-height: 1.4; }
.notification-read { width: 24px; height: 24px; border: 1px solid #d8ccc4; border-radius: 50%; background: #fffefa; color: #5c3d24; cursor: pointer; font-weight: 800; }
.notification-read:hover { background: #f3e7d9; }

.empty-state {
  min-height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  color: var(--dashboard-muted);
  text-align: center;
}

.empty-state strong { color: var(--dashboard-ink); font-size: 12px; }
.empty-state span { font-size: 10px; }

.bottom-promo {
  margin-top: 14px;
  padding: 22px 24px;
  border-radius: 22px;
  background: radial-gradient(circle at 82% 30%, rgba(255,255,255,.12), transparent 25%), var(--dashboard-green);
  color: white;
  display: grid;
  grid-template-columns: 1fr auto auto 80px;
  gap: 30px;
  align-items: center;
  overflow: hidden;
}

.bottom-promo .section-kicker { color: #e5c9b7; }
.bottom-promo h2 { margin: 5px 0; max-width: 500px; font-size: 20px; letter-spacing: -.02em; }
.bottom-promo p { margin: 0; max-width: 590px; color: #ddc9bc; font-size: 10px; line-height: 1.5; }

.promo-stat { min-width: 80px; padding-left: 20px; border-left: 1px solid rgba(255,255,255,.16); }
.promo-stat strong, .promo-stat span { display: block; }
.promo-stat strong { font-size: 23px; }
.promo-stat span { margin-top: 2px; color: #d8c0b0; font-size: 9px; }

.promo-leaf {
  width: 60px;
  height: 60px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: rgba(255,255,255,.08);
  color: #ead9cc;
  font-size: 25px;
}

@media (max-width: 1050px) {
  .stats-grid, .category-strip { grid-template-columns: repeat(2, 1fr); }
  .content-grid { grid-template-columns: 1fr; }
  .tracking-panel { order: -1; }
  .hero-card { grid-template-columns: 1fr; }
  .hero-visual { display: none; }
  .bottom-promo { grid-template-columns: 1fr auto auto; }
  .promo-leaf { display: none; }
}

@media (max-width: 720px) {
  .section-tools { width: 100%; }
  .dashboard-page { padding: 0 0 28px; }
  .hero-card { border-radius: 20px; }
  .hero-copy { padding: 30px 22px; }
  .hero-copy h1 { font-size: 29px; }
  .hero-actions { flex-wrap: wrap; }
  .trust-row { grid-template-columns: repeat(2, 1fr); gap: 12px 4px; }
  .section-heading { align-items: stretch; flex-direction: column; }
  .search-box { width: 100%; }
  .stats-grid, .category-strip { grid-template-columns: 1fr 1fr; }
  .panel { padding: 15px; border-radius: 18px; }
  .order-row { grid-template-columns: 1fr auto; gap: 8px; }
  .order-items { display: none; }
  .eta { text-align: left; }
  .bottom-promo { grid-template-columns: 1fr 1fr; gap: 15px; }
  .bottom-promo > div:first-child { grid-column: 1 / -1; }
  .promo-stat { border-left: 0; padding-left: 0; }
}

@media (max-width: 480px) {
  .stats-grid, .category-strip { grid-template-columns: 1fr; }
  .metric-card { min-height: auto; }
  .trust-row { grid-template-columns: 1fr; }
  .trust-row > div { justify-content: flex-start; }
  .hero-actions button { width: 100%; }
  .tracking-steps { gap: 0; }
  .tracking-steps > div { font-size: 7px; }
  .bottom-promo { grid-template-columns: 1fr; }
}

/* Shared small-business visual system */
:global(body) { margin: 0; background: #f7f5f2; }
:global(*) { box-sizing: border-box; }
.dashboard-page { min-height: 100vh; background: #f7f5f2; color: #2f211d; }
.dashboard-page h1, .dashboard-page h2 { font-family: Georgia, "Times New Roman", serif; color: #2f211d; }
.hero-card, .metric-card, .panel { border-color: #e6ddd7; box-shadow: 0 8px 24px rgba(62,43,29,.05); }
@media (max-width: 760px) {
  .dashboard-main { width: calc(100% - 24px); }
 .dashboard-page { width: 100%; } }
</style>