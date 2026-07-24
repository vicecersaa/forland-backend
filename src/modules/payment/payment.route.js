import { Router } from "express";

import paymentController from "./payment.controller.js";

import authMiddleware from "../../middleware/auth.middleware.js";


const router = Router();



router.post(

    "/callback",

    paymentController.callback

);

router.post(

    "/:orderId",

    authMiddleware,

    paymentController.createPayment

);







export default router;