import { Router } from "express";

import productController from "./product.controller.js";

const router = Router();

router.get(
    "/",
    productController.getPublic
);

router.get(
    "/:slug",
    productController.getPublicBySlug
);

export default router;