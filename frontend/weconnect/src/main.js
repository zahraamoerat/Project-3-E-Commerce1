import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./stores";

// 1. Import core & components
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// 2. Import the explicit icons you want to use (e.g., shopping-cart)
import { faShoppingCart, faUser } from "@fortawesome/free-solid-svg-icons";

// 3. Add icons to the library
library.add(faShoppingCart, faUser);

const app = createApp(App);

app.use(router);
app.use(store);

// 4. Register the component globally
app.component("font-awesome-icon", FontAwesomeIcon);

app.mount("#app");
