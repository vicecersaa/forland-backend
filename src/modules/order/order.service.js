import mongoose from "mongoose";

import Order from "./order.model.js";
import Product from "../product/product.model.js";

import ApiError from "../../utils/ApiError.js";
import generateOrderNumber from "../../utils/generateOrderNumber.js";

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

export default {

    create

};