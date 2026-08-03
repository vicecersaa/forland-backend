import express from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import garansiController from "./garansi.controller.js";

const router = express.Router();

router.get(
  "/search",
  authMiddleware,
  garansiController.search
);

export default router;