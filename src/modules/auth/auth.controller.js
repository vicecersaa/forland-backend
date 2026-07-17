import authService from "./auth.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";

const register = asyncHandler(async (req, res) => {

    const result = await authService.register(req.body);

    ApiResponse.success(
        res,
        result,
        "Register success",
        201
    );

});

const customerLogin = asyncHandler(async (req, res) => {

    const result = await authService.login(
        req.body,
        "customer"
    );

    ApiResponse.success(
        res,
        result,
        "Login success"
    );

});

const adminLogin = asyncHandler(async (req, res) => {

    const result = await authService.login(
        req.body,
        "admin"
    );

    ApiResponse.success(
        res,
        result,
        "Admin login success"
    );

});

const me = asyncHandler(async (req, res) => {

    ApiResponse.success(
        res,
        {
            id: req.user._id,
            email: req.user.email,
            phone: req.user.phone,
            role: req.user.role
        }
    );

});

export default {
    register,
    customerLogin,
    adminLogin,
    me
};