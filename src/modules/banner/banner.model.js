import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
    {

        image: {

            type: String,

            required: true

        },

        link: {

            type: String,

            default: ""

        },

        sortOrder: {

            type: Number,

            default: 0

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

export default mongoose.model(
    "Banner",
    bannerSchema
);