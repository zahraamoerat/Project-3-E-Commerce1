import db from "../config/db.js";
import {
  combineProductImages,
  normalizeProductImage,
  prepareProductImages,
} from "../utils/productImage.js";

const productSelect = `
  SELECT
    p.product_id,
    p.product_name,
    p.subcategory,
    p.description,
    p.price,
    p.compare_price,
    p.unit,
    p.selling_type,
    p.weight_kg,
    p.length_in,
    p.breadth_in,
    p.width_in,
    p.sku,
    p.product_image,
    p.is_active,
    p.catalog_status,
    p.created_at,
    p.updated_at,
    c.category_name,
    i.quantity,
    i.low_stock_threshold,
    i.last_restocked,
    s.lead_time_days,
    COALESCE((
      SELECT SUM(oi.quantity)
      FROM order_items oi
      JOIN orders o ON o.order_id = oi.order_id
      WHERE oi.product_id = p.product_id
        AND o.supplier_id = p.supplier_id
        AND o.status IN ('Processing', 'Shipped', 'Out for delivery', 'Delivered')
        AND o.ordered_at >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)
    ), 0) AS units_sold_30d
  FROM products p
  LEFT JOIN categories c ON p.category_id = c.category_id
  LEFT JOIN inventory i ON p.product_id = i.product_id
  LEFT JOIN suppliers s ON s.supplier_id = p.supplier_id
`;

function shapeProduct(product, media = [], discountTiers = []) {
  const quantity = Number(product.quantity ?? 0);
  const threshold = Number(product.low_stock_threshold ?? 0);
  const units30 = Number(product.units_sold_30d ?? 0);
  const lead = Math.max(1, Number(product.lead_time_days ?? 1));
  const daily = units30 / 30;
  const reorder = Math.max(threshold, Math.ceil(daily * (lead + 7)));
  const status = quantity === 0 ? "Out of stock" : quantity <= threshold ? "Low stock" : "In stock";
  const images = combineProductImages(
    product.product_image,
    media.map((item) => item.media_url),
  );
  const image = images[0] || "";

  return {
    ...product,
    price: Number(product.price ?? 0),
    compare_price: product.compare_price == null ? null : Number(product.compare_price),
    quantity,
    low_stock_threshold: threshold,
    stockStatus: status,
    units_sold_30d: units30,
    lead_time_days: lead,
    average_daily_sales: Number(daily.toFixed(2)),
    recommended_reorder_qty: Math.max(0, reorder - quantity),
    product_image: image || null,
    image,
    images,
    discountTiers: discountTiers.map((tier) => ({
      discount_tier_id: Number(tier.discount_tier_id),
      minimum_quantity: Number(tier.minimum_quantity),
      discount_percent: Number(tier.discount_percent),
    })),
  };
}

export async function getProducts(supplierId, { includeArchived = false } = {}) {
  const [rows] = await db.execute(
    `${productSelect}
     WHERE p.supplier_id = ?
     ${includeArchived ? "" : "AND p.is_active = TRUE AND p.catalog_status = 'Active'"}
     ORDER BY p.product_id DESC`,
    [supplierId],
  );

  let media = [];
  try {
    const [rowsMedia] = await db.execute(
      "SELECT product_id, media_url, is_primary, sort_order FROM product_media WHERE media_type = 'image' ORDER BY is_primary DESC, sort_order ASC, media_id ASC",
    );
    media = rowsMedia;
  } catch (error) {
    if (!["ER_NO_SUCH_TABLE", "ER_BAD_FIELD_ERROR"].includes(error.code)) throw error;
  }

  let tiers = [];
  try {
    const [rowsTiers] = await db.execute(
      "SELECT discount_tier_id, product_id, minimum_quantity, discount_percent FROM product_discount_tiers ORDER BY minimum_quantity ASC, discount_tier_id ASC",
    );
    tiers = rowsTiers;
  } catch (error) {
    if (!["ER_NO_SUCH_TABLE", "ER_BAD_FIELD_ERROR"].includes(error.code)) throw error;
  }

  return rows.map((row) => shapeProduct(
    row,
    media.filter((item) => Number(item.product_id) === Number(row.product_id)),
    tiers.filter((tier) => Number(tier.product_id) === Number(row.product_id)),
  ));
}

