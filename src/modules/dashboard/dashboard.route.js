import express from "express";

import authMiddleware from "../../middleware/auth.middleware.js";
import authorize from "../../middleware/role.middleware.js";

import dashboardController from "./dashboard.controller.js";

const router = express.Router();

router.get(
    "/",
    authMiddleware,
    authorize("admin"),
    dashboardController.getDashboard
);

export default router;