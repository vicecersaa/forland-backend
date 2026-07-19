import { Router } from "express";

import categoryController from "./category.controller.js";

import authMiddleware from "../../middleware/auth.middleware.js";
import authorize from "../../middleware/role.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import upload from "../../middleware/upload.middleware.js";


import {
    createCategorySchema,
    updateCategorySchema
} from "./category.validation.js";

const router = Router();

router.post(
    "/",
    authMiddleware,
    authorize("admin"),

    upload([
        {
            field: "image",
            folder: "categories",
            maxCount: 1,
            type: "image"
        }
    ]),

    validate(createCategorySchema),

    categoryController.create
);

router.get(
    "/",
    authMiddleware,
    authorize("admin"),
    categoryController.getAll
);

router.get(
    "/:id",
    authMiddleware,
    authorize("admin"),
    categoryController.getById
);

router.put(
    "/:id",
    authMiddleware,
    authorize("admin"),

    upload([
        {
            field: "image",
            folder: "categories",
            maxCount: 1,
            type: "image"
        }
    ]),

    validate(updateCategorySchema),

    categoryController.update
);

router.delete(
    "/:id",
    authMiddleware,
    authorize("admin"),
    categoryController.remove
);

router.patch(
    "/:id/restore",
    authMiddleware,
    authorize("admin"),
    categoryController.restore
);

export default router;