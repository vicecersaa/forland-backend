import express from "express";

import bannerController from "./banner.controller.js";

import authMiddleware from "../../middleware/auth.middleware.js";
import authorize from "../../middleware/role.middleware.js";
import validate from "../../middleware/validate.middleware.js";

import upload from "../../middleware/upload.middleware.js";

console.log(upload);

import {
    createBannerSchema,
    updateBannerSchema
} from "./banner.validation.js";

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    authorize("admin"),
    upload([
        {
            field: "image",
            folder: "banners",
            type: "image",
            maxCount: 1
        }
    ]),
    validate(createBannerSchema),
    bannerController.create
);

router.put(
    "/:id",
    authMiddleware,
    authorize("admin"),
    upload([
        {
            field: "image",
            folder: "banners",
            type: "image",
            maxCount: 1
        }
    ]),
    validate(updateBannerSchema),
    bannerController.update
);

router.get(
    "/",
    authMiddleware,
    authorize("admin"),
    bannerController.getAll
);

router.get(
    "/:id",
    authMiddleware,
    authorize("admin"),
    bannerController.getById
);



router.delete(
    "/:id",
    authMiddleware,
    authorize("admin"),
    bannerController.remove
);

export default router;