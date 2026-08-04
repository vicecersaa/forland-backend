import { Router } from "express";

import orderController from "./order.controller.js";

import authMiddleware from "../../middleware/auth.middleware.js";
import authorize from "../../middleware/role.middleware.js";
import validate from "../../middleware/validate.middleware.js";

import {

    createOrderSchema,

    updateOrderStatusSchema,

    updatePaymentStatusSchema,

    updateShippingStatusSchema

} from "./order.validation.js";

const router = Router();

router.post(

    "/",

    authMiddleware,

    authorize("admin"),

    validate(createOrderSchema),

    orderController.create

);

router.get(

    "/",

    authMiddleware,

    authorize("admin"),

    orderController.getAll

);

router.get(

    "/:id",

    authMiddleware,

    authorize("admin"),

    orderController.getById

);

router.patch(

    "/:id/status",

    authMiddleware,

    authorize("admin"),

    validate(updateOrderStatusSchema),

    orderController.updateStatus

);

router.patch(

    "/:id/payment",

    authMiddleware,

    authorize("admin"),

    validate(updatePaymentStatusSchema),

    orderController.updatePaymentStatus

);

router.patch(

    "/:id/shipping",

    authMiddleware,

    authorize("admin"),

    validate(updateShippingStatusSchema),

    orderController.updateShippingStatus

);

router.patch(

    "/:id/cancel",

    authMiddleware,

    authorize("admin"),

    orderController.cancel

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



// Admin routes
router.patch(
    "/:id/ongkir",
    authMiddleware,
    authorize("admin"),
    orderController.setOngkir
);

router.post(
    "/:id/generate-link",
    authMiddleware,
    authorize("admin"),
    orderController.generateCheckoutLink
);

export default router;