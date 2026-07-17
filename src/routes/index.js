import { Router } from "express";

import authRoute from "../modules/auth/auth.route.js";
import adminRoute from "../modules/admin/admin.route.js";
import categoryRoute from "../modules/category/category.route.js";

const router = Router();

router.get("/", (req, res) => {

    res.json({
        success: true,
        message: "Forland API Running"
    });

});

router.use("/auth", authRoute);

router.use("/admin", adminRoute);

router.use("/admin/categories", categoryRoute);

export default router;