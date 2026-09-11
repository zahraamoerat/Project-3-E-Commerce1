<template>
  <div class="main-content">
    <header class="page-header">
      <div>
        <h1>Business profile</h1>
        <p class="subtitle">This information is shown to suppliers when you place an order.</p>
      </div>
    </header>

    <div class="two-col">
      <!-- Profile summary card - updates live as you type, before you save -->
      <section class="card summary-card">
        <div class="logo-circle">{{ initials(profile.businessName) }}</div>
        <h2>{{ profile.businessName || "Your business name" }}</h2>
        <p class="category-tag">{{ categoryName }}</p>
        <span class="verified-badge" :class="{ verified: profile.isVerified }">
          {{ profile.isVerified ? "✓ Verified business" : "Not yet verified" }}
        </span>

        <dl class="summary-list">
          <div>
            <dt>Contact person</dt>
            <dd>{{ profile.contactPerson || "—" }}</dd>
          </div>
          <div>
            <dt>Contact phone</dt>
            <dd>{{ profile.contactPhone || "—" }}</dd>
          </div>
          <div>
            <dt>Registration number</dt>
            <dd>{{ profile.registrationNumber || "—" }}</dd>
          </div>
        </dl>
      </section>

      <!-- Edit form -->
      <section class="card form-card">
        <h3>Edit details</h3>
        <form @submit.prevent="handleSave" novalidate>
          <label>Business name</label>
          <input
            v-model="profile.businessName"
            type="text"
            :class="{ 'input-error': errors.businessName }"
            @input="errors.businessName = ''"
          />
          <p v-if="errors.businessName" class="field-error">{{ errors.businessName }}</p>

          <label>Category</label>
          <select v-model="profile.categoryId">
            <option v-for="c in categories" :key="c.categoryId" :value="c.categoryId">
              {{ c.name }}
            </option>
          </select>

          <label>Registration number</label>
          <input v-model="profile.registrationNumber" type="text" placeholder="e.g. 2021/123456/07" />

          <label>Contact person</label>
          <input v-model="profile.contactPerson" type="text" />

          <label>Contact phone</label>
          <input
            v-model="profile.contactPhone"
            type="tel"
            placeholder="e.g. 071 234 5678"
            :class="{ 'input-error': errors.contactPhone }"
            @input="errors.contactPhone = ''"
          />
          <p v-if="errors.contactPhone" class="field-error">{{ errors.contactPhone }}</p>

          <label>About your business</label>
          <textarea v-model="profile.description" rows="4" placeholder="Tell suppliers a bit about what you do..."></textarea>

          <button class="btn-primary" type="submit" :disabled="saving">
            {{ saving ? "Saving..." : "Save changes" }}
          </button>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Swal from "sweetalert2";
import api from "../services/api";

// Populated from GET /api/business-profile once the backend route exists.
// Sample data below so the page is viewable while you build.
const profile = ref({
  businessName: "Ndlovu Farm Supplies",
  categoryId: 1,
  registrationNumber: "2023/456789/07",
  contactPerson: "Thabo Ndlovu",
  contactPhone: "071 234 5678",
  description: "A small farming supply business sourcing seed, fertiliser, and equipment parts for local growers in the Free State.",
  isVerified: false,
});

const categories = ref([
  { categoryId: 1, name: "Agricultural Inputs" },
  { categoryId: 2, name: "Equipment & Machinery Parts" },
  { categoryId: 3, name: "Packaging & Supplies" },
]);

// Derived from categoryId + the categories list, so the summary card always
// reflects whatever is currently selected in the dropdown - not a separate
// static field that can fall out of sync.
const categoryName = computed(() => {
  const match = categories.value.find((c) => c.categoryId === profile.value.categoryId);
  return match ? match.name : "No category selected";
});

const saving = ref(false);
const errors = ref({ businessName: "", contactPhone: "" });

function initials(name) {
  if (!name || !name.trim()) return "?";
  return name.trim().split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

function validate() {
  errors.value = { businessName: "", contactPhone: "" };
  let valid = true;

  if (!profile.value.businessName || !profile.value.businessName.trim()) {
    errors.value.businessName = "Business name is required.";
    valid = false;
  }

  const phone = profile.value.contactPhone?.trim();
  if (phone) {
    // Loose check for South African numbers: 10 digits, optionally with
    // spaces or a +27 prefix. Not exhaustive, just catches obvious typos.
    const digitsOnly = phone.replace(/\s|-/g, "");
    const validPattern = /^(\+27\d{9}|0\d{9})$/;
    if (!validPattern.test(digitsOnly)) {
      errors.value.contactPhone = "Enter a valid South African number, e.g. 071 234 5678.";
      valid = false;
    }
  }

  return valid;
}

async function loadProfile() {
  // Once the backend route exists, replace the ref() sample data above with:
  // const { data } = await api.get("/business-profile");
  // profile.value = data;
}

async function handleSave() {
  if (!validate()) {
    Swal.fire({
      icon: "warning",
      title: "Check the highlighted fields",
      text: "Some details need fixing before we can save your profile.",
      confirmButtonColor: "#E0703D",
    });
    return;
  }

  saving.value = true;
  try {
    // Once the backend route exists:
    // await api.put("/business-profile", profile.value);
    await new Promise((resolve) => setTimeout(resolve, 500)); // placeholder delay
    Swal.fire({
      icon: "success",
      title: "Saved!",
      text: "Your business profile has been updated.",
      confirmButtonColor: "#E0703D",
      timer: 2000,
      timerProgressBar: true,
    });
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Couldn't save changes",
      text: "Something went wrong. Please try again.",
      confirmButtonColor: "#E0703D",
    });
  } finally {
    saving.value = false;
  }
}

onMounted(loadProfile);
</script>

<style scoped>
.page-header {
  margin-bottom: 24px;
}
.subtitle {
  color: var(--color-text-muted);
  font-size: 14px;
  margin: 4px 0 0;
}

.two-col {
  display: grid;
  grid-template-columns: 1fr 1.6fr;
  gap: 20px;
  align-items: start;
}

.summary-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 32px 24px;
}
.logo-circle {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--color-accent-soft);
  color: var(--color-accent);
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}
.summary-card h2 {
  font-size: 18px;
}
.category-tag {
  color: var(--color-text-muted);
  font-size: 13px;
  margin: 4px 0 12px;
}
.verified-badge {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 20px;
  background: #EEE;
  color: var(--color-text-muted);
}
.verified-badge.verified {
  background: #E3F2E7;
  color: var(--color-success);
}

.summary-list {
  width: 100%;
  margin: 24px 0 0;
  text-align: left;
  border-top: 1px solid var(--color-border);
  padding-top: 16px;
}
.summary-list div {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 13px;
}
.summary-list dt { color: var(--color-text-muted); margin: 0; }
.summary-list dd { margin: 0; font-weight: 500; }

.form-card label {
  display: block;
  font-size: 13px;
  color: var(--color-text-muted);
  margin: 14px 0 6px;
}
.form-card label:first-of-type { margin-top: 0; }

.input-error {
  border-color: #C0392B !important;
}
.field-error {
  color: #C0392B;
  font-size: 12px;
  margin: 4px 0 0;
}
</style>