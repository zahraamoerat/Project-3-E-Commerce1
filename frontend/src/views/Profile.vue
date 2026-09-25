<template>
  <main class="profile-page">
    <section class="profile-cover" :style="coverStyle">
      <button type="button" class="cover-button" @click="goBack">← Back</button>
      <div class="cover-pattern"></div>
      <div class="cover-actions">
        <span class="cover-role">{{ isBuyer ? "SMALL BUSINESS" : "SUPPLIER" }}</span>
        <label class="change-cover">▣ Change Cover<input type="file" accept="image/*" class="hidden-input" @change="changeCover" /></label>
      </div>
    </section>

    <section class="profile-layout"><aside class="profile-summary">
        <div class="profile-avatar">
          <img v-if="avatarUrl" :src="avatarUrl" alt="Profile photo" />
          <span v-else>{{ initials }}</span>
        </div>
        <label class="avatar-edit" title="Change profile photo">
          ✎<input type="file" accept="image/*" class="hidden-input" @change="changeAvatar" />
        </label>

        <h1>{{ displayName }}</h1>
        <p class="company-name">{{ form.businessName || (isBuyer ? "Small Business" : "Supplier Account") }}</p>

        <div class="summary-stats">
          <div><span>{{ isBuyer ? "Orders" : "Products" }}</span><strong>{{ stats.primary }}</strong></div>
          <div><span>{{ isBuyer ? "Suppliers" : "Orders" }}</span><strong>{{ stats.secondary }}</strong></div>
          <div><span>Status</span><strong class="active-text">{{ profileStatus }}</strong></div>
        </div>

        <button type="button" class="public-profile" @click="showPublicProfile = !showPublicProfile">
          {{ showPublicProfile ? "Close Public Profile" : "View Public Profile" }}
        </button>
        <div v-if="businessId" class="profile-id">{{ isBuyer ? "Buyer" : "Supplier" }} ID: {{ businessId }}</div>
      </aside><section class="profile-editor">
        <nav class="profile-tabs" aria-label="Profile sections">
          <button v-for="tab in tabs" :key="tab.id" type="button" :class="{ active: activeTab === tab.id }" @click="activeTab = tab.id">
            {{ tab.label }}
          </button>
        </nav>

        <form v-if="activeTab === 'account'" class="profile-form" @submit.prevent="saveProfile">
          <div class="form-grid">
            <label><span>First Name</span><input v-model.trim="form.firstName" type="text" required /></label>
            <label><span>Last Name</span><input v-model.trim="form.lastName" type="text" required /></label>
            <label><span>Phone Number</span><input v-model.trim="form.phone" type="tel" placeholder="+27..." /></label>
            <label><span>Email address</span><input v-model.trim="form.email" type="email" required /></label>
            <label><span>City</span><input v-model.trim="form.city" type="text" /></label>
            <label><span>Province</span><input v-model.trim="form.province" type="text" /></label>
            <label><span>Postcode</span><input v-model.trim="form.postalCode" type="text" /></label>
            <label><span>Country</span><select v-model="form.country"><option>South Africa</option><option>Namibia</option><option>Botswana</option><option>Zimbabwe</option><option>Other</option></select></label>
          </div>
          <div class="form-footer">
            <span v-if="saveMessage" class="save-message">{{ saveMessage }}</span>
            <span v-if="errorMessage" class="error-message">{{ errorMessage }}</span>
            <button type="submit" class="update-button" :disabled="saving">{{ saving ? "Saving..." : "Update" }}</button>
          </div>
        </form>

        <form v-else-if="activeTab === 'company'" class="profile-form" @submit.prevent="saveProfile">
          <div class="form-grid">
            <label class="form-full"><span>Business Name</span><input v-model.trim="form.businessName" type="text" required /></label>
            <label class="form-full"><span>Business Address</span><input v-model.trim="form.address" type="text" placeholder="Street address" /></label>
            <label><span>City</span><input v-model.trim="form.city" type="text" /></label>
            <label><span>Province</span><input v-model.trim="form.province" type="text" /></label>
            <label><span>Postcode</span><input v-model.trim="form.postalCode" type="text" /></label>
            <label><span>Country</span><select v-model="form.country"><option>South Africa</option><option>Namibia</option><option>Botswana</option><option>Zimbabwe</option><option>Other</option></select></label>
          </div>
          <div class="form-footer">
            <span v-if="saveMessage" class="save-message">{{ saveMessage }}</span>
            <span v-if="errorMessage" class="error-message">{{ errorMessage }}</span>
            <button type="submit" class="update-button" :disabled="saving">{{ saving ? "Saving..." : "Save Company" }}</button>
          </div>
        </form>

        <section v-else-if="activeTab === 'documents'" class="settings-panel">
          <h2>Documents</h2>
          <p>Keep your business documents available on this device.</p>
          <input ref="documentInput" type="file" class="hidden-input" @change="addDocument" />
          <button type="button" class="secondary-button" @click="$refs.documentInput.click()">Add Document</button>
          <ul v-if="documents.length" class="document-list">
            <li v-for="(document, index) in documents" :key="document.name + index">
              <span>{{ document.name }}</span><button type="button" @click="removeDocument(index)">Remove</button>
            </li>
          </ul>
          <p v-else class="empty-state">No documents added yet.</p>
        </section>

        <section v-else-if="activeTab === 'billing'" class="settings-panel">
          <h2>Billing</h2>
          <p>{{ isBuyer ? "Small Business accounts can manage billing details when an order requires payment." : "Supplier subscription information is shown here." }}</p>
          <div class="billing-card">
            <strong>{{ isBuyer ? "Buyer account" : "Supplier account" }}</strong>
            <span>{{ isBuyer ? "Pay per order through the checkout flow." : "Subscription status is managed from your supplier account." }}</span>
          </div>
        </section>

        <section v-else class="settings-panel">
          <h2>Notifications</h2>
          <label class="notification-option"><input v-model="notifications.orders" type="checkbox" @change="saveNotifications" /> Order updates</label>
          <label class="notification-option"><input v-model="notifications.deliveries" type="checkbox" @change="saveNotifications" /> Delivery updates</label>
          <label class="notification-option"><input v-model="notifications.reviews" type="checkbox" @change="saveNotifications" /> Reviews and messages</label>
          <span v-if="notificationMessage" class="save-message">{{ notificationMessage }}</span>
        </section>
      </section></section><section v-if="showPublicProfile" class="public-preview">
      <div><strong>{{ displayName }}</strong><span>{{ form.businessName }}</span></div>
      <p>{{ form.address || "Business address not provided" }}</p>
      <p>{{ [form.city, form.province, form.postalCode, form.country].filter(Boolean).join(", ") }}</p>
      <p>{{ form.email }} · {{ form.phone || "Phone not provided" }}</p>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { api } from "@/services/api";

