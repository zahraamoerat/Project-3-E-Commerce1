import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

// Create the Vue app and register the shared plugins.
const app = createApp(App);

app.use(router);
app.use(createPinia());

// Start the app inside the root element from index.html.
app.mount("#app");
