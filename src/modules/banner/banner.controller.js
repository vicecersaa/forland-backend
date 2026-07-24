import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";

import bannerService from "./banner.service.js";

import uploadToR2 from "../../utils/uploadToR2.js";
import deleteFromR2 from "../../utils/deleteFromR2.js";

const uploadImageToR2 = async (files = {}) => {

    if (!files.image?.[0]) {

        return {

            image: "",
            imageKey: null

        };

    }

    const file = files.image[0];

    const result = await uploadToR2(

        file.buffer,

        file.originalname,

        file.mimetype,

        "banners"

    );

    return {

        image: result.url,

        imageKey: result.key

    };

};

const getR2Key = (url = "") => {

    if (!url) return "";

    return url.replace(

        `${process.env.R2_PUBLIC_URL}/`,

        ""

    );

};

// =====================
// CREATE
// =====================

const create = asyncHandler(async (req, res) => {

    let uploaded = null;

    try {

        uploaded = await uploadImageToR2(req.files);

        const result = await bannerService.create({

            ...req.body,

            image: uploaded.image

        });

        ApiResponse.success(

            res,

            result,

            "Banner created successfully",

            201

        );

    } catch (error) {

        if (uploaded?.imageKey) {

            await deleteFromR2(

                uploaded.imageKey

            );

        }

        throw error;

    }

});

// =====================
// GET ALL
// =====================

const getAll = asyncHandler(async (req, res) => {

    const result = await bannerService.getAll(

        req.query

    );

    ApiResponse.success(

        res,

        result,

        "Banners fetched successfully"

    );

});

// =====================
// PUBLIC
// =====================

const getPublic = asyncHandler(async (req, res) => {

    const result = await bannerService.getPublic();

    ApiResponse.success(

        res,

        result,

        "Banners fetched successfully"

    );

});

// =====================
// GET BY ID
// =====================

const getById = asyncHandler(async (req, res) => {

    const result = await bannerService.getById(

        req.params.id

    );

    ApiResponse.success(

        res,

        result,

        "Banner fetched successfully"

    );

});

// =====================
// UPDATE
// =====================

const update = asyncHandler(async (req, res) => {

    let uploaded = null;

    try {

        uploaded = await uploadImageToR2(req.files);

        const result = await bannerService.update(

            req.params.id,

            {

                ...req.body,

                ...(uploaded.image && {

                    image: uploaded.image

                })

            }

        );

        if (

            uploaded.image &&

            result.oldImage

        ) {

            await deleteFromR2(

                getR2Key(

                    result.oldImage

                )

            );

        }

        ApiResponse.success(

            res,

            result.banner,

            "Banner updated successfully"

        );

    } catch (error) {

        if (uploaded?.imageKey) {

            await deleteFromR2(

                uploaded.imageKey

            );

        }

        throw error;

    }

});

// =====================
// DELETE
// =====================

const remove = asyncHandler(async (req, res) => {

    const result = await bannerService.remove(

        req.params.id

    );

    if (result.oldImage) {

        await deleteFromR2(

            getR2Key(

                result.oldImage

            )

        );

    }

    ApiResponse.success(

        res,

        null,

        "Banner deleted successfully"

    );

});

export default {

    create,

    getAll,

    getPublic,

    getById,

    update,

    remove

};