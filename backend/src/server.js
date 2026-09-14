import express from 'express';
import dotenv from 'dotenv';
import pool from './database/connection.js';
import orderRoutes from './routes/orderRoutes.js';
import deliveryRoutes from './routes/deliveryRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import orderItemRoutes from './routes/orderItemRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

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