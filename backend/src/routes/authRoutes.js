import express from "express";
import {
  login,
  me,
  getSubscriptionPlans,
  registerBuyer,
  registerSupplier,
} from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// GET /api/auth/plans
router.get("/plans", getSubscriptionPlans);

// POST /api/auth/login
router.post("/login", login);

// POST /api/auth/register-buyer
router.post("/register-buyer", registerBuyer);

// POST /api/auth/register-supplier
router.post("/register-supplier", registerSupplier);

// GET /api/auth/me
router.get("/me", requireAuth, me);

export default router;