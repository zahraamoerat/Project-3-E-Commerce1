import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import db from "../config/db.js";
import { requireAuth, requireSupplier } from "../middleware/auth.js";
import { normalizeProductImage, productImageFilename } from "../utils/productImage.js";

const router = express.Router();
const routeDir = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(routeDir, "../..");
const uploadDirectory = path.join(backendRoot, "uploads", "products");
fs.mkdirSync(uploadDirectory, { recursive: true });

const imageSignatures = {
  "image/jpeg": [0xff, 0xd8, 0xff],
  "image/png": [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
};

function hasValidImageSignature(file) {
  const expected = imageSignatures[file.mimetype];
  if (!expected) return false;
  const descriptor = fs.openSync(file.path, "r");
  try {
    const buffer = Buffer.alloc(expected.length);
    const bytesRead = fs.readSync(descriptor, buffer, 0, buffer.length, 0);
    return bytesRead === expected.length && expected.every((value, index) => buffer[index] === value);
  } finally {
    fs.closeSync(descriptor);
  }
}

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, uploadDirectory),
  filename: (req, file, callback) => {
    const extension = file.mimetype === "image/png" ? ".png" : ".jpg";
    const base = path.basename(file.originalname, path.extname(file.originalname))
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .slice(0, 40);
    const ownerPrefix = req.supplierId ? `${req.supplierId}-` : "";
    callback(
      null,
      `${ownerPrefix}${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${base || "product"}${extension}`,
    );
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024, files: 8 },
  fileFilter: (_req, file, callback) => {
    if (!["image/png", "image/jpeg"].includes(file.mimetype)) {
      callback(Object.assign(new Error("Only PNG and JPEG images are allowed."), { status: 400 }));
      return;
    }
    callback(null, true);
  },
});

router.use(requireAuth, requireSupplier);

router.post("/products", upload.array("images", 8), (req, res, next) => {
  const files = req.files || [];
  try {
    if (files.some((file) => !hasValidImageSignature(file))) {
      for (const file of files) {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      }
      return res.status(400).json({ message: "Uploaded files must be valid PNG or JPEG images." });
    }
    const urls = files.map((file) => `/uploads/products/${file.filename}`);
    return res.status(201).json({ urls });
  } catch (error) {
    for (const file of files) {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    }
    return next(error);
  }
});

router.delete("/products", async (req, res, next) => {
  try {
    const urls = Array.isArray(req.body?.urls) ? req.body.urls : [];
    if (!urls.length || urls.length > 8) {
      return res.status(400).json({ message: "Provide between 1 and 8 image URLs to clean up." });
    }

    const filenames = urls.map((value) => {
      const filename = productImageFilename(value);
      if (!filename) {
        throw Object.assign(new Error("Only product upload URLs can be removed."), { status: 400 });
      }
      return filename;
    });
    const canonicalUrls = filenames.map((filename) => `/uploads/products/${filename}`);
    const [mediaRows] = await db.execute("SELECT media_url FROM product_media WHERE media_type = 'image'");
    const [productRows] = await db.execute(
      "SELECT product_image FROM products WHERE product_image IS NOT NULL AND product_image <> ''",
    );
    const referenced = new Set([
      ...(mediaRows || []).map((row) => normalizeProductImage(row.media_url)),
      ...(productRows || []).map((row) => normalizeProductImage(row.product_image)),
    ].filter(Boolean));

    const deleted = [];
    const ownerPrefix = `${req.supplierId}-`;
    for (const [index, filename] of filenames.entries()) {
      if (!filename.startsWith(ownerPrefix)) continue;
      if (referenced.has(canonicalUrls[index])) continue;
      const filePath = path.join(uploadDirectory, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        deleted.push(filename);
      }
    }

    res.json({ deleted });
  } catch (error) {
    next(error);
  }
});

export default router;
