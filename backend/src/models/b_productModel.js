import db from "../config/db.js";
import { combineProductImages } from "../utils/productImage.js";

export async function getAllProducts() {
  const [rows] = await db.query(
    `SELECT p.product_id AS id,p.product_name AS title,c.category_name AS category,p.sku,
            p.price,COALESCE(i.quantity,0) AS stockQty,
            CASE WHEN p.is_active=0 OR COALESCE(i.quantity,0)<=0 THEN 'Out of stock'
                 WHEN COALESCE(i.quantity,0)<=COALESCE(i.low_stock_threshold,20) THEN 'Low stock'
                 ELSE 'Active' END AS status,
            p.product_image AS productImage,s.business_name AS supplier,p.supplier_id AS supplierId,
            p.description,p.unit,p.compare_price AS comparePrice
     FROM products p
     LEFT JOIN categories c ON p.category_id=c.category_id
     LEFT JOIN suppliers s ON p.supplier_id=s.supplier_id
     LEFT JOIN inventory i ON p.product_id=i.product_id
     WHERE p.is_active=1 AND p.product_name<>'' AND p.price>0
     ORDER BY p.product_name ASC`,
  );
  return rows.map((product) => {
    const images=combineProductImages(product.productImage,[]);
    return {...product,image:images[0]||"",product_image:images[0]||null,images};
  });
}
