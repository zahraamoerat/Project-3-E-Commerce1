# WeConnect Branch Documentation: zanda-dev

## Overview

This branch contains Zanda's development work focused on supplier and product management. It is substantially smaller than the later integrated development and main branches.

## Frontend

The Vue application is under frontend/weconnect.

The main application files are frontend/weconnect/src/main.js, frontend/weconnect/src/App.vue, frontend/weconnect/src/router/index.js, frontend/weconnect/src/layouts/MainLayout.vue, and frontend/weconnect/src/components/Sidebar.vue.

Supplier-oriented views include AddProducts.vue, Dashboard.vue, Deliveries.vue, EditProduct.vue, Orders.vue, Products.vue, Profile.vue, RestockPage.vue, Reviews.vue, StockManagement.vue, and ViewProduct.vue.

The supplier data file is frontend/weconnect/src/data/supplierData.js.

Shared styling is under frontend/weconnect/src/assets/base.css and main.css.

## Backend

The backend is focused on supplier and product functionality.

Important files include backend/src/server.js, backend/src/config/db.js, backend/src/controllers/productController.js, backend/src/controllers/supplierController.js, backend/src/models/productModel.js, backend/src/routes/productRoutes.js, and backend/src/routes/supplierRoutes.js.

This makes the branch useful for tracing the original supplier product flow from the Vue page to the Express route, controller, model, and database.

## Database

The branch contains backend/src/database/weconnect_zanda_dev_updated.sql.

Use this SQL file to inspect the database structure associated with this development state.

Do not import it into the team's shared database without checking compatibility with the current schema.

## Installation

Switch to the branch:

git checkout zanda-dev

Install backend dependencies from backend.

Install frontend dependencies from frontend/weconnect.

Use the scripts defined in the respective package.json files.

## Finding product functionality

For the frontend product flow:

1. Open frontend/weconnect/src/router/index.js.
2. Find the product route.
3. Open the corresponding view under frontend/weconnect/src/views.
4. Check frontend/weconnect/src/stores for shared state.
5. Follow the request to the backend.
6. Open backend/src/routes/productRoutes.js.
7. Follow the route into backend/src/controllers/productController.js.
8. Follow the controller into backend/src/models/productModel.js.
9. Check backend/src/config/db.js for database access.

## Finding supplier functionality

Start with frontend/weconnect/src/views and supplierData.js.

Then follow supplier requests into backend/src/routes/supplierRoutes.js and backend/src/controllers/supplierController.js.

## Branch purpose

This branch preserves the supplier and product-management work developed in the Zanda development stream. It should be treated as an earlier feature branch and compared with development before merging additional changes.
