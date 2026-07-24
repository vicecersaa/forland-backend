import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";

import dashboardService from "./dashboard.service.js";

const getDashboard = asyncHandler(async (req, res) => {

    const result =

        await dashboardService.getDashboard();

    ApiResponse.success(

        res,

        result,

        "Dashboard fetched successfully"

    );

});

export default {

    getDashboard

};