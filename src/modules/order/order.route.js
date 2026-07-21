import { Router } from "express";

import orderController from "./order.controller.js";

import authMiddleware from "../../middleware/auth.middleware.js";
import authorize from "../../middleware/role.middleware.js";
import validate from "../../middleware/validate.middleware.js";

import {

    createOrderSchema

} from "./order.validation.js";

const router = Router();

router.post(

    "/",

    authMiddleware,

    authorize("admin"),

    validate(createOrderSchema),

    orderController.create

);

export default router;