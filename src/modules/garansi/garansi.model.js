import mongoose from "mongoose";

const garansiSchema = new mongoose.Schema(
    {
        phone: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        customerName: {
            type: String,
            required: true,
            trim: true
        },
        address: {
            type: String,
            default: ""
        },
        productName: {
            type: String,
            required: true,
            trim: true
        },
        variant: {
            type: String,
            default: ""
        },
        purchaseDate: {
            type: Date,
            required: true
        },
        warrantyStart: {
            type: Date,
            required: true
        },
        warrantyEnd: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ["active", "expired", "claimed", "void"],
            default: "active"
        },
        notes: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Garansi", garansiSchema);