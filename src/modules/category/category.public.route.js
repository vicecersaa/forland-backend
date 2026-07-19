import { Router } from "express";
import categoryPublicController from "./category.public.controller.js";

const router = Router();

router.get("/", categoryPublicController.getAll);

router.get("/:slug", categoryPublicController.getBySlug);

export default router;