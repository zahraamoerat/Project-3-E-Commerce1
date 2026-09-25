# WeConnect Branch Documentation: phelisa-dev

## Overview

This branch contains a Phelisa development version of WeConnect. It includes an older supplier and small-business frontend under frontend/weconnect as well as a separate frontend set of dashboard-oriented views under frontend/src.

## Frontend structures

The frontend/src directory contains pages such as Dashboard, BrowseSuppliers, BusinessProfile, Messages, Reviews, and ComingSoon.

The frontend/weconnect directory contains the larger Vue application with:

- layouts
- sidebar
- tracking
- supplier products
- stock management
- supplier dashboard
- buyer dashboards
- orders
- deliveries
- payments
- reviews
- profiles

When working on a page, check frontend/weconnect/src/router/index.js first if the page belongs to the WeConnect application.

## Backend

The branch contains both older-style backend files and the structured backend under backend/src.

Older-style files include:

backend/config/db.js
backend/middleware/auth.js
backend/routes/auth.js
backend/routes/businessProfile.js
backend/routes/dashboard.js
backend/routes/messages.js
backend/routes/reviews.js
backend/routes/suppliers.js
backend/server.js

The structured backend contains controllers, models, routes, database connection code, authentication middleware, uploads, and the b_ prefixed buyer functionality.

## Supplier functionality

Supplier product pages are under frontend/weconnect/src/views.

Key pages include AddProducts.vue, EditProduct.vue, S_Products.vue, StockManagement.vue, SupplierDashboard.vue, Reviews.vue, Orders.vue, Deliveries.vue, and ViewProduct.vue.

## Buyer functionality

Small-business functionality is available through the b_SmallBusiness views, b_Supplier views, b_PaymentsView.vue, and b_TrackingView.vue.

## Configuration

Use backend/.env.example for server configuration. Database connection code is under backend/src/config/db.js and the older backend/config/db.js.

## Running

Check the root package.json, backend/package.json, and frontend/weconnect/package.json before running commands because this branch contains multiple application structures.

For the WeConnect frontend:

cd frontend/weconnect
npm install

For backend:

cd backend
npm install

Use the package scripts defined on this branch.

## Database

The database connection and SQL-related resources should be checked under backend/src/database and backend/src/config. Always use the SQL schema associated with the branch being tested.

## Branch purpose

This branch is a development workspace containing both dashboard work and the broader WeConnect application. Verify which server and frontend are active before modifying shared files.
