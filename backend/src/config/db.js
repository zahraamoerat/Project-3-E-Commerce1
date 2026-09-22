const mysql = require("mysql2/promise");

// Shared database pool for the CommonJS backend.
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "weconnect",
  ssl: process.env.DB_SSL_CA ? { ca: process.env.DB_SSL_CA } : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
