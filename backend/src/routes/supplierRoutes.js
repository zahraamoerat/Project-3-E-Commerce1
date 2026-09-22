import express from "express";
import { getSupplierOverview, updateOrder, updateDelivery, replyToReview, updateProfile } from "../controllers/supplierController.js";

const router = express.Router();
router.get("/overview", getSupplierOverview);
router.patch("/orders/:id", updateOrder);
router.patch("/deliveries/:id", updateDelivery);
router.post("/reviews/:id/replies", replyToReview);
router.patch("/profile", updateProfile);

export default router;
