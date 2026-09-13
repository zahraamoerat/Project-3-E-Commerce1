import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),

  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,

  database: process.env.DB_NAME,

  ssl: {
    rejectUnauthorized: true
  },

  waitForConnections: true,

  connectionLimit: 10,

  queueLimit: 0
});

/* =========================================================
   TEST DATABASE CONNECTION
   ========================================================= */

export async function testDatabaseConnection() {
  const connection =
    await db.getConnection();

  try {
    await connection.query(
      "SELECT 1"
    );

    console.log(
      "MySQL database connected successfully"
    );
  } finally {
    connection.release();
  }
}

export default db;