import { Router } from "express";
import * as projectController from "../controllers/project.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", projectController.getAllProjects);
router.get("/:id", projectController.getProjectById);

// Authenticated routes
router.post("/", verifyJWT, projectController.createProject);
router.put("/:id", verifyJWT, projectController.updateProject);
router.delete("/:id", verifyJWT, projectController.deleteProject);

export default router;
