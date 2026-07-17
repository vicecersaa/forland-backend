import slugify from "slugify";

import Category from "./category.model.js";
import ApiError from "../../utils/ApiError.js";

const create = async (payload) => {

    const existingCategory = await Category.findOne({
        name: payload.name
    });

    if (existingCategory) {
        throw new ApiError(409, "Category already exists");
    }

    const slug = slugify(payload.name, {
        lower: true,
        strict: true
    });

    const category = await Category.create({
        ...payload,
        slug
    });

    return category;
};

const getAll = async (query) => {

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const skip = (page - 1) * limit;

    const filter = {};

    if (query.search) {
        filter.name = {
            $regex: query.search,
            $options: "i"
        };
    }

    if (query.isActive !== undefined) {
        filter.isActive = query.isActive === "true";
    }

    const sort = {};

    if (query.sort) {

        if (query.sort.startsWith("-")) {

            sort[query.sort.substring(1)] = -1;

        } else {

            sort[query.sort] = 1;

        }

    } else {

        sort.sortOrder = 1;

    }

    const totalItems = await Category.countDocuments(filter);

    const items = await Category.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit);

    return {

        items,

        pagination: {

            page,

            limit,

            totalItems,

            totalPages: Math.ceil(totalItems / limit),

            hasNextPage: page * limit < totalItems,

            hasPrevPage: page > 1

        }

    };

};

const getById = async (id) => {

    const category = await Category.findById(id);

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    return category;

};

export default {
    create,
    getAll,
    getById
};