# WeConnect Branch Documentation: safety/improve-functionality-validation

## Overview

This branch is focused on functionality validation and safety-related implementation work. At the current branch state, the root contains the backend, frontend, package-lock.json, and .gitignore.

## Repository structure

The root directories are backend and frontend.

The branch currently does not expose the same complete root package configuration documented on the newer integrated development branch. Check the files present in the branch before running commands.

## Backend

Open backend to inspect server-side implementation.

Start with backend/package.json if present. Then inspect the server entry point, routes, controllers, middleware, models, and database configuration.

When validating a feature, follow this sequence:

1. Identify the frontend page or action.
2. Identify its API request.
3. Find the matching backend route.
4. Follow the route to its controller.
5. Follow the controller to its database model or query.
6. Verify the database connection and required environment variables.

## Frontend

Open frontend to inspect the Vue application.

Start with frontend/package.json, frontend/src/main.js, frontend/src/App.vue, and frontend/src/router/index.js where those files are present.

Views are under frontend/src/views, reusable components are under frontend/src/components, and API communication is under frontend/src/services.

## Validation approach

Test each feature from the user interface through the API and into the database.

Authentication should be tested with valid and invalid credentials.

Product operations should be tested for create, read, update, and delete behaviour where available.

Cart and order features should be tested with real database records.

Supplier features should be tested separately from buyer features.

## Configuration

Use any .env.example file supplied by the branch. Never commit real credentials.

## Branch purpose

This branch should be treated as a validation-focused development branch. Do not assume that features from main or development are present unless the files exist here.
