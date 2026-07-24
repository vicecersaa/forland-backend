import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";

import homeService from "./home.service.js";

const getHome = asyncHandler(async (req, res) => {

    const result = await homeService.getHome();

    ApiResponse.success(

        res,

        result,

        "Home data fetched successfully"

    );

});

export default {

    getHome

};