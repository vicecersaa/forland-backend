import { Router } from "express";

import authRoute from "../modules/auth/auth.route.js";
import adminRoute from "../modules/admin/admin.route.js";
import categoryRoute from "../modules/category/category.route.js";
import categoryPublicRoute from "../modules/category/category.public.route.js";
import productRoute from "../modules/product/product.route.js";
import orderRoute from "../modules/order/order.route.js";
import dashboardRoute from "../modules/dashboard/dashboard.route.js";
import couponRoute from "../modules/coupon/coupon.route.js";
import bannerRoute from "../modules/banner/banner.route.js";
import bannerPublicRoute from "../modules/banner/banner.public.route.js";
import productPublicRoute from "../modules/product/product.public.route.js";
import homepageRoute from "../modules/homepage/homepage.route.js";
import homepagePublicRoute from "../modules/homepage/homepage.public.route.js";
import garansiPublicRoute from "../modules/garansi/garansi.public.route.js";
import orderMeRoute from "../modules/order/order.me.route.js";
import checkoutRoute from "../modules/checkout/checkout.route.js";
import cartRoute from "../modules/cart/cart.route.js";
import paymentRoute from "../modules/payment/payment.route.js";
import garansiRoute from "../modules/garansi/garansi.route.js";
import orderPublicRoute from "../modules/order/order.public.route.js";


const router = Router();

router.get("/", (req, res) => {

    res.json({
        success: true,
        message: "Forland API Running"
    });

});

router.use("/auth", authRoute);

router.use("/admin/categories", categoryRoute);

router.use("/categories", categoryPublicRoute);

router.use("/admin/products", productRoute);

router.use("/products", productPublicRoute);

router.use("/admin/orders", orderRoute);

router.use("/admin/coupons", couponRoute);

router.use("/admin/banners", bannerRoute);

router.use("/banners", bannerPublicRoute);

router.use("/admin/dashboard", dashboardRoute);

router.use("/orders/my", orderMeRoute);

router.use("/checkout", checkoutRoute);

router.use("/payment", paymentRoute);

router.use("/cart", cartRoute);

router.use("/admin/warranty", garansiRoute);

router.use("/admin/homepage", homepageRoute);

router.use("/homepage", homepagePublicRoute);

router.use("/warranty", garansiPublicRoute);

router.use("/orders", orderPublicRoute);

router.use("/coupons", couponPublicRoute);

export default router;