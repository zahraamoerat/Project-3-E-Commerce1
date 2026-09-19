import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();
const uploadDirectory = path.resolve("uploads/products");
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

export default router;
