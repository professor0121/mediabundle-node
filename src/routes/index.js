import { Router } from "express";
import authRouter from "./auth.routes.js";
import blogRouter from "./blog.routes.js";
import projectRouter from "./project.routes.js";
import teamRouter from "./team.routes.js";
import cartRouter from "./cart.routes.js";
import contactRouter from "./contact.routes.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/blogs", blogRouter);
router.use("/projects", projectRouter);
router.use("/team", teamRouter);
router.use("/cart", cartRouter);
router.use("/contacts", contactRouter);

export default router;
