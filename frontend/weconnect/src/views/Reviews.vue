<template>
  <div class="reviews-page">

    <!-- PAGE HEADER -->
    <header class="page-header">

      <div class="header-content">
        <h1>Reviews</h1>

        <p>
          See what buyers are saying about your products and wholesale services.
        </p>
      </div>

      <div class="search-box">
        <span class="search-icon">⌕</span>

        <input v-model="searchQuery" type="text" placeholder="Search reviews or buyers..." />
      </div>

    </header>


    <!-- STATISTICS -->
    <section class="stats-grid">

      <!-- Average Rating -->
      <div class="stat-card average-card">

        <span class="stat-label">
          AVERAGE RATING
        </span>

        <div class="rating-number">
          4.7
          <span>/ 5</span>
        </div>

        <div class="rating-stars">
          ★★★★★
          <span>Highly Rated</span>
        </div>

      </div>


      <!-- Total Reviews -->
      <div class="stat-card">

        <span class="stat-label">
          TOTAL REVIEWS
        </span>

        <div class="stat-number">
          148
        </div>

        <span class="stat-change">
          +14 this month
        </span>

      </div>


      <!-- Five Star Reviews -->
      <div class="stat-card">

        <span class="stat-label">
          5-STAR REVIEWS
        </span>

        <div class="stat-number">
          122
        </div>

        <span class="stat-description">
          82% of all reviews
        </span>

      </div>


      <!-- Response Rate -->
      <div class="stat-card">

        <span class="stat-label">
          RESPONSE RATE
        </span>

        <div class="stat-number">
          94%
        </div>

        <span class="stat-change">
          Excellent support
        </span>

      </div>

    </section>


    <!-- FILTERS -->
    <section class="filters">

      <div class="filter-left">

        <select v-model="ratingFilter">
          <option value="all">Rating: All Stars</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>


        <select v-model="statusFilter">
          <option value="all">Status: All Reviews</option>
          <option value="replied">Replied</option>
          <option value="unreplied">Needs Reply</option>
        </select>

      </div>


      <select v-model="sortOrder">
        <option value="recent">
          Sort by: Most Recent
        </option>

        <option value="oldest">
          Sort by: Oldest
        </option>

        <option value="highest">
          Sort by: Highest Rated
        </option>

        <option value="lowest">
          Sort by: Lowest Rated
        </option>
      </select>

    </section>


    <!-- REVIEWS -->
    <section class="reviews-list">

      <article v-for="review in filteredReviews" :key="review.id" class="review-card">

        <!-- REVIEW HEADER -->
        <div class="review-header">

          <div class="buyer-info">

            <div class="buyer-avatar" :class="review.avatarClass">
              {{ review.initials }}
            </div>

            <div>
              <h3>{{ review.buyer }}</h3>

              <span class="buyer-location">
                {{ review.location }}
              </span>
            </div>

          </div>


          <div class="review-rating">

            <div class="stars">
              <span v-for="star in 5" :key="star" :class="{ empty: star > review.rating }">
                ★
              </span>
            </div>

            <span class="review-date">
              {{ review.date }}
            </span>

          </div>

        </div>


        <!-- PRODUCT -->
        <div class="product-purchased">

          <span>PRODUCT PURCHASED:</span>

          <strong>
            {{ review.product }}
          </strong>

        </div>


        <!-- REVIEW TEXT -->
        <p class="review-text">
          {{ review.comment }}
        </p>


        <!-- SELLER RESPONSE -->
        <div v-if="review.response" class="seller-response">

          <div class="response-header">
            <strong>
              REPLY FROM CAPE FRESH PACKAGING (YOU)
            </strong>

            <span>
              Replied on {{ review.responseDate }}
            </span>
          </div>

          <p>
            {{ review.response }}
          </p>

        </div>


        <!-- REPLY BUTTON -->
        <button v-else class="reply-button" @click="replyToReview(review)">
          Reply to review
        </button>

      </article>


      <!-- NO RESULTS -->
      <div v-if="filteredReviews.length === 0" class="no-results">
        No reviews found.
      </div>

    </section>

  </div>
</template>


