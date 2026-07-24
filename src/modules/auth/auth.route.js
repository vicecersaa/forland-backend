import { Router } from "express";

import authController from "./auth.controller.js";
import authMiddleware from "../../middleware/auth.middleware.js";

import {

    loginLimiter,
    registerLimiter

} from "../../middleware/rateLimit.middleware.js";

const router = Router();

// ======================
// REGISTER
// ======================

router.post(

    "/register",

    registerLimiter,

    authController.register

);

// ======================
// CUSTOMER LOGIN
// ======================

router.post(

    "/login",

    loginLimiter,

    authController.customerLogin

);

// ======================
// ADMIN LOGIN
// ======================

router.post(

    "/admin/login",

    loginLimiter,

    authController.adminLogin

);

// ======================
// ME
// ======================

router.get(

    "/me",

    authMiddleware,

    authController.me

);

// ======================
// FORGOT PASSWORD
// ======================

router.post(

    "/forgot-password",

    loginLimiter,

    authController.forgotPassword

);

// ======================
// RESET PASSWORD
// ======================

router.post(

    "/reset-password/:token",

    loginLimiter,

    authController.resetPassword

);

export default router;