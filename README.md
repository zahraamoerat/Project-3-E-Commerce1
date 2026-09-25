# WeConnect Branch Documentation: zahraa1-dev

## Overview

This branch contains an earlier full-stack WeConnect implementation with authentication, buyer functionality, supplier functionality, product management, stock management, orders, deliveries, reviews, payments, database access, and product images.

## Frontend

The main Vue application is under frontend/weconnect.

Important files include frontend/weconnect/src/main.js, frontend/weconnect/src/App.vue, frontend/weconnect/src/router/index.js, frontend/weconnect/src/services/api.js, frontend/weconnect/src/stores, frontend/weconnect/src/components, and frontend/weconnect/src/layouts.

Authentication pages are available under direct LoginPage and SignUpPage locations and under loginpage and signuppage folders. Check the router to determine which component is active.

Buyer views are under frontend/weconnect/src/views/buyersviews.

Supplier views are under frontend/weconnect/src/views/suppliersviews.

Supplier functionality includes AddProducts, EditProduct, Orders, Profile, RestockPage, Reviews, S_Products, StockManagement, and SupplierDashboard.

## Backend

The backend includes controllers, models, routes, authentication, database configuration, and upload functionality.

There are route sets for authentication, cart, orders, products, supplier products, suppliers, uploads, and categories.

The backend also contains backend/src/config/axios.js and backend/src/db.js in addition to the primary database configuration.

## Product images

Product image resources are stored under backend/uploads/products.

Upload functionality is implemented through backend/src/routes/uploadRoutes.js.

## Database

The database schema is database/weconnect.sql.

Use this file to understand the tables and relationships used by this branch.

## Running

The repository contains package configuration at the root, backend, and frontend/weconnect levels.

Start by checking the root package.json. Then install dependencies in the application directory required by the selected script.

For the frontend, use frontend/weconnect. For the backend, use backend.

Use the scripts defined in the relevant package.json files.

## Configuration

The backend contains environment configuration examples. The frontend also contains frontend/weconnect/.env.example.

Never commit actual credentials.

## Finding pages

Open frontend/weconnect/src/router/index.js to identify the URL for a page.

Then open the referenced file under frontend/weconnect/src/views.

For API communication, open frontend/weconnect/src/services/api.js.

For backend requests, follow the API call into backend/src/routes, then controllers and models.

## Branch purpose

This branch represents a substantial earlier full-stack version of WeConnect and is useful for tracing the evolution of authentication, supplier management, buyer commerce, and database integration.
