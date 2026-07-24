import orderService from "./order.service.js";

import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";

const create = asyncHandler(async (req, res) => {

    const result =
        await orderService.create(req.body);

    ApiResponse.success(

        res,

        result,

        "Order created successfully",

        201

    );

});

const getAll = asyncHandler(async (req, res) => {

    const result =

        await orderService.getAll(req.query);

    ApiResponse.success(

        res,

        result,

        "Orders fetched successfully"

    );

});

const getById = asyncHandler(async (req, res) => {

    const result = await orderService.getById(

        req.params.id

    );

    ApiResponse.success(

        res,

        result,

        "Order fetched successfully"

    );

});

const updateStatus = asyncHandler(async (req, res) => {

    const result =

        await orderService.updateStatus(

            req.params.id,

            req.body

        );

    ApiResponse.success(

        res,

        result,

        "Order status updated successfully"

    );

});

const updatePaymentStatus = asyncHandler(async (req, res) => {

    const result =

        await orderService.updatePaymentStatus(

            req.params.id,

            req.body

        );

    ApiResponse.success(

        res,

        result,

        "Payment status updated successfully"

    );

});

const updateShippingStatus = asyncHandler(async (req, res) => {

    const result =

        await orderService.updateShippingStatus(

            req.params.id,

            req.body

        );

    ApiResponse.success(

        res,

        result,

        "Shipping status updated successfully"

    );

});

const cancel = asyncHandler(async (req, res) => {

    const result =

        await orderService.cancel(

            req.params.id

        );

    ApiResponse.success(

        res,

        result,

        "Order cancelled successfully"

    );

});

export default {

    create,
    
    getAll,

    getById,

    updateStatus,

    updatePaymentStatus,

    updateShippingStatus,

    cancel

};