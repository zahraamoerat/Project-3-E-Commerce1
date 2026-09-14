const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const businessProfileRoutes = require("./routes/businessProfile");
const suppliersRoutes = require("./routes/suppliers");
const messagesRoutes = require("./routes/messages");
const reviewsRoutes = require("./routes/reviews");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/business-profile", businessProfileRoutes);
app.use("/api/suppliers", suppliersRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/reviews", reviewsRoutes);

app.get("/", (req, res) => {
  res.json({ message: "WeConnect API is running" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong on the server" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`WeConnect API listening on http://localhost:${PORT}`);
});
