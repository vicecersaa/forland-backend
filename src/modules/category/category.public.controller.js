import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import categoryPublicService from "./category.public.service.js";

const getAll = asyncHandler(async (req, res) => {

    const result = await categoryPublicService.getAll();

    ApiResponse.success(
        res,
        result,
        "Categories fetched successfully"
    );

});

const getBySlug = asyncHandler(async (req, res) => {

    const result = await categoryPublicService.getBySlug(
        req.params.slug
    );

    ApiResponse.success(
        res,
        result,
        "Category fetched successfully"
    );

});

export default {
    getAll,
    getBySlug
};