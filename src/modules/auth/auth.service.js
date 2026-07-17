import bcrypt from "bcrypt";
import User from "./user.model.js";
import ApiError from "../../utils/ApiError.js";
import generateToken from "../../utils/generateToken.js";

const register = async ({ email, phone, password }) => {
    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
        throw new ApiError(409, "Email already exists");
    }

    const existingPhone = await User.findOne({ phone });

    if (existingPhone) {
        throw new ApiError(409, "Phone number already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        email,
        phone,
        password: hashedPassword,
        role: "customer"
    });

    return {
        id: user._id,
        email: user.email,
        phone: user.phone,
        role: user.role
    };
};

const login = async ({ email, password }, requiredRole) => {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new ApiError(401, "Invalid email or password");
    }

    if (requiredRole && user.role !== requiredRole) {
        throw new ApiError(403, "You are not allowed to login here");
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);

    return {
        token,
        user: {
            id: user._id,
            email: user.email,
            phone: user.phone,
            role: user.role
        }
    };
};

export default {
    register,
    login
};