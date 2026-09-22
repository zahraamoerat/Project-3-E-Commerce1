import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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

export default db;

/* =========================================================
   TEST DATABASE CONNECTION
   ========================================================= */

export async function testDatabaseConnection() {
  const connection = await db.getConnection();

  try {
    await connection.query("SELECT 1");
    console.log("MySQL database connected successfully");
  } finally {
    connection.release();
  }
}