const router = useRouter();
const isBuyer = localStorage.getItem('weconnect_role') === 'buyer';
const businessId = ref(localStorage.getItem(isBuyer ? "weconnect_buyer_id" : "weconnect_supplier_id") || "");
const activeTab = ref("account");
const saving = ref(false);
const saveMessage = ref("");
const errorMessage = ref("");
const notificationMessage = ref("");
const showPublicProfile = ref(false);
const avatarUrl = ref(localStorage.getItem("weconnect_avatar") || "");
const coverUrl = ref(localStorage.getItem("weconnect_cover") || "");
const documents = ref(JSON.parse(localStorage.getItem("weconnect_documents") || "[]"));
const stats = reactive({ primary: "—", secondary: "—" });
const notifications = reactive(JSON.parse(localStorage.getItem("weconnect_notifications") || '{"orders":true,"deliveries":true,"reviews":true}'));

const form = reactive({
  firstName: "", lastName: "", businessName: "", email: "",
  phone: "", address: "", city: "", province: "", postalCode: "",
  country: "South Africa",
});

const tabs = [
  { id: "account", label: "Account Settings" },
  { id: "company", label: "Company Settings" },
  { id: "documents", label: "Documents" },
  { id: "billing", label: "Billing" },
  { id: "notifications", label: "Notifications" },
];

const displayName = computed(() => {
  const name = `${form.firstName} ${form.lastName}`.trim();
  return name || form.businessName || (isBuyer ? "Small Business" : "Supplier");
});
const initials = computed(() => displayName.value.split(/\s+/).filter(Boolean).slice(0,2).map(p => p[0]).join("").toUpperCase() || "W");
const profileStatus = ref("Active");
const coverStyle = computed(() => coverUrl.value ? { backgroundImage: `url("${coverUrl.value}")`, backgroundSize: "cover", backgroundPosition: "center" } : {});

