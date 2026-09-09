<template>
  <div class="products-page">
    <!-- ===================================================== PAGE HEADER ====================================================== -->
    <header class="page-header">
      <div class="page-header-content">
        <h1>Add New Product</h1>
        <p> List a new product or wholesale bundle to make it available for custom business buying. </p>
      </div> <!-- Search -->
      <div class="search-box"> <span class="search-icon">⌕</span>
        <input type="text" placeholder="Search catalog structures..." />
      </div>
    </header>
    <!-- ===================================================== MAIN CONTENT ====================================================== -->
    <div class="content-grid">
      <!-- =================================================== LEFT COLUMN ==================================================== -->
      <div class="left-column">
        <!-- =============================================== PRODUCT DETAILS ================================================ -->
        <section class="card">
          <h2>Product Details &amp; Cataloging</h2>
          <div class="form-group"> <label> WHOLESALE PRODUCT TITLE </label>
            <input type="text" placeholder="e.g. Sugar Cane Takeaway Bowls (750ml) - Pack of 500" />
          </div>
          <div class="two-columns">
            <div class="form-group"> <label> PRODUCT CATEGORY </label> <select>
                <option> Eco-friendly Packaging </option>
                <option> Food &amp; Beverage </option>
                <option> Cleaning Supplies </option>
                <option> Office Supplies </option>
              </select> </div>
            <div class="form-group"> <label> STOCK KEEPING UNIT (SKU) </label> <input type="text"
                value="CFP-SCB-750M" /> </div>
          </div>
          <div class="form-group"> <label> DETAILED DESCRIPTION </label> <textarea
              placeholder="Enter detailed bulk buying features (dimensions, food certifications, materials used, thermal properties, pack densities, etc.)"></textarea>
          </div>
        </section>
        <!-- =============================================== PRICING ================================================ -->
        <section class="card">
          <h2> Pricing &amp; Bulk Discount Tiers (ZAR) </h2>
          <div class="two-columns">
            <div class="form-group"> <label> BASE PRICE PER UNIT PACK (R) </label> <input type="text"
                value="R 550.00" /> </div>
            <div class="form-group"> <label> MINIMUM ORDER QUANTITY (MOQ) </label> <input type="text"
                value="10 packs" /> </div>
          </div>
          <div class="form-group"> <label> BULK DISCOUNT TIERS </label>
            <div class="discount-grid"> <!-- Tier 1 -->
              <div class="discount-card"> <strong> 10 - 49 packs </strong> <span> Base price (R 550) </span> </div>
              <!-- Tier 2 -->
              <div class="discount-card"> <strong> 50 - 99 packs </strong> <span> 5% off (R 522.50) </span> </div>
              <!-- Tier 3 -->
              <div class="discount-card"> <strong> 100+ packs </strong> <span> 10% off (R 495.00) </span> </div>
            </div>
          </div>
        </section>
      </div>
      <!-- =================================================== RIGHT COLUMN ==================================================== -->
      <div class="right-column">
        <!-- =============================================== PRODUCT MEDIA ================================================ -->
        <section class="card">
          <h2> Product Media </h2>
          <div class="upload-area">
            <div class="upload-icon"> ↥ </div> <strong> Drag product images here </strong> <span> Supports JPG, PNG (Max
              5MB) </span>
          </div>
          <div class="image-preview">
            <div class="thumbnail"> <span>📦</span> </div>
            <div class="thumbnail"> <span>▤</span> </div> <button type="button" class="add-image"> + </button>
          </div>
        </section>
        <!-- =============================================== INVENTORY ================================================ -->
        <section class="card">
          <h2> Inventory &amp; Logistics </h2>
          <div class="two-columns">
            <div class="form-group"> <label> INITIAL STOCK QTY </label> <input type="text" value="500 packs" /> </div>
            <div class="form-group"> <label> LOW STOCK ALERT </label> <input type="text" value="50 packs" /> </div>
          </div>
          <div class="form-group"> <label> SHIPPING WEIGHT (PER PACK) </label> <input type="text" value="2.5 kg" />
          </div> <!-- Publish --> <button type="button" class="publish-button"> Publish Product </button> <!-- Draft -->
          <button type="button" class="draft-button"> Save as Draft </button>
        </section>
      </div>
    </div>
  </div>
