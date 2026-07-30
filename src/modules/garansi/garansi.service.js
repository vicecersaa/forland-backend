import Garansi from "./garansi.model.js";
import ApiError from "../../utils/ApiError.js";
import queryBuilder from "../../utils/queryBuilder.js";
import paginate from "../../utils/paginate.js";

const create = async (payload) => {

    const exists = await Garansi.findOne({ phone: payload.phone });

    if (exists) {
        throw new ApiError(400, "Nomor HP ini sudah terdaftar sebagai data garansi");
    }

    return await Garansi.create(payload);

};

const getAll = async (query) => {

    const {
        page,
        limit,
        skip,
        filter,
        sort
    } = queryBuilder(query, {
        searchableFields: ["phone", "customerName", "productName"]
    });

    const totalItems = await Garansi.countDocuments(filter);

    const items = await Garansi.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit);

    return {
        items,
        pagination: paginate({ page, limit, totalItems })
    };

};

const getById = async (id) => {

    const garansi = await Garansi.findById(id);

    if (!garansi) {
        throw new ApiError(404, "Data garansi tidak ditemukan");
    }

    return garansi;

};

const getByPhone = async (phone) => {

    const garansi = await Garansi.findOne({ phone });

    if (!garansi) {
        throw new ApiError(404, "Data garansi tidak ditemukan untuk nomor ini");
    }

    return garansi;

};

const update = async (id, payload) => {

    const garansi = await Garansi.findById(id);

    if (!garansi) {
        throw new ApiError(404, "Data garansi tidak ditemukan");
    }

    Object.assign(garansi, payload);

    await garansi.save();

    return garansi;

};

const remove = async (id) => {

    const garansi = await Garansi.findById(id);

    if (!garansi) {
        throw new ApiError(404, "Data garansi tidak ditemukan");
    }

    await garansi.deleteOne();

};

export default {
    create,
    getAll,
    getById,
    getByPhone,
    update,
    remove
};