import express from "express";

import homepageController from "./homepage.controller.js";

import authMiddleware from "../../middleware/auth.middleware.js";
import authorize from "../../middleware/role.middleware.js";
import upload from "../../middleware/upload.middleware.js";

// TODO (opsional): kalau mau validasi body `content` sebelum masuk
// controller, bikin homepage.validation.js (Joi schema) kayak
// banner.validation.js, lalu pasang `validate(updateHomepageSchema)`
// di route PUT di bawah.
// import { updateHomepageSchema } from "./homepage.validation.js";

const router = express.Router();

// Field gambar dinamis: promoCards, collection.items, dan
// gallery.images jumlahnya bisa berubah-ubah dari admin (beda dari
// Banner yang cuma 1 field "image"), jadi kita siapkan slot field
// secukupnya. Naikkan angkanya kalau butuh slot lebih banyak.
const MAX_PROMO_CARDS = 12;
const MAX_COLLECTION_ITEMS = 12;
const MAX_GALLERY_IMAGES = 24;

const uploadFields = [
    { field: "heroImage", folder: "homepage/hero", type: "image", maxCount: 1 },
    { field: "philosophyImage", folder: "homepage/philosophy", type: "image", maxCount: 1 },
    { field: "craftImage", folder: "homepage/craftsmanship", type: "image", maxCount: 1 },
    { field: "materialImage", folder: "homepage/material-study", type: "image", maxCount: 1 },
    ...Array.from({ length: MAX_PROMO_CARDS }, (_, i) => ({
        field: `promoImage${i}`,
        folder: "homepage/promo",
        type: "image",
        maxCount: 1,
    })),
    ...Array.from({ length: MAX_COLLECTION_ITEMS }, (_, i) => ({
        field: `collectionImage${i}`,
        folder: "homepage/collection",
        type: "image",
        maxCount: 1,
    })),
    ...Array.from({ length: MAX_GALLERY_IMAGES }, (_, i) => ({
        field: `galleryImage${i}`,
        folder: "homepage/gallery",
        type: "image",
        maxCount: 1,
    })),
];

// Mounted di routes/index.js sebagai: router.use("/admin/homepage", homepageRoute)
router.get(
    "/",
    authMiddleware,
    authorize("admin"),
    homepageController.getAdmin
);

router.put(
    "/",
    authMiddleware,
    authorize("admin"),
    upload(uploadFields),
    // validate(updateHomepageSchema),
    homepageController.update
);

export default router;
