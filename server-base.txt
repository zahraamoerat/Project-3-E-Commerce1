import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './database/connection.js';
import orderRoutes from './routes/orderRoutes.js';
import deliveryRoutes from './routes/deliveryRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import orderItemRoutes from './routes/orderItemRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Allow the Vue frontend to communicate with the backend.
app.use(cors());

// Allows the API to receive JSON data from the frontend.
app.use(express.json());

// Basic test route to confirm the server is running.
app.get('/', (req, res) => {
  res.json({
    message: 'WeConnect backend is running'
  });
});

// Orders API route.
app.use('/api/orders', orderRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/orders', orderItemRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
// Test the MySQL connection.
app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS connected');

    res.json({
      message: 'Database connected successfully',
      database: rows[0].connected === 1
    });
  } catch (error) {
    console.error('Database connection error:', error.message);

    res.status(500).json({
      message: 'Database connection failed'
    });
  }
});

app.listen(PORT, () => {
  console.log(`WeConnect backend running on http://localhost:${PORT}`);
});
import { testDatabaseConnection } from "./config/db.js";
import productRoutes from "./routes/s_productRoutes.js";
import supplierRoutes from "./routes/supplierRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", FRONTEND_URL);
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  );
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});
app.use(express.json());
app.use("/uploads", express.static(path.resolve("uploads")));
app.get("/api/health", (req, res) =>
  res.json({ status: "ok", message: "WeConnect backend is running" }),
);
app.get("/", (req, res) =>
  res.json({ message: "WeConnect backend is running" }),
);
app.use("/api/products", productRoutes);
app.use("/api/supplier", supplierRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/payments", paymentRoutes);
app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal server error" });
});
app.listen(PORT, async () => {
  console.log(`WeConnect server running on http://localhost:${PORT}`);
  try {
    await testDatabaseConnection();
  } catch (error) {
    console.error("MySQL connection failed:", error.message);
  }
});