<script>
export default {
  name: 'Reviews',

  data() {
    return {
      searchQuery: '',
      ratingFilter: 'all',
      statusFilter: 'all',
      sortOrder: 'recent',

      reviews: [
        {
          id: 1,
          buyer: 'Kaya Kitchen',
          initials: 'KK',
          location: 'Woodstock, Cape Town',
          rating: 5,
          date: '12 Oct 2026',
          product: 'Takeaway Containers (500ml)',
          comment:
            'Exceptional quality biodegradable takeaway containers. We use them for all our hot lunch packs and they never leak. Cape Fresh always delivers in under 48 hours. Excellent service!',
          avatarClass: 'avatar-brown',
          response:
            'Thank you so much for the glowing review, Kaya Kitchen! We are thrilled to support your sustainable lunch packaging initiatives.',
          responseDate: '12 Oct 2026'
        },

        {
          id: 2,
          buyer: 'Lindiwe Bakery',
          initials: 'LB',
          location: 'Soweto, Johannesburg',
          rating: 4,
          date: '10 Oct 2026',
          product: 'Branded Paper Bags',
          comment:
            'Really beautiful printing on our custom pastry bags. The colors are crisp and represent our brand perfectly. Knocked off one star just because bulk discount tiers on 5,000 units are slightly low.',
          avatarClass: 'avatar-orange',
          response: null,
          responseDate: null
        },

        {
          id: 3,
          buyer: 'Foodie Lane Cafe',
          initials: 'FL',
          location: 'Observatory, CT',
          rating: 5,
          date: '08 Oct 2026',
          product: 'Compostable Cups (250ml)',
          comment:
            'Great quality cups and excellent service. The ordering process was simple and delivery was faster than expected.',
          avatarClass: 'avatar-green',
          response: null,
          responseDate: null
        },

        {
          id: 4,
          buyer: 'Urban Eats',
          initials: 'UE',
          location: 'Sea Point, Cape Town',
          rating: 5,
          date: '05 Oct 2026',
          product: 'Kraft Food Boxes',
          comment:
            'The boxes are strong, attractive and perfect for our takeaway meals. We will definitely order again.',
          avatarClass: 'avatar-blue',
          response:
            'Thank you Urban Eats! We really appreciate your feedback and look forward to serving you again.',
          responseDate: '06 Oct 2026'
        }
      ]
    }
  },


  computed: {
    filteredReviews() {

      let results = [...this.reviews]


      // Search
      if (this.searchQuery.trim()) {

        const search = this.searchQuery.toLowerCase()

        results = results.filter(review =>
          review.buyer.toLowerCase().includes(search) ||
          review.product.toLowerCase().includes(search) ||
          review.comment.toLowerCase().includes(search)
        )
      }


      // Rating filter
      if (this.ratingFilter !== 'all') {

        results = results.filter(
          review => review.rating === Number(this.ratingFilter)
        )
      }


      // Status filter
      if (this.statusFilter === 'replied') {

        results = results.filter(
          review => review.response
        )
      }

      if (this.statusFilter === 'unreplied') {

        results = results.filter(
          review => !review.response
        )
      }


      // Sorting
      if (this.sortOrder === 'highest') {

        results.sort(
          (a, b) => b.rating - a.rating
        )
      }

      if (this.sortOrder === 'lowest') {

        results.sort(
          (a, b) => a.rating - b.rating
        )
      }

      if (this.sortOrder === 'recent') {

        results.sort(
          (a, b) => b.id - a.id
        )
      }

      if (this.sortOrder === 'oldest') {

        results.sort(
          (a, b) => a.id - b.id
        )
      }

      return results
    }
  },


  methods: {

    replyToReview(review) {

      alert(`Replying to ${review.buyer}'s review.`)

    }

  }
}
</script>


<style scoped>
* {
  box-sizing: border-box;
}


/* =========================
   PAGE
========================= */

.reviews-page {

  min-height: 100vh;

  padding: 17px 26px 50px;

  background: #f7f5f2;

  color: #563d35;

  font-family: Arial, sans-serif;

}


/* =========================
   HEADER
========================= */

.page-header {

  display: flex;

  justify-content: space-between;

  align-items: flex-start;

  padding-bottom: 14px;

  border-bottom: 1px solid #e7e1dc;

  margin-bottom: 25px;

}

.header-content h1 {

  margin: 0 0 4px;

  font-family: Georgia, serif;

  font-size: 21px;

  color: #57372f;

}

.header-content p {

  margin: 0;

  font-size: 9px;

  color: #81746e;

}


.search-box {

  width: 200px;

  height: 24px;

  display: flex;

  align-items: center;

  gap: 7px;

  padding: 0 10px;

  background: #ffffff;

  border: 1px solid #e5ded8;

  border-radius: 15px;

}

.search-icon {

  font-size: 13px;

  color: #6d5a53;

}

.search-box input {

  width: 100%;

  border: none;

  outline: none;

  background: transparent;

  font-size: 8px;

  color: #594941;

}


/* =========================
   STATISTICS
========================= */

.stats-grid {

  display: grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap: 13px;

  margin-bottom: 15px;

}

.stat-card {

  min-height: 84px;

  padding: 13px;

  background: #ffffff;

  border: 1px solid #e5ded8;

  border-radius: 9px;

}

.average-card {

  border: 1px solid #d67d49;

}


.stat-label {

  display: block;

  font-size: 7px;

  font-weight: 700;

  color: #756760;

  margin-bottom: 7px;

}


.rating-number {

  font-family: Georgia, serif;

  font-size: 22px;

  font-weight: bold;

  color: #c96f3d;

}

.rating-number span {

  font-family: Arial, sans-serif;

  font-size: 9px;

  color: #756760;

}


.rating-stars {

  margin-top: 3px;

  color: #d4753e;

  font-size: 10px;

}

