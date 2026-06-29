import { Router } from "express";
import * as contactController from "../controllers/contact.controller.js";
import { verifyJWT, requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

// Submit contact form (public)
router.post("/", contactController.createInquiry);

// Admin-only inquiries listing & update status
router.get("/", verifyJWT, requireRole(["admin", "editor"]), contactController.getInquiries);
router.patch("/:id/status", verifyJWT, requireRole(["admin", "editor"]), contactController.updateInquiryStatus);

export default router;
