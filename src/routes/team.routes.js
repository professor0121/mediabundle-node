import { Router } from "express";
import * as teamController from "../controllers/team.controller.js";
import { verifyJWT, requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", teamController.getTeam);

// Admin / Editor only routes
router.post("/", verifyJWT, requireRole(["admin", "editor"]), teamController.createTeamMember);
router.put("/:id", verifyJWT, requireRole(["admin", "editor"]), teamController.updateTeamMember);
router.delete("/:id", verifyJWT, requireRole(["admin", "editor"]), teamController.deleteTeamMember);

export default router;
