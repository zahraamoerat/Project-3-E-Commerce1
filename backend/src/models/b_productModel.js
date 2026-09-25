import pool from "../config/db.js";
import { combineProductImages } from "../utils/productImage.js";

const fallbackProducts = [
  {
    id: 1,
    title: "Napkin Bundles",
    category: "Paper Goods",
    sku: "PG-NAP-100",
    price: 145,
    stockQty: 450,
    status: "Active",
    image: "https://images.unsplash.com/photo-1584556326561-2c8f7f6a3a2c?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    title: "Takeaway Bowl Packs",
    category: "Packaging",
    sku: "PK-BWL-500",
    price: 550,
    stockQty: 180,
    status: "Low stock",
    image: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    title: "Premium Coffee Beans",
    category: "Beverages",
    sku: "BV-COF-001",
    price: 320,
    stockQty: 24,
    status: "Low stock",
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=900&q=80",
  },
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
        p.product_image AS productImage,
        s.business_name AS supplier,
        p.supplier_id AS supplierId,
        p.description AS description,
        p.unit AS unit,
        p.compare_price AS comparePrice,
        COALESCE((
          SELECT JSON_ARRAYAGG(JSON_OBJECT(
            'minimum_quantity', t.minimum_quantity,
            'discount_percent', t.discount_percent
          ))
          FROM product_discount_tiers t
          WHERE t.product_id = p.product_id
        ), JSON_ARRAY()) AS discountTiers
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id
      LEFT JOIN inventory i ON p.product_id = i.product_id
      WHERE p.is_active = 1
        AND p.product_name <> ''
        AND p.price > 0
      ORDER BY p.product_name ASC
    `);

    const mediaByProduct = new Map();
    if (rows.length) {
      const placeholders = rows.map(() => "?").join(",");
      const [mediaRows] = await pool.query(
        `SELECT product_id, media_url
         FROM product_media
         WHERE media_type = 'image'
           AND product_id IN (${placeholders})
         ORDER BY is_primary DESC, sort_order ASC, media_id ASC`,
        rows.map((row) => row.id),
      );
      for (const media of mediaRows) {
        const id = Number(media.product_id);
        const current = mediaByProduct.get(id) || [];
        current.push(media.media_url);
        mediaByProduct.set(id, current);
      }
    }

    return rows.map((product) => {
      const allImages = combineProductImages(
        product.productImage,
        mediaByProduct.get(Number(product.id)) || [],
      );
      const discountTiers = typeof product.discountTiers === "string"
        ? JSON.parse(product.discountTiers || "[]")
        : (product.discountTiers || []);

      return {
        ...product,
        image: allImages[0] || "",
        product_image: allImages[0] || null,
        images: allImages,
        discountTiers,
      };
    });
  } catch (error) {
    console.error("Error fetching products from MySQL:", error.message);
    throw error;
  }
}

export { fallbackProducts };
