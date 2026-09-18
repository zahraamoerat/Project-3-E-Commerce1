<template>
  <div class="main-content">
    <header class="page-header">
      <div>
        <h1>Reviews</h1>
        <p class="subtitle">Rate suppliers after delivery, and see your past reviews.</p>
      </div>
    </header>

    <!-- Orders awaiting review -->
    <section class="card">
      <h3>Awaiting your review</h3>

      <p v-if="pendingReviews.length === 0" class="empty-text">You're all caught up — no deliveries waiting for a review.</p>

      <div v-for="order in pendingReviews" :key="order.orderId" class="pending-item">
        <div class="pending-info">
          <strong>{{ order.supplierName }}</strong>
          <span class="muted">Order #{{ order.orderId }} · Delivered {{ order.deliveredDate }}</span>
        </div>

        <div class="star-input">
          <span
            v-for="star in 5"
            :key="star"
            class="star"
            :class="{ filled: star <= (draftRatings[order.orderId]?.rating || 0) }"
            @click="setRating(order.orderId, star)"
          >★</span>
        </div>

        <input
          v-model="draftRatings[order.orderId].comment"
          type="text"
          placeholder="Add a comment (optional)"
          class="comment-input"
        />

        <button
          class="btn-primary btn-small"
          :disabled="!draftRatings[order.orderId]?.rating || submitting[order.orderId]"
          @click="submitReview(order)"
        >
          {{ submitting[order.orderId] ? "Submitting..." : "Submit" }}
        </button>
      </div>
    </section>

    <!-- Review history -->
    <section class="card" style="margin-top: 20px;">
      <h3>Your reviews</h3>

      <p v-if="reviews.length === 0" class="empty-text">You haven't left any reviews yet.</p>

      <div v-for="r in reviews" :key="r.ratingId" class="review-item">
        <div class="review-top">
          <div>
            <strong>{{ r.supplierName }}</strong>
            <span class="muted" style="margin-left: 8px;">{{ r.date }}</span>
          </div>
          <button class="delete-btn" @click="confirmDelete(r)">Delete</button>
        </div>
        <div class="star-display">
          <span v-for="star in 5" :key="star" class="star" :class="{ filled: star <= r.rating }">★</span>
        </div>
        <p v-if="r.comment" class="review-comment">{{ r.comment }}</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import Swal from "sweetalert2";
import api from "../services/api";

// Sample data below is a fallback in case the API call fails -
// loadReviews() overwrites these with real data on mount.
const pendingReviews = ref([
  { orderId: "1038", supplierName: "CropGuard Distributors", deliveredDate: "3 days ago" },
  { orderId: "1030", supplierName: "Boland Packaging Supplies", deliveredDate: "1 week ago" },
]);

const reviews = ref([
  { ratingId: 1, supplierName: "Highveld Seed Co.", rating: 5, comment: "Fast delivery and great communication.", date: "2 weeks ago" },
  { ratingId: 2, supplierName: "Karoo Fertiliser Traders", rating: 4, comment: "Good pricing, delivery took a bit longer than quoted.", date: "3 weeks ago" },
]);

// Tracks the in-progress star rating + comment for each pending order,
// before it's submitted.
const draftRatings = reactive({});
const submitting = reactive({});

function initDrafts() {
  pendingReviews.value.forEach((o) => {
    if (!draftRatings[o.orderId]) {
      draftRatings[o.orderId] = { rating: 0, comment: "" };
    }
  });
}
initDrafts();

function setRating(orderId, star) {
  draftRatings[orderId].rating = star;
}

async function submitReview(order) {
  const draft = draftRatings[order.orderId];
  if (!draft?.rating) return;

  submitting[order.orderId] = true;
  try {
    const { data } = await api.post("/reviews", {
      orderId: order.orderId,
      rating: draft.rating,
      comment: draft.comment,
    });

    reviews.value.unshift({
      ratingId: data.ratingId,
      supplierName: order.supplierName,
      rating: draft.rating,
      comment: draft.comment,
      date: "Just now",
    });

    pendingReviews.value = pendingReviews.value.filter((o) => o.orderId !== order.orderId);
    delete draftRatings[order.orderId];

    Swal.fire({
      icon: "success",
      title: "Thanks for your feedback!",
      text: `Your review for ${order.supplierName} has been submitted.`,
      confirmButtonColor: "#E0703D",
      timer: 2000,
      timerProgressBar: true,
    });
  } catch (err) {
    console.error("Failed to submit review:", err);
    Swal.fire({
      icon: "error",
      title: "Couldn't submit review",
      text: "Something went wrong. Please try again.",
      confirmButtonColor: "#E0703D",
    });
  } finally {
    submitting[order.orderId] = false;
  }
}

async function loadReviews() {
  try {
    const { data } = await api.get("/reviews");
    pendingReviews.value = data.pending;
    reviews.value = data.history;
    initDrafts();
  } catch (err) {
    console.error("Failed to load reviews:", err);
    // Falls back to the placeholder sample data above.
  }
}

async function confirmDelete(review) {
  const result = await Swal.fire({
    icon: "warning",
    title: "Delete this review?",
    text: `Your review for ${review.supplierName} will be permanently removed.`,
    showCancelButton: true,
    confirmButtonText: "Delete",
    confirmButtonColor: "#C0392B",
    cancelButtonColor: "#78737E",
  });

  if (result.isConfirmed) {
    try {
      await api.delete(`/reviews/${review.ratingId}`);
      reviews.value = reviews.value.filter((r) => r.ratingId !== review.ratingId);

      Swal.fire({
        icon: "success",
        title: "Review deleted",
        confirmButtonColor: "#E0703D",
        timer: 1500,
        timerProgressBar: true,
      });
    } catch (err) {
      console.error("Failed to delete review:", err);
      Swal.fire({
        icon: "error",
        title: "Couldn't delete review",
        text: "Something went wrong. Please try again.",
        confirmButtonColor: "#E0703D",
      });
    }
  }
}

onMounted(loadReviews);
</script>

<style scoped>
.page-header { margin-bottom: 20px; }
.subtitle { color: var(--color-text-muted); font-size: 14px; margin: 4px 0 0; }

.empty-text { color: var(--color-text-muted); font-size: 14px; }

.pending-item {
  display: grid;
  grid-template-columns: 1fr auto 1fr auto;
  align-items: center;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid var(--color-border);
}
.pending-item:last-child { border-bottom: none; }

.pending-info { display: flex; flex-direction: column; gap: 2px; }
.muted { color: var(--color-text-muted); font-size: 12px; }

.star-input, .star-display { display: flex; gap: 2px; }
.star {
  font-size: 20px;
  color: #DDD;
  cursor: default;
}
.star-input .star { cursor: pointer; }
.star.filled { color: var(--color-accent); }

.comment-input { font-size: 13px; }

.btn-small { padding: 8px 14px; font-size: 13px; white-space: nowrap; }
.btn-small:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.review-item {
  padding: 14px 0;
  border-bottom: 1px solid var(--color-border);
}
.review-item:last-child { border-bottom: none; }
.review-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}
.delete-btn {
  background: none;
  border: none;
  color: #C0392B;
  font-size: 12px;
  padding: 0;
}
.delete-btn:hover { text-decoration: underline; }
.review-comment {
  margin: 6px 0 0;
  font-size: 13px;
  color: var(--color-text-muted);
}
</style>