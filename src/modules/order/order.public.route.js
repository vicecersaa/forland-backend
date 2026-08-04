import { Router } from "express";
import orderController from "./order.controller.js";

const router = Router();

router.get("/check-ongkir", orderController.checkOngkir);
router.post("/pending-ongkir", orderController.createPendingOngkirOrder);
router.get("/validate-token", orderController.validateCheckoutToken);
router.get("/:id/ongkir-status", orderController.checkOngkirStatus);

export default router;