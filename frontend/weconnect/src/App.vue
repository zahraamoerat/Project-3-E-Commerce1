<template>
  <!-- Route views are rendered inside the shared app shell. -->
  <router-view />
</template>

<script>
// Root component used by every page in the application.
export default {
  name: "App",
};
</script>

<style>
/* Global page defaults */
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: #f6f4ee;
}
</style>
