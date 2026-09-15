import db from "../config/db.js";

/* =========================================================
   GET ALL PRODUCTS
   ========================================================= */

export async function getProducts() {
  const [rows] = await db.execute(
    `
    SELECT
      p.product_id,
      p.product_name,

      c.category_name,

      p.price,
      p.unit,

      i.quantity,
      i.low_stock_threshold,

      p.is_active,

      p.sku,
      p.description,
      p.product_image

    FROM products p

    LEFT JOIN categories c
      ON p.category_id = c.category_id

    LEFT JOIN inventory i
      ON p.product_id = i.product_id

    ORDER BY
      p.product_id DESC
    `,
  );

  return rows;
}

/* =========================================================
   GET PRODUCT BY ID
   ========================================================= */

export async function getProductById(productId) {
  const [rows] = await db.execute(
    `
    SELECT
      p.product_id,
      p.product_name,

      c.category_name,

      p.price,
      p.unit,

      i.quantity,
      i.low_stock_threshold,

      p.is_active,

      p.sku,
      p.description,
      p.product_image

    FROM products p

    LEFT JOIN categories c
      ON p.category_id = c.category_id

    LEFT JOIN inventory i
      ON p.product_id = i.product_id

    WHERE p.product_id = ?

    LIMIT 1
    `,
    [productId],
  );

  return rows[0] || null;
}

export const createProduct = async (productData) => {};
