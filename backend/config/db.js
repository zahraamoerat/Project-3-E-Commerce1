const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const projectRoot = path.resolve(__dirname, "../..");

const caPath = process.env.DB_SSL_CA
  ? path.resolve(projectRoot, process.env.DB_SSL_CA)
  : path.join(projectRoot, "certs/ca.pem");

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: fs.existsSync(caPath) ? { ca: fs.readFileSync(caPath) } : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/* =========================================================
   TEST DATABASE CONNECTION
   ========================================================= */

async function testDatabaseConnection() {
  const connection = await db.getConnection();

  try {
    await connection.query("SELECT 1");
    console.log("MySQL database connected successfully");
  } finally {
    connection.release();
  }
}

module.exports = db;
module.exports.testDatabaseConnection = testDatabaseConnection;