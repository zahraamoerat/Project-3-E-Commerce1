<template>
  <div class="products-page">

    <!-- Page Header -->
    <header class="page-header">

      <div>
        <h1>Add New Product</h1>

        <p>
          List a new product or wholesale bundle to make it available
          for custom business buying.
        </p>
      </div>

      <div class="search-box">
        <span>⌕</span>
        <input type="text" placeholder="Search catalog structures..." />
      </div>

    </header>


    <!-- Main Content -->
    <div class="content-grid">

      <!-- LEFT COLUMN -->
      <div class="left-column">

        <!-- Product Details -->
        <section class="card">

          <h2>Product Details &amp; Cataloging</h2>

          <div class="form-group">
            <label>WHOLESALE PRODUCT TITLE</label>

            <input type="text" placeholder="e.g. Sugar Cane Takeaway Bowls (750ml) - Pack of 500" />
          </div>

          <div class="two-columns">

            <div class="form-group">
              <label>PRODUCT CATEGORY</label>

              <select>
                <option>Eco-friendly Packaging</option>
                <option>Food & Beverage</option>
                <option>Cleaning Supplies</option>
                <option>Office Supplies</option>
              </select>
            </div>

            <div class="form-group">
              <label>STOCK KEEPING UNIT (SKU)</label>

              <input type="text" value="CFP-SCB-750M" />
            </div>

          </div>

          <div class="form-group">
            <label>DETAILED DESCRIPTION</label>

            <textarea
              placeholder="Enter detailed bulk buying features (dimensions, food certifications, materials used, thermal properties, pack densities, etc.)..."></textarea>
          </div>

        </section>


        <!-- Pricing -->
        <section class="card">

          <h2>Pricing &amp; Bulk Discount Tiers (ZAR)</h2>

          <div class="two-columns">

            <div class="form-group">
              <label>BASE PRICE PER UNIT PACK (R)</label>

              <input type="text" value="R 550.00" />
            </div>

            <div class="form-group">
              <label>MINIMUM ORDER QUANTITY (MOQ)</label>

              <input type="text" value="10 packs" />
            </div>

          </div>


          <div class="form-group">
            <label>BULK DISCOUNT TIERS</label>

            <div class="discount-grid">

              <div class="discount-card">
                <strong>10 - 49 packs</strong>
                <span>Base price (R 550)</span>
              </div>

              <div class="discount-card">
                <strong>50 - 99 packs</strong>
                <span>5% off (R 522.50)</span>
              </div>

              <div class="discount-card">
                <strong>100+ packs</strong>
                <span>10% off (R 495.00)</span>
              </div>

            </div>
          </div>

        </section>

      </div>


      <!-- RIGHT COLUMN -->
      <div class="right-column">

        <!-- Product Media -->
        <section class="card">

          <h2>Product Media</h2>

          <div class="upload-area">
            <div class="upload-icon">↥</div>

            <strong>Drag product images here</strong>

            <span>Supports JPG, PNG (Max 5MB)</span>
          </div>

          <div class="image-preview">

            <div class="thumbnail">
              <span>📦</span>
            </div>

            <div class="thumbnail">
              <span>▤</span>
            </div>

            <button class="add-image">
              +
            </button>

          </div>

        </section>


        <!-- Inventory -->
        <section class="card">

          <h2>Inventory &amp; Logistics</h2>

          <div class="two-columns">

            <div class="form-group">
              <label>INITIAL STOCK QTY</label>

              <input type="text" value="500 packs" />
            </div>

            <div class="form-group">
              <label>LOW STOCK ALERT</label>

              <input type="text" value="50 packs" />
            </div>

          </div>

          <div class="form-group">
            <label>SHIPPING WEIGHT (PER PACK)</label>

            <input type="text" value="2.5 kg" />
          </div>


          <button class="publish-button">
            Publish Product
          </button>

          <button class="draft-button">
            Save as Draft
          </button>

        </section>

      </div>

    </div>

  </div>
</template>


<script>
export default {
  name: 'Products'
}
</script>

<style scoped>
.products-page {
  min-height: 100vh;
  padding: 40px;
  background: #f7f5f2;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
  color: #543b34;

  /* Makes the page content feel larger */
  max-width: 1500px;
  margin: 0 auto;
}


/* =========================
   HEADER
========================= */

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 35px;
  gap: 30px;
}

.page-header h1 {
  margin: 0 0 8px;

  font-family: Georgia, serif;
  font-size: 32px;
  font-weight: 700;

  color: #57372f;
}

.page-header p {
  margin: 0;
  max-width: 600px;

  color: #82736d;
  font-size: 15px;
  line-height: 1.6;
}


/* =========================
   SEARCH
========================= */

