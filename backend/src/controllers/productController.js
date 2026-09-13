import db from "../config/db.js";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "../models/productModel.js";


/* =========================================================
   PUBLISH PRODUCT
========================================================= */

export async function publishProduct(req, res) {

  try {

    const {

      supplier_id,

      category_name,

      product_name,

      description,

      price,

      unit,

      sku,

      product_image,

      quantity,

      low_stock_threshold

    } = req.body;


    /* =========================
       VALIDATION
    ========================= */

    if (!supplier_id) {

      return res.status(400).json({

        message:
          "Supplier ID is required."

      });

    }


    if (!product_name) {

      return res.status(400).json({

        message:
          "Product name is required."

      });

    }


    if (
      price === undefined ||
      price === null ||
      price === ""
    ) {

      return res.status(400).json({

        message:
          "Product price is required."

      });

    }


    /* =========================
       FIND CATEGORY
    ========================= */

    let category_id = null;


    if (category_name) {

      const [
        categoryRows
      ] = await db.execute(
        `
        SELECT category_id

        FROM categories

        WHERE category_name = ?
        `,
        [category_name]
      );


      if (
        categoryRows.length === 0
      ) {

        return res.status(400).json({

          message:
            `Category "${category_name}" does not exist.`

        });

      }


      category_id =
        categoryRows[0].category_id;

    }


    /* =========================
       CHECK SUPPLIER
    ========================= */

    const [
      supplierRows
    ] = await db.execute(
      `
      SELECT supplier_id

      FROM suppliers

      WHERE supplier_id = ?
      `,
      [supplier_id]
    );


    if (
      supplierRows.length === 0
    ) {

      return res.status(400).json({

        message:
          "The selected supplier does not exist."

      });

    }


    /* =========================
       CREATE PRODUCT
    ========================= */

    const productId =
      await createProduct({

        supplier_id,

        category_id,

        product_name,

        description,

        price,

        unit,

        sku,

        product_image,

        quantity,

        low_stock_threshold

      });


    /* =========================
       SUCCESS
    ========================= */

    res.status(201).json({

      message:
        "Product published successfully.",

      product_id:
        productId

    });


  } catch (error) {

    console.error(
      "Error publishing product:",
      error
    );


    res.status(500).json({

      message:
        "Failed to publish product.",

      error:
        error.message

    });

  }

}


/* =========================================================
   FETCH PRODUCTS
========================================================= */

export async function fetchProducts(
  req,
  res
) {

  try {

    const products =
      await getProducts();


    res.status(200).json(
      products
    );


  } catch (error) {

    console.error(
      "ERROR FETCHING PRODUCTS:"
    );

    console.error(error);


    res.status(500).json({

      message:
        "Failed to fetch products.",

      error:
        error.message ||
        "Unknown database error",

      code:
        error.code ||
        null

    });

  }

}


/* =========================================================
   FETCH SINGLE PRODUCT
========================================================= */

export async function fetchProductById(req, res) {

  try {

    const { id } = req.params;


    const product =
      await getProductById(id);


    if (!product) {

      return res.status(404).json({

        message:
          "Product not found."

      });

    }


    res.status(200).json(
      product
    );


  } catch (error) {

    console.error(
      "Error fetching product:",
      error
    );


    res.status(500).json({

      message:
        "Failed to fetch product.",

      error:
        error.message

    });

  }

}


/* =========================================================
   EDIT PRODUCT
========================================================= */

export async function editProduct(req, res) {

  try {

    const { id } = req.params;


    /* =========================
       CHECK PRODUCT EXISTS
    ========================= */

    const existing =
      await getProductById(id);


    if (!existing) {

      return res.status(404).json({

        message:
          "Product not found."

      });

    }


    const {

      category_name,

      product_name,

      description,

      price,

      unit,

      sku,

      product_image,

      quantity,

      low_stock_threshold

    } = req.body;


    /* =========================
       VALIDATION
    ========================= */

    if (!product_name) {

      return res.status(400).json({

        message:
          "Product name is required."

      });

    }


    if (
      price === undefined ||
      price === null ||
      price === ""
    ) {

      return res.status(400).json({

        message:
          "Product price is required."

      });

    }


    /* =========================
       FIND CATEGORY
    ========================= */

    let category_id = null;


    if (category_name) {

      const [
        categoryRows
      ] = await db.execute(
        `
        SELECT category_id

        FROM categories

        WHERE category_name = ?
        `,
        [category_name]
      );


      if (
        categoryRows.length === 0
      ) {

        return res.status(400).json({

          message:
            `Category "${category_name}" does not exist.`

        });

      }


      category_id =
        categoryRows[0].category_id;

    }


    /* =========================
       UPDATE PRODUCT
    ========================= */

    await updateProduct(id, {

      category_id,

      product_name,

      description,

      price,

      unit,

      sku,

      product_image,

      quantity,

      low_stock_threshold

    });


    /* =========================
       SUCCESS
    ========================= */

    res.status(200).json({

      message:
        "Product updated successfully."

    });


  } catch (error) {

    console.error(
      "Error updating product:",
      error
    );


    res.status(500).json({

      message:
        "Failed to update product.",

      error:
        error.message

    });

  }

}


/* =========================================================
   REMOVE PRODUCT
========================================================= */

export async function removeProduct(req, res) {

  try {

    const { id } = req.params;


    const affectedRows =
      await deleteProduct(id);


    if (!affectedRows) {

      return res.status(404).json({

        message:
          "Product not found."

      });

    }


    res.status(200).json({

      message:
        "Product deleted successfully."

    });


  } catch (error) {

    console.error(
      "Error deleting product:",
      error
    );


    res.status(500).json({

      message:
        "Failed to delete product.",

      error:
        error.message

    });

  }

}