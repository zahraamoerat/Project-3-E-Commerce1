<template>
  <div class="landing-page">
    <!-- Navbar -->
    <header class="navbar">
      <div class="logo-container">
        <!-- website-logo.png -->
        <img
          src="../../assets/link-icon-white.png"
          alt="WeConnect Logo Icon"
          class="logo-icon"
        />
        <span class="logo-text">WeConnect</span>
      </div>

      <nav class="nav-links">
        <a href="#how-it-works">How it Works</a>
        <a href="#dashboards">For business and supliers</a>
        <a href="#faq">FAQ</a>
      </nav>

      <div class="nav-actions">
        <router-link to="/login" class="btn-text">Login</router-link>
        <router-link to="/signup" class="btn-primary">Get Started</router-link>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="tag">— SOUTH AFRICAN B2B MARKETPLACE</div>
        <h1 class="hero-title">
          Sourcing, sorted <span class="highlight">on both sides</span> of the
          order.
        </h1>
        <p class="hero-subtitle">
          Connecting independent local small businesses with verified wholesale
          suppliers across South Africa. Compare Prices, simplify ordering, and
          track real-time delivery on the simple platform.
        </p>

        <div class="hero-buttons">
          <router-link to="/signup" class="btn-primary-lg"
            >I'm a small business</router-link
          >
          <router-link to="/signup" class="btn-secondary-lg"
            >I'm a supplier</router-link
          >
        </div>
      </div>

      <div class="hero-preview">
        <div
          class="delivery-map"
          aria-label="Live delivery route from supplier to Kaya Kitchen"
        >
          <div class="map-grid"></div>
          <div class="map-label supplier-label">Cape Fresh Packaging</div>
          <div class="map-label buyer-label">Kaya Kitchen</div>
          <div class="map-route"></div>
          <div class="map-pin supplier-pin"></div>
          <div class="map-pin buyer-pin"></div>
          <div class="delivery-vehicle" aria-hidden="true">●</div>
          <div class="delivery-status">
            <span class="status-dot"></span>
            <span>LIVE DELIVERY</span>
            <strong>Arriving in 18 min</strong>
          </div>
          <div class="map-coordinates">CAPE TOWN • TRACKING #1842</div>
        </div>
      </div>
    </section>

    <!-- Stats Banner -->
    <section class="stats-banner">
      <div class="stat-item">
        <h3>250+</h3>
        <p>Registeres wholesale suppliers</p>
      </div>
      <div class="stat-item">
        <h3>1,800+</h3>
        <p>Small business onboard</p>
      </div>
      <div class="stat-item">
        <h3>12k+</h3>
        <p>Successful orders placed</p>
      </div>
      <div class="stat-item">
        <h3>98%</h3>
        <p>On-time local delivery rate</p>
      </div>
    </section>

    <!-- 4 Steps Section -->
    <section id="how-it-works" class="section-container">
      <div class="section-tag">— THE FLOW</div>
      <h2 class="section-title">Four steps from login to delivered.</h2>

      <div class="steps-grid">
        <div class="step-card">
          <span class="step-num">1</span>
          <h4>Choose your side</h4>
          <p>
            Register either as a growing business looking to stock up, or a
            verified wholesale supplier expanding distribution.
          </p>
        </div>
        <div class="step-card">
          <span class="step-num">2</span>
          <h4>Browse or list products</h4>
          <p>
            Access active catalogues or upload products with simple tier
            pricing.
          </p>
        </div>
        <div class="step-card">
          <span class="step-num">3</span>
          <h4>Order & Pay</h4>
          <p>
            Checkout securely via instant EFT or store credit options.
            Everything is aggregated into a single transparent invoice.
          </p>
        </div>
        <div class="step-card">
          <span class="step-num">4</span>
          <h4>Fulfill & Track</h4>
          <p>
            Suppliers dispatch directly while buyers get status updates
            end-to-end.
          </p>
        </div>
      </div>
    </section>

    <!-- Dashboards Comparison -->
    <section id="dashboards" class="section-container grey-bg">
      <div class="section-tag">— BUILT FOR TWO ROLES</div>
      <h2 class="section-title">Two dashboards, one marketplace.</h2>

      <div class="dashboards-grid">
        <div class="dashboard-card">
          <h3>Small Business 🛒</h3>
          <ul>
            <li>— Search suppliers instantly across diverse SA categories</li>
            <li>— Add to cart with real-time volume and pricing breaks</li>
            <li>— Choose standard delivery or bulk self-collection</li>
            <li>— Track multiple deliveries on a unified live map</li>
            <li>— Review supplier reliability ratings after each order</li>
          </ul>
          <router-link to="/signup" class="btn-dark"
            >Continue as Small Business</router-link
          >
        </div>

        <div class="dashboard-card">
          <h3>Supplier 📦</h3>
          <ul>
            <li>— List products with custom merchant volume-tier prices</li>
            <li>— Manage wholesale orders in a central pipeline</li>
            <li>— Update fulfilment status with instant buyer notifications</li>
            <li>— Attach reliable carrier tracking links and notes</li>
            <li>— Analyze monthly performance and regional SA sales metrics</li>
          </ul>
          <router-link to="/signup" class="btn-dark"
            >Continue as Supplier</router-link
          >
        </div>
      </div>
    </section>

    <!-- Testimonial Section -->
    <section class="testimonial-section">
      <div class="testimonial-image-box">
        <img src="../../assets/Kaya-Kitchen.jpg" alt="Kaya Kitchen" />
      </div>
      <div class="testimonial-content">
        <p class="quote">
          “We used to chase three different suppliers by WhatsApp. Now we
          compare prices, order, and track watch the delivery arrive — all from
          one screen.”
        </p>
        <div class="author">Thandeka Mthembu</div>
        <div class="author-title">Owner, Kaya Kitchen • Retail Partner</div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section id="faq" class="section-container">
      <h2 class="section-title">Good to know</h2>

      <div class="faq-list">
        <details class="faq-item">
          <summary>Is delivery tracking real GPS?</summary>
          <p>
            Yes, once dispatch is triggered, you will receive real-time updates
            of drivers mapped across Cape Town, Johannesburg and other SA
            regions.
          </p>
        </details>
        <details class="faq-item">
          <summary>Can one account be both a buyer and a supplier?</summary>
          <p>
            Curently, we partition workflows to ensure specialized dashboards.
            However, you can register using a seperate business profile under a
            single manager.
          </p>
        </details>
        <details class="faq-item">
          <summary>What happens after I place an order?</summary>
          <p>
            The supplier is notified immediately to confirm stock. Once
            approved, payment releases securely from escrow, and dispatch route
            planning begins.
          </p>
        </details>
      </div>
    </section>

    <!-- Bottom CTA Banner -->
    <section class="bottom-cta">
      <div class="cta-card">
        <div class="cta-tag">READY TO START?</div>
        <h2>Pick your side and see the dashboard.</h2>
        <p>
          Join hundreds of businesses trading directly on South Africa's digital
          commerce corridor. Fast approval process.
        </p>
        <router-link to="/signup" class="btn-primary-lg"
          >Sign Up Now</router-link
        >
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-col brand-col">
        <div class="logo-container">
          <img
            src="../../assets/link-icon-white.png"
            alt="WeConnect"
            class="logo-icon-sm"
          />
          <span class="logo-text">WeConnect</span>
        </div>
        <p>
          Connecting Small Businesses with verified wholesale suppliers.
          Sourcing, sorted on both sides of the order.
        </p>
      </div>

      <div class="footer-col">
        <h5>PLATFORM</h5>
        <a href="#how-it-works">How it works</a>
        <a href="#dashboards">Dashboards</a>
        <a href="#faq">FAQ</a>
      </div>

      <div class="footer-col">
        <h5>ACCOUNT</h5>
        <router-link to="/login">Sign In</router-link>
        <router-link to="/signup">Sign Up</router-link>
      </div>

      <div class="footer-col">
        <h5>LEGAL</h5>
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "LandingPage",
};
</script>

