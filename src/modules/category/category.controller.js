import categoryService from "./category.service.js";

import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";

const create = asyncHandler(async (req, res) => {

    const result = await categoryService.create(req.body);

    ApiResponse.success(
        res,
        result,
        "Category created successfully",
        201
    );

});

const getAll = asyncHandler(async (req, res) => {

    const result = await categoryService.getAll(req.query);

    ApiResponse.success(
        res,
        result,
        "Categories fetched successfully"
    );

});

const getById = asyncHandler(async (req, res) => {

    const result = await categoryService.getById(
        req.params.id
    );

    ApiResponse.success(
        res,
        result,
        "Category fetched successfully"
    );

});

export default {
    create,
    getAll,
    getById
};