onMounted(async () => {
  if (!localStorage.getItem("weconnect_token")) {
    errorMessage.value = "Please sign in to edit your profile.";
    return;
  }
  try {
    const result = await api.getProfile();
    const p = result.profile || {};
    Object.assign(form, {
      firstName: p.firstName || "",
      lastName: p.lastName || "",
      businessName: p.businessName || "",
      email: p.email || localStorage.getItem("weconnect_email") || "",
      phone: p.phone || "",
      address: p.address || "",
      city: p.city || "",
      province: p.province || "",
      postalCode: p.postalCode || "",
      country: localStorage.getItem("weconnect_country") || "South Africa",
    });
    businessId.value = p.businessId ? String(p.businessId) : businessId.value;
    localStorage.setItem(isBuyer ? "weconnect_buyer_id" : "weconnect_supplier_id", businessId.value);
    localStorage.setItem("weconnect_email", form.email);
    stats.primary = isBuyer ? result.stats?.orders ?? 0 : result.stats?.products ?? 0;
    stats.secondary = isBuyer ? result.stats?.suppliers ?? 0 : result.stats?.orders ?? 0;
    profileStatus.value = isBuyer ? "Active" : (p.approvalStatus || (p.isVerified ? "Verified" : "Active"));
  } catch (error) {
    errorMessage.value = error.message || "Could not load your profile.";
  }
});

async function saveProfile() {
  if (!form.firstName || !form.lastName || !form.businessName || !form.email) {
    errorMessage.value = "Please complete the required fields.";
    return;
  }
  saving.value = true;
  errorMessage.value = "";
  saveMessage.value = "";
  try {
    const result = await api.updateProfile({
      firstName: form.firstName,
      lastName: form.lastName,
      businessName: form.businessName,
      email: form.email,
      phone: form.phone,
      address: form.address,
      city: form.city,
      province: form.province,
      postalCode: form.postalCode,
    });
    const p = result.profile || result;
    Object.assign(form, {
      firstName: p.firstName || form.firstName,
      lastName: p.lastName || form.lastName,
      businessName: p.businessName || form.businessName,
      email: p.email || form.email,
      phone: p.phone || form.phone,
      address: p.address || form.address,
      city: p.city || form.city,
      province: p.province || form.province,
      postalCode: p.postalCode || form.postalCode,
    });
    Object.entries({
      weconnect_first_name: form.firstName, weconnect_last_name: form.lastName,
      weconnect_email: form.email, weconnect_phone: form.phone,
      weconnect_city: form.city, weconnect_province: form.province,
      weconnect_postal_code: form.postalCode, weconnect_country: form.country,
    }).forEach(([key, value]) => localStorage.setItem(key, value));
    saveMessage.value = "Profile updated successfully.";
  } catch (error) {
    errorMessage.value = error.message || "Could not save your profile.";
  } finally {
    saving.value = false;
  }
}

function saveNotifications() {
  localStorage.setItem("weconnect_notifications", JSON.stringify(notifications));
  notificationMessage.value = "Notification preferences saved.";
  setTimeout(() => notificationMessage.value = "", 2000);
}
function readFile(file, callback) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => callback(reader.result);
  reader.readAsDataURL(file);
}
function changeAvatar(event) {
  readFile(event.target.files[0], (url) => {
    avatarUrl.value = url;
    localStorage.setItem("weconnect_avatar", url);
  });
}
function changeCover(event) {
  readFile(event.target.files[0], (url) => {
    coverUrl.value = url;
    localStorage.setItem("weconnect_cover", url);
  });
}
function addDocument(event) {
  const file = event.target.files[0];
  if (!file) return;
  documents.value.push({ name: file.name, size: file.size, type: file.type });
  localStorage.setItem("weconnect_documents", JSON.stringify(documents.value));
  event.target.value = "";
}
function removeDocument(index) {
  documents.value.splice(index, 1);
  localStorage.setItem("weconnect_documents", JSON.stringify(documents.value));
}
function goBack() {
  router.back();
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #f7f5f2;
  color: #4d3933;
}

