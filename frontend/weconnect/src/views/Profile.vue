<template>
  <main class="profile-page">
    <div class="profile-shell">
      <header class="profile-header">
        <button type="button" class="back-button" @click="goBack">← Back</button>

        <div class="header-copy">
          <span class="eyebrow">{{ isBuyer ? "SMALL BUSINESS" : "SUPPLIER" }}</span>
          <h1>My Profile</h1>
          <p>
            {{ isBuyer
              ? "Manage your small business account and shopping preferences."
              : "Manage your supplier account information." }}
          </p>
        </div>
      </header>

      <section class="profile-grid">
        <article class="profile-card identity-card">
          <div class="avatar" aria-hidden="true">{{ initials }}</div>

          <div class="identity-copy">
            <span class="role-badge">{{ isBuyer ? "Buyer" : "Supplier" }}</span>
            <h2>{{ displayName }}</h2>
            <p>{{ email || "No email address saved" }}</p>
            <span v-if="businessId" class="account-id">
              {{ isBuyer ? "Buyer" : "Supplier" }} ID: {{ businessId }}
            </span>
          </div>
        </article>

        <article class="profile-card">
          <div class="section-heading">
            <div>
              <span class="section-kicker">ACCOUNT</span>
              <h2>Account details</h2>
            </div>
          </div>

          <div class="details-grid">
            <div class="detail-item">
              <span>Email address</span>
              <strong>{{ email || "Not available" }}</strong>
            </div>
            <div class="detail-item">
              <span>Account type</span>
              <strong>{{ isBuyer ? "Small Business Buyer" : "Supplier" }}</strong>
            </div>
            <div class="detail-item">
              <span>User ID</span>
              <strong>{{ userId || "Not available" }}</strong>
            </div>
            <div class="detail-item">
              <span>Account status</span>
              <strong class="status"><i></i> Active</strong>
            </div>
          </div>
        </article>

        <article v-if="isBuyer" class="profile-card quick-card">
          <div class="section-heading">
            <div>
              <span class="section-kicker">QUICK ACCESS</span>
              <h2>Small Business</h2>
            </div>
          </div>

          <div class="quick-actions">
            <button type="button" @click="goTo('/small-business/dashboard')">
              <span>▦</span>
              <div>
                <strong>Dashboard</strong>
                <small>View your business overview</small>
              </div>
              <b>→</b>
            </button>

            <button type="button" @click="goTo('/small-business/orders')">
              <span>▤</span>
              <div>
                <strong>Order history</strong>
                <small>View and track your orders</small>
              </div>
              <b>→</b>
            </button>

            <button type="button" @click="goTo('/small-business/cart')">
              <span>🛒</span>
              <div>
                <strong>Shopping cart</strong>
                <small>Review items before checkout</small>
              </div>
              <b>→</b>
            </button>

            <button type="button" @click="goTo('/small-business/suppliers')">
              <span>♧</span>
              <div>
                <strong>View suppliers</strong>
                <small>Explore available suppliers</small>
              </div>
              <b>→</b>
            </button>
          </div>
        </article>

        <article class="profile-card security-card">
          <div class="section-heading">
            <div>
              <span class="section-kicker">SESSION</span>
              <h2>Account actions</h2>
            </div>
          </div>

          <p class="security-copy">
            Your profile uses the account currently signed in on this device.
          </p>

          <button type="button" class="logout-button" @click="logout">
            Sign out
          </button>
        </article>
      </section>
    </div>
  </main>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const role = ref(localStorage.getItem("weconnect_role") || "buyer");
const email = ref(localStorage.getItem("weconnect_email") || "");
const userId = ref(localStorage.getItem("weconnect_user_id") || "");
const buyerId = ref(localStorage.getItem("weconnect_buyer_id") || "");
const supplierId = ref(localStorage.getItem("weconnect_supplier_id") || "");

const isBuyer = computed(() => role.value === "buyer");
const businessId = computed(() => (isBuyer.value ? buyerId.value : supplierId.value));

