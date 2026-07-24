import { Router } from "express";

import bannerController from "./banner.controller.js";

const router = Router();

router.get(
    "/",
    bannerController.getPublic
);

export default router;