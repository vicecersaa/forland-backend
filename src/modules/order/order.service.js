import mongoose from "mongoose";

import Order from "./order.model.js";
import Product from "../product/product.model.js";

import ApiError from "../../utils/ApiError.js";
import generateOrderNumber from "../../utils/generateOrderNumber.js";
import queryBuilder from "../../utils/queryBuilder.js";
import paginate from "../../utils/paginate.js";
import findDocumentOrThrow from "../../utils/findDocumentOrThrow.js";

const create = async (payload) => {

    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        const items = [];

        let subtotal = 0;

        for (const item of payload.items) {

    const product = await Product.findById(

        item.product

    ).session(session);

    if (

        !product ||

        !product.isActive

    ) {

        throw new ApiError(

            404,

            "Product not found"

        );

    }

    let price = product.price;

    let stock = product.stock;

    let sku = product.sku;

    let thumbnail =

        product.thumbnail ||

        product.images[0] ||

        "";

    let variantRef = null;

    let sizeRef = null;

    // ==========================
    // Variant
    // ==========================

    if (item.variant) {

        variantRef = product.variants.find(

            variant =>

                variant.name === item.variant

        );

        if (!variantRef) {

            throw new ApiError(

                404,

                "Variant not found"

            );

        }

        price = variantRef.price;

        stock = variantRef.stock;

        sku = variantRef.sku;

        // ==========================
        // Size
        // ==========================

        if (item.size) {

            sizeRef = variantRef.sizes.find(

                size =>

                    size.name === item.size

            );

            if (!sizeRef) {

                throw new ApiError(

                    404,

                    "Size not found"

                );

            }

            price = sizeRef.price;

            stock = sizeRef.stock;

            sku = sizeRef.sku;

        }

    }

    // ==========================
    // Stock Validation
    // ==========================

    if (stock < item.quantity) {

        throw new ApiError(

            400,

            `${product.name} stock is insufficient`

        );

    }

    const itemSubtotal =

        price *

        item.quantity;

    subtotal += itemSubtotal;

    items.push({

        product: product._id,

        name: product.name,

        thumbnail,

        variant: item.variant || "",

        size: item.size || "",

        sku,

        price,

        quantity: item.quantity,

        subtotal: itemSubtotal

    });

    // ==========================
    // Reduce Stock
    // ==========================

    if (!variantRef) {

        product.stock -= item.quantity;

    }

    else if (!sizeRef) {

        variantRef.stock -= item.quantity;

    }

    else {

        sizeRef.stock -= item.quantity;

    }

    await product.save({

        session

    });

}

const shippingCost = payload.shippingCost ?? 0;

const discount = payload.discount ?? 0;

const total =

    subtotal +

    shippingCost -

    discount;

const order = await Order.create(

    [

        {

            orderNumber:

                generateOrderNumber(),

            customer:

                payload.customer || null,

            items,

            subtotal,

            shippingCost,

            discount,

            total,

            paymentMethod:

                payload.paymentMethod,

            shippingAddress:

                payload.shippingAddress,

            notes:

                payload.notes

        }

    ],

    {

        session

    }

);

        await session.commitTransaction();

return order[0];

    } catch (error) {

        await session.abortTransaction();

        throw error;

    } finally {

        session.endSession();

    }

};

const getAll = async (query) => {

    const {

        page,

        limit,

        skip,

        filter,

        sort

    } = queryBuilder(

        query,

        {

            searchableFields: [

                "orderNumber",

                "shippingAddress.name",

                "shippingAddress.phone"

            ],

            defaultSort: {

                createdAt: -1

            }

        }

    );

    const totalItems = await Order.countDocuments(filter);

    const items = await Order.find(filter)

        .sort(sort)

        .skip(skip)

        .limit(limit);

    return {

        items,

        pagination: paginate({

            page,

            limit,

            totalItems

        })

    };

};

const getById = async (id) => {

    const order = await findDocumentOrThrow(

        Order,

        id,

        "Order not found"

    );

    return order;

};

const updateStatus = async (id, payload) => {
    
    

    const order = await findDocumentOrThrow(
        Order,
        id,
        "Order not found"
    );

   

    order.status = payload.status;

    await order.save();

    

    return order;

};

const updatePaymentStatus = async (

    id,

    payload

) => {

    const order = await findDocumentOrThrow(

        Order,

        id,

        "Order not found"

    );

    order.paymentStatus = payload.paymentStatus;

    await order.save();

    return order;

};

const getMyOrders = async (userId, query) => {

    const {

        page,

        limit,

        skip

    } = queryBuilder(query);

    const filter = {

    customer: userId

};

    const totalItems = await Order.countDocuments(filter);

    const items = await Order.find(filter)

        .sort({

            createdAt: -1

        })

        .skip(skip)

        .limit(limit)

        .select(

            "orderNumber total status paymentStatus createdAt"

        );

    return {

        items,

        pagination: paginate({

            page,

            limit,

            totalItems

        })

    };

};

const getMyOrderById = async (userId, orderId) => {

    const order = await Order.findOne({

    _id: orderId,

    customer: userId

});

    if (!order) {

        throw new ApiError(

            404,

            "Order not found"

        );

    }

    return order;

};

const createOrder = async (data) => {

    const order = await Order.create(data);

    return order;

};

const updateShippingStatus = async (

    id,

    payload

) => {

    const order = await findDocumentOrThrow(

        Order,

        id,

        "Order not found"

    );

    order.shippingStatus = payload.shippingStatus;

    await order.save();

    return order;

};

const cancel = async (id) => {

    const order = await Order.findById(id);

    if (!order) {
        throw new ApiError(
            404,
            "Order not found"
        );
    }


    for (const item of order.items) {

        console.log("PRODUCT LOOP");

        const product = await Product.findById(
            item.product
        );

        console.log("PRODUCT FOUND");


        if (!product) continue;


        console.log("BEFORE STOCK UPDATE");


        if (item.variant) {

            const variant = product.variants.find(
                v => v.name === item.variant
            );

            if (variant) {
                variant.stock += item.quantity;
            }

        } else {

            product.stock += item.quantity;

        }


        console.log("BEFORE PRODUCT SAVE");


        await product.save();


        console.log("AFTER PRODUCT SAVE");

    }


    order.status = "cancelled";

    await order.save();


    return order;

};


export default {

    create,

    getAll,

    getById,

    getMyOrders,

    createOrder,

    getMyOrderById,

    updateStatus,

    updatePaymentStatus, 

    updateShippingStatus,

    cancel

};