<template>
  <div class="page">
    <header class="header">
      <div><span class="eyebrow">FULFILMENT DESK</span>
        <h1>Deliveries</h1>
        <p>Coordinate pickups and keep every buyer informed.</p>
      </div><button class="primary" type="button"
        @click="showNotice('Pickup request created for your next ready order.')">Schedule pickup</button>
    </header>
    <section class="delivery-hero">
      <div><span class="eyebrow">TODAY'S ROUTE</span>
        <h2>Three shipments in motion</h2>
        <p>SwiftShip has a pickup window available at 16:00.</p>
      </div>
      <div class="route-line"><span>Warehouse</span><i></i><span>Buyers</span></div>
    </section>
    <section class="delivery-list">
      <article v-for="delivery in deliveries" :key="delivery.id" class="delivery">
        <div class="delivery-icon">✦</div>
        <div><strong>{{ delivery.id }} · {{ delivery.order }}</strong>
          <h2>{{ delivery.destination }}</h2>
          <p>{{ delivery.carrier }} · ETA {{ delivery.eta }}</p>
        </div><span class="delivery-status" :class="delivery.status.toLowerCase().replaceAll(' ', '-')">{{
          delivery.status }}</span><button type="button" class="track"
          @click="showNotice(`Tracking ${delivery.id} with ${delivery.carrier}.`)">Track</button>
      </article>
    </section>
    <p v-if="notice" class="notice">{{ notice }}</p>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useSupplierData } from "@/data/supplierData";
const { deliveries } = useSupplierData(); const notice = ref(""); function showNotice(text) { notice.value = text; setTimeout(() => notice.value = "", 2600); }
</script>
<style scoped>
.page {
  min-height: 100vh;
  padding: clamp(22px, 4vw, 38px) clamp(16px, 4vw, 38px) 48px;
  background: #f7f5f2;
  color: #4d3933;
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: auto
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20px;
  margin-bottom: 25px
}

.eyebrow {
  color: #d2763d;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.8px
}

.header h1 {
  margin: 7px 0 5px;
  font: 700 clamp(28px, 4vw, 34px) Georgia, serif;
  color: #44312c
}

.header p {
  margin: 0;
  color: #88766e
}

.primary,
.track {
  border: 0;
  border-radius: 7px;
  padding: 11px 14px;
  background: #e17b3d;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer
}

.delivery-hero {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px;
  margin-bottom: 20px;
  border-radius: 13px;
  background: #684b41;
  color: #fff
}

.delivery-hero h2 {
  margin: 8px 0 5px;
  font: 700 24px Georgia, serif
}

.delivery-hero p {
  margin: 0;
  color: #e2d1c9;
  font-size: 13px
}

.route-line {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #f0d5c3;
  font-size: 11px
}

.route-line i {
  display: block;
  width: 100px;
  height: 1px;
  background: #dba47c
}

.delivery-list {
  border: 1px solid #e6dfda;
  border-radius: 13px;
  background: #fff;
  overflow: hidden
}

.delivery {
  display: grid;
  grid-template-columns: 45px 1fr 130px 70px;
  gap: 16px;
  align-items: center;
  padding: 20px 22px;
  border-bottom: 1px solid #f0ece9
}

.delivery-icon {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f1e9e4;
  color: #d2763d
}

.delivery strong {
  font-size: 12px;
  color: #8c756b
}

.delivery h2 {
  margin: 5px 0 3px;
  font: 700 17px Georgia, serif
}

.delivery p {
  margin: 0;
  color: #9b8981;
  font-size: 11px
}

.delivery-status {
  padding: 6px 8px;
  border-radius: 13px;
  font-size: 10px;
  font-weight: 700
}

.ready-for-pickup {
  background: #fff1dc;
  color: #aa742b
}

.in-transit {
  background: #e7f2e8;
  color: #478253
}

.delivered {
  background: #eee9f4;
  color: #765b8d
}

.track {
  background: #684b41
}

.notice {
  position: fixed;
  right: 25px;
  bottom: 25px;
  padding: 13px 16px;
  border-radius: 8px;
  background: #684b41;
  color: #fff;
  font-size: 13px
}

@media(max-width:700px) {
  .page {
    padding: 24px 16px
  }

  .header,
  .delivery-hero {
    align-items: flex-start;
    flex-direction: column;
    gap: 18px
  }

  .delivery {
    grid-template-columns: 40px 1fr
  }

  .delivery-status,
  .track {
    grid-column: 2;
    justify-self: start
  }
}

@media(max-width:480px) {
  .header .primary {
    width: 100%;
  }

  .delivery-hero {
    padding: 20px;
  }

  .route-line {
    width: 100%;
    justify-content: space-between;
  }

  .route-line i {
    flex: 1;
  }
}
</style>
