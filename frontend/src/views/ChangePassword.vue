<template>
  <div class="page-wrapper">
    <main class="card">
      <div class="header">
        <router-link to="/" class="brand">WeConnect</router-link>
        <span class="eyebrow">ACCOUNT SECURITY</span>
      </div>

      <h1>Choose a new password</h1>
      <p class="intro">
        Your temporary password must be replaced before you can continue.
      </p>

      <p v-if="error" class="error-message">{{ error }}</p>

      <form @submit.prevent="submit" class="form">
        <label for="new-password">New password</label>
        <input
          id="new-password"
          v-model="newPassword"
          type="password"
          minlength="12"
          autocomplete="new-password"
          required
        />
        <p class="hint">Use at least 12 characters with uppercase, lowercase, a number, and a symbol.</p>

        <label for="confirm-password">Confirm new password</label>
        <input
          id="confirm-password"
          v-model="confirmPassword"
          type="password"
          minlength="12"
          autocomplete="new-password"
          required
        />

        <button type="submit" :disabled="isLoading">
          {{ isLoading ? "Updating..." : "Update password" }}
        </button>
      </form>
    </main>
  </div>
</template>

<script>
import { api } from "@/services/api";

export default {
  name: "ChangePasswordPage",
  data() {
    return {
      newPassword: "",
      confirmPassword: "",
      error: "",
      isLoading: false,
    };
  },
  methods: {
    async submit() {
      this.error = "";
      if (this.newPassword !== this.confirmPassword) {
        this.error = "The passwords do not match.";
        return;
      }
      if (!/[a-z]/.test(this.newPassword) || !/[A-Z]/.test(this.newPassword) || !/[0-9]/.test(this.newPassword) || !/[^A-Za-z0-9]/.test(this.newPassword)) {
        this.error = "Use uppercase, lowercase, number, and symbol characters.";
        return;
      }

      this.isLoading = true;
      try {
        const result = await api.changePassword(this.newPassword);
        if (!result.token) {
          throw new Error("Password change could not be completed.");
        }

        localStorage.setItem("weconnect_token", result.token);
        localStorage.setItem("weconnect_role", result.role);
        localStorage.setItem("weconnect_user_id", String(result.userId));
        localStorage.setItem("weconnect_email", result.user?.email || "");
        if (result.buyerId) {
          localStorage.setItem("weconnect_buyer_id", String(result.buyerId));
        }
        if (result.supplierId) {
          localStorage.setItem("weconnect_supplier_id", String(result.supplierId));
        }
        localStorage.removeItem("weconnect_password_change_token");

        await this.$router.push(
          result.role === "buyer"
            ? "/small-business/dashboard"
            : "/supplier-dashboard",
        );
      } catch (error) {
        this.error = error.message;
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: #f7f5f0;
  color: #332d29;
  font-family: system-ui, -apple-system, sans-serif;
}

.card {
  width: min(100%, 32rem);
  box-sizing: border-box;
  padding: 2rem;
  background: #ffffff;
  border: 1px solid #e7e5e4;
  border-radius: 1rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2.5rem;
}

.brand {
  color: #2d2522;
  font-size: 1.25rem;
  font-weight: 700;
  text-decoration: none;
}

.eyebrow {
  color: #78716c;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.08em;
}

h1 {
  margin: 0;
  color: #2d2522;
  font-size: 1.75rem;
  letter-spacing: -0.025em;
}

.intro {
  margin: 0.75rem 0 1.5rem;
  color: #78716c;
  line-height: 1.5;
}

.form {
  display: grid;
  gap: 0.65rem;
}

label {
  color: #44403c;
  font-size: 0.8rem;
  font-weight: 600;
}

input {
  width: 100%;
  box-sizing: border-box;
  padding: 0.8rem 0.9rem;
  border: 1px solid #d6d3d1;
  border-radius: 0.5rem;
  color: #332d29;
  font: inherit;
}

input:focus {
  border-color: #78716c;
  outline: 2px solid rgba(120, 113, 108, 0.2);
}

.hint {
  margin: 0 0 0.75rem;
  color: #78716c;
  font-size: 0.78rem;
  line-height: 1.4;
}

button {
  margin-top: 0.75rem;
  padding: 0.85rem 1rem;
  border: 0;
  border-radius: 0.5rem;
  background: #44403c;
  color: #ffffff;
  cursor: pointer;
  font: inherit;
  font-weight: 600;
}

button:disabled {
  cursor: wait;
  opacity: 0.6;
}

.error-message {
  margin: 0 0 1rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 0.85rem;
}
</style>
