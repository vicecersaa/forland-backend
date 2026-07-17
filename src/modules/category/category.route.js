import { Router } from "express";

import categoryController from "./category.controller.js";

import authMiddleware from "../../middleware/auth.middleware.js";
import authorize from "../../middleware/role.middleware.js";
import validate from "../../middleware/validate.middleware.js";

import {
    createCategorySchema
} from "./category.validation.js";

const router = Router();

router.post(
    "/",
    authMiddleware,
    authorize("admin"),
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

export default router;