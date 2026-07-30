import express from "express";

import homepageController from "./homepage.controller.js";

const router = express.Router();

// Mounted di routes/index.js sebagai: router.use("/homepage", homepagePublicRoute)
router.get("/", homepageController.getPublic);

export default router;
