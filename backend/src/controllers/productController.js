import db from "../config/db.js";
import { createProduct as insertProduct, getProducts, getProductById, updateProduct as saveProduct, updateProductStock as saveStock, deleteProduct as archiveProduct } from "../models/productModel.js";

const supplierId = () => Number(process.env.SUPPLIER_ID || 1);
const validId = (value) => Number.isInteger(Number(value)) && Number(value) > 0;

async function categoryId(categoryName) {
  const name = String(categoryName || "").trim();
  if (!name) throw Object.assign(new Error("Product category is required."), { status: 400 });
  const [rows] = await db.execute("SELECT category_id FROM categories WHERE category_name = ? LIMIT 1", [name]);
  if (!rows[0]) throw Object.assign(new Error(`Category "${name}" does not exist.`), { status: 400 });
  return rows[0].category_id;
}

function productData(body, category_id) {
  const name = String(body.product_name || "").trim();
  const price = Number(body.price);
  const compareRaw = body.comparePrice ?? body.compare_price;
  const compare_price = compareRaw === "" || compareRaw === null || compareRaw === undefined ? null : Number(compareRaw);
  const quantity = Number(body.quantity);
  const threshold = Number(body.low_stock_threshold ?? 10);
  const sku = body.sku ? String(body.sku).trim() : null;
  if (name.length < 3 || name.length > 150) throw Object.assign(new Error("Product name must be 3–150 characters."), { status: 400 });
  if (!Number.isFinite(price) || price <= 0) throw Object.assign(new Error("Price must be greater than zero."), { status: 400 });
  if (compare_price !== null && (!Number.isFinite(compare_price) || compare_price < price)) throw Object.assign(new Error("Compare at price must be greater than or equal to the selling price."), { status: 400 });
  if (!Number.isInteger(quantity) || quantity < 0) throw Object.assign(new Error("Quantity must be a non-negative whole number."), { status: 400 });
  if (!Number.isInteger(threshold) || threshold < 0) throw Object.assign(new Error("Low-stock threshold must be a non-negative whole number."), { status: 400 });
  if (sku && !/^[A-Za-z0-9][A-Za-z0-9._-]{2,39}$/.test(sku)) throw Object.assign(new Error("SKU must be 3–40 characters and use only letters, numbers, dots, underscores or hyphens."), { status: 400 });
  return { supplier_id: supplierId(), category_id, product_name: name, subcategory: body.subcategory ? String(body.subcategory).trim() : null, description: body.description ? String(body.description).trim() : null, price, compare_price, unit: body.unit ? String(body.unit).trim() : "unit", selling_type: body.sellingType === "online" ? "in-store" : body.sellingType === "online-only" ? "online-only" : body.sellingType === "both" ? "both" : body.selling_type || "online-only", weight_kg: body.weight ?? body.weight_kg ?? null, length_in: body.length ?? body.length_in ?? null, breadth_in: body.breadth ?? body.breadth_in ?? null, width_in: body.width ?? body.width_in ?? null, sku, product_image: body.product_image || body.image || null, images: Array.isArray(body.images) ? body.images.filter((url) => typeof url === "string" && url.length <= 1000) : [], quantity, low_stock_threshold: threshold };
}
export async function fetchProducts(req,res,next){try{res.json(await getProducts());}catch(e){next(e);}}
export async function duplicateProduct(req,res,next){try{if(!validId(req.params.id))return res.status(400).json({message:"Invalid product ID."});const source=await getProductById(req.params.id);if(!source)return res.status(404).json({message:"Product not found."});const baseSku=source.sku ? String(source.sku).replace(/[^A-Za-z0-9._-]/g,"").slice(0,32) : "COPY";let sku=`${baseSku}-COPY`;let suffix=1;while((await db.execute("SELECT product_id FROM products WHERE sku = ? LIMIT 1",[sku]))[0][0]){sku=`${baseSku}-C${suffix++}`;if(suffix>9999)throw Object.assign(new Error("Unable to generate a unique SKU."),{status:409});}const name=(`Copy of ${source.product_name}`).slice(0,150);const data={supplier_id:supplierId(),category_id:await categoryId(source.category_name),product_name:name,subcategory:source.subcategory||null,description:source.description||null,price:source.price,compare_price:source.compare_price,unit:source.unit||"unit",selling_type:source.selling_type||"online-only",weight_kg:source.weight_kg??null,length_in:source.length_in??null,breadth_in:source.breadth_in??null,width_in:source.width_in??null,sku,product_image:source.product_image||source.image||null,images:source.images||[],quantity:source.quantity||0,low_stock_threshold:source.low_stock_threshold??10};const product_id=await insertProduct(data);res.status(201).json({message:"Product duplicated successfully.",product_id});}catch(e){next(e);}}
export async function fetchProductById(req,res,next){try{if(!validId(req.params.id))return res.status(400).json({message:"Invalid product ID."});const p=await getProductById(req.params.id);if(!p)return res.status(404).json({message:"Product not found."});res.json(p);}catch(e){next(e);}}
export async function publishProduct(req,res,next){try{const data=productData(req.body,await categoryId(req.body.category_name));const product_id=await insertProduct(data);res.status(201).json({message:"Product published successfully.",product_id});}catch(e){next(e);}}
export async function editProduct(req,res,next){try{if(!validId(req.params.id))return res.status(400).json({message:"Invalid product ID."});if(!await getProductById(req.params.id))return res.status(404).json({message:"Product not found."});const data=productData(req.body,await categoryId(req.body.category_name));const affectedRows=await saveProduct(req.params.id,data);res.json({message:"Product updated successfully.",affectedRows});}catch(e){next(e);}}
export async function patchProductStock(req,res,next){try{if(!validId(req.params.id))return res.status(400).json({message:"Invalid product ID."});const quantity=Number(req.body.quantity);if(!Number.isInteger(quantity)||quantity<0)return res.status(400).json({message:"Quantity must be a non-negative whole number."});const affectedRows=await saveStock(req.params.id,quantity);if(!affectedRows)return res.status(404).json({message:"Product or inventory record not found."});res.json({message:"Stock updated successfully.",quantity});}catch(e){next(e);}}
export async function removeProduct(req,res,next){try{if(!validId(req.params.id))return res.status(400).json({message:"Invalid product ID."});const affectedRows=await archiveProduct(req.params.id);if(!affectedRows)return res.status(404).json({message:"Product not found."});res.json({message:"Product deleted successfully."});}catch(e){next(e);}}
