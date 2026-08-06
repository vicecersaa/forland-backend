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

router.post(
    "/:id/variants/:variantIndex/image",
    authMiddleware,
    authorize("admin"),
    upload([
        {
            field: "images",
            folder: "products/variants",
            maxCount: 1,
            type: "image"
        }
    ]),
    productController.setVariantImage
);

router.delete(
    "/:id/variants/:variantIndex/image",
    authMiddleware,
    authorize("admin"),
    productController.removeVariantImage
);

router.patch(

    "/:id/images/reorder",

    authMiddleware,

    authorize("admin"),

    productController.reorderImages

);

router.patch(

    "/:id/images/:index",

    authMiddleware,

    authorize("admin"),

    upload([

        {

            field: "images",

            folder: "products/images",

            maxCount: 1,

            type: "image"

        }

    ]),

    productController.replaceImage

);

router.patch(

    "/:id/thumbnail/:image",

    authMiddleware,

    authorize("admin"),

    productController.setThumbnail

);

router.patch(

    "/:id/restore",

    authMiddleware,

    authorize("admin"),

    productController.restore

);

router.delete(

    "/:id/images/:index",

    authMiddleware,

    authorize("admin"),

    productController.removeImage

);

router.delete(

    "/:id/video",

    authMiddleware,

    authorize("admin"),

    productController.removeVideo

);

router.delete(

    "/:id/permanent",

    authMiddleware,

    authorize("admin"),

    productController.permanentDelete

);

router.delete(

    "/",

    authMiddleware,

    authorize("admin"),

    productController.bulkDelete

);

router.delete(
    "/:id",
    authMiddleware,
    authorize("admin"),
    productController.remove
);





export default router;