import bcrypt from "bcrypt";
import User from "./user.model.js";
import ApiError from "../../utils/ApiError.js";
import generateToken from "../../utils/generateToken.js";
import crypto from "crypto";
import sendEmail from "../../utils/sendEmail.js";

const register = async ({ email, password }) => {

    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
        throw new ApiError(
            409,
            "Email already exists"
        );
    }

    const hashedPassword = await bcrypt.hash(
        password,
        10
    );

    const user = await User.create({

        email,

        password: hashedPassword,

        role: "customer"

    });

    const token = generateToken(user);

    return {

        token,

        user: {

            id: user._id,

            email: user.email,

            role: user.role

        }

    };

};


const login = async ({ email, password }, requiredRole) => {

    const user = await User.findOne({ email })
        .select("+password");


    if (!user) {

        throw new ApiError(
            401,
            "Invalid email or password"
        );

    }


    const isMatch = await bcrypt.compare(
        password,
        user.password
    );


    if (!isMatch) {

        throw new ApiError(
            401,
            "Invalid email or password"
        );

    }


    if (requiredRole && user.role !== requiredRole) {

        throw new ApiError(
            403,
            "You are not allowed to login here"
        );

    }


    user.lastLogin = new Date();

    await user.save();


    const token = generateToken(user);


    return {

        token,

        user: {

            id: user._id,

            email: user.email,

            role: user.role

        }

    };

};

const forgotPassword = async ({ email }) => {


    const user = await User.findOne({
        email
    });


    if (!user) {

        throw new ApiError(
            404,
            "User not found"
        );

    }


    const token = crypto
        .randomBytes(32)
        .toString("hex");


    user.resetPasswordToken = token;

    user.resetPasswordExpire =
        Date.now() + 15 * 60 * 1000;


    await user.save();



    const resetUrl =
        `${process.env.FRONTEND_URL}/reset-password/${token}`;



    await sendEmail({

        to: user.email,

        subject: "Reset Password",

        html: `

        <h2>Reset Password</h2>

        <p>Klik link berikut untuk reset password:</p>

        <a href="${resetUrl}">
            Reset Password
        </a>

        <p>
        Link berlaku 15 menit.
        </p>

        `

    });



    return {

        message:
            "Reset password email sent"

    };


};

const resetPassword = async (
    token,
    password
) => {


    const user = await User.findOne({

        resetPasswordToken: token,

        resetPasswordExpire: {
            $gt: Date.now()
        }

    });


    if (!user) {

        throw new ApiError(
            400,
            "Invalid or expired token"
        );

    }



    user.password =
        await bcrypt.hash(
            password,
            10
        );


    user.resetPasswordToken = null;

    user.resetPasswordExpire = null;


    await user.save();



    return {

        message:
            "Password reset successfully"

    };


};


export default {

    register,

    login,

    forgotPassword,

    resetPassword

};