<style scoped>
.landing-page {
  background-color: #f6f4ee;
  color: #3b2c24;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial,
    sans-serif;
  line-height: 1.5;
}

/* Header Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 60px;
  max-width: 1200px;
  margin: 0 auto;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.logo-icon-sm {
  width: 20px;
  height: 20px;
}

.logo-text {
  font-weight: 700;
  font-size: 22px;
  color: #3b2c24;
}

.nav-links {
  display: flex;
  gap: 30px;
}

.nav-links a {
  text-decoration: none;
  color: #6e6a66;
  font-size: 14px;
  font-weight: 500;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* Buttons */
.btn-text {
  text-decoration: none;
  color: #3b2c24;
  font-weight: 600;
  font-size: 14px;
}

.btn-primary {
  text-decoration: none;
  background-color: #d27343;
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: 600;
}

.btn-primary-lg {
  text-decoration: none;
  background-color: #d27343;
  color: white;
  padding: 14px 28px;
  border-radius: 24px;
  font-weight: 600;
  font-size: 15px;
  display: inline-block;
}

.btn-secondary-lg {
  text-decoration: none;
  background-color: transparent;
  color: #3b2c24;
  border: 1px solid #3b2c24;
  padding: 14px 28px;
  border-radius: 24px;
  font-weight: 600;
  font-size: 15px;
  display: inline-block;
}

