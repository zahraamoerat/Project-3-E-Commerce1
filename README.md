# WeConnect Branch Documentation: merge-test

## Overview

This branch is a merge-testing state of WeConnect. It contains both older application structures and newer backend and frontend structures. It should be used when investigating integration and merge behaviour rather than assuming that every duplicate file is part of the final architecture.

## Important structure

The branch contains an older-style backend structure under:

backend/config
backend/middleware
backend/routes

It also contains the newer structured backend under:

backend/src/config
backend/src/controllers
backend/src/database
backend/src/middleware
backend/src/models
backend/src/routes

The frontend similarly contains a newer application under frontend and an older Vue application under frontend/weconnect.

## Frontend access

The newer frontend has:

frontend/src/App.vue
frontend/src/main.js
frontend/src/router/index.js
frontend/src/services/api.js
frontend/src/views
frontend/src/style.css

The older frontend is under frontend/weconnect.

When testing the branch, first determine which package.json and startup script is intended. Do not start both frontend applications unless the branch configuration explicitly requires it.

## Backend access

There are duplicate server, database, authentication, route, controller, and model structures.

The newer structured backend is generally easier to trace through:

backend/src/routes
backend/src/controllers
backend/src/models
backend/src/config

The older files under backend/routes, backend/middleware, and backend/config should be treated as merge-test material unless the active server imports them.

The active server entry must be checked before changing a route.

## Database

The branch contains backend database connection resources and the project's database SQL structure through the integrated backend files. Check the exact SQL file available in the branch before importing schema changes.

## Why this branch exists

This branch is useful for identifying conflicts between old and new application structures, testing merged files, and checking whether frontend and backend paths agree after integration.

## Safe investigation procedure

1. Open package.json at the root.
2. Open backend/package.json.
3. Open frontend/package.json.
4. Identify the active backend server.
5. Identify the active frontend directory.
6. Check router imports.
7. Check server route imports.
8. Run the active applications separately if necessary.
9. Only remove duplicate structures after confirming that no active import depends on them.

## Configuration

Use backend/.env.example for environment configuration. Never commit real credentials.

## Branch status

This is an integration-testing branch. It contains multiple generations of the application structure, so paths should always be verified against the active package and server files before making changes.