</template>
<script>export default { name: "Products" } </script>
<style scoped>
/* ========================================================= PRODUCTS PAGE ========================================================= */
.products-page {
  /* * The sidebar is handled by the main layout. * Therefore, DO NOT add margin-left here. */
  width: 100%;
  min-height: 100vh;
  padding: 32px;
  box-sizing: border-box;
  background: #f7f5f2;
  font-family: Arial, sans-serif;
  color: #543b34;
  /* * Prevent content from creating * unwanted horizontal scrolling. */
  overflow-x: hidden;
}

/* ========================================================= PAGE HEADER ========================================================= */
.page-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
  margin-bottom: 30px;
}

.page-header-content {
  min-width: 0;
}

.page-header h1 {
  margin: 0 0 8px;
  font-family: Georgia, serif;
  font-size: 30px;
  font-weight: 700;
  line-height: 1.2;
  color: #57372f;
}

.page-header p {
  margin: 0;
  max-width: 650px;
  color: #82736d;
  font-size: 14px;
  line-height: 1.6;
}

/* ========================================================= SEARCH ========================================================= */
.search-box {
  width: 280px;
  min-width: 220px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 15px;
  background: #ffffff;
  border: 1px solid #e5dfda;
  border-radius: 25px;
  box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.search-box:focus-within {
  border-color: #d47b48;
  box-shadow: 0 0 0 3px rgba(212, 123, 72, 0.1);
}

.search-icon {
  font-size: 19px;
  color: #806f68;
  flex-shrink: 0;
}

.search-box input {
  width: 100%;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-size: 13px;
  color: #543b34;
}

.search-box input::placeholder {
  color: #aaa09b;
}

/* ========================================================= MAIN GRID ========================================================= */
.content-grid {
  width: 100%;
  display: grid;
  /* * Larger left section and * smaller right section. */
  grid-template-columns: minmax(0, 1.6fr) minmax(300px, 1fr);
  gap: 24px;
  box-sizing: border-box;
}

.left-column,
.right-column {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* ========================================================= CARDS ========================================================= */
.card {
  width: 100%;
  background: #ffffff;
  border: 1px solid #e5dfda;
  border-radius: 16px;
  padding: 26px;
  box-sizing: border-box;
  box-shadow: 0 4px 15px rgba(84, 59, 52, 0.04);
}

.card h2 {
  margin: 0 0 22px;
  font-family: Georgia, serif;
  font-size: 19px;
  font-weight: 700;
  line-height: 1.3;
  color: #63463c;
}

/* ========================================================= FORM GROUP ========================================================= */
.form-group {
  width: 100%;
  margin-bottom: 20px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #806f68;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 13px 14px;
  border: 1px solid #e6e1dc;
  border-radius: 9px;
  background: #faf9f7;
  color: #665953;
  font-family: Arial, sans-serif;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #aaa09b;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #d47b48;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(212, 123, 72, 0.1);
}

.form-group textarea {
  min-height: 125px;
  resize: vertical;
  line-height: 1.5;
}

/* ========================================================= TWO COLUMNS ========================================================= */
.two-columns {
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 18px;
}

/* ========================================================= DISCOUNT GRID ========================================================= */
.discount-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.discount-card {
  min-width: 0;
  padding: 15px;
  background: #faf8f6;
  border: 1px solid #e7e1dc;
  border-radius: 10px;
  box-sizing: border-box;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.discount-card:hover {
  transform: translateY(-2px);
  border-color: #d47b48;
  box-shadow: 0 4px 12px rgba(84, 59, 52, 0.08);
}

.discount-card strong {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  line-height: 1.3;
  color: #63463c;
}

.discount-card span {
  display: block;
  font-size: 11px;
  line-height: 1.4;
  color: #8b5a43;
}

/* ========================================================= UPLOAD AREA ========================================================= */
.upload-area {
  width: 100%;
  min-height: 155px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background: #faf8f6;
  border: 2px dashed #d9d0ca;
  border-radius: 12px;
  margin-bottom: 18px;
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.upload-area:hover {
  border-color: #d47b48;
  background: #fffaf7;
}

.upload-icon {
  color: #d47b48;
  font-size: 30px;
  line-height: 1;
  margin-bottom: 10px;
}

.upload-area strong {
  font-size: 13px;
  color: #68554e;
}

.upload-area span {
  margin-top: 6px;
  font-size: 11px;
  color: #9a8d87;
}

/* ========================================================= IMAGE PREVIEW ========================================================= */
.image-preview {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.thumbnail,
.add-image {
  width: 68px;
  height: 68px;
  border-radius: 10px;
  border: 1px solid #e3ddd7;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background: #f8f6f3;
}

.thumbnail {
  font-size: 27px;
}

.add-image {
  cursor: pointer;
  font-size: 27px;
  color: #806f68;
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.add-image:hover {
  background: #fffaf7;
  border-color: #d47b48;
  color: #d47b48;
}

/* ========================================================= BUTTONS ========================================================= */
.publish-button,
.draft-button {
  width: 100%;
  box-sizing: border-box;
  padding: 14px;
  border-radius: 25px;
  font-family: Arial, sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

/* Publish */
.publish-button {
  margin-top: 24px;
  background: #d47b48;
  border: none;
  color: #ffffff;
  box-shadow: 0 4px 10px rgba(212, 123, 72, 0.2);
}

.publish-button:hover {
  background: #c76d3b;
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(212, 123, 72, 0.25);
}

/* Draft */
.draft-button {
  margin-top: 10px;
  background: #ffffff;
  border: 1px solid #e4dcd6;
  color: #634c44;
}

.draft-button:hover {
  background: #f8f6f3;
  border-color: #d47b48;
}

/* ========================================================= LARGE TABLET ========================================================= */
@media (max-width: 1200px) {
  .products-page {
    padding: 28px;
  }

  .content-grid {
    grid-template-columns: minmax(0, 1.4fr) minmax(280px, 1fr);
    gap: 20px;
  }

  .card {
    padding: 22px;
  }
}

/* ========================================================= TABLET ========================================================= */
@media (max-width: 1000px) {
  .products-page {
    padding: 24px;
  }

  .page-header {
    align-items: flex-start;
  }

  .search-box {
    width: 240px;
    min-width: 200px;
  }

  /* * Stack the main columns. */
  .content-grid {
    grid-template-columns: 1fr;
  }

  /* * Put right-side cards next to each other * when there is enough tablet width. */
  .right-column {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 20px;
  }
}

/* ========================================================= SMALL TABLET ========================================================= */
@media (max-width: 800px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
    gap: 18px;
  }

  .search-box {
    width: 100%;
    max-width: none;
  }

  .right-column {
    display: flex;
    flex-direction: column;
  }

  .discount-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* ========================================================= MOBILE ========================================================= */
@media (max-width: 700px) {
  .products-page {
    padding: 18px;
  }

  .page-header {
    margin-bottom: 22px;
  }

  .page-header h1 {
    font-size: 27px;
  }

  .page-header p {
    font-size: 13px;
  }

  .content-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .left-column,
  .right-column {
    gap: 18px;
  }

  .card {
    padding: 19px;
    border-radius: 14px;
  }

  .card h2 {
    font-size: 17px;
    margin-bottom: 18px;
  }

  .two-columns {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .discount-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .upload-area {
    min-height: 140px;
  }
}

/* ========================================================= SMALL MOBILE ========================================================= */
@media (max-width: 450px) {
  .products-page {
    padding: 12px;
  }

  .page-header h1 {
    font-size: 24px;
  }

  .page-header p {
    font-size: 12px;
  }

  .card {
    padding: 16px;
    border-radius: 12px;
  }

  .card h2 {
    font-size: 16px;
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    font-size: 12px;
    padding: 12px;
  }

  .thumbnail,
  .add-image {
    width: 60px;
    height: 60px;
  }

  .publish-button,
  .draft-button {
    padding: 13px;
  }
}
</style>
