# WeConnect Branch Documentation: main

## Overview

The main branch contains the integrated WeConnect B2B e-commerce application. It provides a buyer experience for small businesses and a supplier experience for wholesalers. The application uses Vue 3 and Vite on the frontend, Express and Node.js on the backend, and MySQL for persistent data.

## Repository structure

backend contains the Express API, authentication, controllers, models, routes, database configuration, uploaded product images, and supporting utilities.

frontend contains the Vue 3 application, views, layouts, components, stores, assets, routing, and API service.

database/weconnect.sql contains the database schema.

scripts/dev.js starts the frontend and backend development environment together.

The root package.json and package-lock.json define the project-level setup.

## Installation and startup

From the repository root:

npm install
npm run dev

The combined development setup starts the frontend and backend. The normal development addresses are frontend http://localhost:5173 and backend http://localhost:5000.

For backend-only development:

cd backend
npm install
npm start

For frontend-only development:

cd frontend
npm install
npm run dev

For a production-style build, inspect the root package.json for the current build and start scripts.

## Environment

Copy backend/.env.example to backend/.env and fill in the required database and authentication values.

The database connection is configured in backend/src/config/db.js.

The backend includes backend/certs/ca.pem for the database SSL configuration.

Never commit backend/.env or real credentials.

## Authentication

Authentication code is primarily located in:

backend/src/controllers/authController.js
backend/src/middleware/auth.js
backend/src/routes/authRoutes.js

The frontend authentication pages are:

frontend/src/views/loginpage/LoginPage.vue
frontend/src/views/signuppage/SignUpPage.vue

Registration supports buyer and supplier account flows. The backend uses JWT authentication and role information to protect relevant routes.

## Buyer and small-business side

Buyer-facing pages are found mainly under frontend/src/views/buyersviews and the b_ prefixed views.

Relevant files include:

frontend/src/views/buyersviews/MarketplaceView.vue
frontend/src/views/buyersviews/CartView.vue
frontend/src/views/buyersviews/ViewProduct.vue
frontend/src/views/b_SmallBusinessDashboard.vue
frontend/src/views/b_SmallBusinessProductsView.vue
frontend/src/views/b_SmallBusinessOrdersView.vue
frontend/src/views/b_SmallBusinessDeliveriesView.vue
frontend/src/views/b_SmallBusinessProfile.vue
frontend/src/views/b_PaymentsView.vue
frontend/src/views/b_TrackingView.vue

The buyer workflow connects marketplace products to cart, checkout, payment, orders, and delivery tracking.

## Supplier side

Supplier pages are mainly under frontend/src/views/suppliersviews plus the supplier-related root views.

Important files include:

frontend/src/views/suppliersviews/AddProducts.vue
frontend/src/views/suppliersviews/EditProduct.vue
frontend/src/views/S_Products.vue
frontend/src/views/StockManagement.vue
frontend/src/views/SupplierDashboard.vue
frontend/src/views/b_SupplierOrdersView.vue
frontend/src/views/b_SupplierDeliveriesView.vue

Supplier product creation and editing communicate with the backend and database. Stock management reads and changes supplier product stock.

## Product images

Product image upload routes are in backend/src/routes/uploadRoutes.js.

Image processing or storage helpers are in backend/src/utils/productImage.js.

Uploaded product images are stored under backend/uploads/products.

The product database records contain image references rather than requiring the frontend to hard-code every image.

## Backend API

backend/server.js mounts the major API groups.

The main groups are:

/api/auth
/api/admin
/api/supplier/products
/api/supplier
/api/profile
/api/uploads
/api/categories
/api/orders
/api/deliveries
/api/products
/api/cart
/api/suppliers
/api/payments

To find a specific endpoint, open the matching route file in backend/src/routes, then follow it to its controller and model.

## Database

database/weconnect.sql defines the MySQL schema.

The database supports users, buyers, suppliers, products, cart items, orders, order items, payment methods, payments, deliveries, reviews, supplier replies, conversations, messages, notifications, and subscription-related data.

Import the schema into the intended MySQL database before running database-dependent features.

## Frontend navigation

Open frontend/src/router/index.js to see every registered page and its URL.

Open frontend/src/services/api.js to see how frontend requests are sent to the backend.

Open frontend/src/stores for shared client state.

Open frontend/src/components and frontend/src/layouts for reusable interface structures.

## Recommended end-to-end test

Register a small-business account, log in, browse the marketplace, open a product, add it to the cart, proceed through checkout, select payment and delivery information, submit the order, then verify the order and payment records in MySQL.

Next test a supplier account by adding or editing a product, changing stock, uploading an image, and confirming that the product information is available to the buyer side.

## Security and configuration

Keep all database credentials and JWT secrets in backend/.env. Do not place secrets in Vue VITE variables.

Before submitting, verify authentication, database connection, product image handling, order creation, payment handling, and supplier-to-buyer product visibility.
