<template>
  <div class="supplier_reviews_reviews">
    <header class="supplier_reviews_header">
      <div><span class="supplier_reviews_eyebrow">BUYER FEEDBACK</span>
        <h1>Reviews</h1>
        <p>Turn great supplier experiences into stronger buyer relationships.</p>
      </div>
      <div class="supplier_reviews_rating"><strong>4.8</strong><span>★★★★★</span><small>Average supplier rating</small></div>
    </header>
    <section class="supplier_reviews_summary">
      <article><span>Reviews this month</span><strong>{{ reviews.length }}</strong></article>
      <article><span>Response rate</span><strong>92%</strong></article>
      <article><span>Unanswered</span><strong>{{ unanswered }}</strong></article>
    </section>
    <section class="supplier_reviews_review-list">
      <div class="supplier_reviews_list-head">
        <div>
          <h2>Recent buyer reviews</h2>
          <p>Your latest customer conversations.</p>
        </div><button type="button" class="supplier_reviews_filter" @click="onlyUnanswered = !onlyUnanswered">{{ onlyUnanswered ?
          'Showall reviews' : 'Needs reply' }}</button>
      </div>
      <article v-for="review in visibleReviews" :key="review.id" class="supplier_reviews_review">
        <div class="supplier_reviews_avatar">{{ review.buyer.slice(0, 2).toUpperCase() }}</div>
        <div class="supplier_reviews_review-content">
          <div class="supplier_reviews_review-meta"><strong>{{ review.buyer }}</strong><span>{{ review.date }}</span></div>
          <div class="supplier_reviews_stars">{{ '★'.repeat(review.rating) }}<span>{{ '★'.repeat(5 - review.rating) }}</span></div>
          <h3>{{ review.title }}</h3>
          <p>{{ review.text }}</p><span v-if="review.replied" class="supplier_reviews_replied">Replied</span><button v-else type="button"
            class="supplier_reviews_reply" @click="reply(review)">Reply to buyer</button>
        </div>
      </article>
      <div v-if="!visibleReviews.length" class="supplier_reviews_empty">No reviews need a reply right now.</div>
    </section>
    <p v-if="message" class="supplier_reviews_notice">{{ message }}</p>
  </div>
</template>
<script setup>
import { computed, ref } from "vue";
import { useSupplierData } from "@/data/supplierData";
const { reviews, replyToReview } = useSupplierData(); const onlyUnanswered = ref(false); const message = ref(""); const unanswered = computed(() => reviews.value.filter((review) => !review.replied).length); const visibleReviews = computed(() => onlyUnanswered.value ? reviews.value.filter((review) => !review.replied) : reviews.value);
function reply(review) { replyToReview(review.id); message.value = `Reply saved for ${review.buyer}.`; setTimeout(() => message.value = "", 2500); }
</script>
<style scoped>
.supplier_reviews_reviews {
  min-height: 100vh;
  padding: clamp(22px, 4vw, 38px) clamp(16px, 4vw, 38px) 48px;
  background: #f7f5f2;
  color: #4d3933;
  font-family: Arial, sans-serif;
  max-width: 1120px;
  margin: auto
}

.supplier_reviews_header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 24px
}

.supplier_reviews_eyebrow {
  color: #d2763d;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.8px
}

.supplier_reviews_header h1 {
  margin: 7px 0 5px;
  font: 700 clamp(28px, 4vw, 34px) Georgia, serif;
  color: #44312c
}

.supplier_reviews_header p {
  margin: 0;
  color: #88766e
}

.supplier_reviews_rating {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 13px 17px;
  border: 1px solid #e6dfda;
  border-radius: 10px;
  background: #fff
}

.supplier_reviews_rating strong {
  font: 700 28px Georgia, serif
}

.supplier_reviews_rating span,
.supplier_reviews_stars {
  color: #d98942;
  letter-spacing: 2px
}

.supplier_reviews_rating small {
  margin-top: 3px;
  color: #9b8981;
  font-size: 10px
}

.supplier_reviews_summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 22px
}

.supplier_reviews_summary article {
  padding: 17px;
  border: 1px solid #e6dfda;
  border-radius: 11px;
  background: #fff
}

.supplier_reviews_summary span {
  color: #95827a;
  font-size: 11px
}

.supplier_reviews_summary strong {
  display: block;
  margin-top: 8px;
  font: 700 25px Georgia, serif
}

.supplier_reviews_review-list {
  border: 1px solid #e6dfda;
  border-radius: 13px;
  background: #fff;
  overflow: hidden
}

.supplier_reviews_list-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 21px;
  border-bottom: 1px solid #eee8e3
}

.supplier_reviews_list-head h2 {
  margin: 0;
  font: 700 20px Georgia, serif
}

.supplier_reviews_list-head p {
  margin: 4px 0 0;
  color: #9b8981;
  font-size: 12px
}

.supplier_reviews_filter,
.supplier_reviews_reply {
  border: 1px solid #e1d8d2;
  border-radius: 7px;
  padding: 9px 12px;
  background: #fff;
  color: #684b41;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer
}

.supplier_reviews_review {
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: 14px;
  padding: 20px 21px;
  border-bottom: 1px solid #f0ece9
}

.supplier_reviews_avatar {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f1e9e4;
  color: #96654d;
  font-size: 11px;
  font-weight: 700
}

.supplier_reviews_review-meta {
  display: flex;
  justify-content: space-between
}

.supplier_reviews_review-meta strong {
  font-size: 13px
}

.supplier_reviews_review-meta span {
  color: #9b8981;
  font-size: 11px
}

.supplier_reviews_stars {
  margin: 5px 0 5px;
  font-size: 13px
}

.supplier_reviews_stars span {
  color: #ded4cf
}

.supplier_reviews_review h3 {
  margin: 0 0 4px;
  font: 700 16px Georgia, serif
}

.supplier_reviews_review p {
  margin: 0 0 10px;
  color: #796860;
  font-size: 13px;
  line-height: 1.5
}

.supplier_reviews_replied {
  color: #4b8756;
  font-size: 11px;
  font-weight: 700
}

.supplier_reviews_reply {
  background: #684b41;
  color: #fff
}

.supplier_reviews_empty {
  text-align: center;
  padding: 40px;
  color: #9b8981
}

.supplier_reviews_notice {
  position: fixed;
  right: 25px;
  bottom: 25px;
  padding: 13px 16px;
  border-radius: 8px;
  background: #684b41;
  color: #fff;
  font-size: 13px
}

@media(max-width:600px) {
  .supplier_reviews_reviews {
    padding: 24px 16px
  }

  .supplier_reviews_header {
    align-items: flex-start;
    flex-direction: column;
    gap: 16px
  }

  .supplier_reviews_rating {
    align-items: flex-start
  }

  .supplier_reviews_summary {
    gap: 8px
  }

  .supplier_reviews_summary strong {
    font-size: 21px
  }

  .supplier_reviews_list-head {
    align-items: flex-start;
    gap: 12px;
    flex-direction: column
  }
}

@media(max-width:460px) {
  .supplier_reviews_list-head .supplier_reviews_filter {
    width: 100%;
  }

  .supplier_reviews_review {
    padding: 18px 16px;
  }

  .supplier_reviews_review-meta {
    align-items: flex-start;
    flex-direction: column;
    gap: 3px;
  }
}
</style>
