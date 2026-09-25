import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import { testDatabaseConnection } from "./src/config/db.js";

// ===============================
// ADMIN APIs
// ===============================
import adminRoutes from "./src/routes/adminRoutes.js";

// ===============================
// SUPPLIER ROUTES
// ===============================
import supplierProductRoutes from "./src/routes/s_productRoutes.js";
import supplierRoutes from "./src/routes/supplierRoutes.js";
import profileRoutes from "./src/routes/profileRoutes.js";
import uploadRoutes from "./src/routes/uploadRoutes.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";

// ===============================
// SMALL BUSINESS ROUTES
// ===============================
import orderRoutes from "./src/routes/b_orderRoutes.js";
import deliveryRoutes from "./src/routes/b_deliveryRoutes.js";
import paymentRoutes from "./src/routes/b_paymentRoutes.js";
import orderItemRoutes from "./src/routes/b_orderItemRoutes.js";
import productRoutes from "./src/routes/b_productRoutes.js";
import cartRoutes from "./src/routes/b_cartRoutes.js";
import supplierDirectoryRoutes from "./src/routes/b_supplierDirectoryRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

const backendRoot = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(backendRoot, "uploads");
const frontendDist = path.join(backendRoot, "..", "frontend", "dist");

// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());

app.use(express.json());

// Serve uploaded product images.
app.use("/uploads", express.static(uploadsDir));

// ===============================
// BASIC ROUTES
// ===============================

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "WeConnect backend is running",
  });
});

// ===============================
// AUTHENTICATION APIs
// ===============================

app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);

// ===============================
// SUPPLIER APIs
// ===============================

app.use("/api/supplier/products", supplierProductRoutes);

app.use("/api/supplier", supplierRoutes);

app.use("/api/profile", profileRoutes);

app.use("/api/uploads", uploadRoutes);

app.use("/api/categories", categoryRoutes);

// ===============================
// SMALL BUSINESS APIs
// ===============================

app.use("/api/orders", orderRoutes);

app.use("/api/orders", orderItemRoutes);

app.use("/api/deliveries", deliveryRoutes);

app.use("/api/products", productRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/suppliers", supplierDirectoryRoutes);

app.use("/api/payments", paymentRoutes);

// ===============================
// DATABASE TEST
// ===============================

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

// ===============================
// FRONTEND (same port)
// ===============================

const frontendAvailable = fs.existsSync(frontendDist);

// When the frontend hasn't been built yet, the root just describes the API.
app.get("/", (_req, res) => {
  if (frontendAvailable) return res.redirect("/index.html");
  return res.json({ message: "WeConnect backend is running" });
});

// Serve the built Vue app so the whole project runs on a single port.
if (frontendAvailable) {
  app.use(express.static(frontendDist));

  // SPA fallback: let Vue Router handle client-side routes.
  app.use((req, res, next) => {
    if (
      req.method !== "GET" ||
      req.path.startsWith("/api") ||
      req.path.startsWith("/uploads")
    ) {
      return next();
    }

    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

// ===============================
// GLOBAL ERROR HANDLER
// ===============================

app.use((err, _req, res, _next) => {
  console.error(err);

  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {
  console.log(`WeConnect backend running on http://localhost:${PORT}`);
});