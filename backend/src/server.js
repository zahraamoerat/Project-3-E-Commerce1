import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import { testDatabaseConnection } from "./config/db.js";
import productRoutes from "./routes/s_productRoutes.js";
import supplierRoutes from "./routes/supplierRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Allow the Vue frontend to communicate with the backend.
app.use(
  cors({
    origin: FRONTEND_URL,
  }),
);

// Allows the API to receive JSON data from the frontend.
app.use(express.json());

// Serve uploaded product images.
app.use("/uploads", express.static(path.resolve("uploads")));

// Basic health check.
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "WeConnect backend is running",
  });
});

// Basic test route.
app.get("/", (req, res) => {
  res.json({
    message: "WeConnect backend is running",
  });
});

// Product API.
app.use("/api/products", productRoutes);

// Supplier API.
app.use("/api/supplier", supplierRoutes);

// Product image upload API.
app.use("/api/uploads", uploadRoutes);

// Category API.
app.use("/api/categories", categoryRoutes);

// Payment API.
app.use("/api/payments", paymentRoutes);

// Test the MySQL connection.
app.get("/api/test-db", async (_req, res) => {
  try {
    await testDatabaseConnection();

    res.json({
      message: "Database connected successfully",
      database: true,
    });
  } catch (error) {
    console.error("MySQL connection failed:", error.message);

    res.status(500).json({
      message: "Database connection failed",
      database: false,
    });
  }
});

// Global error handler.
app.use((err, _req, res, _next) => {
  console.error(err);

  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

// Start the backend.
app.listen(PORT, () => {
  console.log(`WeConnect backend running on http://localhost:${PORT}`);
});
