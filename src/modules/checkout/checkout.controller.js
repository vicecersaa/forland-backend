import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";

import checkoutService from "./checkout.service.js";


const createCheckout = asyncHandler(async (req, res) => {

    const result = await checkoutService.createCheckout(

        req.user.id,

        req.body

    );


    ApiResponse.success(

        res,

        result,

        "Checkout created successfully"

    );

});


export default {

    createCheckout

};