import express from "express";
import garansiController from "./garansi.controller.js";
import authMiddleware from "../../middleware/auth.middleware.js";
import authorize from "../../middleware/role.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import {
    createGaransiSchema,
    updateGaransiSchema
} from "./garansi.validation.js";

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    authorize("admin"),
    validate(createGaransiSchema),
    garansiController.create
);

router.get(
    "/",
    authMiddleware,
    authorize("admin"),
    garansiController.getAll
);

// PENTING: /search harus didaftar SEBELUM /:id,
// kalau kebalik Express bakal nganggep "search" itu isi dari :id
router.get(
    "/search",
    authMiddleware,
    authorize("admin"),
    garansiController.search
);

router.get(
    "/:id",
    authMiddleware,
    authorize("admin"),
    garansiController.getById
);

router.put(
    "/:id",
    authMiddleware,
    authorize("admin"),
    validate(updateGaransiSchema),
    garansiController.update
);

router.delete(
    "/:id",
    authMiddleware,
    authorize("admin"),
    garansiController.remove
);

export default router;