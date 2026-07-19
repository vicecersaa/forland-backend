import { Router } from "express";

import productController from "./product.controller.js";

import authMiddleware from "../../middleware/auth.middleware.js";
import authorize from "../../middleware/role.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import upload from "../../middleware/upload.middleware.js";
import parseFormData from "../../middleware/parseFormData.middleware.js";

import {
    createProductSchema,
    updateProductSchema
} from "./product.validation.js";

const router = Router();

router.post(

    "/",

    authMiddleware,

    authorize("admin"),

    upload([

        {

            field: "images",

            folder: "products/images",

            maxCount: 10,

            type: "image"

        },

        {

            field: "video",

            folder: "products/videos",

            maxCount: 1,

            type: "video"

        }

    ]),

    parseFormData,

    validate(createProductSchema),

    productController.create

);

router.get(
    "/",
    authMiddleware,
    authorize("admin"),
    productController.getAll
);

router.get(
    "/:id",
    authMiddleware,
    authorize("admin"),
    productController.getById
);

router.put(

    "/:id",

    authMiddleware,

    authorize("admin"),

    upload([

        {

            field: "images",

            folder: "products/images",

            maxCount: 10,

            type: "image"

        },

        {

            field: "video",

            folder: "products/videos",

            maxCount: 1,

            type: "video"

        }

    ]),

    parseFormData,

    validate(updateProductSchema),

    productController.update

);

router.delete(
    "/:id",
    authMiddleware,
    authorize("admin"),
    productController.remove
);

router.patch(
    "/:id/restore",
    authMiddleware,
    authorize("admin"),
    productController.restore
);

export default router;