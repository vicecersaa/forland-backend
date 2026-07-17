import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import adminService from "./admin.service.js";

const dashboard = asyncHandler(async (req, res) => {

    const result = await adminService.dashboard(req.user._id);

    ApiResponse.success(
        res,
        result,
        "Dashboard loaded successfully"
    );

});

export default {
    dashboard
};