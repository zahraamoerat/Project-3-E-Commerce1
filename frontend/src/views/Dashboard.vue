<template>
  <div class="main-content">
    <!-- Loading state -->
    <div v-if="isLoading" class="state-message">
      <p>Loading dashboard…</p>
    </div>

    <!-- No buyer profile yet -->
    <div v-else-if="needsProfile" class="state-message card">
      <h3>Set up your business profile</h3>
      <p class="subtitle">
        You need to complete your Business Profile before your dashboard can show real data.
      </p>
      <button class="btn-primary" @click="router.push('/business-profile')">
        Go to Business Profile
      </button>
    </div>

    <!-- Real error (not the "no profile" case) -->
    <div v-else-if="loadError" class="state-message card error-state">
      <h3>Couldn't load your dashboard</h3>
      <p class="subtitle">{{ loadError }}</p>
      <button class="btn-primary" @click="loadDashboard">Try again</button>
    </div>

    <!-- Loaded successfully -->
    <template v-else>
      <header class="page-header">
        <div>
          <h1>Welcome back, {{ business.name }}</h1>
          <p class="subtitle">Here's what's moving across your orders today.</p>
        </div>
        <div class="search-box">
          <input type="text" placeholder="Search suppliers or products..." />
        </div>
      </header>

      <!-- Stat cards -->
      <section class="stats-grid">
        <div class="card stat-card">
          <span class="stat-label">Active orders</span>
          <span class="stat-value">{{ stats.activeOrders }}</span>
        </div>
        <div class="card stat-card">
          <span class="stat-label">Pending payment</span>
          <span class="stat-value">R{{ formatMoney(stats.pendingPayment) }}</span>
          <span class="stat-trend warning" v-if="stats.pendingInvoices > 0">
            {{ stats.pendingInvoices }} invoice{{ stats.pendingInvoices > 1 ? "s" : "" }} due
          </span>
        </div>
        <div class="card stat-card">
          <span class="stat-label">In transit</span>
          <span class="stat-value">{{ stats.inTransit }}</span>
        </div>
        <div class="card stat-card">
          <span class="stat-label">Total spend (mo.)</span>
          <span class="stat-value">R{{ formatMoney(stats.totalSpend) }}</span>
          <span
            class="stat-trend"
            :class="stats.spendChangePercent >= 0 ? 'positive' : 'negative'"
            v-if="stats.spendChangePercent !== 0"
          >
            {{ stats.spendChangePercent > 0 ? "+" : "" }}{{ stats.spendChangePercent }}% vs last month
          </span>
        </div>
      </section>

      <div class="two-col">
        <!-- Recent orders -->
        <section class="card">
          <h3>Recent orders</h3>
          <table class="orders-table" v-if="recentOrders.length">
            <thead>
              <tr>
                <th>Order</th>
                <th>Supplier</th>
                <th>Items</th>
                <th>Status</th>
                <th>ETA</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in recentOrders" :key="order.orderId">
                <td>#{{ order.orderId }}</td>
                <td>{{ order.supplierName }}</td>
                <td class="truncate">{{ order.itemsSummary || "—" }}</td>
                <td><span class="status-pill" :class="order.status">{{ statusLabel(order.status) }}</span></td>
                <td>{{ order.eta || "—" }}</td>
              </tr>
            </tbody>
          </table>
          <p class="subtitle" v-else>No orders yet.</p>

          <h3 class="section-spacer">Suggested suppliers</h3>
          <ul class="suggested-list" v-if="suggestedSuppliers.length">
            <li v-for="s in suggestedSuppliers" :key="s.supplierId" @click="goToSuppliers">
              <div class="supplier-initials">{{ initials(s.companyName) }}</div>
              <div class="supplier-info">
                <strong>{{ s.companyName }}</strong>
                <span>{{ s.description }}</span>
              </div>
              <span class="chevron">›</span>
            </li>
          </ul>
          <p class="subtitle" v-else>No suggestions right now.</p>
        </section>

        <!-- Tracking + notifications -->
        <section class="side-col">
          <div class="card" v-if="trackedOrder">
            <h3>Order #{{ trackedOrder.orderId }} tracking</h3>
            <div class="tracking-steps">
              <span :class="{ active: true }">Placed</span>
              <span :class="{ active: trackedOrder.status !== 'awaiting_pickup' }">Dispatched</span>
              <span :class="{ active: trackedOrder.status === 'in_transit' || trackedOrder.status === 'delivered' }">In transit</span>
              <span :class="{ active: trackedOrder.status === 'delivered' }">Delivered</span>
            </div>
            <div class="map-placeholder">
              <span>
                Simulated GPS marker — courier is approx.
                {{ trackedOrder.etaMinutes ?? "?" }} minutes from {{ trackedOrder.destinationCity }}
              </span>
            </div>
          </div>
          <div class="card" v-else>
            <h3>Order tracking</h3>
            <p class="subtitle">Nothing in transit right now.</p>
          </div>

          <div class="card">
            <h3>Notifications</h3>
            <ul class="notifications-list" v-if="notifications.length">
              <li v-for="n in notifications" :key="n.notificationId" :class="{ unread: !n.isRead }">
                <span class="dot"></span>
                <div>
                  <strong>{{ n.title }}</strong>
                  <p>{{ n.message }}</p>
                </div>
              </li>
            </ul>
            <p class="subtitle" v-else>No notifications.</p>
          </div>
        </section>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";

