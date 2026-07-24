import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";

import couponService from "./coupon.service.js";

const create = asyncHandler(async (req, res) => {

    const result = await couponService.create(req.body);

    ApiResponse.success(

        res,

        result,

        "Coupon created successfully",

        201

    );

});

const getAll = asyncHandler(async (req, res) => {

    const result = await couponService.getAll(req.query);

    ApiResponse.success(

        res,

        result,

        "Coupons fetched successfully"

    );

});

const getById = asyncHandler(async (req, res) => {

    const result = await couponService.getById(req.params.id);

    ApiResponse.success(

        res,

        result,

        "Coupon fetched successfully"

    );

});

const update = asyncHandler(async (req, res) => {

    const result = await couponService.update(

        req.params.id,

        req.body

    );

    ApiResponse.success(

        res,

        result,

        "Coupon updated successfully"

    );

});

const validateCoupon = asyncHandler(async (req, res) => {

    const result = await couponService.validateCoupon(req.body);

    ApiResponse.success(

        res,

        result,

        "Coupon is valid"

    );

});

const remove = asyncHandler(async (req, res) => {

    await couponService.remove(req.params.id);

    ApiResponse.success(

        res,

        null,

        "Coupon deleted successfully"

    );

});

export default {

    create,

    getAll,

    getById,

    update,

    validateCoupon,

    remove

};