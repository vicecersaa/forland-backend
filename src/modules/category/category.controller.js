import categoryService from "./category.service.js";

import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";

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

        "categories"

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

        const result = await categoryService.create({

            ...req.body,

            image: uploaded.image

        });

        ApiResponse.success(

            res,

            result,

            "Category created successfully",

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

    const result = await categoryService.getAll(req.query);

    ApiResponse.success(

        res,

        result,

        "Categories fetched successfully"

    );

});

// =====================
// GET BY ID
// =====================

const getById = asyncHandler(async (req, res) => {

    const result = await categoryService.getById(

        req.params.id

    );

    ApiResponse.success(

        res,

        result,

        "Category fetched successfully"

    );

});

// =====================
// UPDATE
// =====================

const update = asyncHandler(async (req, res) => {

    let uploaded = null;

    try {

        uploaded = await uploadImageToR2(req.files);

        const result = await categoryService.update(

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

            result.category,

            "Category updated successfully"

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

    const result = await categoryService.remove(

        req.params.id

    );

    ApiResponse.success(

        res,

        result,

        "Category deleted successfully"

    );

});

// =====================
// RESTORE
// =====================

const restore = asyncHandler(async (req, res) => {

    const result = await categoryService.restore(

        req.params.id

    );

    ApiResponse.success(

        res,

        result,

        "Category restored successfully"

    );

});

export default {

    create,

    getAll,

    getById,

    update,

    remove,

    restore

};