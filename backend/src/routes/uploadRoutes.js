import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import db from "../config/db.js";

const router = express.Router();

const routeDir = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(routeDir, "../..");
const uploadDirectory = path.join(backendRoot, "uploads", "products");
fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDirectory),
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const base = path.basename(file.originalname, extension).replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 40);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${base || "product"}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024, files: 8 },
  fileFilter: (_req, file, cb) => {
    if (!["image/png", "image/jpeg"].includes(file.mimetype)) return cb(new Error("Only PNG and JPEG images are allowed."));
    cb(null, true);
  },
});

router.post("/products", upload.array("images", 8), (req, res) => {
  const urls = (req.files || []).map((file) => `${req.protocol}://${req.get("host")}/uploads/products/${file.filename}`);
  res.status(201).json({ urls });
});

router.delete("/products", express.json(), async (req, res, next) => {
  try {
    const urls = Array.isArray(req.body?.urls) ? req.body.urls : [];
    if (!urls.length || urls.length > 8) {
      return res.status(400).json({ message: "Provide between 1 and 8 image URLs to clean up." });
    }

    const requestOrigin = `${req.protocol}://${req.get("host")}`;
    const safeFiles = urls.map((value) => {
      const parsed = new URL(String(value));
      if (parsed.origin !== requestOrigin) {
        throw Object.assign(new Error("Only images uploaded by this application can be removed."), { status: 400 });
      }
      const filename = path.basename(parsed.pathname);
      if (!parsed.pathname.startsWith("/uploads/products/") || !filename || filename !== path.basename(parsed.pathname)) {
        throw Object.assign(new Error("Only product upload URLs can be removed."), { status: 400 });
      }
      if (!/^[a-zA-Z0-9._-]+$/.test(filename)) {
        throw Object.assign(new Error("Invalid product image filename."), { status: 400 });
      }
      return filename;
    });

    const placeholders = safeFiles.map(() => "?").join(",");
    const publicUrls = safeFiles.map((file) => `${requestOrigin}/uploads/products/${file}`);
    const [referenced] = await db.execute(`SELECT media_url FROM product_media WHERE media_url IN (${placeholders})`, publicUrls);

    const referencedUrls = new Set((referenced || []).map((row) => String(row.media_url)));
    const deleted = [];
    for (const filename of safeFiles) {
      const publicUrl = `${req.protocol}://${req.get("host")}/uploads/products/${filename}`;
      if (referencedUrls.has(publicUrl)) continue;
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
