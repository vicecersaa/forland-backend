import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true
        },

        description: {
            type: String,
            default: ""
        },

        type: {
            type: String,
            enum: ["percentage", "fixed"],
            required: true
        },

        value: {
            type: Number,
            required: true
        },

        minimumPurchase: {
            type: Number,
            default: 0
        },

        maximumDiscount: {
            type: Number,
            default: 0
        },

        usageLimit: {
            type: Number,
            default: 0
        },

        usedCount: {
            type: Number,
            default: 0
        },

        usagePerUser: {
            type: Number,
            default: 1
        },

        startDate: {
            type: Date,
            required: true
        },

        endDate: {
            type: Date,
            required: true
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Coupon", couponSchema);