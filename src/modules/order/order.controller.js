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

const checkOngkir = asyncHandler(async (req, res) => {
    const { city } = req.query;
    if (!city) throw new ApiError(400, "City is required");

    const result = orderService.checkOngkir(city);

    if (result) {
        ApiResponse.success(res, { found: true, ...result }, "Ongkir found");
    } else {
        ApiResponse.success(res, { found: false }, "Kota tidak ditemukan di database ongkir");
    }
});

const createPendingOngkirOrder = asyncHandler(async (req, res) => {
    const result = await orderService.createPendingOngkirOrder(req.body);
    ApiResponse.success(res, result, "Pending ongkir order created", 201);
});

const setOngkir = asyncHandler(async (req, res) => {
    const result = await orderService.setOngkir(req.params.id, req.body);
    ApiResponse.success(res, result, "Ongkir updated successfully");
});

const generateCheckoutLink = asyncHandler(async (req, res) => {
    const baseUrl = process.env.FRONTEND_URL || "https://forlandliving.com";
    const result = await orderService.generateCheckoutLink(req.params.id, baseUrl);
    ApiResponse.success(res, result, "Checkout link generated");
});

const validateCheckoutToken = asyncHandler(async (req, res) => {
    const { order_id, token } = req.query;
    const result = await orderService.validateCheckoutToken(order_id, token);
    ApiResponse.success(res, result, "Token valid");
});

const checkOngkirStatus = asyncHandler(async (req, res) => {
    const result = await orderService.checkOngkirStatus(req.params.id);
    ApiResponse.success(res, result, "Ongkir status fetched");
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

    cancel, 

    checkOngkir,

    createPendingOngkirOrder,

    setOngkir,

    generateCheckoutLink,

    validateCheckoutToken,
    
    checkOngkirStatus


};