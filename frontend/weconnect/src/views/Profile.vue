<template>
  <div class="profile">
    <header class="profile-hero">
      <div class="avatar">CF</div>
      <div><span class="eyebrow">SUPPLIER PROFILE</span>
        <h1>{{ form.businessName }}</h1>
        <p>{{ form.location }} · Verified wholesale supplier</p>
      </div><button class="primary" type="button" @click="save">{{ editing ? 'Save profile' : 'Edit profile' }}</button>
    </header>
    <div class="profile-grid">
      <section class="card">
        <div class="card-title">
          <div>
            <h2>Business information</h2>
            <p>Help buyers understand who they are ordering from.</p>
          </div>
        </div><label>Business name<input v-model="form.businessName" :disabled="!editing" /></label>
        <div class="two"><label>Contact person<input v-model="form.owner"
              :disabled="!editing" /></label><label>Location<input v-model="form.location"
              :disabled="!editing" /></label></div>
        <div class="two"><label>Email<input v-model="form.email" type="email"
              :disabled="!editing" /></label><label>Phone<input v-model="form.phone" :disabled="!editing" /></label>
        </div><label>About your business<textarea v-model="form.description" rows="5"
            :disabled="!editing"></textarea></label>
        <p v-if="message" class="success">{{ message }}</p>
      </section>
      <aside>
        <section class="card presence"><img
            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80"
            alt="Bright supplier studio" />
          <h2>Make your storefront memorable</h2>
          <p>A clear profile and thoughtful product photography help buyers choose you with confidence.</p>
          <RouterLink to="/products/add" class="link">Add your first featured product →</RouterLink>
        </section>
        <section class="card checklist">
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
const { profile } = useSupplierData(); const form = reactive({ ...profile.value }); const editing = ref(false); const message = ref("");
function save() { if (editing.value) { Object.assign(profile.value, form); message.value = "Profile saved locally."; setTimeout(() => message.value = "", 2500); } editing.value = !editing.value; }
</script>
<style scoped>
.profile {
  min-height: 100vh;
  padding: clamp(22px, 4vw, 38px) clamp(16px, 4vw, 38px) 48px;
  background: #f7f5f2;
  color: #4d3933;
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: auto
}

.profile-hero {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 25px;
  border-radius: 14px;
  background: #684b41;
  color: #fff
}

.avatar {
  display: grid;
  place-items: center;
  width: 65px;
  height: 65px;
  border-radius: 18px;
  background: #e17b3d;
  font: 700 20px Georgia, serif
}

.eyebrow {
  color: #dba47c;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.8px
}

.profile h1 {
  margin: 7px 0 4px;
  font: 700 clamp(25px, 4vw, 30px) Georgia, serif
}

.profile-hero p {
  margin: 0;
  color: #e2d1c9
}

.primary {
  margin-left: auto;
  border: 0;
  border-radius: 7px;
  padding: 11px 15px;
  background: #e17b3d;
  color: #fff;
  font-weight: 700;
  cursor: pointer
}

.profile-grid {
  display: grid;
  grid-template-columns: 1.3fr .7fr;
  gap: 22px;
  margin-top: 22px
}

.card {
  padding: 23px;
  border: 1px solid #e6dfda;
  border-radius: 13px;
  background: #fff
}

.card-title {
  margin-bottom: 24px
}

.card h2 {
  margin: 0;
  font: 700 20px Georgia, serif
}

.card-title p,
.presence p {
  margin: 5px 0 0;
  color: #9b8981;
  font-size: 12px
}

.card label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 17px;
  color: #7d6c64;
  font-size: 11px;
  font-weight: 700
}

.card input,
.card textarea {
  padding: 12px;
  border: 1px solid #e4ddd8;
  border-radius: 8px;
  background: #fbfaf8;
  color: #4d3933;
  font: 14px Arial
}

.card input:disabled,
.card textarea:disabled {
  opacity: 1
}

.two {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px
}

.presence {
  overflow: hidden
}

.presence img {
  width: calc(100% + 46px);
  height: 160px;
  object-fit: cover;
  margin: -23px -23px 20px
}

.presence h2 {
  font-size: 18px
}

.link {
  display: inline-block;
  margin-top: 17px;
  color: #d2763d;
  font-size: 12px;
  font-weight: 700;
  text-decoration: none
}

.checklist {
  margin-top: 22px
}

.checklist h2 {
  margin-bottom: 14px
}

.checklist p {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  margin: 0;
  border-top: 1px solid #f0ece9;
  color: #7e6c64;
  font-size: 12px
}

.checklist b {
  color: #4d8a5c
}

.success {
  color: #428252;
  font-size: 13px
}

@media(max-width:750px) {
  .profile {
    padding: 24px 16px
  }

  .profile-hero {
    align-items: flex-start;
    flex-wrap: wrap
  }

  .primary {
    margin-left: 0
  }

  .profile-grid {
    grid-template-columns: 1fr
  }

  .two {
    grid-template-columns: 1fr
  }
}

@media(max-width:480px) {
  .profile-hero {
    padding: 20px;
  }

  .profile-hero .primary {
    width: 100%;
  }

  .card {
    padding: 18px;
  }

  .presence img {
    width: calc(100% + 36px);
    margin: -18px -18px 18px;
  }
}
</style>
