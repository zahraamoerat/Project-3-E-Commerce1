<template>
  <section class="restock-page">
    <div class="card" v-if="product">
      <span class="eyebrow">INVENTORY</span>
      <h1>Restock product</h1>
      <p class="product-name">{{ product.product_name }}</p>
      <p class="current">Current stock: <strong>{{ product.quantity }}</strong> units</p>

      <label>
        Quantity to add
        <input v-model.number="quantity" type="number" min="1" step="1" />
      </label>

      <label>
        Reason
        <select v-model="reason">
          <option>Delivery received</option>
          <option>Returned stock</option>
          <option>Stock count correction</option>
        </select>
      </label>

      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="message" class="success">{{ message }}</p>

      <div class="actions">
        <button type="button" class="cancel" @click="router.back()">Cancel</button>
        <button type="button" class="save" :disabled="saving" @click="restock">
          {{ saving ? "Saving..." : "Restock" }}
        </button>
      </div>
    </div>

    <div v-else class="card">
      <h1>Product not found</h1>
      <p>The selected product could not be found in your inventory.</p>
      <button class="save" @click="router.push('/stockmanagement')">Back to stock</button>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSupplierData } from "@/data/supplierData";

const route = useRoute();
const router = useRouter();
const { products, updateProductStock } = useSupplierData();

const product = computed(() =>
  products.value.find((item) => String(item.product_id) === String(route.params.id))
);

const quantity = ref(1);
const reason = ref("Delivery received");
const saving = ref(false);
const error = ref("");
const message = ref("");

async function restock() {
  const amount = Number(quantity.value);

  if (!Number.isInteger(amount) || amount < 1) {
    error.value = "Enter a valid quantity greater than 0.";
    return;
  }

  if (!product.value) return;

  saving.value = true;
  error.value = "";
  message.value = "";

  try {
    await updateProductStock(
      product.value.product_id,
      Number(product.value.quantity || 0) + amount,
      reason.value
    );

    message.value = "Stock updated successfully.";

    setTimeout(() => {
      router.push("/stockmanagement");
    }, 700);
  } catch (err) {
    error.value = err.message || "Unable to update stock.";
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.restock-page {
  min-height: 100vh;
  padding: 40px;
  background: #f7f5f2;
  color: #553c35;
}

.card {
  width: min(560px, 100%);
  margin: 30px auto;
  padding: 32px;
  border: 1px solid #e4dcd5;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 10px 35px rgba(70, 50, 40, .06);
}

.eyebrow {
  color: #c96d38;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 2px;
}

h1 {
  margin: 8px 0;
  font: 700 30px Georgia, serif;
}

.product-name {
  font-size: 18px;
  font-weight: 700;
}

.current {
  color: #8d7b72;
  margin-bottom: 24px;
}

label {
  display: block;
  margin: 16px 0;
  font-size: 12px;
  font-weight: 700;
}

input,
select {
  display: block;
  box-sizing: border-box;
  width: 100%;
  margin-top: 7px;
  padding: 11px;
  border: 1px solid #ddd3cc;
  border-radius: 9px;
  background: #fff;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 24px;
}

button {
  border: 0;
  border-radius: 9px;
  padding: 10px 16px;
  font-weight: 700;
  cursor: pointer;
}

.cancel {
  background: #f0ebe7;
  color: #66534b;
}

.save {
  background: #725247;
  color: #fff;
}

.save:disabled {
  opacity: .6;
}

.error {
  color: #a64e46;
  background: #fff3f1;
  padding: 10px;
  border-radius: 8px;
}

.success {
  color: #397052;
  background: #f0f8f2;
  padding: 10px;
  border-radius: 8px;
}
</style>