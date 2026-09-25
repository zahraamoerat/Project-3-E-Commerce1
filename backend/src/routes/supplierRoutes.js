import express from "express";
import { requireAuth, requireSupplier } from "../middleware/auth.js";
import { getSupplierOverview, updateOrder, updateDelivery, replyToReview, updateProfile } from "../controllers/supplierController.js";

const router = express.Router();
router.use(requireAuth, requireSupplier);
router.get("/overview", getSupplierOverview);
router.patch("/orders/:id", updateOrder);
router.patch("/deliveries/:id", updateDelivery);
router.post("/reviews/:id/replies", replyToReview);
router.patch("/profile", updateProfile);

export default router;