.btn-dark {
  display: block;
  text-align: center;
  text-decoration: none;
  background-color: #3b2c24;
  color: #ffffff;
  padding: 12px;
  border-radius: 20px;
  font-weight: 600;
  margin-top: 20px;
}

/* Hero Section */
.hero-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 60px 60px 80px 60px;
  max-width: 1200px;
  margin: 0 auto;
}

.hero-content {
  max-width: 550px;
}

.tag,
.section-tag,
.cta-tag {
  color: #c86d44;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: 12px;
}

.hero-title {
  font-family: "Georgia", serif;
  font-size: 48px;
  line-height: 1.15;
  margin: 0 0 20px 0;
}

.highlight {
  color: #c86d44;
}

.hero-subtitle {
  color: #6e6a66;
  font-size: 16px;
  margin-bottom: 30px;
}

.hero-buttons {
  display: flex;
  gap: 14px;
  margin-bottom: 30px;
}

.hero-preview {
  position: relative;
  width: 400px;
  height: 320px;
}

.delivery-map {
  position: absolute;
  inset: 10px 0;
  overflow: hidden;
  border: 1px solid #e2d9ca;
  border-radius: 20px;
  background: #e8e1d5;
  box-shadow: 0 18px 35px rgba(59, 44, 36, 0.12);
}

.map-grid {
  position: absolute;
  inset: 0;
  opacity: 0.48;
  background-image:
    linear-gradient(
      28deg,
      transparent 44%,
      #d5cabb 45%,
      #d5cabb 47%,
      transparent 48%
    ),
    linear-gradient(
      118deg,
      transparent 42%,
      #d5cabb 43%,
      #d5cabb 45%,
      transparent 46%
    ),
    linear-gradient(90deg, transparent 49%, #d5cabb 50%, transparent 51%);
  background-size:
    130px 100px,
    155px 120px,
    110px 110px;
}

.map-route {
  position: absolute;
  top: 82px;
  left: 80px;
  width: 235px;
  height: 130px;
  border: 3px solid #c86d44;
  border-left-color: transparent;
  border-bottom-color: transparent;
  border-radius: 50% 50% 50% 0;
  transform: rotate(18deg);
  filter: drop-shadow(0 2px 0 rgba(255, 255, 255, 0.5));
}

.map-route::after {
  content: "";
  position: absolute;
  inset: -3px;
  border: 3px dashed rgba(255, 255, 255, 0.8);
  border-left-color: transparent;
  border-bottom-color: transparent;
  border-radius: inherit;
  animation: route-flow 2.2s linear infinite;
}

.map-pin {
  position: absolute;
  z-index: 2;
  width: 14px;
  height: 14px;
  border: 3px solid white;
  border-radius: 50% 50% 50% 0;
  background: #3b2c24;
  box-shadow: 0 3px 8px rgba(59, 44, 36, 0.25);
  transform: rotate(-45deg);
}

.supplier-pin {
  top: 72px;
  left: 68px;
}

.buyer-pin {
  right: 68px;
  bottom: 76px;
  background: #c86d44;
}

.map-label {
  position: absolute;
  z-index: 3;
  padding: 6px 9px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.92);
  color: #3b2c24;
  font-size: 10px;
  font-weight: 700;
  box-shadow: 0 4px 10px rgba(59, 44, 36, 0.1);
}

