import { Router } from "express";

import adminController from "./admin.controller.js";

import authMiddleware from "../../middleware/auth.middleware.js";
import authorize from "../../middleware/role.middleware.js";

const router = Router();



export default router;