import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import { testDatabaseConnection } from "./config/db.js";

// ===============================
// SUPPLIER ROUTES
// ===============================
import supplierProductRoutes from "./routes/s_productRoutes.js";
import supplierRoutes from "./routes/supplierRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import supplierPaymentRoutes from "./routes/paymentRoutes.js";

// ===============================
// SMALL BUSINESS ROUTES
// ===============================
import orderRoutes from "./routes/b_orderRoutes.js";
import deliveryRoutes from "./routes/b_deliveryRoutes.js";
import paymentRoutes from "./routes/b_paymentRoutes.js";
import orderItemRoutes from "./routes/b_orderItemRoutes.js";
import productRoutes from "./routes/b_productRoutes.js";
import cartRoutes from "./routes/b_cartRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5173";

// ===============================
// MIDDLEWARE
// ===============================

app.use(
  cors({
    origin: FRONTEND_URL,
  })
);

app.use(express.json());

// Serve uploaded product images
app.use("/uploads", express.static(path.resolve("uploads")));

// ===============================
// BASIC ROUTES
// ===============================

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "WeConnect backend is running",
  });
});

app.get("/", (_req, res) => {
  res.json({
    message: "WeConnect backend is running",
  });
});

// ===============================
// SUPPLIER APIs
// ===============================

// Supplier products
app.use(
  "/api/supplier/products",
  supplierProductRoutes
);

// Supplier profile/orders/deliveries/etc.
app.use(
  "/api/supplier",
  supplierRoutes
);

// Product image uploads
app.use(
  "/api/uploads",
  uploadRoutes
);

// Categories
app.use(
  "/api/categories",
  categoryRoutes
);

// Supplier payments
app.use(
  "/api/supplier/payments",
  supplierPaymentRoutes
);

// ===============================
// SMALL BUSINESS APIs
// ===============================

// Orders
app.use(
  "/api/orders",
  orderRoutes
);

// Order items
app.use(
  "/api/orders",
  orderItemRoutes
);

// Deliveries
app.use(
  "/api/deliveries",
  deliveryRoutes
);

// Products
app.use(
  "/api/products",
  productRoutes
);

// Cart
app.use(
  "/api/cart",
  cartRoutes
);

// Payments
app.use(
  "/api/payments",
  paymentRoutes
);

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
    console.error(
      "MySQL connection failed:",
      error.message
    );

    res.status(500).json({
      message: "Database connection failed",
      database: false,
    });
  }
});

// ===============================
// GLOBAL ERROR HANDLER
// ===============================

app.use((err, _req, res, _next) => {
  console.error(err);

  res.status(err.status || 500).json({
    message:
      err.message || "Internal server error",
  });
});

// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {
  console.log(
    `WeConnect backend running on http://localhost:${PORT}`
  );
});