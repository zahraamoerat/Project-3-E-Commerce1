<template>
  <div class="page-container">
    <!-- Header -->
    <header class="header">
      <div class="logo-container">
        <span class="logo-badge">WC</span>
        <span class="logo-text">WeConnect</span>
      </div>
      <div class="header-tag">B2B Trade Corridor</div>
    </header>

    <!-- Main Content -->
    <main class="content">
      <div class="subtitle-tag">— JOIN THE MARKETPLACE</div>
      <h1 class="main-title">Create your account</h1>
      <p class="description">Select your role to view registration options and pricing.</p>

      <!-- Role Selector Tabs -->
      <div class="role-selector">
        <button 
          :class="['role-tab', { active: selectedRole === 'buyer' }]"
          @click="selectedRole = 'buyer'"
        >
          🛒 Small Business (Buyer)
        </button>
        <button 
          :class="['role-tab', { active: selectedRole === 'supplier' }]"
          @click="selectedRole = 'supplier'"
        >
          📦 Supplier / Producer
        </button>
      </div>

      <!-- Registration Form Container -->
      <div class="form-card">
        <form @submit.prevent="handleSignUp">
          <!-- Common Fields -->
          <div class="form-group">
            <label>{{ selectedRole === 'buyer' ? 'BUSINESS NAME' : 'SUPPLIER / COMPANY NAME' }}</label>
            <input 
              type="text" 
              v-model="form.name" 
              :placeholder="selectedRole === 'buyer' ? 'e.g. Kaya Kitchen' : 'e.g. Cape Fresh Packaging Co.'" 
              required 
            />
          </div>

          <div class="form-group">
            <label>WORK EMAIL</label>
            <input 
              type="email" 
              v-model="form.email" 
              placeholder="e.g. name@company.com" 
              required 
            />
          </div>

          <div class="form-group">
            <label>PASSWORD</label>
            <input 
              type="password" 
              v-model="form.password" 
              placeholder="••••••••" 
              required 
            />
          </div>

          <!-- Supplier Subscription Tier Selector -->
          <div v-if="selectedRole === 'supplier'" class="supplier-pricing-section">
            <label class="section-label">SELECT YOUR PRODUCT LISTING TIER</label>
            
            <div class="pricing-grid">
              <div 
                v-for="tier in tiers" 
                :key="tier.id"
                :class="['tier-card', { selected: form.selectedTier === tier.id }]"
                @click="form.selectedTier = tier.id"
              >
                <div class="tier-name">{{ tier.name }}</div>
                <div class="tier-limit">{{ tier.limit }}</div>
                <div class="tier-price">{{ tier.price }}</div>
              </div>
            </div>
          </div>

          <button type="submit" class="submit-btn">
            {{ selectedRole === 'buyer' ? 'Create Free Buyer Account' : 'Proceed to Payment & Register' }}
          </button>
        </form>
      </div>

      <div class="footer-link">
        <a href="#" @click.prevent="$emit('navigate', 'login')">← Already have an account? Log in</a>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'SignUpPage',
  data() {
    return {
      selectedRole: 'buyer', // 'buyer' or 'supplier'
      form: {
        name: '',
        email: '',
        password: '',
        selectedTier: 'growth'
      },
      tiers: [
        { id: 'starter', name: 'Starter Tier', limit: 'Up to 25 products', price: '$29/mo' },
        { id: 'growth', name: 'Growth Tier', limit: 'Up to 100 products', price: '$79/mo' },
        { id: 'enterprise', name: 'Enterprise', limit: 'Unlimited products', price: '$199/mo' }
      ]
    };
  },
  methods: {
    handleSignUp() {
      const payload = {
        role: this.selectedRole,
        ...this.form,
        tier: this.selectedRole === 'supplier' ? this.form.selectedTier : 'free'
      };
      
      console.log('Signing up with data:', payload);
      alert(`Registration submitted as ${this.selectedRole.toUpperCase()}!`);
    }
  }
};
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #f6f4ee;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #333333;
  padding: 24px 40px;
  box-sizing: border-box;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-badge {
  background-color: #3b2c24;
  color: #ffffff;
  font-weight: bold;
  padding: 6px 8px;
  border-radius: 6px;
  font-size: 14px;
}

.logo-text {
  font-weight: 700;
  font-size: 20px;
  color: #3b2c24;
}

.header-tag {
  font-size: 13px;
  color: #7a7571;
  font-weight: 500;
}

.content {
  max-width: 600px;
  margin: 50px auto 0 auto;
  text-align: center;
}

.subtitle-tag {
  color: #c86d44;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: 12px;
}

.main-title {
  font-family: 'Georgia', serif;
  font-size: 34px;
  color: #3b2c24;
  margin: 0 0 12px 0;
  font-weight: bold;
}

.description {
  color: #6e6a66;
  font-size: 14px;
  margin-bottom: 30px;
}

.role-selector {
  display: flex;
  background-color: #e9e5dc;
  padding: 4px;
  border-radius: 30px;
  margin-bottom: 24px;
}

.role-tab {
  flex: 1;
  padding: 12px;
  border: none;
  background: transparent;
  border-radius: 26px;
  font-weight: 600;
  color: #6e6a66;
  cursor: pointer;
  transition: all 0.2s ease;
}

.role-tab.active {
  background-color: #ffffff;
  color: #3b2c24;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.form-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.03);
  text-align: left;
}

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  color: #555;
  margin-bottom: 6px;
  letter-spacing: 0.5px;
}

.form-group input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: #f9f8f5;
  font-size: 14px;
  box-sizing: border-box;
  outline: none;
}

.form-group input:focus {
  border-color: #c86d44;
  background-color: #fff;
}

.supplier-pricing-section {
  margin-top: 24px;
  margin-bottom: 24px;
}

.section-label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  color: #555;
  margin-bottom: 10px;
  letter-spacing: 0.5px;
}

.pricing-grid {
  display: flex;
  gap: 10px;
}

.tier-card {
  flex: 1;
  border: 2px solid #eee;
  border-radius: 10px;
  padding: 12px;
  cursor: pointer;
  background-color: #f9f8f5;
  transition: all 0.2s;
  text-align: center;
}

.tier-card.selected {
  border-color: #c86d44;
  background-color: #fdf8f5;
}

.tier-name {
  font-size: 12px;
  font-weight: bold;
  color: #3b2c24;
}

.tier-limit {
  font-size: 11px;
  color: #777;
  margin: 4px 0;
}

.tier-price {
  font-size: 14px;
  font-weight: 700;
  color: #c86d44;
}

.submit-btn {
  width: 100%;
  background-color: #d27343;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 24px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.2s;
}

.submit-btn:hover {
  background-color: #be6133;
}

.footer-link {
  margin-top: 30px;
}

.footer-link a {
  color: #3b2c24;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
}

.footer-link a:hover {
  text-decoration: underline;
}
</style>