import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcrypt";
import mongoose from "mongoose";

import connectDatabase from "../config/database.js";
import User from "../modules/auth/user.model.js";

const seedAdmin = async () => {
    try {
        await connectDatabase();

        const existingAdmin = await User.findOne({
            role: "admin"
        });

        if (existingAdmin) {
            console.log("⚠️ Admin already exists");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash("12345678", 10);

        await User.create({
            email: "admin@forland.com",
            phone: "081111111111",
            password: hashedPassword,
            role: "admin"
        });

        console.log("✅ Admin created successfully");
        console.log("Email    : admin@forland.com");
        console.log("Password : 12345678");

        process.exit(0);

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedAdmin();