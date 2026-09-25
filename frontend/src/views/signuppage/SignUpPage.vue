<template>
  <div class="page-wrapper">
    <header class="header-container">
      <div class="brand-group" @click="$router.push('/')">
        <img
          src="../../assets/link-icon-white.png"
          alt="WeConnect Logo"
          class="logo-icon"
        />
        <span class="brand-title">WeConnect</span>
      </div>
      <span class="sub-header-text">B2B Trade Corridor</span>
    </header>

    <main class="main-container">
      <div v-if="submittedSupplier" class="card-box text-center">
        <div class="status-icon">⏳</div>
        <h2 class="card-title">Supplier Application Submitted!</h2>
        <p class="status-description">
          Thank you for registering <strong>{{ form.companyName }}</strong
          >. Your supplier application and
          <strong>{{ selectedPlan?.plan_name }}</strong> subscription request
          have been sent to our team for verification.
        </p>

        <div class="info-banner">
          <p class="font-bold">What happens next?</p>
          <ul class="info-list">
            <li>
              Our admin team will review your business and registration
              credentials.
            </li>
            <li>
              You will receive an email once your account and seller access are
              approved.
            </li>
            <li>
              Upon approval, you will be directed to activate your subscription
              and access your Supplier Dashboard.
            </li>
          </ul>
        </div>

        <button
          @click="$router.push('/login')"
          class="primary-button max-w-xs mx-auto"
        >
          Return to Login
        </button>
      </div>

      <div v-else class="card-box">
        <div class="header-block">
          <div class="tag-row">
            <span class="tag-line"></span>
            <span class="tag-text">GET STARTED</span>
          </div>
          <h1 class="main-heading">Create your WeConnect account</h1>
          <p class="sub-heading">
            Select your account type to configure your workspace.
          </p>
        </div>

        <div class="role-switcher">
          <button
            type="button"
            @click="selectedRole = 'buyer'"
            :class="[
              'role-btn',
              selectedRole === 'buyer'
                ? 'role-btn-active'
                : 'role-btn-inactive',
            ]"
          >
            <span>🧺</span>
            <span>Small Business (Buyer)</span>
          </button>

          <button
            type="button"
            @click="selectedRole = 'supplier'"
            :class="[
              'role-btn',
              selectedRole === 'supplier'
                ? 'role-btn-active'
                : 'role-btn-inactive',
            ]"
          >
            <span>📦</span>
            <span>Supplier / Wholesaler</span>
          </button>
        </div>

        <p v-if="error" class="error-message">{{ error }}</p>

        <form @submit.prevent="handleSignUp" class="form-space">
          <div class="grid-2-col">
            <div>
              <label class="form-label">FIRST NAME</label>
              <input
                v-model="form.firstName"
                type="text"
                required
                placeholder="Thandeka"
                class="form-input"
              />
            </div>
            <div>
              <label class="form-label">LAST NAME</label>
              <input
                v-model="form.lastName"
                type="text"
                required
                placeholder="Mthembu"
                class="form-input"
              />
            </div>
          </div>

          <div>
            <label class="form-label">WORK EMAIL</label>
            <input
              v-model="form.email"
              type="email"
              required
              placeholder="thandeka@kayakitchen.co.za"
              class="form-input"
            />
          </div>

          <div>
            <label class="form-label">PASSWORD</label>
            <input
              v-model="form.password"
              type="password"
              required
              placeholder="••••••••••••"
              class="form-input"
            />
          </div>

          <div>
            <label class="form-label">
              {{
                selectedRole === "buyer"
                  ? "BUSINESS NAME"
                  : "SUPPLIER COMPANY NAME"
              }}
            </label>
            <input
              v-model="form.companyName"
              type="text"
              required
              :placeholder="
                selectedRole === 'buyer'
                  ? 'Kaya Kitchen'
                  : 'Cape Fresh Packaging Co.'
              "
              class="form-input"
            />
          </div>

          <div v-if="selectedRole === 'supplier'" class="supplier-section">
            <label class="form-label highlight-label"
              >SELECT TARGET SUBSCRIPTION PLAN</label
            >
            <div class="plan-grid">
              <div
                v-for="plan in subscriptionPlans"
                :key="plan.plan_id"
                @click="form.planId = plan.plan_id"
                :class="[
                  'plan-card',
                  form.planId === plan.plan_id
                    ? 'plan-card-active'
                    : 'plan-card-inactive',
                ]"
              >
                <div class="plan-header">
                  <span class="plan-title">{{ plan.plan_name }}</span>
                  <span class="plan-price">
                    {{
                      plan.monthly_price === null
                        ? "Contact us"
                        : `R${formatPrice(plan.monthly_price)}/mo`
                    }}
                  </span>
                </div>
                <p class="plan-desc">
                  Up to {{ plan.max_products }} active product listings.
                </p>
              </div>
            </div>
          </div>

          <button type="submit" class="primary-button" :disabled="isLoading">
            {{
              isLoading
                ? "Submitting..."
                : selectedRole === "supplier"
                  ? "Submit Supplier Application"
                  : "Create Buyer Account"
            }}
          </button>
        </form>
      </div>

      <div class="footer-link-box">
        <router-link to="/login" class="footer-link">
          Already have an account?
          <span class="link-highlight">Log in here</span>
        </router-link>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { api } from "@/services/api";

