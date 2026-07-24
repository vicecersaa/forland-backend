import { Router } from "express";

import checkoutController from "./checkout.controller.js";

import authMiddleware from "../../middleware/auth.middleware.js";
import validate from "../../middleware/validate.middleware.js";

import {
    createCheckoutSchema
} from "./checkout.validation.js";


const router = Router();


router.post(

    "/",

    authMiddleware,

    validate(createCheckoutSchema),

    checkoutController.createCheckout

);


export default router;