.search-box {
  width: 300px;

  display: flex;
  align-items: center;
  gap: 10px;

  padding: 12px 16px;

  background: white;
  border: 1px solid #e5dfda;

  border-radius: 25px;

  transition: 0.2s ease;
}

.search-box:focus-within {
  border-color: #d47b48;
  box-shadow: 0 0 0 3px rgba(212, 123, 72, 0.1);
}

.search-box span {
  font-size: 20px;
  color: #806f68;
}

.search-box input {
  width: 100%;

  border: none;
  outline: none;

  font-size: 14px;
  background: transparent;
}


/* =========================
   MAIN GRID
========================= */

.content-grid {
  display: grid;

  grid-template-columns: 1.6fr 1fr;

  gap: 24px;

  width: 100%;
}

.left-column,
.right-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}


/* =========================
   CARDS
========================= */

.card {
  background: #ffffff;

  border: 1px solid #e5dfda;

  border-radius: 16px;

  padding: 28px;

  box-sizing: border-box;

  box-shadow: 0 4px 15px rgba(84, 59, 52, 0.04);
}

.card h2 {
  margin: 0 0 22px;

  font-family: Georgia, serif;

  font-size: 20px;
  font-weight: 700;

  color: #63463c;
}


/* =========================
   FORM
========================= */

.form-group {
  margin-bottom: 20px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;

  margin-bottom: 8px;

  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;

  color: #806f68;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;

  box-sizing: border-box;

  padding: 14px 15px;

  border: 1px solid #e6e1dc;

  border-radius: 9px;

  background: #faf9f7;

  color: #665953;

  font-size: 14px;

  outline: none;

  transition: all 0.2s ease;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #aaa09b;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #d47b48;

  background: white;

  box-shadow: 0 0 0 3px rgba(212, 123, 72, 0.1);
}

.form-group textarea {
  height: 130px;

  resize: vertical;

  line-height: 1.5;
}


/* =========================
   TWO COLUMNS
========================= */

.two-columns {
  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 18px;
}


/* =========================
   DISCOUNTS
========================= */

.discount-grid {
  display: grid;

  grid-template-columns: repeat(3, 1fr);

  gap: 12px;
}

.discount-card {
  padding: 16px;

  background: #faf8f6;

  border: 1px solid #e7e1dc;

  border-radius: 10px;

  transition: 0.2s ease;
}

.discount-card:hover {
  transform: translateY(-2px);

  border-color: #d47b48;

  box-shadow: 0 4px 12px rgba(84, 59, 52, 0.08);
}

.discount-card strong {
  display: block;

  font-size: 14px;

  margin-bottom: 6px;

  color: #63463c;
}

.discount-card span {
  display: block;

  font-size: 12px;

  color: #8b5a43;
}


/* =========================
   UPLOAD AREA
========================= */

.upload-area {
  height: 160px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background: #faf8f6;

  border: 2px dashed #d9d0ca;

  border-radius: 12px;

  margin-bottom: 18px;

  cursor: pointer;

  transition: 0.2s ease;
}

.upload-area:hover {
  border-color: #d47b48;

  background: #fffaf7;
}

.upload-icon {
  color: #d47b48;

  font-size: 32px;

  margin-bottom: 10px;
}

.upload-area strong {
  font-size: 14px;

  color: #68554e;
}

.upload-area span {
  font-size: 12px;

  color: #9a8d87;

  margin-top: 6px;
}


/* =========================
   IMAGE PREVIEWS
========================= */

.image-preview {
  display: flex;

  gap: 12px;

  flex-wrap: wrap;
}

.thumbnail,
.add-image {
  width: 70px;
  height: 70px;

  border-radius: 10px;

  border: 1px solid #e3ddd7;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #f8f6f3;

  transition: 0.2s ease;
}

.thumbnail {
  font-size: 28px;
}

.add-image {
  cursor: pointer;

  font-size: 28px;

  color: #806f68;
}

.add-image:hover {
  background: #fffaf7;

  border-color: #d47b48;

  color: #d47b48;
}


/* =========================
   BUTTONS
========================= */

.publish-button,
.draft-button {
  width: 100%;

  padding: 15px;

  border-radius: 25px;

  font-size: 15px;
  font-weight: 600;

  cursor: pointer;

  transition: all 0.2s ease;
}

.publish-button {
  margin-top: 25px;

  background: #d47b48;

  border: none;

  color: white;

  box-shadow: 0 4px 10px rgba(212, 123, 72, 0.2);
}

.publish-button:hover {
  background: #c76d3b;

  transform: translateY(-2px);
}

.draft-button {
  margin-top: 10px;

  background: white;

  border: 1px solid #e4dcd6;

  color: #634c44;
}

.draft-button:hover {
  background: #f8f6f3;

  border-color: #d47b48;
}


/* =========================
   TABLET
========================= */

