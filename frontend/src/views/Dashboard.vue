<template>
  <div class="main-content">
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
        <span class="stat-trend positive">+2 this week</span>
      </div>
      <div class="card stat-card highlight">
        <span class="stat-label">Pending payment</span>
        <span class="stat-value">R{{ formatMoney(stats.pendingPayment) }}</span>
        <span class="stat-trend warning">{{ stats.pendingInvoices }} invoice due</span>
      </div>
      <div class="card stat-card">
        <span class="stat-label">In transit</span>
        <span class="stat-value">{{ stats.inTransit }}</span>
        <span class="stat-trend">On schedule</span>
      </div>
      <div class="card stat-card">
        <span class="stat-label">Total spend (mo.)</span>
        <span class="stat-value">R{{ formatMoney(stats.totalSpend) }}</span>
        <span class="stat-trend positive">+{{ stats.spendChangePercent }}% vs last month</span>
      </div>
    </section>

    <div class="two-col">
      <!-- Recent orders -->
      <section class="card">
        <h3>Recent orders</h3>
        <table class="orders-table">
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
              <td class="truncate">{{ order.itemsSummary }}</td>
              <td><span class="status-pill" :class="order.status">{{ statusLabel(order.status) }}</span></td>
              <td>{{ order.eta || "—" }}</td>
            </tr>
          </tbody>
        </table>

        <h3 class="section-spacer">Suggested suppliers</h3>
        <ul class="suggested-list">
          <li v-for="s in suggestedSuppliers" :key="s.supplierId">
            <div class="supplier-initials">{{ initials(s.companyName) }}</div>
            <div class="supplier-info">
              <strong>{{ s.companyName }}</strong>
              <span>{{ s.description }}</span>
            </div>
            <span class="chevron">›</span>
          </li>
        </ul>
      </section>

      <!-- Tracking + notifications -->
      <section class="side-col">
        <div class="card">
          <h3>Order #{{ trackedOrder.orderId }} tracking</h3>
          <div class="tracking-steps">
            <span :class="{ active: true }">Placed</span>
            <span :class="{ active: trackedOrder.status !== 'awaiting_pickup' }">Dispatched</span>
            <span :class="{ active: trackedOrder.status === 'in_transit' || trackedOrder.status === 'delivered' }">In transit</span>
            <span :class="{ active: trackedOrder.status === 'delivered' }">Delivered</span>
          </div>
          <div class="map-placeholder">
            <span>Simulated GPS marker — courier is approx. {{ trackedOrder.etaMinutes }} minutes from {{ trackedOrder.destinationCity }}</span>
          </div>
        </div>

        <div class="card">
          <h3>Notifications</h3>
          <ul class="notifications-list">
            <li v-for="n in notifications" :key="n.notificationId" :class="{ unread: !n.isRead }">
              <span class="dot" :class="n.type"></span>
              <div>
                <strong>{{ notificationTitle(n.type) }}</strong>
                <p>{{ n.message }}</p>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api";

// Populated from GET /api/dashboard once the backend route exists.
// Placeholder sample data below so the page is viewable while you build.
const business = ref({ name: "Ndlovu Farm Supplies" });

const stats = ref({
  activeOrders: 6,
  pendingPayment: 2140,
  pendingInvoices: 1,
  inTransit: 2,
  totalSpend: 18760,
  spendChangePercent: 11,
});

const recentOrders = ref([
  { orderId: "SB-1042", supplierName: "Highveld Seed Co...", itemsSummary: "Maize seed (10kg bags)...", status: "out_for_delivery", eta: "24 min" },
  { orderId: "SB-1041", supplierName: "Karoo Fertiliser T...", itemsSummary: "NPK fertiliser (50kg)...", status: "dispatched", eta: "Tomorrow 9–11am" },
  { orderId: "SB-1038", supplierName: "CropGuard Distrib...", itemsSummary: "Crop protection spray...", status: "delivered", eta: "—" },
  { orderId: "SB-1035", supplierName: "FarmTech Equipm...", itemsSummary: "Irrigation pipe fittings...", status: "processing", eta: "Awaiting confirmation" },
]);

const suggestedSuppliers = ref([
  { supplierId: 1, companyName: "Highveld Seed Co.", description: "Certified maize, wheat & soya seed supplier" },
  { supplierId: 2, companyName: "Karoo Fertiliser Traders", description: "Bulk NPK, lime, and soil conditioner supply" },
  { supplierId: 3, companyName: "FarmTech Equipment Parts", description: "Tractor and irrigation equipment spares" },
]);

const trackedOrder = ref({
  orderId: "SB-1042",
  status: "in_transit",
  etaMinutes: 24,
  destinationCity: "Bloemfontein",
});

const notifications = ref([
  { notificationId: 1, type: "order_update", message: "Karoo Fertiliser Traders has accepted your NPK fertiliser order", isRead: false },
  { notificationId: 2, type: "payment_reminder", message: "Invoice for #SB-1035 is due in 2 days (R1,450)", isRead: false },
  { notificationId: 3, type: "rating_request", message: "Share your feedback for FarmTech Equipment Parts' delivery", isRead: true },
]);

function formatMoney(n) {
  return Number(n).toLocaleString("en-ZA", { minimumFractionDigits: 0 });
}
function statusLabel(status) {
  return {
    out_for_delivery: "Out for delivery",
    dispatched: "Dispatched",
    delivered: "Delivered",
    processing: "Processing",
  }[status] || status;
}
function notificationTitle(type) {
  return {
    order_update: "Order Confirmed",
    payment_reminder: "Payment Reminder",
    rating_request: "New Rating Available",
    message: "New Message",
    system: "Notice",
  }[type] || "Notification";
}
function initials(name) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

async function loadDashboard() {
  // Once the backend route exists, replace the ref() sample data above with:
  // const { data } = await api.get("/dashboard");
  // business.value = data.business; stats.value = data.stats; etc.
}

onMounted(loadDashboard);
</script>

<style scoped>
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
.stat-card.highlight {
  border-color: var(--color-accent);
  background: var(--color-accent-soft);
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

.section-spacer { margin-top: 24px; }

.suggested-list { list-style: none; padding: 0; margin: 12px 0 0; }
.suggested-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--color-border);
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
  background: var(--color-text-muted);
}
.dot.order_update { background: var(--color-success); }
.dot.payment_reminder { background: var(--color-warning); }
.dot.rating_request { background: var(--color-accent); }
</style>
