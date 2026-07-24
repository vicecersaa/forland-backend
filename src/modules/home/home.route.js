import { Router } from "express";

import homeController from "./home.controller.js";

const router = Router();

router.get(

    "/",

    homeController.getHome

);

export default router;