@media (max-width: 1000px) {

  .products-page {
    padding: 25px;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }

  .right-column {
    display: grid;

    grid-template-columns: 1fr 1fr;

    gap: 20px;
  }

}


/* =========================
   MOBILE
========================= */

@media (max-width: 700px) {

  .products-page {
    padding: 18px;
  }

  .page-header {
    flex-direction: column;

    align-items: stretch;

    gap: 20px;
  }

  .page-header h1 {
    font-size: 27px;
  }

  .search-box {
    width: auto;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }

  .right-column {
    display: flex;
    flex-direction: column;
  }

  .two-columns {
    grid-template-columns: 1fr;
  }

  .discount-grid {
    grid-template-columns: 1fr;
  }

  .card {
    padding: 20px;
  }

}


/* =========================
   SMALL MOBILE
========================= */

@media (max-width: 400px) {

  .products-page {
    padding: 12px;
  }

  .page-header h1 {
    font-size: 24px;
  }

  .card {
    padding: 16px;
  }

}
</style>

<!-- 
<style scoped>
.products-page {
  min-height: 100vh;
  padding: 20px;
  background: #f7f5f2;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
  color: #543b34;
}


/* HEADER */

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  margin-bottom: 28px;
}

.page-header h1 {
  margin: 0 0 4px;

  font-family: Georgia, serif;

  font-size: 21px;

  color: #57372f;
}

.page-header p {
  margin: 0;

  color: #82736d;

  font-size: 9px;
}

.search-box {
  width: 200px;

  display: flex;
  align-items: center;
  gap: 7px;

  padding: 7px 11px;

  background: white;

  border: 1px solid #e5dfda;

  border-radius: 18px;
}

.search-box span {
  font-size: 14px;
}

.search-box input {
  width: 100%;

  border: none;
  outline: none;

  font-size: 9px;
}


/* GRID */

.content-grid {
  display: grid;

  grid-template-columns: 1.7fr 1fr;

  gap: 14px;

  max-width: 1000px;
}

.left-column,
.right-column {
  display: flex;
  flex-direction: column;
  gap: 14px;
}


/* CARD */

.card {
  background: #ffffff;

  border: 1px solid #e5dfda;

  border-radius: 11px;

  padding: 15px;

  box-sizing: border-box;
}

.card h2 {
  margin: 0 0 12px;

  font-family: Georgia, serif;

  font-size: 12px;

  color: #63463c;
}


/* FORM */

.form-group {
  margin-bottom: 11px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;

  margin-bottom: 5px;

  font-size: 7px;

  font-weight: 700;

  color: #806f68;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;

  box-sizing: border-box;

  padding: 8px 10px;

  border: 1px solid #e6e1dc;

  border-radius: 6px;

  background: #f8f6f3;

  color: #665953;

  font-size: 9px;

  outline: none;
}

.form-group textarea {
  height: 64px;

  resize: vertical;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #d47b48;
}


/* TWO COLUMNS */

.two-columns {
  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 10px;
}


/* DISCOUNTS */

.discount-grid {
  display: grid;

  grid-template-columns: repeat(3, 1fr);

  gap: 7px;
}

.discount-card {
  padding: 9px;

  background: #f8f6f3;

  border: 1px solid #e7e1dc;

  border-radius: 6px;
}

.discount-card strong {
  display: block;

  font-size: 8px;

  margin-bottom: 4px;
}

.discount-card span {
  display: block;

  font-size: 8px;

  color: #8b5a43;
}


/* UPLOAD */

.upload-area {
  height: 72px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background: #f8f6f3;

  border: 1px dashed #d9d0ca;

  border-radius: 7px;

  margin-bottom: 10px;
}

.upload-icon {
  color: #d47b48;

  font-size: 17px;

  margin-bottom: 4px;
}

.upload-area strong {
  font-size: 8px;

  color: #68554e;
}

.upload-area span {
  font-size: 7px;

  color: #9a8d87;

  margin-top: 3px;
}


/* IMAGE PREVIEWS */

.image-preview {
  display: flex;

  gap: 7px;
}

.thumbnail,
.add-image {
  width: 38px;
  height: 38px;

  border-radius: 6px;

  border: 1px solid #e3ddd7;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #f8f6f3;
}

.thumbnail {
  font-size: 18px;
}

.add-image {
  cursor: pointer;

  font-size: 16px;

  color: #806f68;
}


/* BUTTONS */

.publish-button,
.draft-button {
  width: 100%;

  padding: 9px;

  border-radius: 18px;

  font-size: 9px;

  cursor: pointer;
}

.publish-button {
  margin-top: 15px;

  background: #d47b48;

  border: none;

  color: white;
}

.publish-button:hover {
  background: #c76d3b;
}

.draft-button {
  margin-top: 7px;

  background: white;

  border: 1px solid #e4dcd6;

  color: #634c44;
}
</style> -->
