# WeConnect Branch Documentation: xabiso-1

## Overview

This branch contains an earlier Xabiso implementation focused mainly on buyer-side commerce functionality, order processing, payment handling, delivery handling, and supporting backend structures.

## Frontend

The Vue application is under frontend/weconnect.

The main entry files are frontend/weconnect/src/main.js, frontend/weconnect/src/App.vue, and frontend/weconnect/src/router/index.js.

Buyer-facing pages include b_PaymentsView.vue, b_SmallBusinessDashboard.vue, b_SmallBusinessDeliveriesView.vue, b_SmallBusinessOrdersView.vue, b_SmallBusinessProductsView.vue, b_SupplierDeliveriesView.vue, b_SupplierOrdersView.vue, and b_TrackingView.vue.

The branch also contains reusable tracking components, order data, shared stores, styles, and the WeConnect sidebar assets.

## Backend

The backend is under backend/src.

Available functionality includes cart, delivery, order, order item, payment, and product controllers and models.

Routes are under backend/src/routes.

Database connection code is under backend/src/config and backend/src/database.

The branch does not contain the full supplier-management controller and route set found in later integrated branches.

## Running

Check package.json at the root and frontend/weconnect/package.json before starting.

Install frontend dependencies from frontend/weconnect and backend dependencies from backend.

Use the scripts defined by the package files.

## Database

Database connection files are under backend/src/config and backend/src/database.

Use backend/.env.example for environment configuration.

## Accessing buyer functionality

Open frontend/weconnect/src/router/index.js to see the registered URLs.

Open frontend/weconnect/src/views to inspect page implementations.

For orders, inspect b_SmallBusinessOrdersView.vue and the backend order route, controller, and model files.

For payments, inspect b_PaymentsView.vue and the corresponding backend payment files.

For delivery tracking, inspect b_TrackingView.vue and the tracking component.

## Branch purpose

This branch is useful for reviewing the earlier commerce and order-processing implementation before later supplier and authentication integrations were added.
