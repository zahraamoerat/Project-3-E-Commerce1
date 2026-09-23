<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Sidebar from "../components/Sidebar.vue";

const router = useRouter();
const route = useRoute();
const paletteOpen = ref(false);
const paletteQuery = ref("");

const commands = [
  { label: "Open dashboard", path: "/dashboard", hint: "Overview" },
  { label: "Browse products", path: "/products", hint: "Catalog" },
  { label: "Manage stock", path: "/stockmanagement", hint: "Inventory" },
  { label: "Review orders", path: "/orders", hint: "Fulfilment" },
  { label: "Track deliveries", path: "/deliveries", hint: "Logistics" },
  { label: "Read reviews", path: "/reviews", hint: "Feedback" },
  { label: "Edit business profile", path: "/profile", hint: "Settings" },
];

const visibleCommands = computed(() => commands.filter((command) =>
  `${command.label} ${command.hint}`.toLowerCase().includes(paletteQuery.value.toLowerCase().trim())
));

const pageTitle = computed(() => {
  const titles = {
    SupplierDashboard: "Dashboard",
    S_Products: "Products",
    AddProducts: "Add Product",
    EditProduct: "Edit Product",
    ViewProduct: "Product Details",
    Reviews: "Reviews",
    StockManagement: "Stock Management",
    RestockPage: "Restock",
    Orders: "Orders",
    Deliveries: "Deliveries",
    Profile: "Business Profile",
  };
  return titles[route.name] || "WeConnect";
});

const userInitials = computed(() => {
  const email = localStorage.getItem("weconnect_email") || "";
  if (!email) return "S";
  return email.split("@")[0].replace(/[._-]+/g, " ").trim().split(/\s+/).filter(Boolean)
    .slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "S";
});

function openPalette() {
  paletteOpen.value = true;
  paletteQuery.value = "";
}

function closePalette() {
  paletteOpen.value = false;
}

function runCommand(command) {
  router.push(command.path);
  closePalette();
}

function handleShortcut(event) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    paletteOpen.value ? closePalette() : openPalette();
  }
  if (event.key === "Escape") closePalette();
}

function goToProfile() {
  router.push("/profile");
}

onMounted(() => window.addEventListener("keydown", handleShortcut));
onUnmounted(() => window.removeEventListener("keydown", handleShortcut));
</script>

<template>
  <div class="sidebar_main-layout">
    <Sidebar />

    <main class="sidebar_main-content">
      <header class="portal_topbar">
        <div class="portal_topbar-title">
          <span>WeConnect</span>
          <strong>{{ pageTitle }}</strong>
        </div>

        <div class="portal_topbar-actions">
          <button type="button" class="portal_notification" aria-label="Notifications">♧<span></span></button>
          <button type="button" class="portal_profile" @click="goToProfile" aria-label="Open profile">
            <span class="portal_avatar">{{ userInitials }}</span>
            <span class="portal_profile-copy">
              <strong>{{ userInitials }}</strong>
              <small>Supplier</small>
            </span>
            <span class="portal_profile-chevron">⌄</span>
          </button>
          <button type="button" class="portal_quick-jump" @click="openPalette">⌕ <span>Quick jump</span><kbd>Ctrl K</kbd></button>
        </div>
      </header>

      <section v-if="route.name === 'SupplierDashboard'" class="portal_cover">
        <div>
          <span>SUPPLIER PORTAL</span>
          <h1>Manage your business in one place.</h1>
          <p>Products, orders, stock and deliveries stay connected through WeConnect.</p>
        </div>
        <div class="portal_cover-badge">
          <span class="portal_cover-avatar">{{ userInitials }}</span>
          <div><strong>{{ userInitials }}</strong><small>Supplier account</small></div>
        </div>
      </section>

      <router-view />
    </main>
  </div>

  <div v-if="paletteOpen" class="palette-backdrop" @click.self="closePalette">
    <section class="command-palette" role="dialog" aria-modal="true" aria-label="Quick navigation">
      <div class="palette-search"><span>⌕</span><input v-model="paletteQuery" autofocus placeholder="Jump to a page..." /></div>
      <div class="command-list">
        <button v-for="command in visibleCommands" :key="command.path" type="button" class="command-item" @click="runCommand(command)">
          <span>{{ command.label }}</span><small>{{ command.hint }}</small>
        </button>
        <p v-if="!visibleCommands.length" class="command-empty">No matching page.</p>
      </div>
      <footer><span>Press <kbd>Esc</kbd> to close</span><span>Navigate anywhere in WeConnect</span></footer>
    </section>
  </div>
</template>

<style scoped>
:global(html), :global(body), :global(#app) {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100%;
}

.sidebar_main-layout {
  display: flex;
  width: 100%;
  min-height: 100vh;
  background: #f5f7fb;
}

.sidebar_main-content {
  flex: 1;
  min-width: 0;
  min-height: 100vh;
  overflow-x: hidden;
}

