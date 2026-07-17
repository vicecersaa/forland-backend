import User from "../auth/user.model.js";

const dashboard = async (adminId) => {

    const admin = await User.findById(adminId);

    return {
        id: admin._id,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
        lastLogin: admin.lastLogin,
        createdAt: admin.createdAt
    };

};

export default {
    dashboard
};