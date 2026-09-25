# WeConnect Branch Documentation: development-backup

## Overview

This branch is a backup and earlier development state of WeConnect. It contains both backend and frontend code, but its structure differs from the newer integrated development and main branches.

## Repository structure

The main directories are backend and frontend/weconnect.

The backend contains:

- src/b_server.js
- src/config
- src/controllers
- src/database
- src/middleware
- src/models
- src/routes
- uploaded product images
- backend/server.js

The frontend application is located under frontend/weconnect.

The branch also contains package-base.txt, package-head.txt, package-revert.txt, router-base.txt, router-head.txt, router-revert.txt, server-base.txt, server-head.txt, and server-revert.txt. These files are useful when investigating earlier package, router, and server states.

## Frontend

The Vue application is in frontend/weconnect.

Start with:

frontend/weconnect/src/main.js
frontend/weconnect/src/App.vue
frontend/weconnect/src/router/index.js

Reusable components are in frontend/weconnect/src/components.

The main application pages are in frontend/weconnect/src/views.

Important pages include supplier products, supplier dashboard, stock management, product editing, orders, deliveries, reviews, profiles, small-business dashboards, small-business products, small-business orders, supplier orders, supplier deliveries, payments, and tracking.

## Backend

The backend is organised around controllers, models, routes, authentication middleware, and database access.

Open backend/src/routes to locate endpoints.

Open backend/src/controllers to locate request handling and business logic.

Open backend/src/models to locate database queries.

Open backend/src/config/db.js and backend/src/database/b_connection.js when investigating database connection behaviour.

Authentication is in backend/src/middleware/auth.js and backend/src/controllers/authController.js.

## Database

This branch contains database-related connection files but does not use the same final database folder structure as the newer development branch. Check the SQL resources and connection configuration before importing or modifying database data.

## Installation

Clone the repository and switch to this branch:

git clone https://github.com/zahraamoerat/Project-3-E-Commerce1.git
cd Project-3-E-Commerce1
git checkout development-backup

Because this is an older structure, install dependencies from the package.json files in the directories that contain them. In particular, inspect frontend/weconnect/package.json and backend/package.json.

## Finding older changes

The text files named package-base, package-head, package-revert, router-base, router-head, router-revert, server-base, server-head, and server-revert are intended as references for earlier versions of important files.

Use them when comparing how package configuration, routing, or server configuration changed.

## Branch status

This branch should be treated as a historical or backup state rather than automatically as the current integrated version. If a feature is missing here, check development or main for the newer implementation.
