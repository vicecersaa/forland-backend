import { Router } from "express";

import orderController from "./order.me.controller.js";

import authMiddleware from "../../middleware/auth.middleware.js";

const router = Router();

router.get(

    "/",

    authMiddleware,

    orderController.getMyOrders

);

router.get(

    "/:id",

    authMiddleware,

    orderController.getMyOrderById

);

export default router;