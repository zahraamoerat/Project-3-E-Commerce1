import express from "express";
import dotenv from "dotenv";

import { testDatabaseConnection } from "./config/db.js";

import productRoutes from "./routes/productRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5173";

/* =========================
   CORS
========================= */

app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    FRONTEND_URL
  );

  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );

  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

/* =========================
   JSON
========================= */

app.use(express.json());

/* =========================
   HEALTH CHECK
========================= */

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "WeConnect backend is running"
  });
});

/* =========================
   ROOT
========================= */

app.get("/", (req, res) => {
  res.json({
    message: "WeConnect backend is running"
  });
});

/* =========================
   PRODUCT ROUTES
========================= */

app.use("/api/products", productRoutes);

/* =========================
   ERROR HANDLER
========================= */

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    message: err.message || "Internal server error"
  });
});

/* =========================
   START SERVER
========================= */

app.listen(PORT, async () => {
  console.log(
    `WeConnect server running on http://localhost:${PORT}`
  );

  try {
    await testDatabaseConnection();
  } catch (error) {
    console.error(
      "MySQL connection failed:",
      error.message
    );
  }
});