.portal_topbar {
  position: sticky;
  top: 0;
  z-index: 900;
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 0 28px;
  border-bottom: 1px solid #e7eaf0;
  background: rgba(255,255,255,.96);
  backdrop-filter: blur(12px);
}

.portal_topbar-title {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.portal_topbar-title span {
  color: #98a2b3;
  font-size: 11px;
  font-weight: 700;
}

.portal_topbar-title strong {
  color: #344054;
  font-size: 13px;
  font-weight: 750;
}

.portal_topbar-actions {
  display: flex;
  align-items: center;
  gap: 9px;
}

.portal_notification {
  position: relative;
  width: 35px;
  height: 35px;
  border: 1px solid #e1e6ef;
  border-radius: 50%;
  background: #fff;
  color: #667085;
  cursor: pointer;
}

.portal_notification span {
  position: absolute;
  top: 7px;
  right: 8px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #e85d5d;
}

.portal_profile {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 0;
  background: transparent;
  color: #344054;
  cursor: pointer;
}

.portal_avatar,
.portal_cover-avatar {
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #4169e1;
  color: #fff;
  font-weight: 800;
}

.portal_avatar {
  width: 32px;
  height: 32px;
  font-size: 10px;
}

.portal_profile-copy {
  display: grid;
  text-align: left;
}

.portal_profile-copy strong {
  font-size: 11px;
}

.portal_profile-copy small {
  color: #98a2b3;
  font-size: 9px;
}

.portal_profile-chevron {
  color: #98a2b3;
  font-size: 14px;
}

.portal_quick-jump {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 10px;
  border: 1px solid #e1e6ef;
  border-radius: 8px;
  background: #fff;
  color: #667085;
  font-size: 10px;
  cursor: pointer;
}

.portal_quick-jump kbd {
  padding: 2px 5px;
  border: 1px solid #e1e6ef;
  border-radius: 4px;
  background: #f7f8fa;
  font-size: 9px;
}

.portal_cover {
  min-height: 158px;
  margin: 0;
  padding: 26px 34px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 25px;
  color: #fff;
  background:
    radial-gradient(circle at 12% 25%, rgba(255,255,255,.16) 0 16%, transparent 17%),
    linear-gradient(135deg, #355bd4 0%, #5478e8 55%, #3456c5 100%);
}

.portal_cover > div:first-child {
  max-width: 690px;
}

.portal_cover > div:first-child > span {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.6px;
  opacity: .85;
}

.portal_cover h1 {
  margin: 7px 0 5px;
  font: 700 clamp(24px, 3vw, 34px) Georgia, serif;
}

.portal_cover p {
  margin: 0;
  color: #e4ebff;
  font-size: 12px;
  line-height: 1.6;
}

.portal_cover-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 170px;
  padding: 12px;
  border: 1px solid rgba(255,255,255,.25);
  border-radius: 12px;
  background: rgba(255,255,255,.12);
  backdrop-filter: blur(8px);
}

.portal_cover-avatar {
  width: 38px;
  height: 38px;
  font-size: 11px;
  background: #fff;
  color: #4169e1;
}

.portal_cover-badge strong,
.portal_cover-badge small {
  display: block;
}

.portal_cover-badge strong { font-size: 11px; }
.portal_cover-badge small { margin-top: 2px; color: #dce5ff; font-size: 9px; }

.palette-backdrop {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: grid;
  place-items: start center;
  padding-top: min(18vh, 150px);
  background: rgba(35, 45, 72, .35);
}

.command-palette {
  width: min(520px, calc(100vw - 32px));
  border: 1px solid #e1e6ef;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 28px 80px rgba(31,41,55,.22);
  overflow: hidden;
}

.palette-search {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 18px;
  border-bottom: 1px solid #eef1f5;
  color: #4169e1;
}

.palette-search input {
  width: 100%;
  border: 0;
  outline: 0;
  color: #344054;
  font-size: 15px;
}

.command-list { padding: 8px; }

.command-item {
  display: flex;
  justify-content: space-between;
  width: 100%;
  border: 0;
  border-radius: 8px;
  padding: 12px;
  background: transparent;
  color: #344054;
  text-align: left;
  cursor: pointer;
}

.command-item:hover { background: #f4f7ff; }
.command-item small, .command-empty, .command-palette footer { color: #98a2b3; font-size: 11px; }
.command-empty { padding: 18px 12px; text-align: center; }

.command-palette footer {
  display: flex;
  justify-content: space-between;
  padding: 11px 16px;
  border-top: 1px solid #eef1f5;
  background: #fafbfc;
}

@media (max-width: 700px) {
  .portal_topbar {
    padding: 0 14px;
    min-height: 58px;
  }

  .portal_topbar-title span,
  .portal_profile-copy,
  .portal_quick-jump span,
  .portal_quick-jump kbd {
    display: none;
  }

  .portal_cover {
    padding: 22px 18px;
  }

  .portal_cover-badge { display: none; }
}
</style>