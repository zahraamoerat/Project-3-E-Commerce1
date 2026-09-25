# WeConnect Branch Documentation: merge-xabiso-development

## Overview

This branch represents an integration of Xabiso-related work with the development application. It contains the earlier frontend/weconnect structure and an expanded backend.

## Frontend

The active Vue application is under frontend/weconnect.

Important locations are:

frontend/weconnect/src/main.js
frontend/weconnect/src/App.vue
frontend/weconnect/src/router/index.js
frontend/weconnect/src/components
frontend/weconnect/src/layouts
frontend/weconnect/src/views
frontend/weconnect/src/stores
frontend/weconnect/src/data

Supplier functionality includes AddProducts, EditProduct, Orders, Reviews, S_Products, StockManagement, SupplierDashboard, and ViewProduct.

Buyer functionality includes small-business dashboards, products, orders, deliveries, payments, supplier deliveries, and tracking.

The frontend also contains product and supplier data files and a tracking map component.

## Backend

The backend uses the structured src layout:

backend/src/controllers
backend/src/models
backend/src/routes
backend/src/config
backend/src/database
backend/src/middleware

The branch includes buyer cart, delivery, order, order item, payment, product, and review functionality. Supplier product and supplier management functionality is also present.

A supplierPaymentRoutes.js file is included in this branch and should be checked when working on supplier payment-related endpoints.

Product uploads are handled by uploadRoutes.js.

## Running the project

First inspect the root package.json and the package.json under frontend/weconnect and backend.

Typical setup is:

cd backend
npm install

Then:

cd ../frontend/weconnect
npm install

Use the scripts defined in the package.json files to start each side.

## Authentication

Authentication code is under backend/src/middleware/auth.js and backend/src/controllers/authController.js.

Authentication routes are under backend/src/routes/authRoutes.js.

## Database

Database connection code is under backend/src/config/db.js and backend/src/database/b_connection.js.

Use backend/.env.example as the starting point for local configuration. Do not commit credentials.

## Finding functionality

To trace a frontend page, start at frontend/weconnect/src/router/index.js and follow the route to its view.

To trace an API request, start at frontend/weconnect/src/services if present, then find the matching backend route, controller, and model.

To trace database behaviour, start at backend/src/models and backend/src/config/db.js.

## Branch purpose

This branch is useful for checking the integration of Xabiso-related changes with the broader development application. Before merging further changes, compare route definitions, server imports, frontend router paths, package files, authentication, and database code.
