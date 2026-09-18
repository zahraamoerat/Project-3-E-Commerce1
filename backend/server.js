require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./src/routes/auth");
const cartRoutes = require("./src/routes/cart.routes");
const healthRoutes = require("./src/routes/health.routes");
const productRoutes = require("./src/routes/products.routes");

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5000",
  "http://localhost:5173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    status: "online",
    service: "WeConnect Buyer & Supplier Marketplace API",
    timestamp: new Date(),
  });
});

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/products", productRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found on Marketplace API." });
});

app.use((err, req, res, next) => {
  console.error("Public API Error:", err.stack);
  res.status(500).json({
    message: "Internal server error.",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

const PORT = Number(process.env.PORT || 5000);
app.listen(PORT, () => {
  console.log(`Buyer & Supplier Server listening on port ${PORT}`);
});
