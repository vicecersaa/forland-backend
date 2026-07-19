import productService from "./product.service.js";

import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";

import deleteUploadedFiles from "../../utils/deleteUploadedFiles.js";

const create = asyncHandler(async (req, res) => {

    const images =
        req.files?.images?.map(
            file => file.filename
        ) ?? [];

    const video =
        req.files?.video?.[0]?.filename ?? "";

    try {

        const result =
            await productService.create({

                ...req.body,

                images,

                video

            });

        ApiResponse.success(

            res,

            result,

            "Product created successfully",

            201

        );

    } catch (error) {

        deleteUploadedFiles(req.files);

        throw error;

    }

});

const getAll = asyncHandler(async (req, res) => {

    const result =
        await productService.getAll(req.query);

    ApiResponse.success(

        res,

        result,

        "Products fetched successfully"

    );

});

const getById = asyncHandler(async (req, res) => {

    const result =
        await productService.getById(
            req.params.id
        );

    ApiResponse.success(

        res,

        result,

        "Product fetched successfully"

    );

});

const update = asyncHandler(async (req, res) => {

    const images =
        req.files?.images?.map(
            file => file.filename
        ) ?? [];

    const video =
        req.files?.video?.[0]?.filename ?? null;

    try {

        const result =
            await productService.update(

                req.params.id,

                {

                    ...req.body,

                    images,

                    video

                }

            );

        ApiResponse.success(

            res,

            result,

            "Product updated successfully"

        );

    } catch (error) {

        deleteUploadedFiles(req.files);

        throw error;

    }

});

const remove = asyncHandler(async (req, res) => {

    const result =
        await productService.remove(
            req.params.id
        );

    ApiResponse.success(

        res,

        result,

        "Product deleted successfully"

    );

});

const restore = asyncHandler(async (req, res) => {

    const result =
        await productService.restore(
            req.params.id
        );

    ApiResponse.success(

        res,

        result,

        "Product restored successfully"

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