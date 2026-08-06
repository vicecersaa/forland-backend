import productService from "./product.service.js";

import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";

import deleteUploadedFiles from "../../utils/deleteUploadedFiles.js";
import uploadToR2 from "../../utils/uploadToR2.js";
import deleteFromR2 from "../../utils/deleteFromR2.js";
import ApiError from "../../utils/ApiError.js";


const uploadFilesToR2 = async (files = {}) => {

    const uploaded = {
        images: [],
        imageKeys: [],

        variantImages: [],
        
        video: "",
        videoKey: null
    };


    if (files.images) {

        for (const file of files.images) {

            const result =
                await uploadToR2(
                    file.buffer,
                    file.originalname,
                    file.mimetype,
                    "products/images"
                );

            uploaded.images.push(result.url);
            uploaded.imageKeys.push(result.key);
        }
    }


    // =====================
    // VARIANT IMAGES
    // =====================

    if (files.variantImages) {

        for (const file of files.variantImages) {

            const result =
                await uploadToR2(
                    file.buffer,
                    file.originalname,
                    file.mimetype,
                    "products/variants"
                );


            uploaded.variantImages.push({
                url: result.url,
                key: result.key
            });

        }

    }


    if (files.video?.[0]) {

        const file = files.video[0];

        const result =
            await uploadToR2(
                file.buffer,
                file.originalname,
                file.mimetype,
                "products/videos"
            );


        uploaded.video = result.url;
        uploaded.videoKey = result.key;

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



        let variants = [];

if (req.body.variants) {

    variants = JSON.parse(req.body.variants);

}


variants = variants.map((variant, index)=>{

    const image =
        uploaded.variantImages[index];


    return {

        ...variant,

        image: image?.url || "",
        imageKey: image?.key || ""

    };

});


const result =
    await productService.create({

        ...req.body,

        variants,

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

const setVariantImage = asyncHandler(async (req, res) => {
    const image = req.files?.images?.[0];

    if (!image) throw new ApiError(400, "Image is required");

    const uploaded = await uploadToR2(
        image.buffer,
        image.originalname,
        image.mimetype,
        "products/variants"
    );

    const result = await productService.setVariantImage(
        req.params.id,
        Number(req.params.variantIndex),
        uploaded.url,
        uploaded.key
    );

    ApiResponse.success(res, result, "Variant image updated successfully");
});

const removeVariantImage = asyncHandler(async (req, res) => {
    const result = await productService.removeVariantImage(
        req.params.id,
        Number(req.params.variantIndex)
    );

    ApiResponse.success(res, result, "Variant image deleted successfully");
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


        let updateData = {
            ...req.body
        };


        // =====================
        // VARIANTS
        // =====================

        if(req.body.variants){

            let variants =
                JSON.parse(req.body.variants);


            let imageIndex = 0;

variants = variants.map((variant)=>{

    let image = null;


    if (uploaded.variantImages[imageIndex]) {

        image = uploaded.variantImages[imageIndex];

        imageIndex++;

    }


    return {

        ...variant,

        image:
            image?.url ||
            variant.image ||
            "",


        imageKey:
            image?.key ||
            variant.imageKey ||
            ""

    };

});


            updateData.variants = variants;

        }



        // =====================
        // PRODUCT IMAGES
        // =====================

        if(uploaded.images.length > 0){

            updateData.images =
                uploaded.images;

        }



        // =====================
        // VIDEO
        // =====================

        if(uploaded.video){

            updateData.video =
                uploaded.video;

        }



        const result =
            await productService.update(

                req.params.id,

                updateData

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

const removeImage = asyncHandler(async (req, res) => {

    const result =
        await productService.removeImage(

            req.params.id,

            Number(req.params.index)

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

        Number(req.params.index),

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

    getPublicBySlug,

    setVariantImage,
    
    removeVariantImage,


};