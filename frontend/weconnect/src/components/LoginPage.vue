<template>
  <div class="auth-container">
    <!-- Left Column: Branding / Marketing -->
    <div class="auth-brand-side">
      <div class="brand-header">
        <router-link to="/" class="brand-logo">
          <img src="../assets/website-logo.png" alt="WeConnect Logo" class="logo-icon" />
          <span class="logo-text">WeConnect</span>
        </router-link>
      </div>

      <div class="brand-hero">
        <div class="tag">— WELCOME BACK</div>
        <h1 class="brand-title">Access your trade corridor.</h1>
        <p class="brand-subtitle">
          Log in to manage your wholesale orders, track dispatches, or message your suppliers directly.
        </p>

        <div class="feature-pills">
          <div class="pill">
            <span class="pill-icon">🛒</span> Direct B2B Sourcing
          </div>
          <div class="pill">
            <span class="pill-icon">📦</span> Real-time Order Tracking
          </div>
          <div class="pill">
            <span class="pill-icon">⚡</span> Fast Invoice Archiving
          </div>
        </div>
      </div>

      <div class="brand-footer">
        <p>© WeConnect B2B Marketplace. All rights reserved.</p>
      </div>
    </div>

    <!-- Right Column: Login Form -->
    <div class="auth-form-side">
      <div class="form-wrapper">
        <div class="form-header">
          <h2>Sign in to your account</h2>
          <p>
            Don't have an account yet?
            <router-link to="/signup" class="link-highlight">Sign up free</router-link>
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

        <form @submit.prevent="handleLogin" class="auth-form">
          <div class="form-group">
            <label for="email">Work Email Address</label>
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
              <label for="password">Password</label>
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

          <button type="submit" class="submit-btn">
            Sign In as {{ selectedRole === 'buyer' ? 'Buyer' : 'Supplier' }}
          </button>
        </form>

        <div class="form-footer">
          <router-link to="/" class="back-link">← Back to home page</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      selectedRole: 'buyer', // default selection
      email: '',
      password: '',
      rememberMe: false
    };
  },
  methods: {
    handleLogin() {
      // Logic for authenticating user
      console.log('Logging in as:', this.selectedRole, this.email);
      
      // Redirect based on selected role
      if (this.selectedRole === 'buyer') {
        this.$router.push('/buyer-dashboard');
      } else {
        this.$router.push('/supplier-dashboard');
      }
    }
  }
};
</script>

<style scoped>
.auth-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background-color: #f6f4ee;
  color: #3b2c24;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

/* Left Column: Branding */
.auth-brand-side {
  flex: 1;
  background-color: #3b2c24;
  color: #f6f4ee;
  padding: 48px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.logo-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.logo-text {
  font-weight: 700;
  font-size: 24px;
  color: #ffffff;
}

.brand-hero {
  max-width: 480px;
  margin: auto 0;
}

.tag {
  color: #c86d44;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: 12px;
}

.brand-title {
  font-family: 'Georgia', serif;
  font-size: 42px;
  line-height: 1.2;
  margin: 0 0 16px 0;
  color: #ffffff;
}

.brand-subtitle {
  color: #c2b8ae;
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 32px;
}

.feature-pills {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pill {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 18px;
  border-radius: 30px;
  font-size: 14px;
  color: #e5dbc9;
}

.pill-icon {
  font-size: 16px;
}

.brand-footer p {
  font-size: 12px;
  color: #8c827a;
  margin: 0;
}

/* Right Column: Form */
.auth-form-side {
  flex: 1.2;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background-color: #f6f4ee;
}

.form-wrapper {
  width: 100%;
  max-width: 420px;
}

.form-header h2 {
  font-family: 'Georgia', serif;
  font-size: 30px;
  margin: 0 0 8px 0;
  color: #3b2c24;
}

.form-header p {
  font-size: 14px;
  color: #6e6a66;
  margin: 0 0 28px 0;
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
  display: flex;
  gap: 12px;
  background-color: #efece6;
  padding: 6px;
  border-radius: 12px;
  margin-bottom: 24px;
}

.role-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #6e6a66;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.role-btn.active {
  background-color: #ffffff;
  color: #3b2c24;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* Form Groups & Inputs */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
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

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: #3b2c24;
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
  padding: 12px 16px;
  border: 1px solid #dcd6cd;
  border-radius: 8px;
  background-color: #ffffff;
  font-size: 14px;
  color: #3b2c24;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.2s;
}

.form-group input:focus {
  border-color: #c86d44;
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
.submit-btn {
  background-color: #d27343;
  color: #ffffff;
  border: none;
  padding: 14px;
  border-radius: 24px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-top: 8px;
}

.submit-btn:hover {
  background-color: #b85e31;
}

.form-footer {
  margin-top: 28px;
  text-align: center;
}

.back-link {
  font-size: 13px;
  color: #6e6a66;
  text-decoration: none;
}

.back-link:hover {
  color: #3b2c24;
}

/* Responsive view for smaller screens */
@media (max-width: 900px) {
  .auth-container {
    flex-direction: column;
  }

  .auth-brand-side {
    padding: 32px 24px;
  }

  .brand-title {
    font-size: 32px;
  }

  .auth-form-side {
    padding: 32px 24px;
  }
}
</style>