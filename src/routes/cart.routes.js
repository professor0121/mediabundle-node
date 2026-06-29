import { Router } from "express";
import * as cartController from "../controllers/cart.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// All cart routes require authentication
router.use(verifyJWT);

router.get("/", cartController.getCart);
router.post("/items", cartController.addItemToCart);
router.delete("/items/:projectId", cartController.removeItemFromCart);
router.post("/clear", cartController.clearCart);
router.post("/checkout", cartController.checkout);

export default router;
