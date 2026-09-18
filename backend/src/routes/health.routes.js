const express = require("express");
const { checkDatabaseConnection } = require("../config/db");

const router = express.Router();

router.get("/", async (_request, response) => {
  try {
    await checkDatabaseConnection();
    response.json({ status: "ok", database: "connected" });
  } catch (error) {
    response.status(503).json({
      status: "error",
      database: "unavailable",
      message: error.message,
    });
  }
});

module.exports = router;
