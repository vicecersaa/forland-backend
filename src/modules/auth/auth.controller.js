import authService from "./auth.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";

const register = asyncHandler(async (req, res) => {

    const result = await authService.register(req.body);

    res.cookie("token", result.token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    ApiResponse.success(
        res,
        {
            user: result.user,
        },
        "Register success",
        201
    );

});

const customerLogin = asyncHandler(async (req, res) => {

    const result = await authService.login(
        req.body,
        "customer"
    );

    res.cookie("token", result.token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    ApiResponse.success(
        res,
        {
            user: result.user,
        },
        "Login success"
    );

});

const adminLogin = asyncHandler(async (req, res) => {

    const result = await authService.login(
        req.body,
        "admin"
    );

    res.cookie(
        "token",
        result.token,
        {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        }
    );

    ApiResponse.success(
        res,
        { user: result.user },
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

const forgotPassword = asyncHandler(
async(req,res)=>{


    const result =
        await authService.forgotPassword(
            req.body
        );


    ApiResponse.success(
        res,
        result,
        "Forgot password success"
    );


});

const resetPassword = asyncHandler(
async(req,res)=>{


    const result =
        await authService.resetPassword(

            req.params.token,

            req.body.password

        );


    ApiResponse.success(
        res,
        result,
        "Reset password success"
    );


});

const logout = asyncHandler(async (req, res) => {

    res.clearCookie(
        "token",
        {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        }
    );

    ApiResponse.success(
        res,
        null,
        "Logout success"
    );

});

export default {
    register,
    customerLogin,
    adminLogin,
    me,
    forgotPassword,
    resetPassword,
    logout
};
