import { Router } from "express";

import checkoutController from "./checkout.controller.js";
import orderController from "../order/order.controller.js";

import authMiddleware from "../../middleware/auth.middleware.js";
import validate from "../../middleware/validate.middleware.js";

import {
    createCheckoutSchema
} from "./checkout.validation.js";

const router = Router();

router.get("/check-ongkir", orderController.checkOngkir);
router.post("/pending-ongkir", orderController.createPendingOngkirOrder);
router.get("/validate-token", orderController.validateCheckoutToken);
router.get("/:id/ongkir-status", orderController.checkOngkirStatus);

router.post(
    "/",
    authMiddleware,
    validate(createCheckoutSchema),
    checkoutController.createCheckout
);

export default router;