import makeSlug from "../../utils/slug.js";
import Category from "./category.model.js";
import ApiError from "../../utils/ApiError.js";
import queryBuilder from "../../utils/queryBuilder.js";
import paginate from "../../utils/paginate.js";
import findDocumentOrThrow from "../../utils/findDocumentOrThrow.js";

const create = async (payload) => {

    const existingCategory = await Category.findOne({
        name: payload.name
    });

    if (existingCategory) {
        throw new ApiError(409, "Category already exists");
    }

    const slug = makeSlug(payload.name);

    const category = await Category.create({
        ...payload,
        slug
    });

    return category;
};

const getAll = async (query) => {

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
        ],

        defaultSort: {
            sortOrder: 1
        }

    });

    const totalItems =
        await Category.countDocuments(filter);

    const items = await Category.find(filter)
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

    const category = await findDocumentOrThrow(
    Category,
    id,
    "Category not found"
);

    return category;

};

const update = async (id, payload) => {

    const category = await findDocumentOrThrow(
        Category,
        id,
        "Category not found"
    );

    // Simpan gambar lama DULU
    const oldImage = category.image;

    // kalau name diubah
    if (
        payload.name &&
        payload.name !== category.name
    ) {

        const exists = await Category.findOne({
            name: payload.name
        });

        if (exists) {
            throw new ApiError(
                409,
                "Category already exists"
            );
        }

        payload.slug = makeSlug(payload.name);
    }

    Object.assign(category, payload);

    await category.save();

    return {
        category,
        oldImage
    };

};

const remove = async (id) => {

    const category = await findDocumentOrThrow(
    Category,
    id,
    "Category not found"
);

    if (!category.isActive) {
        throw new ApiError(400, "Category already deleted");
    }

    category.isActive = false;

    await category.save();

    return category;

};

const restore = async (id) => {

    const category = await findDocumentOrThrow(
    Category,
    id,
    "Category not found"
);

    if (category.isActive) {
        throw new ApiError(400, "Category is already active");
    }

    category.isActive = true;

    await category.save();

    return category;

};

export default {
    create,
    getAll,
    getById,
    update,
    remove,
    restore
};