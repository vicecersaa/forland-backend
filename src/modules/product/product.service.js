import Product from "./product.model.js";

import makeSlug from "../../utils/slug.js";
import ApiError from "../../utils/ApiError.js";
import findDocumentOrThrow from "../../utils/findDocumentOrThrow.js";
import queryBuilder from "../../utils/queryBuilder.js";
import paginate from "../../utils/paginate.js";
import Category from "../category/category.model.js";
import deleteFile from "../../utils/deleteFile.js";


const calculateSummary = (product) => {

    const prices = [];
    let totalStock = 0;

    // Produk tanpa variant
    if (!product.variants || product.variants.length === 0) {

        if (product.price != null) {
            prices.push(product.price);
        }

        totalStock += product.stock ?? 0;

    }

    // Produk dengan variant
    else {

        for (const variant of product.variants) {

            // Variant tanpa size
            if (!variant.sizes || variant.sizes.length === 0) {

                if (variant.price != null) {
                    prices.push(variant.price);
                }

                totalStock += variant.stock ?? 0;

            }

            // Variant dengan size
            else {

                for (const size of variant.sizes) {

                    if (size.price != null) {
                        prices.push(size.price);
                    }

                    totalStock += size.stock ?? 0;

                }

            }

        }

    }

    return {

        minPrice: prices.length ? Math.min(...prices) : 0,

        maxPrice: prices.length ? Math.max(...prices) : 0,

        totalStock

    };

};

const findOrCreateCategory = async (categoryName) => {

    let category = await Category.findOne({

        name: categoryName.trim()

    });

    if (!category) {

        category = await Category.create({

            name: categoryName.trim(),

            slug: makeSlug(categoryName)

        });

    }

    return category;

};

const create = async (payload) => {

    const exists = await Product.findOne({

        name: payload.name

    });

    if (exists) {

        throw new ApiError(

            409,

            "Product already exists"

        );

    }

    const category =
        await findOrCreateCategory(
            payload.category
        );

    const slug =
        makeSlug(payload.name);

    const summary =
        calculateSummary(payload);

    const product =
        await Product.create({

            ...payload,

            category: category._id,

            slug,

            ...summary

        });

    await product.populate("category");

    return product;

};

const getAll = async (query) => {

    const {

        page,

        limit,

        skip,

        filter,

        sort

    } = queryBuilder(

        query,

        {

            searchableFields: [

                "name",

                "description"

            ]

        }

    );

    const totalItems =
        await Product.countDocuments(filter);

    const items =
        await Product.find(filter)

            .populate("category")

            .sort(sort)

            .skip(skip)

            .limit(limit);

    return {

        items,

        pagination: paginate({

            page,

            limit,

            totalItems

        })

    };

};

const getById = async (id) => {

    return await findDocumentOrThrow(

        Product,

        id,

        "Product not found"

    );

};

const update = async (id, payload) => {

    const product = await findDocumentOrThrow(

        Product,

        id,

        "Product not found"

    );

    const uploadedImages = payload.images ?? [];
    const uploadedVideo = payload.video ?? null;

    try {

        // ==========================
        // Duplicate Name
        // ==========================

        if (

            payload.name &&
            payload.name !== product.name

        ) {

            const exists = await Product.findOne({

                name: payload.name,

                _id: { $ne: id }

            });

            if (exists) {

                throw new ApiError(

                    409,

                    "Product already exists"

                );

            }

            payload.slug = makeSlug(payload.name);

        }

        // ==========================
        // Category
        // ==========================

        if (payload.category) {

            const category =
                await findOrCreateCategory(
                    payload.category
                );

            payload.category =
                category._id;

        }

        // ==========================
        // Append Images
        // ==========================

        if (uploadedImages.length > 0) {

            payload.images = [

                ...product.images,

                ...uploadedImages

            ];

        } else {

            delete payload.images;

        }

        // ==========================
        // Replace Video
        // ==========================

        if (uploadedVideo) {

            if (product.video) {

                deleteFile(

                    "products/videos",

                    product.video

                );

            }

            payload.video = uploadedVideo;

        } else {

            delete payload.video;

        }

        // ==========================
        // Assign
        // ==========================

        Object.assign(

            product,

            payload

        );

        // ==========================
        // Recalculate Summary
        // ==========================

        Object.assign(

            product,

            calculateSummary(product)

        );

        await product.save();

        await product.populate("category");

        return product;

    } catch (error) {

        // Rollback image baru

        uploadedImages.forEach(image => {

            deleteFile(

                "products/images",

                image

            );

        });

        // Rollback video baru

        if (uploadedVideo) {

            deleteFile(

                "products/videos",

                uploadedVideo

            );

        }

        throw error;

    }

};

const removeImage = async (

    productId,

    imageName

) => {

    const product =
        await findDocumentOrThrow(

            Product,

            productId,

            "Product not found"

        );

    if (

        !product.images.includes(imageName)

    ) {

        throw new ApiError(

            404,

            "Image not found"

        );

    }

    product.images =
        product.images.filter(

            image => image !== imageName

        );

    deleteFile(

        "products/images",

        imageName

    );

    await product.save();

    return product;

};

const replaceImage = async (

    productId,

    oldImage,

    newImage

) => {

    const product =
        await findDocumentOrThrow(

            Product,

            productId,

            "Product not found"

        );

    const index =
        product.images.indexOf(oldImage);

    if (index === -1) {

        deleteFile(

            "products/images",

            newImage

        );

        throw new ApiError(

            404,

            "Image not found"

        );

    }

    deleteFile(

        "products/images",

        oldImage

    );

    product.images[index] =
        newImage;

    await product.save();

    return product;

};

const removeVideo = async (productId) => {

    const product =
        await findDocumentOrThrow(

            Product,

            productId,

            "Product not found"

        );

    if (!product.video) {

        throw new ApiError(

            404,

            "Video not found"

        );

    }

    deleteFile(

        "products/videos",

        product.video

    );

    product.video = "";

    await product.save();

    return product;

};

const remove = async (id) => {

    const product =
        await findDocumentOrThrow(

            Product,

            id,

            "Product not found"

        );

    if (!product.isActive) {

        throw new ApiError(

            400,

            "Product already deleted"

        );

    }

    product.isActive = false;

    await product.save();

    return product;

};

const restore = async (id) => {

    const product =
        await findDocumentOrThrow(

            Product,

            id,

            "Product not found"

        );

    if (product.isActive) {

        throw new ApiError(

            400,

            "Product is already active"

        );

    }

    product.isActive = true;

    await product.save();

    return product;

};

const permanentDelete = async (id) => {

    const product = await findDocumentOrThrow(

        Product,

        id,

        "Product not found"

    );

    // Hapus semua gambar
    for (const image of product.images) {

        deleteFile(

            "products/images",

            image

        );

    }

    // Hapus video
    if (product.video) {

        deleteFile(

            "products/videos",

            product.video

        );

    }

    await Product.findByIdAndDelete(id);

    return null;

};

export default {

    create,

    getAll,

    getById,

    update,

    removeImage,

    replaceImage,

    removeVideo,

    remove,

    restore,
    
    permanentDelete

};