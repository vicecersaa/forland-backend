import mongoose from "mongoose";

const sizeSchema = new mongoose.Schema(

    {

        name: {

            type: String,

            required: true,

            trim: true

        },

        sku: {

            type: String,

            required: true,

            trim: true,

            uppercase: true

        },

        price: {

            type: Number,

            required: true,

            min: 0

        },

        stock: {

            type: Number,

            required: true,

            default: 0,

            min: 0

        },

        isActive: {

            type: Boolean,

            default: true

        }

    },

    {

        _id: false

    }

);

const variantSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        sku: { type: String, trim: true, uppercase: true, default: "" },
        price: { type: Number, default: null, min: 0 },
        stock: { type: Number, default: null, min: 0 },
        sizes: { type: [sizeSchema], default: [] },
        isActive: { type: Boolean, default: true },

        // TAMBAH INI
        image: { type: String, default: "" },
        imageKey: { type: String, default: "" }
    },
    { _id: false }
);

const productSchema = new mongoose.Schema(

    {

        name: {

            type: String,

            required: true,

            trim: true,

            unique: true

        },

        slug: {

            type: String,

            required: true,

            unique: true,

            index: true

        },

        category: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Category",

            required: true

        },

        description: {

            type: String,

            default: ""

        },

        images: [{

            type: String

        }],

        thumbnail: {

            type: String,

            default: ""

        },
        
        video: {

            type: String,

            default: ""

        },

        price: {

            type: Number,

            default: null,

            min: 0

        },

        stock: {

            type: Number,

            default: null,

            min: 0

        },

        sku: {

            type: String,

            trim: true,

            uppercase: true,

            default: ""

        },

        variants: {

            type: [variantSchema],

            default: []

        },

        minPrice: {

            type: Number,

            default: 0

        },

        maxPrice: {

            type: Number,

            default: 0

        },

        totalStock: {

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

productSchema.index({
    category: 1,
    isActive: 1
});

productSchema.pre("save", function () {

    // Produk tanpa variant
    if (!this.variants.length) {

        this.minPrice = this.price || 0;
        this.maxPrice = this.price || 0;
        this.totalStock = this.stock || 0;

        return;

    }

    const prices = [];
    let totalStock = 0;

    this.variants.forEach((variant) => {

        if (!variant.isActive) return;

        // Variant tanpa size
        if (!variant.sizes.length) {

            if (variant.price != null) {

                prices.push(variant.price);

            }

            totalStock += variant.stock || 0;

            return;

        }

        // Variant punya size
        variant.sizes.forEach((size) => {

            if (!size.isActive) return;

            prices.push(size.price);

            totalStock += size.stock;

        });

    });

    this.minPrice = prices.length
        ? Math.min(...prices)
        : 0;

    this.maxPrice = prices.length
        ? Math.max(...prices)
        : 0;

    this.totalStock = totalStock;

    

});

export default mongoose.model(
    "Product",
    productSchema
);