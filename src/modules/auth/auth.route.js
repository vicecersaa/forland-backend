import { Router } from "express";
import authController from "./auth.controller.js";
import authMiddleware from "../../middleware/auth.middleware.js";

const router = Router();

router.post("/register", authController.register);

router.post("/login", authController.customerLogin);

router.post("/admin/login", authController.adminLogin);

router.get("/me", authMiddleware, authController.me);

router.post("/forgot-password", authController.forgotPassword);

router.post("/reset-password/:token", authController.resetPassword);

export default router;