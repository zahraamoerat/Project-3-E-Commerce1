# WeConnect Branch Documentation: ai/implementation-2026-09-19

## Branch purpose

This branch is an implementation-focused branch of the WeConnect project. At the current branch state, the repository is organised around three main application areas: the backend, frontend, and database. The branch is not documented as a final production branch, so the README records what is present without assuming that later features from main or development are available here.

## Repository structure

The root contains:

- backend: server-side application code, database access, controllers, models, routes, configuration, and uploaded product resources.
- frontend: Vue application source and client-side resources.
- database: SQL database resources.
- package-lock.json: root dependency lock information.
- .gitignore: files and directories excluded from Git.

## Backend

Start by opening the backend directory.

The backend is where server-side functionality is located. The main areas are configuration, controllers, models, middleware, routes, database resources, and uploaded product files.

When investigating backend functionality, follow this order:

1. Open the backend package.json to see the scripts and dependencies available on this branch.
2. Open the server entry file to see how the API is started.
3. Open src/routes to find the HTTP endpoints.
4. Open src/controllers to find the business logic called by routes.
5. Open src/models to find database operations.
6. Open src/config to find database configuration.
7. Open src/middleware for request authentication or validation.
8. Check backend uploads when investigating product images.

## Frontend

Open the frontend directory to access the Vue application.

The frontend contains the application entry point, views, components, layouts, assets, stores, router configuration, and API service code.

Useful locations are:

- frontend/src/main.js: application entry point.
- frontend/src/App.vue: root Vue component.
- frontend/src/router: page and route configuration.
- frontend/src/views: application pages.
- frontend/src/components: reusable interface components.
- frontend/src/layouts: shared page layouts.
- frontend/src/services: frontend-to-backend communication.
- frontend/src/stores: shared client state.
- frontend/src/assets: application images and styles.
- frontend/vite.config.js: Vite development configuration.

## Database

Open database to find the SQL resources included in this branch. Check the actual SQL files before importing anything because database structure can differ between branches.

## Installation

Clone the repository and switch to this branch:

git clone https://github.com/zahraamoerat/Project-3-E-Commerce1.git
cd Project-3-E-Commerce1
git checkout ai/implementation-2026-09-19

Install dependencies using the package files that exist in the relevant application directory. Do not assume that the current branch uses the same root scripts as main or development.

## Configuration

Use example environment files when they exist. Never commit real passwords, database credentials, JWT secrets, or other private values.

## Finding functionality

For frontend functionality, start with frontend/src/router and then follow each route into its view.

For backend functionality, start with backend server and route files, then follow the route to its controller and model.

For database functionality, inspect the SQL files under database and compare their table names with the backend model queries.

## Branch status

This README intentionally describes only the structure visible on this branch. Features introduced later on development or main should not be treated as part of this branch unless they are actually present here.
