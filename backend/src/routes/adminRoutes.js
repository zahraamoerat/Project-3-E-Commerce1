import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import {
  listSuppliers,
  approveSupplier,
  rejectSupplier,
} from "../controllers/adminController.js";

const router = Router();

router.use(requireAuth, requireRole("admin"));

router.get("/suppliers", listSuppliers);
router.post("/suppliers/:id/approve", approveSupplier);
router.post("/suppliers/:id/reject", rejectSupplier);

export default router;