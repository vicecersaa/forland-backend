import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({

    product: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "Product",

        required: true

    },

    name: {

        type: String,

        required: true

    },

    thumbnail: {

        type: String,

        default: ""

    },

    variant: {

        type: String,

        default: ""

    },

    size: {

        type: String,

        default: ""

    },

    sku: {

        type: String,

        default: ""

    },

    price: {

        type: Number,

        required: true

    },

    quantity: {

        type: Number,

        required: true,

        min: 1

    },

    subtotal: {

        type: Number,

        required: true

    }

}, {

    _id: false

});

const addressSchema = new mongoose.Schema({

    name: String,

    phone: String,

    province: String,

    city: String,

    district: String,

    postalCode: String,

    address: String

}, {

    _id: false

});

const orderSchema = new mongoose.Schema({

    orderNumber: {

        type: String,

        unique: true,

        required: true

    },

    customer: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

        default: null

    },

    items: {

        type: [orderItemSchema],

        required: true

    },

    subtotal: {

        type: Number,

        default: 0

    },

    shippingCost: {

        type: Number,

        default: 0

    },

    discount: {

        type: Number,

        default: 0

    },

    total: {

        type: Number,

        default: 0

    },

    status: {

        type: String,

        enum: [

            "pending",

            "processing",

            "shipped",

            "completed",

            "cancelled"

        ],

        default: "pending"

    },

    paymentStatus: {

        type: String,

        enum: [

            "pending",

            "paid",

            "failed",

            "refunded"

        ],

        default: "pending"

    },

    shippingStatus: {

        type: String,

        enum: [

            "pending",

            "packed",

            "shipped",

            "delivered"

        ],

        default: "pending"

    },

    paymentMethod: {

        type: String,

        default: ""

    },

    shippingAddress: {

        type: addressSchema,

        required: true

    },

    notes: {

        type: String,

        default: ""

    }

}, {

    timestamps: true

});



orderSchema.index({

    status: 1

});

orderSchema.index({

    paymentStatus: 1

});

export default mongoose.model(

    "Order",

    orderSchema

);