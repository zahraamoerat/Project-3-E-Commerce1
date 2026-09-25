# WeConnect Branch Documentation: zahraa2-dev

## Overview

This branch is an earlier and smaller WeConnect implementation focused on the core buyer experience. It contains a Vue frontend, Express backend, MySQL database schema, authentication routes, product routes, cart routes, and order routes.

## Frontend

The frontend is under frontend/weconnect.

Important files are frontend/weconnect/src/main.js, frontend/weconnect/src/App.vue, frontend/weconnect/src/router/index.js, frontend/weconnect/src/services/api.js, and frontend/weconnect/src/stores/productStore.js.

The main views include LandingPage.vue, LoginPage.vue, SignUpPage.vue, MarketplaceView.vue, and CartView.vue.

These provide the basic public landing, authentication, product browsing, and cart experience.

## Backend

The backend contains backend/src/config/axios.js, backend/src/config/db.js, backend/src/db.js, backend/src/middleware/auth.js, backend/src/routes/auth.js, backend/src/routes/cart.js, backend/src/routes/orders.js, backend/src/routes/products.js, and backend/src/server.js.

The backend therefore provides the core authentication, product, cart, and order API structure available in this branch.

## Database

The database schema is database/weconnect.sql.

Inspect the SQL file to understand the tables used by this version before running database operations.

## Installation

Switch to the branch:

git checkout zahraa2-dev

Install frontend dependencies from frontend/weconnect.

Install backend dependencies from backend.

Check package.json scripts before starting the servers.

## Configuration

The frontend includes frontend/weconnect/.env.example.

Backend database configuration is implemented in the backend config and db files.

Do not commit credentials.

## Finding functionality

Use frontend/weconnect/src/router/index.js to identify page URLs.

Use frontend/weconnect/src/services/api.js to identify frontend API calls.

Use backend/src/routes to find API endpoints.

Use backend/src/middleware/auth.js for authentication behaviour.

## Branch purpose

This branch represents an earlier core-commerce stage of WeConnect. It is useful for understanding the original buyer-side flow before the larger supplier, stock, delivery, review, profile, and administrative functionality was integrated.
