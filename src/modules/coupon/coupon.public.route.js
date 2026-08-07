import express from "express";
import couponController from "./coupon.controller.js";

const router = express.Router();

router.get("/popup", couponController.getPopup);

export default router;