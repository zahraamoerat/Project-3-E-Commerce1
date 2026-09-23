<template>
  <div class="main-content">
    <div class="card">
      <h2>{{ pageName }}</h2>
      <p style="color: var(--color-text-muted);">This page is being built by another team member.</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const pageName = computed(() =>
  route.meta.label || route.path.replace("/", "").replace("-", " ")
);
</script>
