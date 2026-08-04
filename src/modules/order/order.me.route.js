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

// Public routes (no auth)
router.get(
    "/check-ongkir",
    orderController.checkOngkir
);

router.post(
    "/pending-ongkir",
    orderController.createPendingOngkirOrder
);

router.get(
    "/validate-token",
    orderController.validateCheckoutToken
);

// Polling (no auth — pakai order ID)
router.get(
    "/:id/ongkir-status",
    orderController.checkOngkirStatus
);

export default router;