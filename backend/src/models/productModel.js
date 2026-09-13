import db from "../config/db.js";


/* =========================================================
   CREATE PRODUCT
========================================================= */

export async function createProduct(product) {

  const {
    supplier_id,
    category_id,
    product_name,
    description,
    price,
    unit,
    sku,
    product_image,
    quantity,
    low_stock_threshold
  } = product;


  const connection =
    await db.getConnection();


  try {

    await connection.beginTransaction();


    /* =========================
       INSERT PRODUCT
    ========================= */

    const [result] =
      await connection.execute(
        `
        INSERT INTO products
        (
          supplier_id,
          category_id,
          product_name,
          description,
          price,
          unit,
          sku,
          product_image
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          supplier_id,
          category_id || null,
          product_name,
          description || null,
          price,
          unit || "unit",
          sku || null,
          product_image || null
        ]
      );


    const productId =
      result.insertId;


    /* =========================
       INSERT INVENTORY
    ========================= */

    await connection.execute(
      `
      INSERT INTO inventory
      (
        product_id,
        quantity,
        low_stock_threshold
      )
      VALUES (?, ?, ?)
      `,
      [
        productId,
        quantity || 0,
        low_stock_threshold || 10
      ]
    );


    await connection.commit();


    return productId;


  } catch (error) {

    await connection.rollback();

    throw error;

  } finally {

    connection.release();

  }

}


/* =========================================================
   GET PRODUCTS
========================================================= */

export async function getProducts() {

  const [rows] =
    await db.execute(
      `
      SELECT

        p.product_id,

        p.supplier_id,

        p.category_id,

        p.product_name,

        p.description,

        p.price,

        p.unit,

        p.sku,

        p.product_image,

        p.is_active,

        p.created_at,

        c.category_name,

        i.quantity,

        i.low_stock_threshold

      FROM products p

      LEFT JOIN categories c
        ON p.category_id = c.category_id

      LEFT JOIN inventory i
        ON p.product_id = i.product_id

      WHERE p.is_active = TRUE

      ORDER BY p.created_at DESC
      `
    );


  return rows;

}


/* =========================================================
   GET PRODUCT BY ID (full details)
========================================================= */

export async function getProductById(productId) {

  const [rows] =
    await db.execute(
      `
      SELECT

        p.product_id,

        p.supplier_id,

        p.category_id,

        p.product_name,

        p.description,

        p.price,

        p.unit,

        p.sku,

        p.product_image,

        p.is_active,

        c.category_name,

        i.quantity,

        i.low_stock_threshold

      FROM products p

      LEFT JOIN categories c
        ON p.category_id = c.category_id

      LEFT JOIN inventory i
        ON p.product_id = i.product_id

      WHERE p.product_id = ?
        AND p.is_active = TRUE
      `,
      [productId]
    );


  return rows[0] || null;

}


/* =========================================================
   UPDATE PRODUCT
========================================================= */

export async function updateProduct(productId, product) {

  const {
    category_id,
    product_name,
    description,
    price,
    unit,
    sku,
    product_image,
    quantity,
    low_stock_threshold
  } = product;


  const connection =
    await db.getConnection();


  try {

    await connection.beginTransaction();


    /* =========================
       UPDATE PRODUCT
    ========================= */

    await connection.execute(
      `
      UPDATE products
      SET
        category_id = ?,
        product_name = ?,
        description = ?,
        price = ?,
        unit = ?,
        sku = ?,
        product_image = COALESCE(?, product_image)
      WHERE product_id = ?
      `,
      [
        category_id || null,
        product_name,
        description || null,
        price,
        unit || "unit",
        sku || null,
        product_image || null,
        productId
      ]
    );


    /* =========================
       UPDATE INVENTORY
    ========================= */

    if (
      quantity !== undefined ||
      low_stock_threshold !== undefined
    ) {

      await connection.execute(
        `
        UPDATE inventory
        SET
          quantity = COALESCE(?, quantity),
          low_stock_threshold = COALESCE(?, low_stock_threshold)
        WHERE product_id = ?
        `,
        [
          quantity !== undefined ? quantity : null,
          low_stock_threshold !== undefined ? low_stock_threshold : null,
          productId
        ]
      );

    }


    await connection.commit();


  } catch (error) {

    await connection.rollback();

    throw error;

  } finally {

    connection.release();

  }

}


/* =========================================================
   DELETE PRODUCT
   (Soft delete - keeps order/review history intact)
========================================================= */

export async function deleteProduct(productId) {

  const [result] =
    await db.execute(
      `
      UPDATE products

      SET is_active = FALSE

      WHERE product_id = ?
      `,
      [productId]
    );


  return result.affectedRows;

}