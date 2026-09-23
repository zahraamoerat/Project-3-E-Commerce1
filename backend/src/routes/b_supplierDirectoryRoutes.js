import express from "express";
import { listSuppliers } from "../controllers/b_supplierDirectoryController.js";

const router = express.Router();

router.get("/", listSuppliers);

export default router;
