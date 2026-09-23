import pool from '../database/b_connection.js';

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
        COALESCE(NULLIF(p.product_image, ''), MIN(pm.media_url)) AS image,
        COALESCE(
          CONCAT(
            '[',
            GROUP_CONCAT(
              DISTINCT JSON_QUOTE(pm.media_url)
              ORDER BY pm.is_primary DESC, pm.sort_order ASC, pm.media_id ASC
              SEPARATOR ','
            ),
            ']'
          ),
          '[]'
        ) AS productImages,
        s.business_name AS supplier,
        p.description AS description,
        p.unit AS unit,
        p.compare_price AS comparePrice,
        COALESCE((SELECT JSON_ARRAYAGG(JSON_OBJECT('minimum_quantity', t.minimum_quantity, 'discount_percent', t.discount_percent)) FROM product_discount_tiers t WHERE t.product_id=p.product_id), JSON_ARRAY()) AS discountTiers
      FROM products p
      LEFT JOIN categories c
        ON p.category_id = c.category_id
      LEFT JOIN suppliers s
        ON p.supplier_id = s.supplier_id
      LEFT JOIN inventory i
        ON p.product_id = i.product_id
      LEFT JOIN product_media pm
        ON p.product_id = pm.product_id
        AND pm.media_type = 'image'
      WHERE p.is_active = 1
        AND p.product_name <> ''
        AND p.price > 0
      GROUP BY
        p.product_id,
        p.product_name,
        c.category_name,
        p.sku,
        p.price,
        i.quantity,
        i.low_stock_threshold,
        p.is_active,
        p.product_image,
        s.business_name,
        p.description,
        p.unit,
        p.compare_price
      ORDER BY p.product_name ASC
    `);

    return rows.map((product) => {
      let images = [];
      try {
        images = JSON.parse(product.productImages || '[]');
      } catch {
        images = [];
      }

      // Keep the supplier's primary product image first, then every image
      // stored in product_media, without duplicates.
      const allImages = [...new Set([
        product.image,
        ...images
      ].filter((url) => typeof url === 'string' && url.trim()))];

      return {
        ...product,
        image: allImages[0] || '',
        discountTiers: typeof product.discountTiers === "string" ? JSON.parse(product.discountTiers || "[]") : (product.discountTiers || []),
        images: allImages
      };
    });
  } catch (error) {
    console.error('Error fetching products from MySQL:', error.message);
    throw error;
  }
}