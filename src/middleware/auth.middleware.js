import jwt from "jsonwebtoken";
import User from "../modules/auth/user.model.js";
import ApiError from "../utils/ApiError.js";

const authMiddleware = async (req, res, next) => {
    try {

        let token;

        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        } else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            throw new ApiError(401, "Unauthorized");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);

        if (!user) {
            throw new ApiError(401, "User not found");
        }

        req.user = user;

        next();

    } catch (error) {
        next(error);
    }
};

export default authMiddleware;