.supplier-label {
  top: 32px;
  left: 38px;
}

.buyer-label {
  right: 28px;
  bottom: 42px;
}

.delivery-vehicle {
  position: absolute;
  z-index: 4;
  top: 157px;
  left: 205px;
  display: grid;
  width: 25px;
  height: 25px;
  place-items: center;
  border: 4px solid white;
  border-radius: 50%;
  background: #c86d44;
  color: white;
  font-size: 10px;
  box-shadow: 0 0 0 8px rgba(200, 109, 68, 0.18);
  animation: vehicle-pulse 2.2s ease-in-out infinite;
}

.delivery-status {
  position: absolute;
  right: 22px;
  top: 20px;
  display: grid;
  gap: 3px;
  padding: 11px 13px;
  border-radius: 9px;
  background: #3b2c24;
  color: white;
  font-size: 9px;
  letter-spacing: 0.7px;
}

.delivery-status strong {
  font-size: 12px;
  letter-spacing: 0;
}

.status-dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  margin-right: 4px;
  border-radius: 50%;
  background: #80c878;
  box-shadow: 0 0 0 4px rgba(128, 200, 120, 0.14);
}

.map-coordinates {
  position: absolute;
  bottom: 18px;
  left: 22px;
  color: #7a7571;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1px;
}

@keyframes route-flow {
  to {
    stroke-dashoffset: -30px;
  }
}

@keyframes vehicle-pulse {
  50% {
    transform: translate(10px, -5px);
    box-shadow: 0 0 0 12px rgba(200, 109, 68, 0.08);
  }
}

.card-tag {
  font-size: 10px;
  color: #c86d44;
  font-weight: bold;
}

.status-badge {
  font-size: 10px;
  color: #4caf50;
  font-weight: bold;
  margin-bottom: 4px;
}

/* Stats Banner */
.stats-banner {
  background-color: #3b2c24;
  color: white;
  display: flex;
  justify-content: space-around;
  padding: 40px 60px;
  text-align: center;
}

.stat-item h3 {
  font-family: "Georgia", serif;
  font-size: 36px;
  margin: 0;
  color: #f6f4ee;
}

.stat-item p {
  margin: 4px 0 0 0;
  font-size: 13px;
  color: #c2b8ae;
}

/* Generic Section Layout */
.section-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 80px 20px;
  text-align: center;
}

.grey-bg {
  background-color: #efece6;
  max-width: 100%;
  padding-left: 60px;
  padding-right: 60px;
}

.section-title {
  font-family: "Georgia", serif;
  font-size: 32px;
  margin: 0 0 40px 0;
}

/* Steps Grid */
.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.step-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  text-align: left;
}

.step-num {
  display: inline-block;
  width: 28px;
  height: 28px;
  background-color: #f1ece4;
  color: #c86d44;
  font-weight: bold;
  border-radius: 50%;
  text-align: center;
  line-height: 28px;
  margin-bottom: 12px;
}

.step-card h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
}

.step-card p {
  font-size: 13px;
  color: #6e6a66;
  margin: 0;
}

/* Dashboards Comparison Grid */
.dashboards-grid {
  display: flex;
  gap: 24px;
  justify-content: center;
  max-width: 900px;
  margin: 0 auto;
}

.dashboard-card {
  flex: 1;
  background: white;
  border-radius: 16px;
  padding: 32px;
  text-align: left;
}

.dashboard-card h3 {
  font-family: "Georgia", serif;
  font-size: 22px;
  margin-top: 0;
}

.dashboard-card ul {
  list-style: none;
  padding: 0;
  margin: 20px 0 30px 0;
}

.dashboard-card li {
  font-size: 14px;
  color: #555;
  margin-bottom: 12px;
}

/* Testimonial Section */
.testimonial-section {
  display: flex;
  align-items: center;
  gap: 40px;
  max-width: 900px;
  margin: 0 auto;
  padding: 60px 20px;
}