const router = useRouter();

const isLoading = ref(true);
const needsProfile = ref(false);
const loadError = ref(null);

const business = ref({ name: "" });
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
const trackedOrder = ref(null);
const notifications = ref([]);

function formatMoney(n) {
  return Number(n).toLocaleString("en-ZA", { minimumFractionDigits: 0 });
}
function statusLabel(status) {
  return {
    out_for_delivery: "Out for delivery",
    dispatched: "Dispatched",
    delivered: "Delivered",
    processing: "Processing",
    pending: "Pending",
    shipped: "Shipped",
    cancelled: "Cancelled",
  }[status] || status;
}
function initials(name) {
  return (name || "")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
function goToSuppliers() {
  router.push("/browse-suppliers");
}

async function loadDashboard() {
  isLoading.value = true;
  needsProfile.value = false;
  loadError.value = null;

  try {
    const { data } = await api.get("/dashboard");
    business.value = data.business;
    stats.value = data.stats;
    recentOrders.value = data.recentOrders;
    suggestedSuppliers.value = data.suggestedSuppliers;
    trackedOrder.value = data.trackedOrder;
    notifications.value = data.notifications;
  } catch (err) {
    console.error("Failed to load dashboard data:", err);

    if (err.response?.status === 404 && err.response?.data?.error === "No buyer profile found for this user") {
      needsProfile.value = true;
    } else {
      loadError.value =
        err.response?.data?.error || "Something went wrong loading your dashboard. Please try again.";
    }
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadDashboard);
</script>

<style scoped>
.state-message {
  max-width: 480px;
  margin: 80px auto;
  text-align: center;
  padding: 32px;
}
.state-message h3 {
  margin-bottom: 8px;
}
.state-message .subtitle {
  margin-bottom: 20px;
}
.error-state h3 {
  color: var(--color-warning, #b35c00);
}
.btn-primary {
  background: var(--color-accent);
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: var(--radius-sm, 6px);
  font-weight: 600;
  cursor: pointer;
}
.btn-primary:hover {
  opacity: 0.9;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}
.subtitle {
  color: var(--color-text-muted);
  font-size: 14px;
  margin: 4px 0 0;
}
.search-box input {
  width: 260px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}
.stat-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.stat-label {
  font-size: 12px;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
.stat-value {
  font-size: 24px;
  font-weight: 700;
}
.stat-trend {
  font-size: 12px;
  color: var(--color-text-muted);
}
.stat-trend.positive { color: var(--color-success); }
.stat-trend.negative { color: var(--color-warning); }
.stat-trend.warning { color: var(--color-warning); }

.two-col {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 20px;
  align-items: start;
}
.side-col {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.orders-table th {
  text-align: left;
  color: var(--color-text-muted);
  font-weight: 500;
  padding: 8px 6px;
  border-bottom: 1px solid var(--color-border);
}
.orders-table td {
  padding: 10px 6px;
  border-bottom: 1px solid var(--color-border);
}
.truncate {
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status-pill {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 20px;
  background: #EEE;
}
.status-pill.out_for_delivery { background: var(--color-accent-soft); color: var(--color-accent); }
.status-pill.dispatched { background: #E7EEF7; color: #3563A8; }
.status-pill.delivered { background: #E3F2E7; color: var(--color-success); }
.status-pill.processing { background: #F3F0E9; color: var(--color-warning); }
.status-pill.pending { background: #F3F0E9; color: var(--color-warning); }
.status-pill.shipped { background: #E7EEF7; color: #3563A8; }
.status-pill.cancelled { background: #F5E5E5; color: #A33; }

.section-spacer { margin-top: 24px; }

.suggested-list { list-style: none; padding: 0; margin: 12px 0 0; }
.suggested-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
}
.suggested-list li:hover {
  background: var(--color-accent-soft);
}
.supplier-initials {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-accent-soft);
  color: var(--color-accent);
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.supplier-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  font-size: 13px;
}
.supplier-info span { color: var(--color-text-muted); font-size: 12px; }
.chevron { color: var(--color-text-muted); }

.tracking-steps {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--color-text-muted);
  margin: 12px 0;
}
.tracking-steps .active { color: var(--color-accent); font-weight: 600; }

.map-placeholder {
  height: 140px;
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, #E7EEF7, #F5F3EF);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 12px;
  font-size: 12px;
  color: var(--color-text-muted);
}

.notifications-list { list-style: none; padding: 0; margin: 12px 0 0; }
.notifications-list li {
  display: flex;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid var(--color-border);
  font-size: 13px;
}
.notifications-list li p { margin: 2px 0 0; color: var(--color-text-muted); font-size: 12px; }
.notifications-list li.unread strong { color: var(--color-text); }
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 5px;
  flex-shrink: 0;
  background: var(--color-accent);
}
</style>