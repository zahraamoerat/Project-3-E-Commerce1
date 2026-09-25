# WeConnect Branch Documentation: phelisa-integration

## Overview

This branch integrates Phelisa work into the WeConnect application. It contains both a separate dashboard-style frontend and the larger frontend/weconnect application.

## Frontend

The frontend/src area contains Dashboard, BrowseSuppliers, BusinessProfile, Messages, Reviews, and ComingSoon.

The main WeConnect Vue application is under frontend/weconnect.

Important WeConnect paths include frontend/weconnect/src/main.js, frontend/weconnect/src/App.vue, frontend/weconnect/src/router/index.js, frontend/weconnect/src/components, frontend/weconnect/src/layouts, frontend/weconnect/src/views, frontend/weconnect/src/stores, and frontend/weconnect/src/data.

The branch includes supplier product management, stock management, supplier dashboards, buyer dashboards, orders, deliveries, payments, reviews, profiles, and tracking views.

## Backend

The backend contains older routes and a structured src implementation.

The structured implementation contains controllers, models, routes, middleware, database connection code, upload routes, and product image resources.

## Accessing functionality

Use frontend/weconnect/src/router/index.js to find application URLs.

Use frontend/weconnect/src/views to locate page implementations.

Use backend/src/routes to find API endpoints.

Use backend/src/controllers for request handling.

Use backend/src/models for database queries.

Use backend/src/config/db.js for database connection settings.

## Installation

Inspect the package.json files at the root, backend, and frontend/weconnect levels.

Install backend dependencies from backend and frontend dependencies from frontend/weconnect.

Use backend/.env.example to create the local backend environment file.

## Database

Database connection files are under backend/src/config and backend/src/database. Product image files are stored under backend/uploads/products.

Do not commit credentials or local .env files.

## Branch purpose

This branch is intended for integration testing and development. When merging it into another branch, check frontend router changes, backend route changes, authentication middleware, database connection code, and package configuration carefully.
