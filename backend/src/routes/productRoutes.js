import express from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateProductStock
} from "../controllers/productController.js";

const router = express.Router();

/* =========================================================
   PRODUCTS
   ========================================================= */

/*
  GET
  /api/products
*/
router.get(
  "/",
  getProducts
);

/*
  GET
  /api/products/:id
*/
router.get(
  "/:id",
  getProductById
);

/*
  POST
  /api/products
*/
router.post(
  "/",
  createProduct
);

/*
  PUT
  /api/products/:id
*/
router.put(
  "/:id",
  updateProduct
);

/*
  PATCH
  /api/products/:id/stock
*/
router.patch(
  "/:id/stock",
  updateProductStock
);

/*
  DELETE
  /api/products/:id
*/
router.delete(
  "/:id",
  deleteProduct
);

export default router;