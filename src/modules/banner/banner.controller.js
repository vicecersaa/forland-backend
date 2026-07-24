import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import deleteUploadedFiles from "../../utils/deleteUploadedFiles.js";
import bannerService from "./banner.service.js";
import deleteFile from "../../utils/deleteFile.js";

const create = asyncHandler(async (req, res) => {

    try {

        const image =
            req.files?.image?.[0]?.filename || "";

        const result =
            await bannerService.create({

                ...req.body,

                image

            });

        ApiResponse.success(

            res,

            result,

            "Banner created successfully",

            201

        );

    } catch (error) {

        deleteUploadedFiles(req.files);

        throw error;

    }

});

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



const getPublic = asyncHandler(async (req, res) => {

    const result = await bannerService.getPublic();

    ApiResponse.success(

        res,

        result,

        "Banners fetched successfully"

    );

});

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

const update = asyncHandler(async (req, res) => {

    const newImage =
        req.files?.image?.[0]?.filename;

    try {

        const result =
            await bannerService.update(

                req.params.id,

                {

                    ...req.body,

                    ...(newImage && {

                        image: newImage

                    })

                }

            );

        if (

            newImage &&

            result.oldImage

        ) {

            deleteFile(

                "banners",

                result.oldImage

            );

        }

        ApiResponse.success(

            res,

            result.banner,

            "Banner updated successfully"

        );

    } catch (error) {

        deleteUploadedFiles(req.files);

        throw error;

    }

});

const remove = asyncHandler(async (req, res) => {

    const result =
        await bannerService.remove(

            req.params.id

        );

    if (result.oldImage) {

        deleteFile(

            "banners",

            result.oldImage

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