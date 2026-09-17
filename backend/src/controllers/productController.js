import db from "../config/db.js";
import {
  createProduct as insertProduct,
  getProducts,
  getProductById,
  updateProduct as saveProduct,
  updateProductStock as saveStock,
  deleteProduct as archiveProduct,
} from "../models/productModel.js";

const supplierId = () => Number(process.env.SUPPLIER_ID || 1);

async function categoryId(categoryName) {
  if (!categoryName) return null;
  const [rows] = await db.execute("SELECT category_id FROM categories WHERE category_name = ? LIMIT 1", [categoryName]);
  if (!rows[0]) {
    const error = new Error(`Category \"${categoryName}\" does not exist.`);
    error.status = 400;
    throw error;
  }
  return rows[0].category_id;
}

function productData(body, category_id) {
  return {
    supplier_id: Number(body.supplier_id || supplierId()),
    category_id,
    product_name: String(body.product_name || "").trim(),
    subcategory: body.subcategory,
    description: body.description,
    price: Number(body.price || 0),
    compare_price: body.comparePrice ?? body.compare_price,
    unit: body.unit,
    selling_type: body.sellingType === "online" ? "in-store" : body.sellingType === "online-only" ? "online-only" : body.sellingType === "both" ? "both" : body.selling_type,
    weight_kg: body.weight ?? body.weight_kg,
    length_in: body.length ?? body.length_in,
    breadth_in: body.breadth ?? body.breadth_in,
    width_in: body.width ?? body.width_in,
    sku: body.sku,
    product_image: body.product_image || body.image,
    images: body.images,
    quantity: Number(body.quantity || 0),
    low_stock_threshold: Number(body.low_stock_threshold ?? 10),
  };
}

export async function fetchProducts(req, res, next) {
  try { res.json(await getProducts()); } catch (error) { next(error); }
}

export async function fetchProductById(req, res, next) {
  try {
    const product = await getProductById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found." });
    res.json(product);
  } catch (error) { next(error); }
}

export async function publishProduct(req, res, next) {
  try {
    if (!req.body.product_name) return res.status(400).json({ message: "Product name is required." });
    const data = productData(req.body, await categoryId(req.body.category_name));
    const product_id = await insertProduct(data);
    res.status(201).json({ message: "Product published successfully.", product_id });
  } catch (error) { next(error); }
}

export async function editProduct(req, res, next) {
  try {
    if (!await getProductById(req.params.id)) return res.status(404).json({ message: "Product not found." });
    const data = productData(req.body, await categoryId(req.body.category_name));
    const affectedRows = await saveProduct(req.params.id, data);
    res.json({ message: "Product updated successfully.", affectedRows });
  } catch (error) { next(error); }
}

export async function patchProductStock(req, res, next) {
  try {
    const quantity = Number(req.body.quantity);
    if (!Number.isInteger(quantity) || quantity < 0) return res.status(400).json({ message: "Quantity must be a non-negative integer." });
    const affectedRows = await saveStock(req.params.id, quantity);
    if (!affectedRows) return res.status(404).json({ message: "Product not found." });
    res.json({ message: "Stock updated successfully.", quantity });
  } catch (error) { next(error); }
}

export async function removeProduct(req, res, next) {
  try {
    const affectedRows = await archiveProduct(req.params.id);
    if (!affectedRows) return res.status(404).json({ message: "Product not found." });
    res.json({ message: "Product deleted successfully." });
  } catch (error) { next(error); }
}
