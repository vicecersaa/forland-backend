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

export default {

    create

};