.testimonial-image-box {
  width: 220px;
  height: 220px;
  border-radius: 12px;
  flex-shrink: 0;
  overflow: hidden;
}

.testimonial-image-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.quote {
  font-family: "Georgia", serif;
  font-size: 22px;
  line-height: 1.4;
  margin-bottom: 16px;
}

.author {
  font-weight: bold;
  font-size: 14px;
}

.author-title {
  font-size: 12px;
  color: #7a7571;
}

/* FAQ */
.faq-list {
  text-align: left;
  max-width: 700px;
  margin: 0 auto;
}

.faq-item {
  background: white;
  padding: 16px 20px;
  border-radius: 8px;
  margin-bottom: 12px;
  cursor: pointer;
}

.faq-item summary {
  font-weight: 600;
  font-size: 15px;
}

.faq-item p {
  margin: 10px 0 0 0;
  font-size: 14px;
  color: #6e6a66;
}

@media (max-width: 900px) {
  .navbar {
    padding: 18px 24px;
  }

  .nav-links {
    gap: 16px;
  }

  .hero-section {
    gap: 36px;
    padding: 48px 24px 64px;
  }

  .hero-title {
    font-size: 42px;
  }

  .hero-preview {
    width: min(38vw, 360px);
  }

  .dashboards-grid,
  .testimonial-section {
    margin-left: 24px;
    margin-right: 24px;
  }
}

@media (max-width: 640px) {
  .navbar {
    flex-wrap: wrap;
    gap: 14px;
    padding: 16px;
  }

  .nav-links {
    order: 3;
    width: 100%;
    justify-content: space-between;
    gap: 8px;
  }

  .nav-links a {
    font-size: 12px;
  }

  .nav-actions {
    margin-left: auto;
  }

  .hero-section {
    flex-direction: column;
    align-items: stretch;
    padding: 40px 16px 48px;
  }

  .hero-content {
    max-width: none;
  }

  .hero-title {
    font-size: 36px;
  }

  .hero-subtitle {
    font-size: 15px;
  }

  .hero-buttons {
    flex-direction: column;
    gap: 10px;
  }

  .btn-primary-lg,
  .btn-secondary-lg {
    text-align: center;
  }

  .hero-preview {
    width: 100%;
    height: 280px;
  }

  .delivery-map {
    inset: 0;
  }

  .stats-banner {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px 12px;
    padding: 28px 16px;
  }

  .stat-item h3 {
    font-size: 30px;
  }

  .section-container {
    padding: 56px 16px;
  }

  .section-title {
    font-size: 28px;
  }

  .dashboards-grid,
  .testimonial-section {
    flex-direction: column;
    margin-left: 0;
    margin-right: 0;
  }

  .dashboard-card {
    width: 100%;
    padding: 24px;
  }

  .testimonial-image-box {
    width: 180px;
    height: 180px;
  }

  .quote {
    font-size: 20px;
  }

  .grey-bg {
    padding-left: 16px;
    padding-right: 16px;
  }
}

/* Bottom CTA */
.bottom-cta {
  padding: 60px 20px;
  max-width: 900px;
  margin: 0 auto;
}

.cta-card {
  background-color: #3b2c24;
  color: white;
  border-radius: 20px;
  padding: 60px 40px;
  text-align: center;
}

.cta-card h2 {
  font-family: "Georgia", serif;
  font-size: 32px;
  margin: 10px 0;
}

.cta-card p {
  color: #c2b8ae;
  margin-bottom: 24px;
}

/* Footer */
.footer {
  border-top: 1px solid #e5e0d8;
  padding: 60px;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
}

.brand-col {
  max-width: 280px;
}

.brand-col p {
  font-size: 13px;
  color: #7a7571;
  margin-top: 12px;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-col h5 {
  margin: 0 0 6px 0;
  font-size: 11px;
  letter-spacing: 0.5px;
  color: #999;
}

.footer-col a {
  color: #3b2c24;
  text-decoration: none;
  font-size: 13px;
}

.footer-col a:hover {
  text-decoration: underline;
}
</style>