const displayName = computed(() => {
  if (email.value) {
    return email.value.split("@")[0]
      .replace(/[._-]+/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  return isBuyer.value ? "Small Business Account" : "Supplier Account";
});

const initials = computed(() => {
  const words = displayName.value.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "W";
  return words.slice(0, 2).map((word) => word[0]).join("").toUpperCase();
});

function goTo(path) {
  router.push(path);
}

function goBack() {
  router.back();
}

function logout() {
  [
    "weconnect_token",
    "weconnect_role",
    "weconnect_user_id",
    "weconnect_buyer_id",
    "weconnect_supplier_id",
    "weconnect_email",
  ].forEach((key) => localStorage.removeItem(key));

  router.push("/login");
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  padding: 32px 20px 56px;
  background: #f5efe7;
  color: #3f2b24;
}

.profile-shell {
  width: min(1100px, 100%);
  margin: 0 auto;
}

.profile-header {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 28px;
}

.back-button {
  border: 1px solid #d9c8b9;
  background: #fffaf5;
  color: #63473a;
  border-radius: 10px;
  padding: 10px 14px;
  font-weight: 700;
  cursor: pointer;
}

.back-button:hover {
  background: #eadbce;
}

.header-copy {
  flex: 1;
}

.eyebrow,
.section-kicker {
  display: block;
  margin: 0 0 7px;
  color: #9a6248;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.7px;
}

.profile-header h1 {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(30px, 5vw, 46px);
  line-height: 1.05;
  color: #4b3128;
}

.profile-header p {
  margin: 9px 0 0;
  color: #806f65;
  font-size: 15px;
}

.profile-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.profile-card {
  min-width: 0;
  padding: 24px;
  border: 1px solid #e4d7cc;
  border-radius: 18px;
  background: rgba(255, 252, 248, 0.94);
  box-shadow: 0 8px 25px rgba(83, 55, 40, 0.07);
}

.identity-card {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 20px;
  background: #5a3d32;
  color: #fffaf5;
  border-color: #5a3d32;
}

.avatar {
  display: grid;
  place-items: center;
  width: 82px;
  height: 82px;
  flex: 0 0 82px;
  border-radius: 50%;
  background: #d39a73;
  color: #fff;
  font-size: 27px;
  font-weight: 800;
}

.identity-copy {
  min-width: 0;
}

.identity-copy h2 {
  margin: 8px 0 5px;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 28px;
}

.identity-copy p {
  margin: 0;
  color: #eadbd1;
  overflow-wrap: anywhere;
}

.role-badge {
  display: inline-flex;
  padding: 5px 9px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.13);
  color: #f8e9df;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.account-id {
  display: inline-block;
  margin-top: 10px;
  color: #d9c1b1;
  font-size: 12px;
}

.section-heading {
  display: flex;
  justify-content: space-between;
  margin-bottom: 18px;
}

.section-heading h2 {
  margin: 0;
  color: #4b3128;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 23px;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 13px;
}

.detail-item {
  padding: 15px;
  border-radius: 12px;
  background: #f7f0e9;
}

.detail-item span {
  display: block;
  margin-bottom: 5px;
  color: #8b776b;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .7px;
}

.detail-item strong {
  display: block;
  color: #51372c;
  font-size: 14px;
  overflow-wrap: anywhere;
}

.status {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.status i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #5f8a61;
}

.quick-actions {
  display: grid;
  gap: 9px;
}

.quick-actions button {
  width: 100%;
  display: grid;
  grid-template-columns: 34px 1fr auto;
  align-items: center;
  gap: 11px;
  padding: 13px;
  border: 1px solid #e5d8ce;
  border-radius: 12px;
  background: #fffaf6;
  color: #52372c;
  text-align: left;
  cursor: pointer;
}

.quick-actions button:hover {
  border-color: #c58a68;
  background: #f8eee7;
}

.quick-actions button > span {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: #ead8ca;
}

.quick-actions strong,
.quick-actions small {
  display: block;
}

.quick-actions small {
  margin-top: 2px;
  color: #8a766b;
}

.quick-actions b {
  color: #a06a50;
}

.security-card {
  display: flex;
  flex-direction: column;
}

.security-copy {
  margin: 0 0 20px;
  color: #806f65;
  line-height: 1.6;
}

.logout-button {
  align-self: flex-start;
  padding: 11px 18px;
  border: 1px solid #b75f4c;
  border-radius: 10px;
  background: transparent;
  color: #a84f3d;
  font-weight: 800;
  cursor: pointer;
}

.logout-button:hover {
  background: #a84f3d;
  color: white;
}

@media (max-width: 760px) {
  .profile-page {
    padding: 22px 14px 40px;
  }

  .profile-header {
    flex-direction: column;
    gap: 14px;
  }

  .profile-grid {
    grid-template-columns: 1fr;
  }

  .identity-card {
    grid-column: auto;
    align-items: flex-start;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .profile-card {
    padding: 18px;
    border-radius: 15px;
  }

  .identity-card {
    flex-direction: column;
  }

  .avatar {
    width: 70px;
    height: 70px;
    flex-basis: 70px;
  }

  .identity-copy h2 {
    font-size: 24px;
  }
}
</style>
