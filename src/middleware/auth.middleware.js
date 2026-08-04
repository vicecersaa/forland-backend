import jwt from "jsonwebtoken";
import User from "../modules/auth/user.model.js";
import ApiError from "../utils/ApiError.js";

const authMiddleware = async (req, res, next) => {
    try {
        let token;

        console.log("Cookie Header:", req.headers.cookie);
        console.log("Cookies:", req.cookies);
        
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        } else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        console.log("Token:", token);

        if (!token) {
            throw new ApiError(401, "Unauthorized");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded:", decoded);

        const user = await User.findById(decoded.id);
        console.log("User:", user);

        if (!user) {
            throw new ApiError(401, "User not found");
        }

        req.user = user;
        next();

    } catch (err) {
        console.error(err);
        next(err);
    }
};

export default authMiddleware;