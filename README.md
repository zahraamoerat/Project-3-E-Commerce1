# WeConnect Branch Documentation: development

## Overview

This branch contains the integrated WeConnect B2B e-commerce application. The application connects small businesses with suppliers and includes separate buyer and supplier experiences backed by an Express API, MySQL database, Vue 3 frontend, authentication, product management, stock management, ordering, payments, deliveries, profiles, reviews, supplier directory functionality, and product image handling.

## Main application areas

The project is divided into:

- frontend: Vue 3 and Vite client application.
- backend: Express server, API routes, controllers, models, authentication, database configuration, and image uploads.
- database: MySQL schema.
- scripts: development startup helpers.
- root package.json and package-lock.json: project-level scripts and dependencies.

## Starting the application

From the repository root:

npm install
npm run dev

The development script starts the frontend and backend together. The frontend is normally available at http://localhost:5173 and the backend at http://localhost:5000 according to the current development setup.

For frontend-only work:

cd frontend
npm install
npm run dev

For backend-only work:

cd backend
npm install
npm start

Check the package.json files on the branch if a script name has changed.

## Environment configuration

The backend contains backend/.env.example. Copy it to backend/.env and supply the required database and authentication configuration.

Do not commit backend/.env. Do not place passwords or private database credentials in frontend environment variables.

The database connection is implemented in backend/src/config/db.js. The backend uses SSL configuration for the MySQL connection and includes backend/certs/ca.pem.

## Frontend access

The frontend application starts at frontend/src/main.js and uses frontend/src/App.vue as its root component.

Routing is in frontend/src/router/index.js.

Important views include:

- frontend/src/views/landingpage/LandingPage.vue for the public landing page.
- frontend/src/views/loginpage/LoginPage.vue for login.
- frontend/src/views/signuppage/SignUpPage.vue for registration.
- frontend/src/views/buyersviews for small-business marketplace, cart, and product pages.
- frontend/src/views/suppliersviews for supplier product management.
- frontend/src/views/StockManagement.vue for supplier stock management.
- frontend/src/views/SupplierDashboard.vue for supplier dashboard functionality.
- frontend/src/views/b_SmallBusinessDashboard.vue for the small-business dashboard.
- frontend/src/views/b_SmallBusinessOrdersView.vue for small-business orders.
- frontend/src/views/b_SmallBusinessProductsView.vue for the small-business product catalogue.
- frontend/src/views/b_PaymentsView.vue for payment-related screens.
- frontend/src/views/b_TrackingView.vue for delivery tracking.
- frontend/src/views/Profile.vue and frontend/src/views/b_SmallBusinessProfile.vue for profile functionality.

Shared interface components are under frontend/src/components. Shared layout code is under frontend/src/layouts.

API communication is centralised in frontend/src/services/api.js. Shared client state is in frontend/src/stores.

## Backend access

The backend entry point is backend/server.js.

Authentication is implemented in backend/src/middleware/auth.js and backend/src/controllers/authController.js.

Authentication routes are in backend/src/routes/authRoutes.js.

Supplier product functionality is in:

backend/src/routes/s_productRoutes.js
backend/src/controllers/s_productController.js
backend/src/models/s_productModel.js

Buyer product functionality is in the b_product controller, model, and route files.

Cart functionality is in the b_cart controller, model, and route files.

Order functionality is in the b_order and b_orderItem controller, model, and route files.

Payment functionality is in b_paymentController.js, b_paymentModel.js, and b_paymentRoutes.js.

Delivery functionality is in b_deliveryController.js, b_deliveryModel.js, and b_deliveryRoutes.js.

Profile functionality is in profileController.js and profileRoutes.js.

Supplier directory functionality is in b_supplierDirectoryController.js and b_supplierDirectoryRoutes.js.

Admin functionality is in adminController.js and adminRoutes.js.

Product image uploads are handled by uploadRoutes.js and utils/productImage.js. Uploaded product images are stored under backend/uploads/products.

## Database

The database schema is in database/weconnect.sql.

The database contains the structures needed for users, buyers, suppliers, products, carts, orders, order items, payments, deliveries, reviews, messages, notifications, subscriptions, and related application data.

Import the SQL schema into the project's MySQL database before expecting database-backed features to work.

## Typical user flows

A small business user can register, log in, browse supplier products, view product information, add products to the cart, proceed through checkout, select payment and delivery information, and access order and delivery information.

A supplier can register, log in, manage products, upload product images, manage stock, review stock information, and access supplier-side orders and delivery functionality.

The intended data flow is:

Supplier product management -> backend API -> MySQL products table -> buyer marketplace -> cart -> checkout -> order and payment records.

## Finding a page

If you know the page name, search under frontend/src/views.

If you know the URL, open frontend/src/router/index.js and locate the matching route.

If you need to change the data used by a page, inspect frontend/src/services/api.js first, then follow the relevant backend route, controller, and model.

## Important development notes

Use the development branch as an integrated working branch. Before merging another branch, compare its files against development and check router, server, package, database, and authentication changes carefully.

Do not commit .env files or credentials.

## Verification checklist

Start both application sides, register a test account, log in, open the relevant buyer or supplier side, test product retrieval, test product creation or editing, test cart operations, complete a test checkout, verify order and payment records in MySQL, and test supplier stock functionality.

This branch contains the integrated structure needed for the full WeConnect workflow, but every live flow should be tested before submission.
