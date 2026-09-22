<template>
  <div class="page-wrapper">
    <header class="header-container">
      <router-link to="/" class="brand-group">
        <img
          src="../../assets/website-logo.png"
          alt="WeConnect Logo"
          class="logo-icon"
        />
        <span class="brand-title">WeConnect</span>
      </router-link>
      <span class="sub-header-text">B2B Trade Corridor</span>
    </header>

    <main class="main-container">
      <div class="card-box">
        <div class="header-block">
          <div class="tag-row">
            <span class="tag-line"></span>
            <span class="tag-text">WELCOME BACK</span>
          </div>
          <h1 class="main-heading">Sign in to your account</h1>
          <p class="sub-heading">
            Don't have an account yet?
            <router-link to="/signup" class="link-highlight"
              >Sign up free</router-link
            >
          </p>
        </div>

        <!-- Role Selector Toggle -->
        <div class="role-selector">
          <button
            type="button"
            class="role-btn"
            :class="{ active: selectedRole === 'buyer' }"
            @click="selectedRole = 'buyer'"
          >
            <span class="role-icon">🛒</span>
            <span>Buyer</span>
          </button>
          <button
            type="button"
            class="role-btn"
            :class="{ active: selectedRole === 'supplier' }"
            @click="selectedRole = 'supplier'"
          >
            <span class="role-icon">📦</span>
            <span>Supplier</span>
          </button>
        </div>

        <p v-if="error" class="error-message">{{ error }}</p>
        <form @submit.prevent="handleLogin" class="form-space">
          <div class="form-group">
            <label for="email" class="form-label">WORK EMAIL ADDRESS</label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="e.g. owner@kayakitchen.co.za"
              required
            />
          </div>

          <div class="form-group">
            <div class="label-row">
              <label for="password" class="form-label">PASSWORD</label>
              <a href="#" class="forgot-link">Forgot password?</a>
            </div>
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          <div class="form-checkbox">
            <label class="checkbox-container">
              <input type="checkbox" v-model="rememberMe" />
              <span class="checkmark"></span>
              Remember me on this device
            </label>
          </div>

          <button type="submit" class="primary-button">
            {{
              isLoading
                ? "Signing in..."
                : `Sign In as ${selectedRole === "buyer" ? "Buyer" : "Supplier"}`
            }}
          </button>
        </form>

        <div class="footer-link-box">
          <router-link to="/" class="footer-link"
            >← Back to home page</router-link
          >
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { api } from "@/services/api";

// Login state and role-specific navigation.
export default {
  name: "LoginPage",
  data() {
    return {
      selectedRole: "buyer", // default selection
      email: "",
      password: "",
      rememberMe: false,
      error: "",
      isLoading: false,
    };
  },
  methods: {
    // Authenticate the user and save the session details for later requests.
    async handleLogin() {
      this.error = "";
      this.isLoading = true;
      try {
        const result = await api.login(this.email, this.password);

        if (result.role !== this.selectedRole) {
          throw new Error(
            `This account is registered as a ${result.role}, not a ${this.selectedRole}.`,
          );
        }

        localStorage.setItem("weconnect_token", result.token);
        localStorage.setItem("weconnect_role", result.role);
        localStorage.setItem("weconnect_user_id", String(result.userId));
        if (result.buyerId)
          localStorage.setItem("weconnect_buyer_id", String(result.buyerId));
        if (result.supplierId)
          localStorage.setItem(
            "weconnect_supplier_id",
            String(result.supplierId),
          );

        this.$router.push(
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
  background-color: #f7f5f0;
  color: #332d29;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.5rem;
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
}

@media (min-width: 768px) {
  .page-wrapper {
    padding: 2.5rem;
  }
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 80rem;
  margin: 0 auto;
  width: 100%;
}

.brand-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
}

.logo-icon {
  width: 2.5rem;
  height: 2.5rem;
  object-fit: contain;
  flex: 0 0 auto;
}

.brand-title {
  font-weight: 700;
  font-size: 1.25rem;
  letter-spacing: -0.025em;
  color: #2d2522;
}

.sub-header-text {
  font-size: 0.75rem;
  color: #78716c;
  font-weight: 500;
}

.main-container {
  max-width: 42rem;
  margin: auto auto;
  width: 100%;
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.card-box {
  background-color: #ffffff;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(231, 229, 228, 0.6);
}

@media (min-width: 768px) {
  .card-box {
    padding: 2.5rem;
  }
}

.header-block {
  text-align: center;
  margin-bottom: 2rem;
}

.tag-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.tag-line {
  width: 1rem;
  height: 2px;
  background-color: #cd6d43;
}

.tag-text {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #cd6d43;
}

.main-heading {
  font-family: Georgia, Cambria, serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d2522;
  margin-bottom: 0.5rem;
}

@media (min-width: 768px) {
  .main-heading {
    font-size: 1.875rem;
  }
}

.sub-heading {
  font-size: 0.875rem;
  color: #78716c;
}

.link-highlight {
  color: #c86d44;
  font-weight: 600;
  text-decoration: none;
}

.link-highlight:hover {
  text-decoration: underline;
}

/* Role Selector Toggle Buttons */
.role-selector {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem;
  background-color: #f7f5f0;
  padding: 0.375rem;
  border-radius: 0.75rem;
  margin-bottom: 2rem;
}

.role-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.5rem;
  background: transparent;
  color: #6e6a66;
  font-weight: 600;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.role-btn.active {
  background-color: #ffffff;
  color: #3b2c24;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* Form Groups & Inputs */
.form-space {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-label {
  display: block;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #78716c;
  margin-bottom: 0.375rem;
}

.forgot-link {
  font-size: 12px;
  color: #c86d44;
  text-decoration: none;
  font-weight: 500;
}

.forgot-link:hover {
  text-decoration: underline;
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid transparent;
  border-radius: 0.5rem;
  background-color: #f7f5f0;
  font-size: 0.875rem;
  color: #292524;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.2s;
}

.form-group input:focus {
  border-color: #cd6d43;
  background-color: #ffffff;
}

/* Checkbox */
.form-checkbox {
  display: flex;
  align-items: center;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #6e6a66;
  cursor: pointer;
}

.checkbox-container input {
  accent-color: #c86d44;
  width: 16px;
  height: 16px;
  cursor: pointer;
}

/* Submit Button */
.primary-button {
  width: 100%;
  background-color: #cd6d43;
  color: #ffffff;
  border: none;
  padding: 0.875rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-top: 1rem;
}

.primary-button:hover {
  background-color: #b85e37;
}

.footer-link-box {
  margin-top: 1.5rem;
  text-align: center;
}

.footer-link {
  font-size: 0.75rem;
  font-weight: 600;
  color: #57534e;
  text-decoration: none;
}

.error-message {
  color: #b42318;
  background: #fef3f2;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  margin-bottom: 1rem;
  text-align: center;
}

.footer-link:hover {
  color: #2d2522;
}
</style>
