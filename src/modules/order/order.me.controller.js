import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";

import orderService from "./order.service.js";

const getMyOrders = asyncHandler(async (req, res) => {

    const result = await orderService.getMyOrders(

        req.user.id,

        req.query

    );

    ApiResponse.success(

        res,

        result,

        "Orders fetched successfully"

    );

});

const getMyOrderById = asyncHandler(async (req, res) => {

    const result = await orderService.getMyOrderById(

        req.user.id,

        req.params.id

    );

    ApiResponse.success(

        res,

        result,

        "Order fetched successfully"

    );

});

export default {

    getMyOrders,

    getMyOrderById

};