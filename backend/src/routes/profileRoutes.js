import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { getProfile, updateProfile } from "../controllers/profileController.js";

const router = express.Router();

router.get("/", requireAuth, getProfile);
router.patch("/", requireAuth, updateProfile);

export default router;
