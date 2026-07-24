import { Router } from "express";


import cartController from "./cart.controller.js";

import authMiddleware from "../../middleware/auth.middleware.js";

import validate from "../../middleware/validate.middleware.js";


import {

    addCartSchema,

    updateCartSchema

} from "./cart.validation.js";



const router = Router();



router.use(
    authMiddleware
);



router.get(

    "/",

    cartController.getCart

);



router.post(

    "/",

    validate(addCartSchema),

    cartController.addItem

);



router.patch(

    "/:productId",

    validate(updateCartSchema),

    cartController.updateQuantity

);



router.delete(

    "/:productId",

    cartController.removeItem

);



router.delete(

    "/",

    cartController.clearCart

);



export default router;