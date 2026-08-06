import Product from "./product.model.js";

import makeSlug from "../../utils/slug.js";
import ApiError from "../../utils/ApiError.js";
import findDocumentOrThrow from "../../utils/findDocumentOrThrow.js";
import queryBuilder from "../../utils/queryBuilder.js";
import paginate from "../../utils/paginate.js";
import Category from "../category/category.model.js";
import deleteFromR2 from "../../utils/deleteFromR2.js";

const getR2Key = (url = "") => {

    if (!url) return "";

    return url.replace(

        `${process.env.R2_PUBLIC_URL}/`,

        ""

    );

};


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

            thumbnail:
                payload.images?.[0] ?? "",

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

    // ==========================
    // Active / Trash Filter
    // ==========================

    if (query.isActive !== undefined) {

        filter.isActive = query.isActive === "true";

    } 

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

const getPublic = async (query) => {

    const {

        page,

        limit,

        skip,

        filter,

        sort

    } = queryBuilder(query, {

        searchableFields: [

            "name",

            "description"

        ]

    });

    // Hanya tampilkan produk aktif
    filter.isActive = true;

    // ===========================
    // CATEGORY FILTER (SLUG)
    // ===========================

    if (query.category) {

        const category = await Category.findOne({

            slug: query.category,

            isActive: true

        });

        if (!category) {

            return {

                items: [],

                pagination: paginate({

                    page,

                    limit,

                    totalItems: 0

                })

            };

        }

        filter.category = category._id;

    }

    // ===========================
    // PRICE FILTER
    // ===========================

    if (query.minPrice || query.maxPrice) {

        filter.minPrice = {};

        if (query.minPrice) {

            filter.minPrice.$gte = Number(query.minPrice);

        }

        if (query.maxPrice) {

            filter.minPrice.$lte = Number(query.maxPrice);

        }

    }

    // ===========================
    // SORTING
    // ===========================

    let publicSort = sort;

    switch (query.sort) {

        case "newest":

            publicSort = {

                createdAt: -1

            };

            break;

        case "oldest":

            publicSort = {

                createdAt: 1

            };

            break;

        case "price_asc":

            publicSort = {

                minPrice: 1

            };

            break;

        case "price_desc":

            publicSort = {

                minPrice: -1

            };

            break;

        case "name_asc":

            publicSort = {

                name: 1

            };

            break;

        case "name_desc":

            publicSort = {

                name: -1

            };

            break;

    }

    // ===========================
    // QUERY
    // ===========================

    const totalItems = await Product.countDocuments(filter);

    const items = await Product.find(filter)

        .populate("category", "name slug")

        .sort(publicSort)

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

const getPublicBySlug = async (slug) => {

    const product = await Product.findOne({

        slug,

        isActive: true

    }).populate(

        "category",

        "name slug"

    );

    if (!product) {

        throw new ApiError(

            404,

            "Product not found"

        );

    }

    return product;

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

    const oldVideo = product.video;

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
        // Images
        // ==========================

        if (uploadedImages.length > 0) {

            payload.images = [

                ...product.images,

                ...uploadedImages

            ];

            if (!product.thumbnail) {

                payload.thumbnail =
                    uploadedImages[0];

            }

        } else {

            delete payload.images;

        }

        // ==========================
        // Video
        // ==========================

        if (!uploadedVideo) {

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

        // ==========================
        // Delete old video AFTER success
        // ==========================

        if (

            uploadedVideo &&
            oldVideo &&
            oldVideo !== uploadedVideo

        ) {

            await deleteFromR2(

                getR2Key(oldVideo)

            );

        }

        return product;

    } catch (error) {

        // ==========================
        // Rollback uploaded images
        // ==========================

        for (const image of uploadedImages) {

            await deleteFromR2(

                getR2Key(image)

            );

        }

        // ==========================
        // Rollback uploaded video
        // ==========================

        if (uploadedVideo) {

            await deleteFromR2(

                getR2Key(uploadedVideo)

            );

        }

        throw error;

    }

};

const removeImage = async (

    productId,

    index

) => {

    const product =
        await findDocumentOrThrow(

            Product,

            productId,

            "Product not found"

        );

    if (

        index < 0 ||

        index >= product.images.length

    ) {

        throw new ApiError(

            404,

            "Image not found"

        );

    }

    const image =
        product.images[index];

    product.images.splice(index, 1);

    if (product.thumbnail === image) {

        product.thumbnail =
            product.images[0] || "";

    }

    await product.save();

    await deleteFromR2(

        getR2Key(image)

    );

    return product;

};

const replaceImage = async (

    productId,

    index,

    newImage

) => {

    const product =
        await findDocumentOrThrow(

            Product,

            productId,

            "Product not found"

        );

    if (

        index < 0 ||

        index >= product.images.length

    ) {

        // rollback image baru
        await deleteFromR2(

            getR2Key(newImage)

        );

        throw new ApiError(

            404,

            "Image not found"

        );

    }

    const oldImage =
        product.images[index];

    product.images[index] =
        newImage;

    if (

        product.thumbnail === oldImage

    ) {

        product.thumbnail =
            newImage;

    }

    await product.save();

    await deleteFromR2(

        getR2Key(oldImage)

    );

    return product;

};

const setThumbnail = async (

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

    product.thumbnail = imageName;

    await product.save();

    return product;

};

const reorderImages = async (

    productId,

    images

) => {

    const product =
        await findDocumentOrThrow(

            Product,

            productId,

            "Product not found"

        );

    // jumlah gambar harus sama
    if (

        images.length !== product.images.length

    ) {

        throw new ApiError(

            400,

            "Invalid image list"

        );

    }

    // semua gambar harus ada
    const isValid = images.every(

        image => product.images.includes(image)

    );

    if (!isValid) {

        throw new ApiError(

            400,

            "Invalid image list"

        );

    }

    product.images = images;

    // kalau thumbnail hilang (harusnya nggak mungkin)
    if (

        product.thumbnail &&
        !images.includes(product.thumbnail)

    ) {

        product.thumbnail = images[0] ?? "";

    }

    await product.save();

    return product;

};

const bulkDelete = async (ids) => {
    if (!Array.isArray(ids) || ids.length === 0) {
        throw new ApiError(
            400,
            "Product ids are required"
        );
    }

    for (const id of ids) {
        await permanentDelete(id);
    }

    return {
        deleted: ids.length
    };
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

    const oldVideo =
        product.video;

    product.video = "";

    await product.save();

    await deleteFromR2(

        getR2Key(oldVideo)

    );

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

const permanentDelete = async (productId) => {

    const product =
        await findDocumentOrThrow(

            Product,

            productId,

            "Product not found"

        );

    // ==========================
    // Delete Images
    // ==========================

    for (const image of product.images) {

        await deleteFromR2(

            getR2Key(image)

        );

    }

    // ==========================
    // Delete Video
    // ==========================

    if (product.video) {

        await deleteFromR2(

            getR2Key(product.video)

        );

    }

    // ==========================
    // Delete Product
    // ==========================

    await Product.findByIdAndDelete(

        productId

    );

};

export default {

    create,

    getAll,

    getById,

    update,

    bulkDelete, 

    removeImage,

    replaceImage,

    setThumbnail,

    reorderImages,

    removeVideo,

    remove,

    restore,
    
    permanentDelete,

    getPublic,

    getPublicBySlug

};