export async function getProductById(id, supplierId) {
  const [rows] = await db.execute(
    `${productSelect}
     WHERE p.product_id = ? AND p.supplier_id = ?
     LIMIT 1`,
    [id, supplierId],
  );
  if (!rows[0]) return null;

  let media = [];
  try {
    const [rowsMedia] = await db.execute(
      "SELECT media_url, is_primary, sort_order FROM product_media WHERE product_id = ? AND media_type = 'image' ORDER BY is_primary DESC, sort_order ASC, media_id ASC",
      [id],
    );
    media = rowsMedia;
  } catch (error) {
    if (!["ER_NO_SUCH_TABLE", "ER_BAD_FIELD_ERROR"].includes(error.code)) throw error;
  }

  let tiers = [];
  try {
    const [rowsTiers] = await db.execute(
      "SELECT discount_tier_id, minimum_quantity, discount_percent FROM product_discount_tiers WHERE product_id = ? ORDER BY minimum_quantity ASC, discount_tier_id ASC",
      [id],
    );
    tiers = rowsTiers;
  } catch (error) {
    if (!["ER_NO_SUCH_TABLE", "ER_BAD_FIELD_ERROR"].includes(error.code)) throw error;
  }

  return shapeProduct(rows[0], media, tiers);
}

export async function createProduct(data) {
  const imageData = prepareProductImages(data);
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [result] = await connection.execute(
      `INSERT INTO products (
        supplier_id, category_id, product_name, subcategory, description, price,
        compare_price, unit, selling_type, weight_kg, length_in, breadth_in,
        width_in, sku, product_image, is_active, catalog_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.supplier_id,
        data.category_id,
        data.product_name,
        data.subcategory || null,
        data.description || null,
        data.price,
        data.compare_price ?? null,
        data.unit || "unit",
        data.selling_type || "online-only",
        data.weight_kg ?? null,
        data.length_in ?? null,
        data.breadth_in ?? null,
        data.width_in ?? null,
        data.sku ?? null,
        imageData.product_image,
        true,
        "Active",
      ],
    );
    const productId = result.insertId;
    await connection.execute(
      "INSERT INTO inventory (product_id, quantity, low_stock_threshold) VALUES (?, ?, ?)",
      [productId, data.quantity ?? 0, data.low_stock_threshold ?? 10],
    );
    if (data.bulk_discount) {
      await connection.execute(
        "INSERT INTO product_discount_tiers (product_id, minimum_quantity, discount_percent) VALUES (?, ?, ?)",
        [productId, data.bulk_discount.minimum_quantity, data.bulk_discount.discount_percent],
      );
    }
    if (imageData.images.length) {
      await connection.query(
        "INSERT INTO product_media (product_id, media_url, media_type, is_primary, sort_order) VALUES ?",
        [imageData.images.map((url, index) => [productId, url, "image", index === 0, index + 1])],
      );
    }
    await connection.commit();
    return productId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function updateProduct(id, data) {
  const imageData = prepareProductImages(data);
  const connection = await db.getConnection();
  let removedMediaUrls = [];

  try {
    await connection.beginTransaction();
    const [result] = await connection.execute(
      `UPDATE products
       SET product_name = ?, category_id = ?, subcategory = ?, description = ?,
           price = ?, compare_price = ?, unit = ?, selling_type = ?,
           weight_kg = ?, length_in = ?, breadth_in = ?, width_in = ?, sku = ?,
           product_image = ?, updated_at = CURRENT_TIMESTAMP
       WHERE product_id = ? AND supplier_id = ?`,
      [
        data.product_name,
        data.category_id,
        data.subcategory || null,
        data.description || null,
        data.price,
        data.compare_price ?? null,
        data.unit || "unit",
        data.selling_type || "online-only",
        data.weight_kg ?? null,
        data.length_in ?? null,
        data.breadth_in ?? null,
        data.width_in ?? null,
        data.sku ?? null,
        imageData.product_image,
        id,
        data.supplier_id,
      ],
    );

    await connection.execute(
      "UPDATE inventory SET quantity = ?, low_stock_threshold = ? WHERE product_id = ?",
      [data.quantity ?? 0, data.low_stock_threshold ?? 10, id],
    );
    await connection.execute("DELETE FROM product_discount_tiers WHERE product_id = ?", [id]);
    if (data.bulk_discount) {
      await connection.execute(
        "INSERT INTO product_discount_tiers (product_id, minimum_quantity, discount_percent) VALUES (?, ?, ?)",
        [id, data.bulk_discount.minimum_quantity, data.bulk_discount.discount_percent],
      );
    }

    if (Array.isArray(data.images)) {
      const [existing] = await connection.execute(
        "SELECT media_url FROM product_media WHERE product_id = ? AND media_type = 'image'",
        [id],
      );
      const nextUrls = imageData.images;
      const nextSet = new Set(nextUrls);
      removedMediaUrls = (existing || [])
        .map((row) => row.media_url)
        .filter((url) => !nextSet.has(normalizeProductImage(url)));
      await connection.execute(
        "DELETE FROM product_media WHERE product_id = ? AND media_type = 'image'",
        [id],
      );
      if (nextUrls.length) {
        await connection.query(
          "INSERT INTO product_media (product_id, media_url, media_type, is_primary, sort_order) VALUES ?",
          [nextUrls.map((url, index) => [id, url, "image", index === 0, index + 1])],
        );
      }
    }

    await connection.commit();
    return { affectedRows: result.affectedRows, removedMediaUrls };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function updateProductStock(id, quantity, supplierId, reason = "Manual adjustment") {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [[row]] = await connection.execute(
      "SELECT i.quantity FROM inventory i JOIN products p ON p.product_id = i.product_id WHERE i.product_id = ? AND p.supplier_id = ? FOR UPDATE",
      [id, supplierId],
    );
    if (!row) {
      await connection.rollback();
      return 0;
    }

    const previous = Number(row.quantity);
    const normalizedReason = String(reason || "Manual adjustment").trim().slice(0, 120) || "Manual adjustment";
    const isRestock = ["Delivery received", "Restock received", "Returned stock"].includes(normalizedReason);
    const [result] = await connection.execute(
      `UPDATE inventory SET quantity = ?${isRestock ? ", last_restocked = CURDATE()" : ""} WHERE product_id = ?`,
      [quantity, id],
    );
    await connection.execute(
      "INSERT INTO stock_history (product_id, supplier_id, previous_quantity, new_quantity, change_quantity, reason) VALUES (?, ?, ?, ?, ?, ?)",
      [id, supplierId, previous, quantity, quantity - previous, normalizedReason],
    );
    await connection.commit();
    return result.affectedRows;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function bulkUpdateStock(updates, supplierId, reason = "Manual adjustment") {
  if (!Array.isArray(updates) || !updates.length) return 0;
  const connection = await db.getConnection();
  let count = 0;
  try {
    await connection.beginTransaction();
    for (const item of updates) {
      const id = Number(item.product_id);
      const quantity = Number(item.quantity);
      if (!Number.isInteger(id) || !Number.isInteger(quantity) || quantity < 0) {
        throw Object.assign(new Error("Each stock update requires a valid product ID and non-negative whole-number quantity."), { status: 400 });
      }
      const [[row]] = await connection.execute(
        "SELECT i.quantity FROM inventory i JOIN products p ON p.product_id = i.product_id WHERE i.product_id = ? AND p.supplier_id = ? FOR UPDATE",
        [id, supplierId],
      );
      if (!row) continue;
      const previous = Number(row.quantity);
      const normalizedReason = String(reason || "Manual adjustment").trim().slice(0, 120) || "Manual adjustment";
      const isRestock = ["Delivery received", "Restock received", "Returned stock"].includes(normalizedReason);
      await connection.execute(
        `UPDATE inventory SET quantity = ?${isRestock ? ", last_restocked = CURDATE()" : ""} WHERE product_id = ?`,
        [quantity, id],
      );
      await connection.execute(
        "INSERT INTO stock_history (product_id, supplier_id, previous_quantity, new_quantity, change_quantity, reason) VALUES (?, ?, ?, ?, ?, ?)",
        [id, supplierId, previous, quantity, quantity - previous, normalizedReason],
      );
      count += 1;
    }
    await connection.commit();
    return count;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function getStockAnalytics(supplierId) {
  const [rows] = await db.execute(
    `SELECT DATE(h.created_at) AS activity_date,
            SUM(CASE WHEN h.change_quantity > 0 THEN h.change_quantity ELSE 0 END) AS units_received,
            SUM(CASE WHEN h.change_quantity < 0 THEN ABS(h.change_quantity) ELSE 0 END) AS units_removed,
            COUNT(*) AS adjustments
     FROM stock_history h
     WHERE h.supplier_id = ?
       AND h.created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)
     GROUP BY DATE(h.created_at)
     ORDER BY activity_date`,
    [supplierId],
  );
  return rows.map((row) => ({
    ...row,
    units_received: Number(row.units_received || 0),
    units_removed: Number(row.units_removed || 0),
    adjustments: Number(row.adjustments || 0),
  }));
}

export async function deleteProduct(id, supplierId) {
  const [result] = await db.execute(
    "UPDATE products SET is_active = FALSE, catalog_status = 'Archived', updated_at = CURRENT_TIMESTAMP WHERE product_id = ? AND supplier_id = ?",
    [id, supplierId],
  );
  return result.affectedRows;
}
