import { Router } from "express";

import authRoute from "../modules/auth/auth.route.js";
import adminRoute from "../modules/admin/admin.route.js";
import categoryRoute from "../modules/category/category.route.js";
import categoryPublicRoute from "../modules/category/category.public.route.js";
import productRoute from "../modules/product/product.route.js";
import orderRoute from "../modules/order/order.route.js";

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

router.use("/categories", categoryPublicRoute);

router.use("/admin/products", productRoute);

router.use("/admin/orders", orderRoute);

export default router;