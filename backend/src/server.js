import express from "express";
import dotenv from "dotenv";

import productRoutes from "./routes/productRoutes.js";


dotenv.config();


const app =
  express();


const PORT =
  process.env.PORT || 5000;


/* =========================================================
   CORS
========================================================= */

app.use(
  (req, res, next) => {

    res.header(
      "Access-Control-Allow-Origin",
      "http://localhost:5173"
    );

    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );

    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );


    if (
      req.method === "OPTIONS"
    ) {

      return res.sendStatus(200);

    }


    next();

  }
);


/* =========================================================
   JSON
========================================================= */

app.use(
  express.json()
);


/* =========================================================
   TEST ROUTE
========================================================= */

app.get(
  "/",
  (req, res) => {

    res.json({

      message:
        "WeConnect backend is running"

    });

  }
);


/* =========================================================
   PRODUCT ROUTES
========================================================= */

app.use(
  "/api/products",
  productRoutes
);


/* =========================================================
   START SERVER
========================================================= */

app.listen(
  PORT,
  () => {

    console.log(
      `WeConnect server running on http://localhost:${PORT}`
    );

  }
);