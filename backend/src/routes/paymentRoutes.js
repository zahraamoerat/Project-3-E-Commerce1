import express from "express";
import { createPaymentIntent } from "../controllers/paymentController.js";
import { requireAuth } from "../middleware/auth.js";
const router = express.Router();
router.post("/intent", requireAuth, createPaymentIntent);
export default router;
