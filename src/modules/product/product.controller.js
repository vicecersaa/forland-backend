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

const removeImage = asyncHandler(async (req, res) => {

    const result =
        await productService.removeImage(

            req.params.id,

            req.params.image

        );

    ApiResponse.success(

        res,

        result,

        "Image deleted successfully"

    );

});

const replaceImage = asyncHandler(async (req, res) => {

    const image =
        req.files?.images?.[0];

    if (!image) {

        throw new Error("Image is required");

    }

    try {

        const result =
            await productService.replaceImage(

                req.params.id,

                req.params.image,

                image.filename

            );

        ApiResponse.success(

            res,

            result,

            "Image replaced successfully"

        );

    } catch (error) {

        deleteUploadedFiles(req.files);

        throw error;

    }

});

const setThumbnail = asyncHandler(async (req, res) => {

    const result =
        await productService.setThumbnail(

            req.params.id,

            req.params.image

        );

    ApiResponse.success(

        res,

        result,

        "Thumbnail updated successfully"

    );

});

const reorderImages = asyncHandler(async (req, res) => {

    const result =
        await productService.reorderImages(

            req.params.id,

            req.body.images

        );

    ApiResponse.success(

        res,

        result,

        "Images reordered successfully"

    );

});

const bulkDelete = asyncHandler(async (req, res) => {

    const result =

        await productService.bulkDelete(

            req.body.ids

        );

    ApiResponse.success(

        res,

        result,

        "Products deleted successfully"

    );

});

const removeVideo = asyncHandler(async (req, res) => {

    const result =
        await productService.removeVideo(

            req.params.id

        );

    ApiResponse.success(

        res,

        result,

        "Video deleted successfully"

    );

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

const permanentDelete = asyncHandler(async (req, res) => {

    await productService.permanentDelete(

        req.params.id

    );

    ApiResponse.success(

        res,

        null,

        "Product permanently deleted"

    );

});

export default {

    create,

    getAll,

    getById,

    update,

    removeImage,

    setThumbnail,

    reorderImages,

    bulkDelete,

    replaceImage,

    removeVideo,

    remove,

    restore,

    permanentDelete
};