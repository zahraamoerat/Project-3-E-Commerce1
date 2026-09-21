import pool from '../database/connection.js';

const fallbackProducts = [
  {
    id: 1,
    title: 'Napkin Bundles',
    category: 'Paper Goods',
    sku: 'PG-NAP-100',
    price: 145,
    stockQty: 450,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1584556326561-2c8f7f6a3a2c?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 2,
    title: 'Takeaway Bowl Packs',
    category: 'Packaging',
    sku: 'PK-BWL-500',
    price: 550,
    stockQty: 180,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 3,
    title: 'Premium Coffee Beans',
    category: 'Beverages',
    sku: 'BV-COF-001',
    price: 320,
    stockQty: 24,
    status: 'Low stock',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=900&q=80'
  }
];

export async function getAllProducts() {
  try {
    const [rows] = await pool.query(`
      SELECT
        p.product_id AS id,
        p.product_name AS title,
        c.category_name AS category,
        p.sku AS sku,
        p.price AS price,
        COALESCE(i.quantity, 0) AS stockQty,
        CASE
          WHEN p.is_active = 0 OR COALESCE(i.quantity, 0) <= 0 THEN 'Out of stock'
          WHEN COALESCE(i.quantity, 0) <= COALESCE(i.low_stock_threshold, 20) THEN 'Low stock'
          ELSE 'Active'
        END AS status,
        p.product_image AS image,
        s.business_name AS supplier,
        p.description AS description,
        p.unit AS unit,
        p.compare_price AS comparePrice
      FROM products p
      LEFT JOIN categories c
        ON p.category_id = c.category_id
      LEFT JOIN suppliers s
        ON p.supplier_id = s.supplier_id
      LEFT JOIN inventory i
        ON p.product_id = i.product_id
      WHERE p.is_active = 1
        AND p.product_name <> ''
        AND p.price > 0
      ORDER BY p.product_name ASC
    `);

    return rows;
  } catch (error) {
    const canUseFallback = [
      'ECONNREFUSED',
      'ETIMEDOUT',
      'ENOTFOUND',
      'ER_ACCESS_DENIED_ERROR',
      'PROTOCOL_CONNECTION_LOST'
    ].includes(error.code);

    if (!canUseFallback) {
      throw error;
    }

    return fallbackProducts;
  }
}