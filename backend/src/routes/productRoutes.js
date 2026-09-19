import express from "express";

import {
  publishProduct,
  fetchProducts,
  fetchProductById,
  editProduct,
  removeProduct,
  patchProductStock,
  duplicateProduct
} from "../controllers/productController.js";

const router = express.Router();

/* =========================================================
   PRODUCTS
   ========================================================= */

/*
  GET
  /api/products
*/
router.get("/", fetchProducts);

/*
  GET
  /api/products/:id
*/
router.post("/:id/duplicate", duplicateProduct);

router.get("/:id", fetchProductById);

/*
  POST
  /api/products
*/
router.post("/", publishProduct);

/*
  PUT
  /api/products/:id
*/
router.put("/:id", editProduct);

/*
  PATCH
  /api/products/:id/stock
*/
router.patch("/:id/stock", patchProductStock);

/*
  DELETE
  /api/products/:id
*/
router.delete("/:id", removeProduct);

export default router;