.profile-cover {
  position: relative;
  height: 185px;
  overflow: hidden;
  background: linear-gradient(135deg, #5b4037 0%, #684b41 52%, #4f352e 100%);
}

.cover-pattern {
  position: absolute;
  inset: -40px;
  opacity: .18;
  background:
    linear-gradient(135deg, transparent 0 25%, #fff 25% 34%, transparent 34% 100%),
    linear-gradient(45deg, transparent 0 48%, #fff 48% 58%, transparent 58% 100%);
  transform: rotate(-7deg) scale(1.2);
}

.cover-button {
  position: absolute;
  top: 18px;
  left: 24px;
  z-index: 3;
  border: 1px solid rgba(255,255,255,.38);
  border-radius: 7px;
  padding: 7px 12px;
  background: rgba(255,255,255,.10);
  color: #fff;
  cursor: pointer;
}

.cover-actions {
  position: absolute;
  top: 18px;
  right: 24px;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 12px;
}

.cover-role {
  color: rgba(255,255,255,.82);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.3px;
}

.change-cover {
  border: 1px solid rgba(255,255,255,.42);
  border-radius: 5px;
  padding: 7px 11px;
  background: rgba(76,52,45,.45);
  color: #fff;
  font-size: 10px;
  cursor: pointer;
}

.profile-layout {
  position: relative;
  display: grid;
  grid-template-columns: 245px minmax(0, 1fr);
  gap: 18px;
  width: min(1040px, calc(100% - 36px));
  margin: -45px auto 0;
  padding-bottom: 45px;
  z-index: 4;
}

.profile-summary {
  position: relative;
  align-self: start;
  padding: 16px 14px 15px;
  border: 1px solid #e6dfda;
  border-radius: 3px;
  background: #fff;
  box-shadow: 0 4px 16px rgba(31,41,55,.06);
  text-align: center;
}

.profile-avatar {
  position: relative;
  display: grid;
  place-items: center;
  width: 92px;
  height: 92px;
  margin: -2px auto 11px;
  border: 5px solid #fff;
  border-radius: 50%;
  overflow: hidden;
  background: #eadfd8;
  color: #684b41;
  font-size: 27px;
  font-weight: 800;
  box-shadow: 0 2px 8px rgba(31,41,55,.12);
}
.profile-avatar img { width:100%; height:100%; object-fit:cover; }

.avatar-edit {
  position: absolute;
  top: 77px;
  right: calc(50% - 48px);
  width: 22px;
  height: 22px;
  border: 2px solid #fff;
  border-radius: 50%;
  background: #684b41;
  color: #fff;
  font-size: 10px;
  cursor: pointer;
}

.profile-summary h1 {
  overflow-wrap: anywhere;
  margin: 0;
  color: #4d3933;
  font-size: 14px;
  font-weight: 800;
}

.company-name {
  margin: 4px 0 14px;
  color: #98857c;
  font-size: 10px;
}

.summary-stats {
  border-top: 1px solid #eee8e3;
  border-bottom: 1px solid #eee8e3;
}

.summary-stats div {
  display: flex;
  justify-content: space-between;
  padding: 10px 1px;
  border-bottom: 1px solid #f1eeeb;
  font-size: 10px;
}

.summary-stats div:last-child {
  border-bottom: 0;
}

.summary-stats span {
  color: #806c63;
}

.summary-stats strong {
  color: #4d3933;
}

.active-text {
  color: #55865d !important;
}

.public-profile {
  width: 100%;
  margin-top: 13px;
  padding: 8px;
  border: 1px solid #e6dfda;
  background: #fff;
  color: #806c63;
  font-size: 9px;
  cursor: pointer;
}

.profile-id {
  margin-top: 9px;
  color: #98857c;
  font-size: 8px;
}

.profile-editor {
  min-width: 0;
  border: 1px solid #e6dfda;
  border-radius: 3px;
  background: #fff;
  box-shadow: 0 4px 16px rgba(31,41,55,.04);
}

.profile-tabs {
  display: flex;
  align-items: center;
  gap: 23px;
  min-height: 45px;
  padding: 0 16px;
  border-bottom: 1px solid #e6dfda;
  overflow-x: auto;
}

.profile-tabs button {
  position: relative;
  height: 45px;
  flex: 0 0 auto;
  border: 0;
  background: transparent;
  color: #98857c;
  font-size: 9px;
  cursor: pointer;
}

.profile-tabs button.active {
  color: #4d3933;
  font-weight: 800;
}

.profile-tabs button.active::after {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 2px;
  content: "";
  background: #684b41;
}

.profile-form {
  padding: 19px 16px 0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 13px;
  padding-bottom: 20px;
}

.form-grid label {
  min-width: 0;
}

.form-grid label > span {
  display: block;
  margin-bottom: 6px;
  color: #806c63;
  font-size: 8px;
  font-weight: 700;
}

.form-grid input,
.form-grid select {
  width: 100%;
  min-height: 31px;
  box-sizing: border-box;
  padding: 7px 9px;
  border: 1px solid #e6dfda;
  border-radius: 2px;
  outline: 0;
  background: #fff;
  color: #4d3933;
  font-size: 9px;
}

.form-grid input:focus,
.form-grid select:focus {
  border-color: #684b41;
  box-shadow: 0 0 0 2px rgba(104,75,65,.10);
}

.form-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 66px;
  margin: 0 -16px;
  padding: 0 16px;
  border-top: 1px solid #eee8e3;
}

.update-button {
  min-width: 64px;
  padding: 8px 15px;
  border: 0;
  border-radius: 3px;
  background: #684b41;
  color: #fff;
  font-size: 9px;
  font-weight: 800;
  cursor: pointer;
}

.update-button:hover {
  background: #4f352e;
}

.save-message {
  color: #55865d;
  font-size: 9px;
}

.profile-notice {
  width: min(1040px, calc(100% - 36px));
  margin: -25px auto 30px;
  padding: 9px 12px;
  border: 1px solid #eadfd8;
  border-radius: 5px;
  background: #fbf7f3;
  color: #806c63;
  font-size: 10px;
}

@media (max-width: 760px) {
  .profile-cover {
    height: 145px;
  }

  .profile-layout {
    grid-template-columns: 1fr;
    width: calc(100% - 24px);
    margin-top: -35px;
  }

  .profile-summary {
    display: grid;
    grid-template-columns: 78px 1fr;
    gap: 0 13px;
    text-align: left;
    padding: 13px;
  }

  .profile-avatar {
    grid-row: span 3;
    width: 68px;
    height: 68px;
    margin: 0;
  }

  .avatar-edit {
    top: 58px;
    left: 66px;
    right: auto;
  }

  .summary-stats,
  .public-profile,
  .profile-id {
    grid-column: 1 / -1;
  }

  .profile-summary h1 {
  overflow-wrap: anywhere;
    align-self: end;
  }

  .company-name {
    margin-bottom: 5px;
  }
}

@media (max-width: 520px) {
  .cover-actions {
    right: 12px;
  }

  .cover-role {
    display: none;
  }

  .profile-tabs {
    gap: 16px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
<style scoped>
.form-full { grid-column: 1 / -1; }
.hidden-input { display:none; }
.settings-panel { padding: 24px; min-height: 300px; }
.settings-panel h2 { margin:0 0 8px; color:#4d3933; font-size:18px; }
.settings-panel p { color:#806c63; font-size:12px; }
.secondary-button { border:1px solid #684b41; background:#fff; color:#684b41; padding:9px 14px; border-radius:4px; cursor:pointer; font-size:10px; font-weight:700; }
.document-list { list-style:none; padding:0; margin:18px 0 0; }
.document-list li { display:flex; justify-content:space-between; gap:12px; padding:10px 0; border-bottom:1px solid #eee8e3; font-size:11px; }
.document-list button { border:0; background:transparent; color:#a04f43; cursor:pointer; }
.empty-state { font-style:italic; }
.billing-card { display:flex; flex-direction:column; gap:5px; padding:16px; margin-top:18px; border:1px solid #e6dfda; background:#fbf7f3; border-radius:5px; font-size:11px; color:#806c63; }
.notification-option { display:flex; align-items:center; gap:9px; padding:12px 0; border-bottom:1px solid #eee8e3; color:#5f4b43; font-size:12px; }
.notification-option input { accent-color:#684b41; }
.public-preview { width:min(1040px,calc(100% - 36px)); margin:-25px auto 30px; padding:18px; background:#fff; border:1px solid #e6dfda; border-radius:5px; color:#806c63; }
.public-preview div { display:flex; justify-content:space-between; gap:15px; color:#4d3933; }
.public-preview p { margin:7px 0 0; font-size:11px; }
.change-cover { cursor:pointer; }
.update-button:disabled { opacity:.6; cursor:not-allowed; }
.error-message { color:#a04f43; font-size:9px; }
@media (max-width:760px){ .settings-panel{padding:16px;} .public-preview{width:calc(100% - 24px);} .public-preview div{flex-direction:column;gap:4px;} }
</style>
