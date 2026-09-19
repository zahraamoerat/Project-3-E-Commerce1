import db from "../config/db.js";

const productSelect = `
  SELECT p.product_id, p.product_name, p.subcategory, p.description,
    p.price, p.compare_price, p.unit, p.selling_type, p.weight_kg,
    p.length_in, p.breadth_in, p.width_in, p.sku, p.product_image,
    p.is_active, c.category_name, i.quantity, i.low_stock_threshold,
    i.last_restocked
  FROM products p
  LEFT JOIN categories c ON p.category_id = c.category_id
  LEFT JOIN inventory i ON p.product_id = i.product_id
`;

function shapeProduct(product, media = []) {
  const quantity = Number(product.quantity || 0);
  const threshold = Number(product.low_stock_threshold || 0);
  return {
    ...product,
    price: Number(product.price || 0),
    compare_price: product.compare_price === null ? null : Number(product.compare_price),
    quantity,
    low_stock_threshold: threshold,
    stockStatus: quantity === 0 ? "Out of stock" : quantity <= threshold ? "Low stock" : "In stock",
    image: product.product_image || media[0]?.media_url || "",
    images: media.map((item) => item.media_url),
  };
}

export async function getProducts() {
  const [rows] = await db.execute(`${productSelect} WHERE p.is_active = TRUE ORDER BY p.product_id DESC`);
  const [media] = await db.execute("SELECT product_id, media_url FROM product_media WHERE media_type = 'image' ORDER BY sort_order, media_id");
  return rows.map((row) => shapeProduct(row, media.filter((item) => item.product_id === row.product_id)));
}

export async function getProductById(productId) {
  const [rows] = await db.execute(`${productSelect} WHERE p.product_id = ? LIMIT 1`, [productId]);
  if (!rows[0]) return null;
  const [media] = await db.execute("SELECT media_url FROM product_media WHERE product_id = ? AND media_type = 'image' ORDER BY sort_order, media_id", [productId]);
  return shapeProduct(rows[0], media);
}

export async function createProduct(data) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [result] = await connection.execute(
      `INSERT INTO products (supplier_id, category_id, product_name, subcategory, description, price, compare_price, unit, selling_type, weight_kg, length_in, breadth_in, width_in, sku, product_image)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [data.supplier_id, data.category_id, data.product_name, data.subcategory || null, data.description || null, data.price, data.compare_price ?? null, data.unit || "unit", data.selling_type || "online-only", data.weight_kg ?? null, data.length_in ?? null, data.breadth_in ?? null, data.width_in ?? null, data.sku ?? null, data.product_image ?? null],
    );
    await connection.execute("INSERT INTO inventory (product_id, quantity, low_stock_threshold) VALUES (?, ?, ?)", [result.insertId, data.quantity ?? 0, data.low_stock_threshold ?? 10]);
    if (data.images?.length) {
      await connection.query("INSERT INTO product_media (product_id, media_url, media_type, is_primary, sort_order) VALUES ?", [data.images.map((url, index) => [result.insertId, url, "image", index === 0, index + 1])]);
    }
    await connection.commit();
    return result.insertId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function updateProduct(productId, data) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [result] = await connection.execute(
      `UPDATE products SET product_name = ?, category_id = ?, subcategory = ?, description = ?, price = ?, compare_price = ?, unit = ?, selling_type = ?, weight_kg = ?, length_in = ?, breadth_in = ?, width_in = ?, sku = ?, product_image = ? WHERE product_id = ?`,
      [data.product_name, data.category_id, data.subcategory || null, data.description || null, data.price, data.compare_price ?? null, data.unit || "unit", data.selling_type || "online-only", data.weight_kg ?? null, data.length_in ?? null, data.breadth_in ?? null, data.width_in ?? null, data.sku ?? null, data.product_image ?? null, productId],
    );
    await connection.execute("UPDATE inventory SET quantity = ?, low_stock_threshold = ? WHERE product_id = ?", [data.quantity ?? 0, data.low_stock_threshold ?? 10, productId]);
    if (data.images) {
      await connection.execute("DELETE FROM product_media WHERE product_id = ?", [productId]);
      if (data.images.length) await connection.query("INSERT INTO product_media (product_id, media_url, media_type, is_primary, sort_order) VALUES ?", [data.images.map((url, index) => [productId, url, "image", index === 0, index + 1])]);
    }
    await connection.commit();
    return result.affectedRows;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function updateProductStock(productId, quantity) {
  const [result] = await db.execute("UPDATE inventory SET quantity = ?, last_restocked = CURDATE() WHERE product_id = ?", [quantity, productId]);
  return result.affectedRows;
}

export async function deleteProduct(productId) {
  const [result] = await db.execute("UPDATE products SET is_active = FALSE WHERE product_id = ?", [productId]);
  return result.affectedRows;
}
