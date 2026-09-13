import express from "express";

import {
  publishProduct,
  fetchProducts,
  fetchProductById,
  editProduct,
  removeProduct
} from "../controllers/productController.js";

const router = express.Router();

router.post("/", publishProduct);

router.get("/", fetchProducts);

router.get("/:id", fetchProductById);

router.put("/:id", editProduct);

router.delete("/:id", removeProduct);

export default router;