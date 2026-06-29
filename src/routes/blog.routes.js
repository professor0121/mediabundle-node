import { Router } from "express";
import * as blogController from "../controllers/blog.controller.js";
import { verifyJWT, requireRole, optionalJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", optionalJWT, blogController.getAllBlogs);
router.get("/:slug", optionalJWT, blogController.getBlogBySlug);

// Admin / Editor only routes
router.post("/", verifyJWT, requireRole(["admin", "editor"]), blogController.createBlog);
router.put("/:slug", verifyJWT, requireRole(["admin", "editor"]), blogController.updateBlog);
router.delete("/:slug", verifyJWT, requireRole(["admin", "editor"]), blogController.deleteBlog);

export default router;
