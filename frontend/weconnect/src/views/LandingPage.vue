<template>
  <div class="landing-page">
    <!-- Navbar -->
    <header class="navbar">
      <div class="logo-container">
        <!-- Uses website-logo.png inside your src/assets folder -->
        <img
          src="../assets/website-logo.png"
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

        <div class="trust-badge">
          <div class="avatar-group">
            <span class="avatar"></span>
            <span class="avatar"></span>
            <span class="avatar"></span>
          </div>
          <span class="trust-text">Trusted by 250+ suppliers</span>
        </div>
      </div>

      <div class="hero-preview">
        <div class="floating-card top-card">
          <span class="card-tag">NEW ORDER #1842</span>
          <strong>Cape Fresh Packaging</strong>
          <small>R12,450.00 • Processing</small>
        </div>
        <div class="floating-card middle-card">
          <span class="status-badge">✔ DISPATCHED</span>
          <strong>Track Shipment</strong>
        </div>
        <div class="floating-card bottom-card">
          <small>Buyer Account</small>
          <strong>Kaya Kitchen</strong>
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
            PCheckout securely via instant EFT or store credit options.
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
      <div class="testimonial-image-box"></div>
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
            Curently, we prtition workflows to ensure specialized dashboards.
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
          commerce corridor. Fat approval process.
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
            src="../assets/website-logo.png"
            alt="WeConnect"
            class="logo-icon-sm"
          />
          <span class="logo-text">WeConnect</span>
        </div>
        <p>
          Connecting Small Businesses with verified wholesale suppliers.
          Sourcing, sorted on both sdes of the order.
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

.trust-badge {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar-group {
  display: flex;
}

.avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #d1c7b7;
  border: 2px solid #f6f4ee;
  margin-right: -8px;
}

.trust-text {
  font-size: 13px;
  color: #7a7571;
}

.hero-preview {
  position: relative;
  width: 400px;
  height: 320px;
}

.floating-card {
  position: absolute;
  background: white;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
}

.top-card {
  top: 10px;
  right: 20px;
  width: 220px;
}

.middle-card {
  top: 110px;
  left: 20px;
  background: #3b2c24;
  color: white;
  width: 200px;
}

.bottom-card {
  bottom: 20px;
  right: 40px;
  width: 200px;
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
  background-color: #e5dbc9;
  border-radius: 12px;
  flex-shrink: 0;
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
z
