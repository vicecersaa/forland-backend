import Banner from "./banner.model.js";

import ApiError from "../../utils/ApiError.js";
import queryBuilder from "../../utils/queryBuilder.js";
import paginate from "../../utils/paginate.js";

const create = async (payload) => {

    if (!payload.image) {

        throw new ApiError(
            400,
            "Banner image is required"
        );

    }

    return await Banner.create(payload);

};

const getAll = async (query) => {

    const {
        page,
        limit,
        skip,
        filter,
        sort
    } = queryBuilder(query);

    const totalItems = await Banner.countDocuments(filter);

    const items = await Banner.find(filter)
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

const getPublic = async () => {

    return await Banner.find({

        isActive: true

    })

    .sort({

        sortOrder: 1

    })

    .select(

        "image link sortOrder"

    );

};

const getById = async (id) => {

    const banner = await Banner.findById(id);

    if (!banner) {

        throw new ApiError(
            404,
            "Banner not found"
        );

    }

    return banner;

};

const update = async (id, payload) => {

    const banner = await Banner.findById(id);

    if (!banner) {

        throw new ApiError(

            404,

            "Banner not found"

        );

    }

    const oldImage = banner.image;

    Object.assign(

        banner,

        payload

    );

    await banner.save();

    return {

        banner,

        oldImage

    };

};

const remove = async (id) => {

    const banner = await Banner.findById(id);

    if (!banner) {

        throw new ApiError(

            404,

            "Banner not found"

        );

    }

    const oldImage = banner.image;

    await banner.deleteOne();

    return {

        oldImage

    };

};

export default {

    create,

    getAll,

    getPublic,

    getById,

    update,

    remove

};