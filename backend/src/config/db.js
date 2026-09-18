const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const caPath = process.env.DB_SSL_CA
  ? path.resolve(process.cwd(), process.env.DB_SSL_CA)
  : path.join(process.cwd(), "certs/ca.pem");

const poolOptions = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "weconnect",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

if (fs.existsSync(caPath)) {
  poolOptions.ssl = { ca: fs.readFileSync(caPath) };
}

const db = mysql.createPool(poolOptions);

async function checkDatabaseConnection() {
  const connection = await db.getConnection();
  try {
    await connection.query("SELECT 1");
  } finally {
    connection.release();
  }
}

module.exports = db;
module.exports.checkDatabaseConnection = checkDatabaseConnection;
