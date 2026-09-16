<template>
  <div class="supplier_profile_profile">
    <header class="supplier_profile_profile-hero">
      <div class="supplier_profile_avatar">CF</div>
      <div><span class="supplier_profile_eyebrow">SUPPLIER PROFILE</span>
        <h1>{{ form.businessName }}</h1>
        <p>{{ form.location }} · Verified wholesale supplier</p>
      </div><button class="supplier_profile_primary" type="button" @click="save">{{ editing ? 'Save profile' : 'Edit profile' }}</button>
    </header>
    <div class="supplier_profile_profile-grid">
      <section class="supplier_profile_card">
        <div class="supplier_profile_card-title">
          <div>
            <h2>Business information</h2>
            <p>Help buyers understand who they are ordering from.</p>
          </div>
        </div><label>Business name<input v-model="form.businessName" :disabled="!editing" /></label>
        <div class="supplier_profile_two"><label>Contact person<input v-model="form.owner"
              :disabled="!editing" /></label><label>Location<input v-model="form.location"
              :disabled="!editing" /></label></div>
        <div class="supplier_profile_two"><label>Email<input v-model="form.email" type="email"
              :disabled="!editing" /></label><label>Phone<input v-model="form.phone" :disabled="!editing" /></label>
        </div><label>About your business<textarea v-model="form.description" rows="5"
            :disabled="!editing"></textarea></label>
        <p v-if="message" class="supplier_profile_success">{{ message }}</p>
      </section>
      <aside>
        <section class="supplier_profile_card supplier_profile_presence"><img
            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80"
            alt="Bright supplier studio" />
          <h2>Make your storefront memorable</h2>
          <p>A clear profile and thoughtful product photography help buyers choose you with confidence.</p>
          <RouterLink to="/products/add" class="supplier_profile_link">Add your first featured product →</RouterLink>
        </section>
        <section class="supplier_profile_card supplier_profile_checklist">
          <h2>Profile checklist</h2>
          <p>Business details <b>Complete</b></p>
          <p>Catalog photos <b>3 of 5</b></p>
          <p>Delivery preferences <b>Complete</b></p>
        </section>
      </aside>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref } from "vue";
import { RouterLink } from "vue-router";
import { useSupplierData } from "@/data/supplierData";
const { profile, updateProfile } = useSupplierData(); const form = reactive({ ...profile.value }); const editing = ref(false); const message = ref("");
async function save() { if (editing.value) { await updateProfile(form); message.value = "Profile saved."; setTimeout(() => message.value = "", 2500); } editing.value = !editing.value; }
</script>
<style scoped>
.supplier_profile_profile {
  min-height: 100vh;
  padding: clamp(22px, 4vw, 38px) clamp(16px, 4vw, 38px) 48px;
  background: #f7f5f2;
  color: #4d3933;
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: auto
}

.supplier_profile_profile-hero {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 25px;
  border-radius: 14px;
  background: #684b41;
  color: #fff
}

.supplier_profile_avatar {
  display: grid;
  place-items: center;
  width: 65px;
  height: 65px;
  border-radius: 18px;
  background: #e17b3d;
  font: 700 20px Georgia, serif
}

.supplier_profile_eyebrow {
  color: #dba47c;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.8px
}

.supplier_profile_profile h1 {
  margin: 7px 0 4px;
  font: 700 clamp(25px, 4vw, 30px) Georgia, serif
}

.supplier_profile_profile-hero p {
  margin: 0;
  color: #e2d1c9
}

.supplier_profile_primary {
  margin-left: auto;
  border: 0;
  border-radius: 7px;
  padding: 11px 15px;
  background: #e17b3d;
  color: #fff;
  font-weight: 700;
  cursor: pointer
}

.supplier_profile_profile-grid {
  display: grid;
  grid-template-columns: 1.3fr .7fr;
  gap: 22px;
  margin-top: 22px
}

.supplier_profile_card {
  padding: 23px;
  border: 1px solid #e6dfda;
  border-radius: 13px;
  background: #fff
}

.supplier_profile_card-title {
  margin-bottom: 24px
}

.supplier_profile_card h2 {
  margin: 0;
  font: 700 20px Georgia, serif
}

.supplier_profile_card-title p,
.supplier_profile_presence p {
  margin: 5px 0 0;
  color: #9b8981;
  font-size: 12px
}

.supplier_profile_card label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 17px;
  color: #7d6c64;
  font-size: 11px;
  font-weight: 700
}

.supplier_profile_card input,
.supplier_profile_card textarea {
  padding: 12px;
  border: 1px solid #e4ddd8;
  border-radius: 8px;
  background: #fbfaf8;
  color: #4d3933;
  font: 14px Arial
}

.supplier_profile_card input:disabled,
.supplier_profile_card textarea:disabled {
  opacity: 1
}

.supplier_profile_two {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px
}

.supplier_profile_presence {
  overflow: hidden
}

.supplier_profile_presence img {
  width: calc(100% + 46px);
  height: 160px;
  object-fit: cover;
  margin: -23px -23px 20px
}

.supplier_profile_presence h2 {
  font-size: 18px
}

.supplier_profile_link {
  display: inline-block;
  margin-top: 17px;
  color: #d2763d;
  font-size: 12px;
  font-weight: 700;
  text-decoration: none
}

.supplier_profile_checklist {
  margin-top: 22px
}

.supplier_profile_checklist h2 {
  margin-bottom: 14px
}

.supplier_profile_checklist p {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  margin: 0;
  border-top: 1px solid #f0ece9;
  color: #7e6c64;
  font-size: 12px
}

.supplier_profile_checklist b {
  color: #4d8a5c
}

.supplier_profile_success {
  color: #428252;
  font-size: 13px
}

@media(max-width:750px) {
  .supplier_profile_profile {
    padding: 24px 16px
  }

  .supplier_profile_profile-hero {
    align-items: flex-start;
    flex-wrap: wrap
  }

  .supplier_profile_primary {
    margin-left: 0
  }

  .supplier_profile_profile-grid {
    grid-template-columns: 1fr
  }

  .supplier_profile_two {
    grid-template-columns: 1fr
  }
}

@media(max-width:480px) {
  .supplier_profile_profile-hero {
    padding: 20px;
  }

  .supplier_profile_profile-hero .supplier_profile_primary {
    width: 100%;
  }

  .supplier_profile_card {
    padding: 18px;
  }

  .supplier_profile_presence img {
    width: calc(100% + 36px);
    margin: -18px -18px 18px;
  }
}
</style>
