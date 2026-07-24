import express from "express";

import couponController from "./coupon.controller.js";

import authMiddleware from "../../middleware/auth.middleware.js";
import authorize from "../../middleware/role.middleware.js";
import validate from "../../middleware/validate.middleware.js";

import {
    createCouponSchema,
    updateCouponSchema,
    validateCouponSchema
} from "./coupon.validation.js";

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    authorize("admin"),
    validate(createCouponSchema),
    couponController.create
);

router.get(
    "/",
    authMiddleware,
    authorize("admin"),
    couponController.getAll
);

router.post(
    "/validate",
    validate(validateCouponSchema),
    couponController.validateCoupon
);

router.get(
    "/:id",
    authMiddleware,
    authorize("admin"),
    couponController.getById
);

router.put(
    "/:id",
    authMiddleware,
    authorize("admin"),
    validate(updateCouponSchema),
    couponController.update
);



router.delete(
    "/:id",
    authMiddleware,
    authorize("admin"),
    couponController.remove
);

export default router;