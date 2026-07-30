import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import ApiError from "../../utils/ApiError.js";

import homepageService from "./homepage.service.js";

import uploadToR2 from "../../utils/uploadToR2.js";
import deleteFromR2 from "../../utils/deleteFromR2.js";

const getR2Key = (url = "") => {

    if (!url) return "";

    return url.replace(
        `${process.env.R2_PUBLIC_URL}/`,
        ""
    );

};

// =====================
// Upload satu file ke R2 dan catat key-nya (buat rollback kalau gagal)
// =====================

const uploadOne = async (file, folder, uploadedKeys) => {

    const result = await uploadToR2(
        file.buffer,
        file.originalname,
        file.mimetype,
        folder
    );

    uploadedKeys.push(result.key);

    return result.url;

};

// =====================
// Resolve satu slot gambar:
// - value === null  -> ada file baru diunggah di field `fieldName`, upload ke R2
// - value === string -> gambar lama, tidak berubah
// =====================

const resolveImage = async (value, files, fieldName, folder, uploadedKeys) => {

    if (value !== null) {
        return value || "";
    }

    const file = files?.[fieldName]?.[0];

    if (!file) {
        return "";
    }

    return await uploadOne(file, folder, uploadedKeys);

};

// =====================
// GET PUBLIC
// =====================

const getPublic = asyncHandler(async (req, res) => {

    const result = await homepageService.getPublic();

    ApiResponse.success(
        res,
        result,
        "Homepage content fetched successfully"
    );

});

// =====================
// GET ADMIN
// =====================

const getAdmin = asyncHandler(async (req, res) => {

    const result = await homepageService.getAdmin();

    ApiResponse.success(
        res,
        result,
        "Homepage content fetched successfully"
    );

});

// =====================
// UPDATE
// =====================

const update = asyncHandler(async (req, res) => {

    let content;

    try {
        content = JSON.parse(req.body.content || "{}");
    } catch {
        throw new ApiError(400, "Format content tidak valid");
    }

    const files = req.files || {};
    const uploadedKeys = [];

    try {

        // --- Hero ---
        content.hero = content.hero || {};
        content.hero.image = await resolveImage(
            content.hero.image,
            files,
            "heroImage",
            "homepage/hero",
            uploadedKeys
        );

        // --- Promo Cards ---
        content.promoCards = await Promise.all(
            (content.promoCards || []).map(async (card, i) => ({
                ...card,
                image: await resolveImage(
                    card.image,
                    files,
                    `promoImage${i}`,
                    "homepage/promo",
                    uploadedKeys
                ),
            }))
        );

        // --- Collection ---
        content.collection = content.collection || {};
        content.collection.items = await Promise.all(
            (content.collection.items || []).map(async (item, i) => ({
                ...item,
                image: await resolveImage(
                    item.image,
                    files,
                    `collectionImage${i}`,
                    "homepage/collection",
                    uploadedKeys
                ),
            }))
        );

        // --- Philosophy ---
        content.philosophy = content.philosophy || {};
        content.philosophy.image = await resolveImage(
            content.philosophy.image,
            files,
            "philosophyImage",
            "homepage/philosophy",
            uploadedKeys
        );

        // --- Craftsmanship ---
        content.craftsmanship = content.craftsmanship || {};
        content.craftsmanship.image = await resolveImage(
            content.craftsmanship.image,
            files,
            "craftImage",
            "homepage/craftsmanship",
            uploadedKeys
        );

        // --- Material Study ---
        content.materialStudy = content.materialStudy || {};
        content.materialStudy.image = await resolveImage(
            content.materialStudy.image,
            files,
            "materialImage",
            "homepage/material-study",
            uploadedKeys
        );

        // --- Gallery ---
        content.gallery = content.gallery || {};
        content.gallery.images = await Promise.all(
            (content.gallery.images || []).map((img, i) =>
                resolveImage(
                    img,
                    files,
                    `galleryImage${i}`,
                    "homepage/gallery",
                    uploadedKeys
                )
            )
        );

        const result = await homepageService.update(content);

        // Hapus gambar lama yang sudah diganti/dihapus dari form
        for (const oldUrl of result.removedImages) {
            await deleteFromR2(getR2Key(oldUrl));
        }

        ApiResponse.success(
            res,
            result.homepage,
            "Homepage content updated successfully"
        );

    } catch (error) {

        // Rollback: hapus semua file yang sudah kadung diupload di request ini
        for (const key of uploadedKeys) {
            await deleteFromR2(key);
        }

        throw error;

    }

});

export default {
    getPublic,
    getAdmin,
    update,
};
