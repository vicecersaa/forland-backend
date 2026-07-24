import productService from "./product.service.js";

import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";

import deleteUploadedFiles from "../../utils/deleteUploadedFiles.js";
import uploadToR2 from "../../utils/uploadToR2.js";
import deleteFromR2 from "../../utils/deleteFromR2.js";


const uploadFilesToR2 = async (files = {}) => {

    const uploaded = {

        images: [],
        imageKeys: [],

        video: "",
        videoKey: null

    };


    // =====================
    // IMAGES
    // =====================

    if (files.images) {

        for (const file of files.images) {

            const result =
                await uploadToR2(
                    file.buffer,
                    file.originalname,
                    file.mimetype,
                    "products/images"
                );


            uploaded.images.push(
                result.url
            );


            uploaded.imageKeys.push(
                result.key
            );

        }

    }


    // =====================
    // VIDEO
    // =====================

    if (files.video?.[0]) {

        const file =
            files.video[0];


        const result =
            await uploadToR2(
                file.buffer,
                file.originalname,
                file.mimetype,
                "products/videos"
            );


        uploaded.video =
            result.url;


        uploaded.videoKey =
            result.key;

    }


    return uploaded;

};




// =====================
// CREATE
// =====================

const create = asyncHandler(async (req,res)=>{

    let uploaded = null;


    try {


        uploaded =
            await uploadFilesToR2(
                req.files
            );



        const result =
            await productService.create({

                ...req.body,

                images:
                    uploaded.images,

                video:
                    uploaded.video

            });



        ApiResponse.success(

            res,

            result,

            "Product created successfully",

            201

        );


    } catch(error){


        if(uploaded){

            for(const key of uploaded.imageKeys){

                await deleteFromR2(key);

            }


            if(uploaded.videoKey){

                await deleteFromR2(
                    uploaded.videoKey
                );

            }

        }


        throw error;


    }


});




// =====================
// GET ALL ADMIN
// =====================

const getAll = asyncHandler(async(req,res)=>{


    const result =
        await productService.getAll(
            req.query
        );


    ApiResponse.success(

        res,

        result,

        "Products fetched successfully"

    );


});




// =====================
// GET BY ID
// =====================

const getById = asyncHandler(async(req,res)=>{


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




// =====================
// PUBLIC
// =====================

const getPublic = asyncHandler(async(req,res)=>{


    const result =
        await productService.getPublic(
            req.query
        );


    ApiResponse.success(

        res,

        result,

        "Products fetched successfully"

    );


});



const getPublicBySlug = asyncHandler(async(req,res)=>{


    const result =
        await productService.getPublicBySlug(
            req.params.slug
        );


    ApiResponse.success(

        res,

        result,

        "Product fetched successfully"

    );


});




// =====================
// UPDATE
// =====================

const update = asyncHandler(async(req,res)=>{


    try {


        const uploaded =
            await uploadFilesToR2(
                req.files
            );



        const result =
            await productService.update(

                req.params.id,

                {

                    ...req.body,


                    ...(uploaded.images.length > 0 && {

                        images:
                            uploaded.images

                    }),



                    ...(uploaded.video && {

                        video:
                            uploaded.video

                    })

                }

            );



        ApiResponse.success(

            res,

            result,

            "Product updated successfully"

        );


    } catch(error){


        await deleteUploadedFiles(
            req.files
        );


        throw error;


    }


});




// =====================
// DELETE IMAGE
// =====================

const removeImage = asyncHandler(async(req,res)=>{


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




// =====================
// REPLACE IMAGE
// =====================

const replaceImage = asyncHandler(async(req,res)=>{


    const image =
        req.files?.images?.[0];


    if(!image){

        throw new Error(
            "Image is required"
        );

    }



    const uploaded =
        await uploadToR2(

            image.buffer,

            image.originalname,

            image.mimetype,

            "products/images"

        );



    const result =
        await productService.replaceImage(

            req.params.id,

            req.params.image,

            uploaded.url

        );



    ApiResponse.success(

        res,

        result,

        "Image replaced successfully"

    );


});




// =====================
// SET THUMBNAIL
// =====================

const setThumbnail = asyncHandler(async(req,res)=>{


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




// =====================
// REORDER IMAGE
// =====================

const reorderImages = asyncHandler(async(req,res)=>{


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




// =====================
// BULK DELETE
// =====================

const bulkDelete = asyncHandler(async(req,res)=>{


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




// =====================
// REMOVE VIDEO
// =====================

const removeVideo = asyncHandler(async(req,res)=>{


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




// =====================
// SOFT DELETE
// =====================

const remove = asyncHandler(async(req,res)=>{


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




// =====================
// RESTORE
// =====================

const restore = asyncHandler(async(req,res)=>{


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




// =====================
// PERMANENT DELETE
// =====================

const permanentDelete = asyncHandler(async(req,res)=>{


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

    replaceImage,

    setThumbnail,

    reorderImages,

    bulkDelete,

    removeVideo,

    remove,

    restore,

    permanentDelete,

    getPublic,

    getPublicBySlug


};