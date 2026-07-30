import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import ApiError from "../../utils/ApiError.js";
import garansiService from "./garansi.service.js";

const create = asyncHandler(async (req, res) => {
    const result = await garansiService.create(req.body);
    ApiResponse.success(res, result, "Data garansi berhasil ditambahkan", 201);
});

const getAll = asyncHandler(async (req, res) => {
    const result = await garansiService.getAll(req.query);
    ApiResponse.success(res, result, "Data garansi berhasil diambil");
});

const getById = asyncHandler(async (req, res) => {
    const result = await garansiService.getById(req.params.id);
    ApiResponse.success(res, result, "Data garansi berhasil diambil");
});

const search = asyncHandler(async (req, res) => {
    const { phone } = req.query;

    if (!phone) {
        throw new ApiError(400, "Nomor HP wajib disertakan");
    }

    const result = await garansiService.getByPhone(phone);
    ApiResponse.success(res, result, "Data garansi ditemukan");
});

const update = asyncHandler(async (req, res) => {
    const result = await garansiService.update(req.params.id, req.body);
    ApiResponse.success(res, result, "Data garansi berhasil diperbarui");
});

const remove = asyncHandler(async (req, res) => {
    await garansiService.remove(req.params.id);
    ApiResponse.success(res, null, "Data garansi berhasil dihapus");
});

export default {
    create,
    getAll,
    getById,
    search,
    update,
    remove
};