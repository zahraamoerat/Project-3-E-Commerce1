<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import Sidebar from "../components/Sidebar.vue";

const router = useRouter();
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

const visibleCommands = () => commands.filter((command) =>
  `${command.label} ${command.hint}`.toLowerCase().includes(paletteQuery.value.toLowerCase().trim()),
);

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

onMounted(() => window.addEventListener("keydown", handleShortcut));
onUnmounted(() => window.removeEventListener("keydown", handleShortcut));
</script>

<template>
  <div class="sidebar_main-layout">
    <Sidebar />

    <main class="sidebar_main-content">
      <div class="quick-bar">
        <button type="button" class="quick-bar_button" @click="openPalette">
          <span>⌕</span> Quick jump <kbd>Ctrl K</kbd>
        </button>
      </div>
      <router-view />
    </main>
  </div>
  <div v-if="paletteOpen" class="palette-backdrop" @click.self="closePalette">
    <section class="command-palette" role="dialog" aria-modal="true" aria-label="Quick navigation">
      <div class="palette-search"><span>⌕</span><input v-model="paletteQuery" autofocus placeholder="Jump to a page..." /></div>
      <div class="command-list">
        <button v-for="command in visibleCommands()" :key="command.path" type="button" class="command-item" @click="runCommand(command)">
          <span>{{ command.label }}</span><small>{{ command.hint }}</small>
        </button>
        <p v-if="!visibleCommands().length" class="command-empty">No matching page.</p>
      </div>
      <footer><span>Press <kbd>Esc</kbd> to close</span><span>Navigate anywhere in WeConnect</span></footer>
    </section>
  </div>
</template>

<style scoped>
:global(html),
:global(body),
:global(#app) {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100%;
}

.sidebar_main-layout {
  display: flex;
  gap: 0;
  width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  background: #f7f5f2;
}

.sidebar_main-content {
  flex: 1;
  min-width: 0;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

.quick-bar {
  display: flex;
  justify-content: flex-end;
  padding: 10px 24px 0;
  background: #f7f5f2;
}

.quick-bar_button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #e4ddd8;
  border-radius: 8px;
  padding: 7px 10px;
  background: #fff;
  color: #816f67;
  font-size: 11px;
  cursor: pointer;
}

.quick-bar_button span {
  color: #d2763d;
  font-size: 15px;
}

kbd {
  padding: 2px 5px;
  border: 1px solid #e3dad4;
  border-radius: 4px;
  background: #f8f5f2;
  color: #8c796f;
  font-size: 10px;
}

.palette-backdrop {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: grid;
  place-items: start center;
  padding-top: min(18vh, 150px);
  background: rgba(54, 38, 32, 0.35);
}

.command-palette {
  width: min(520px, calc(100vw - 32px));
  border: 1px solid #e2d8d0;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 22px 70px rgba(59, 37, 27, 0.22);
  overflow: hidden;
}

.palette-search {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 18px;
  border-bottom: 1px solid #eee8e3;
  color: #d2763d;
}

.palette-search input {
  width: 100%;
  border: 0;
  outline: 0;
  color: #4d3933;
  font-size: 15px;
}

.command-list {
  padding: 8px;
}

.command-item {
  display: flex;
  justify-content: space-between;
  width: 100%;
  border: 0;
  border-radius: 8px;
  padding: 12px;
  background: transparent;
  color: #4d3933;
  text-align: left;
  cursor: pointer;
}

.command-item:hover {
  background: #f8f2ed;
}

.command-item small,
.command-empty,
.command-palette footer {
  color: #99877e;
  font-size: 11px;
}

.command-empty {
  padding: 18px 12px;
  text-align: center;
}

.command-palette footer {
  display: flex;
  justify-content: space-between;
  padding: 11px 16px;
  border-top: 1px solid #eee8e3;
  background: #faf8f6;
}

@media (max-width: 700px) {
  .sidebar_main-layout {
    flex-direction: column;
  }

  .sidebar_main-content {
    min-height: auto;
  }

  .quick-bar {
    padding: 8px 16px 0;
  }
}
</style>
