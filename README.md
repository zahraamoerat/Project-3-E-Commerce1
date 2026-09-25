# WeConnect

B2B trade platform with two sides: **buyers** (small businesses) and **suppliers**
(wholesalers). The app opens on a landing page where users can sign up or log in
as either a buyer or a supplier — the role they choose determines which side of
the platform they see.

## Project structure

```
.
├─ backend/          Express API (single server.js entry point)
│  ├─ server.js      Runs the ENTIRE backend AND serves the built frontend
│  ├─ src/
│  │  ├─ config/     Database pool (MySQL + SSL)
│  │  ├─ controllers/
│  │  ├─ middleware/ JWT auth
│  │  ├─ models/
│  │  └─ routes/     All API route modules
│  ├─ certs/         SSL certificate for the DB connection
│  └─ uploads/       Uploaded product images
├─ frontend/         Vue 3 + Vite app (buyer & supplier UIs)
└─ scripts/dev.js    Runs backend + frontend rebuild together
```

## Getting started

```sh
npm install        # installs backend + frontend (npm workspaces)
npm run dev        # everything served from http://localhost:5000 (single port)
```

For development with Vue hot-module-reload instead:

```sh
npm run dev:frontend   # Vite on http://localhost:5173 (proxies /api to :5000)
```

## Production-style run

```sh
npm run build      # bundle the frontend into frontend/dist
npm start          # backend serves API + frontend on http://localhost:5000
```

## Configuration

Copy `backend/.env.example` to `backend/.env` (or edit the existing one) with
your MySQL/Aiven credentials. `PORT` controls the single port the whole app runs
on (default `5000`). The frontend talks to the API on the same origin
(`/api`), so no frontend env file is needed.

## API

All routes are mounted under `/api` by `backend/server.js`:

- `/api/auth` – login, register buyer, register supplier, subscription plans
- `/api/supplier/products` – product CRUD, stock, analytics, uploads
- `/api/products` – marketplace products and reviews
- `/api/orders`, `/api/cart`, `/api/payments`, `/api/deliveries`
- `/api/profile`, `/api/suppliers`, `/api/categories`
- Database schema lives in `database/weconnect.sql`