// Signup state is shared by both buyer and supplier forms.
const router = useRouter();
const selectedRole = ref("buyer");
const submittedSupplier = ref(false);
const error = ref("");
const isLoading = ref(false);
const subscriptionPlans = ref([
  { plan_id: 1, plan_name: "Starter", monthly_price: 250, max_products: 10 },
  { plan_id: 2, plan_name: "Growth", monthly_price: 550, max_products: 25 },
  {
    plan_id: 3,
    plan_name: "Enterprise",
    monthly_price: null,
    max_products: 75,
  },
]);

const form = reactive({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  companyName: "",
  planId: 1,
});

const selectedPlan = computed(() =>
  subscriptionPlans.value.find((plan) => plan.plan_id === form.planId),
);

const formatPrice = (price) => Number(price).toFixed(2);

const loadSubscriptionPlans = async () => {
  try {
    const plans = await api.getSubscriptionPlans();
    if (plans.length > 0) subscriptionPlans.value = plans;
  } catch (err) {
    // Keep the updated plan values visible if the plans request is unavailable.
    console.error("Unable to load subscription plans:", err);
  }
};

const handleSignUp = async () => {
  error.value = "";
  isLoading.value = true;

  try {
    // Supplier applications and buyer accounts use different backend routes.
    if (selectedRole.value === "supplier") {
      await api.registerSupplier({
        email: form.email,
        password: form.password,
        first_name: form.firstName,
        last_name: form.lastName,
        business_name: form.companyName,
        plan_id: form.planId,
      });
      submittedSupplier.value = true;
    } else {
      const result = await api.registerBuyer({
        email: form.email,
        password: form.password,
        business_name: form.companyName,
        contact_person: (form.firstName + " " + form.lastName).trim(),
      });
      localStorage.setItem("weconnect_token", result.token);
      localStorage.setItem("weconnect_role", result.role);
      localStorage.setItem("weconnect_user_id", String(result.userId));
      localStorage.setItem("weconnect_buyer_id", String(result.buyerId));
      localStorage.setItem("weconnect_email", form.email);
      router.push("/small-business/dashboard");
    }
  } catch (err) {
    error.value = err?.message || "Registration failed. Please try again.";
  } finally {
    isLoading.value = false;
  }
};

onMounted(loadSubscriptionPlans);
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
  cursor: pointer;
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

.role-switcher {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem;
  background-color: #f7f5f0;
  padding: 0.375rem;
  border-radius: 0.75rem;
  margin-bottom: 2rem;
}

.role-btn {
  padding: 0.75rem 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 0.5rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  cursor: pointer;
}

.role-btn-active {
  background-color: #ffffff;
  color: #2d2522;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.role-btn-inactive {
  background-color: transparent;
  color: #78716c;
}

.form-space {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.grid-2-col {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

@media (min-width: 768px) {
  .grid-2-col {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.form-label {
  display: block;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #78716c;
  margin-bottom: 0.375rem;
}

.highlight-label {
  color: #cd6d43;
}

.form-input {
  width: 100%;
  background-color: #f7f5f0;
  border: 1px solid transparent;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: #292524;
  outline: none;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: #cd6d43;
  background-color: #ffffff;
}

.supplier-section {
  padding-top: 1rem;
  border-top: 1px solid #f5f5f4;
  margin-top: 0.5rem;
}

.plan-card {
  padding: 1rem;
  border-radius: 0.75rem;
  border: 2px solid #e7e5e4;
  cursor: pointer;
  transition: all 0.2s;
}

.plan-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
}

.plan-card-active {
  border-color: #cd6d43;
  background-color: #faf3ee;
}

.plan-card-inactive:hover {
  border-color: #d6d3d1;
}

@media (max-width: 767px) {
  .plan-grid {
    grid-template-columns: 1fr;
  }
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.plan-title {
  font-family: Georgia, Cambria, serif;
  font-weight: 700;
  font-size: 0.875rem;
  color: #2d2522;
}

.plan-price {
  font-size: 0.75rem;
  font-weight: 700;
  color: #cd6d43;
}

.plan-desc {
  font-size: 11px;
  color: #78716c;
}

.primary-button {
  width: 100%;
  background-color: #cd6d43;
  color: #ffffff;
  font-weight: 500;
  padding: 0.875rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1rem;
}

.primary-button:hover {
  background-color: #b85e37;
}
.primary-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.status-icon {
  width: 4rem;
  height: 4rem;
  background-color: #f5ebe1;
  color: #cd6d43;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem auto;
  font-size: 1.5rem;
}

.card-title {
  font-family: Georgia, Cambria, serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d2522;
  margin-bottom: 0.5rem;
}

.status-description {
  font-size: 0.875rem;
  color: #57534e;
  max-width: 28rem;
  margin: 0 auto 1.5rem auto;
  line-height: 1.5;
}

.info-banner {
  background-color: #f7f5f0;
  padding: 1rem;
  border-radius: 0.75rem;
  font-size: 0.75rem;
  color: #78716c;
  margin-bottom: 1.5rem;
  text-align: left;
  max-width: 28rem;
  margin-left: auto;
  margin-right: auto;
}

.info-list {
  list-style-type: disc;
  padding-left: 1rem;
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
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

.footer-link-box {
  text-align: center;
  margin-top: 1.5rem;
}

.footer-link {
  font-size: 0.75rem;
  font-weight: 600;
  color: #57534e;
  text-decoration: none;
}

.link-highlight {
  color: #cd6d43;
}
</style>