.rating-stars span {

  margin-left: 5px;

  color: #d4753e;

  font-size: 7px;

}


.stat-number {

  font-family: Georgia, serif;

  font-size: 22px;

  font-weight: bold;

  color: #563d35;

  margin-bottom: 5px;

}


.stat-change {

  color: #49894c;

  font-size: 7px;

  font-weight: 600;

}


.stat-description {

  color: #756760;

  font-size: 7px;

}


/* =========================
   FILTERS
========================= */

.filters {

  display: flex;

  align-items: center;

  justify-content: space-between;

  margin-bottom: 15px;

}

.filter-left {

  display: flex;

  gap: 8px;

}


.filters select {

  height: 21px;

  padding: 0 8px;

  border: 1px solid #e3dcd6;

  border-radius: 5px;

  background: #ffffff;

  color: #5e4b44;

  font-size: 7px;

  outline: none;

  cursor: pointer;

}


/* =========================
   REVIEW CARD
========================= */

.reviews-list {

  display: flex;

  flex-direction: column;

  gap: 12px;

}


.review-card {

  padding: 14px;

  background: #ffffff;

  border: 1px solid #e5ded8;

  border-radius: 9px;

}


/* =========================
   REVIEW HEADER
========================= */

.review-header {

  display: flex;

  justify-content: space-between;

  align-items: flex-start;

  margin-bottom: 11px;

}


.buyer-info {

  display: flex;

  align-items: center;

  gap: 8px;

}


.buyer-avatar {

  width: 26px;

  height: 26px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  font-size: 8px;

  font-weight: 700;

}


.avatar-brown {

  background: #ead5bd;

  color: #79563d;

}


.avatar-orange {

  background: #d67d49;

  color: #ffffff;

}


.avatar-green {

  background: #e1f0e5;

  color: #4f7656;

}


.avatar-blue {

  background: #dfe9f4;

  color: #52718d;

}


.buyer-info h3 {

  margin: 0 0 2px;

  font-size: 9px;

  color: #563d35;

}


.buyer-location {

  font-size: 7px;

  color: #81746e;

}


/* =========================
   RATING
========================= */

.review-rating {

  display: flex;

  flex-direction: column;

  align-items: flex-end;

}


.stars {

  font-size: 12px;

  letter-spacing: 1px;

  color: #d67d49;

}


.stars .empty {

  color: #ded7d2;

}


.review-date {

  margin-top: 1px;

  font-size: 6px;

  color: #81746e;

}


/* =========================
   PRODUCT
========================= */

.product-purchased {

  display: flex;

  gap: 6px;

  margin-bottom: 8px;

  font-size: 7px;

}


.product-purchased span {

  color: #d06f3c;

  font-weight: 700;

}


.product-purchased strong {

  color: #563d35;

  font-weight: 600;

}


/* =========================
   REVIEW TEXT
========================= */

.review-text {

  margin: 0;

  font-size: 8px;

  line-height: 1.6;

  color: #594a44;

}


/* =========================
   SELLER RESPONSE
========================= */

.seller-response {

  margin-top: 10px;

  padding: 9px;

  background: #f5f3f0;

  border: 1px solid #e4ded8;

  border-radius: 7px;

}


.response-header {

  display: flex;

  justify-content: space-between;

  margin-bottom: 5px;

}


.response-header strong {

  font-size: 6px;

  color: #634b42;

}


.response-header span {

  font-size: 6px;

  color: #8b7d76;

}


.seller-response p {

  margin: 0;

  font-size: 7px;

  line-height: 1.5;

  color: #81746e;

}


/* =========================
   REPLY BUTTON
========================= */

.reply-button {

  margin-top: 9px;

  padding: 5px 9px;

  background: #f7f5f2;

  border: 1px solid #e2dcd7;

  border-radius: 4px;

  color: #634b42;

  font-size: 7px;

  cursor: pointer;

}


.reply-button:hover {

  background: #eee9e4;

}


/* =========================
   NO RESULTS
========================= */

.no-results {

  padding: 40px;

  text-align: center;

  background: #ffffff;

  border: 1px solid #e5ded8;

  border-radius: 9px;

  color: #81746e;

  font-size: 10px;

}


/* =========================
   RESPONSIVE
========================= */

@media (max-width: 900px) {

  .stats-grid {

    grid-template-columns:
      repeat(2, 1fr);

  }

  .content-grid {

    grid-template-columns: 1fr;

  }

}


@media (max-width: 650px) {

  .reviews-page {

    margin-left: 0;

    padding: 15px;

  }

  .stats-grid {

    grid-template-columns: 1fr;

  }

  .page-header {

    flex-direction: column;

    gap: 15px;

  }

  .search-box {

    width: 100%;

  }

  .filters {

    flex-direction: column;

    align-items: stretch;

    gap: 8px;

  }

  .filter-left {

    width: 100%;

  }

  .filters select {

    flex: 1;

  }

}
</style>