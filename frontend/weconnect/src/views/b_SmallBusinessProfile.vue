<template>
  <main class="profile-page">
    <section class="profile-cover">
      <button type="button" class="cover-button" @click="goBack">← Back</button>
      <div class="cover-pattern"></div>
      <div class="cover-actions">
        <span class="cover-role">{{ isBuyer ? "SMALL BUSINESS" : "SUPPLIER" }}</span>
        <button type="button" class="change-cover" @click="coverMessage = 'Cover image can be connected to your profile image storage later.'">
          ▣ Change Cover
        </button>
      </div>
    </section>

    <section class="profile-layout">
      <aside class="profile-summary">
        <div class="profile-avatar">{{ initials }}</div>
        <button type="button" class="avatar-edit" @click="coverMessage = 'Profile photo upload can be connected to your image storage.'">✎</button>

        <h1>{{ displayName }}</h1>
        <p class="company-name">{{ isBuyer ? "Small Business" : "Supplier Account" }}</p>

        <div class="summary-stats">
          <div>
            <span>{{ isBuyer ? "Orders" : "Products" }}</span>
            <strong>{{ isBuyer ? "—" : "—" }}</strong>
          </div>
          <div>
            <span>{{ isBuyer ? "Suppliers" : "Orders" }}</span>
            <strong>—</strong>
          </div>
          <div>
            <span>Status</span>
            <strong class="active-text">Active</strong>
          </div>
        </div>

        <button type="button" class="public-profile" @click="coverMessage = 'Public profile preview will use these saved details.'">
          View Public Profile
        </button>

        <div v-if="businessId" class="profile-id">
          {{ isBuyer ? "Buyer" : "Supplier" }} ID: {{ businessId }}
        </div>
      </aside>

      <section class="profile-editor">
        <nav class="profile-tabs" aria-label="Profile sections">
          <button class="active" type="button">Account Settings</button>
          <button type="button" @click="coverMessage = 'Company Settings are ready for the next profile section.'">Company Settings</button>
          <button type="button" @click="coverMessage = 'Documents will appear here when document storage is connected.'">Documents</button>
          <button type="button" @click="coverMessage = 'Billing settings can be added here.'">Billing</button>
          <button type="button" @click="coverMessage = 'Notification preferences can be added here.'">Notifications</button>
        </nav>

        <form class="profile-form" @submit.prevent="saveProfile">
          <div class="form-grid">
            <label>
              <span>First Name</span>
              <input v-model="form.firstName" type="text" placeholder="First name" />
            </label>

            <label>
              <span>Last Name</span>
              <input v-model="form.lastName" type="text" placeholder="Last name" />
            </label>

            <label>
              <span>Phone Number</span>
              <input v-model="form.phone" type="tel" placeholder="+27..." />
            </label>

            <label>
              <span>Email address</span>
              <input v-model="form.email" type="email" placeholder="name@company.com" />
            </label>

            <label>
              <span>City</span>
              <input v-model="form.city" type="text" placeholder="Cape Town" />
            </label>

            <label>
              <span>State/County</span>
              <input v-model="form.province" type="text" placeholder="Western Cape" />
            </label>

            <label>
              <span>Postcode</span>
              <input v-model="form.postalCode" type="text" placeholder="8000" />
            </label>

            <label>
              <span>Country</span>
              <select v-model="form.country">
                <option value="">Select country</option>
                <option>South Africa</option>
                <option>Namibia</option>
                <option>Botswana</option>
                <option>Zimbabwe</option>
                <option>Other</option>
              </select>
            </label>
          </div>

          <div class="form-footer">
            <span v-if="saveMessage" class="save-message">{{ saveMessage }}</span>
            <button type="submit" class="update-button">Update</button>
          </div>
        </form>
      </section>
    </section>

    <p v-if="coverMessage" class="profile-notice">{{ coverMessage }}</p>
  </main>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const role = ref("buyer");
const email = ref(localStorage.getItem("weconnect_email") || "");
const userId = ref(localStorage.getItem("weconnect_user_id") || "");
const buyerId = ref(localStorage.getItem("weconnect_buyer_id") || "");
const supplierId = ref("");

const isBuyer = computed(() => role.value === "buyer");
const businessId = computed(() => isBuyer.value ? buyerId.value : supplierId.value);

const savedFirstName = localStorage.getItem("weconnect_first_name") || "";
const savedLastName = localStorage.getItem("weconnect_last_name") || "";

const form = reactive({
  firstName: savedFirstName,
  lastName: savedLastName,
  phone: localStorage.getItem("weconnect_phone") || "",
  email: email.value,
  city: localStorage.getItem("weconnect_city") || "",
  province: localStorage.getItem("weconnect_province") || "",
  postalCode: localStorage.getItem("weconnect_postal_code") || "",
  country: localStorage.getItem("weconnect_country") || "South Africa",
});

const saveMessage = ref("");
const coverMessage = ref("");

const displayName = computed(() => {
  const fullName = `${form.firstName} ${form.lastName}`.trim();
  if (fullName) return fullName;

  if (form.email) {
    return form.email.split("@")[0]
      .replace(/[._-]+/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  return isBuyer.value ? "Small Business" : "Supplier";
});

const initials = computed(() => {
  const parts = displayName.value.split(/\s+/).filter(Boolean);
  return (parts.slice(0, 2).map((part) => part[0]).join("") || "W").toUpperCase();
});

function saveProfile() {
  const values = {
    weconnect_first_name: form.firstName,
    weconnect_last_name: form.lastName,
    weconnect_phone: form.phone,
    weconnect_email: form.email,
    weconnect_city: form.city,
    weconnect_province: form.province,
    weconnect_postal_code: form.postalCode,
    weconnect_country: form.country,
  };

  Object.entries(values).forEach(([key, value]) => localStorage.setItem(key, value));

  email.value = form.email;
  saveMessage.value = "Profile details saved on this device.";

  window.setTimeout(() => {
    saveMessage.value = "";
  }, 3000);
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
  display: grid;
  place-items: center;
  width: 92px;
  height: 92px;
  margin: -2px auto 11px;
  border: 5px solid #fff;
  border-radius: 50%;
  background: #eadfd8;
  color: #684b41;
  font-size: 27px;
  font-weight: 800;
  box-shadow: 0 2px 8px rgba(31,41,55,.12);
}

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