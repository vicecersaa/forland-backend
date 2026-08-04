import ApiError from "../utils/ApiError.js";

const authorize = (...roles) => {
    return (req, res, next) => {

        console.log("ROLE DEBUG:", {
            rolesAllowed: roles,
            userId: req.user?._id,
            email: req.user?.email,
            role: req.user?.role,
        });

        if (!req.user) {
            return next(new ApiError(401, "Unauthorized"));
        }

        if (!roles.includes(req.user.role)) {
            return next(new ApiError(403, "Forbidden"));
        }

        next();
    };
};

export default authorize;