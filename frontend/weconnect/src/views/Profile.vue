<template>
  <section class="profile-page">
    <div class="profile-header">
      <div>
        <p class="eyebrow">SUPPLIER</p>
        <h1>My Profile</h1>
        <p class="subtitle">Manage your supplier account information.</p>
      </div>
    </div>

    <div class="profile-card">
      <div class="avatar">S</div>
      <div class="details">
        <h2>Supplier Profile</h2>
        <p>Update your account details and supplier information here.</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.profile-page {
  min-height: 100vh;
  padding: 40px;
  background: #f7f5f2;
  color: #553c35;
}

.profile-header {
  margin-bottom: 28px;
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.5px;
}

h1 {
  margin: 0;
  font-family: Georgia, serif;
  font-size: 32px;
}

.subtitle {
  margin-top: 8px;
  color: #777;
}

.profile-card {
  display: flex;
  align-items: center;
  gap: 20px;
  max-width: 700px;
  padding: 28px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.06);
}

.avatar {
  display: grid;
  width: 64px;
  height: 64px;
  place-items: center;
  flex-shrink: 0;
  border-radius: 50%;
  background: #553c35;
  color: #fff;
  font-size: 24px;
  font-weight: 700;
}

.details h2 {
  margin: 0 0 8px;
  font-size: 20px;
}

.details p {
  margin: 0;
  color: #777;
}
</style>
