import paymentService from "./payment.service.js";

import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import paymentWebhook from "./payment.webhook.js";

const createPayment = asyncHandler(async(req,res)=>{


    const result =
        await paymentService.createPayment(

            req.user.id,

            req.params.orderId

        );


    ApiResponse.success(

        res,

        result,

        "Payment created successfully"

    );


});

const callback = asyncHandler(async(req,res)=>{


    const result = await paymentWebhook.handleNotification(

        req.body

    );


    ApiResponse.success(

        res,

        result,

        "Payment callback processed"

    );


});


export default {

    createPayment,

    callback

};