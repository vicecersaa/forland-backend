import Product from "../product/product.model.js";
import Cart from "../cart/cart.model.js";
import orderService from "../order/order.service.js";

import ApiError from "../../utils/ApiError.js";
import updateProductStock from "../../utils/updateProductStock.js";
import generateOrderNumber from "../../utils/generateOrderNumber.js";


const createCheckout = async (userId, data) => {

    const {
        shippingAddress,
        notes = ""
    } = data;



    const cart = await Cart.findOne({

        user: userId

    })
    .populate(
        "items.product"
    );



    if (!cart || cart.items.length === 0) {

        throw new ApiError(

            400,

            "Cart is empty"

        );

    }



    let orderItems = [];

    let subtotal = 0;

    let stockUpdates = [];



    for (const item of cart.items) {


        const product = item.product;



        if (!product || !product.isActive) {

            throw new ApiError(

                404,

                "Product not found"

            );

        }



        let price = product.price;

        let sku = product.sku;

        let stock = product.stock;


        let variantName = "";

        let sizeName = "";



        let variantRef = null;

        let sizeRef = null;



        // ======================
        // VARIANT
        // ======================

        if (item.variant) {


            variantRef = product.variants.find(

                v =>

                    v.name === item.variant

            );



            if (!variantRef) {

                throw new ApiError(

                    400,

                    "Variant not found"

                );

            }



            if (!variantRef.isActive) {

                throw new ApiError(

                    400,

                    "Variant inactive"

                );

            }



            variantName = variantRef.name;

            price = variantRef.price;

            sku = variantRef.sku;

            stock = variantRef.stock;



            // ======================
            // SIZE
            // ======================

            if (item.size) {


                sizeRef = variantRef.sizes.find(

                    s =>

                        s.name === item.size

                );



                if (!sizeRef) {

                    throw new ApiError(

                        400,

                        "Size not found"

                    );

                }



                sizeName = sizeRef.name;

                price = sizeRef.price;

                sku = sizeRef.sku;

                stock = sizeRef.stock;



                stockUpdates.push({

                    productId: product._id,

                    type: "size",

                    variantName,

                    sizeName,

                    quantity: item.quantity

                });



            } else {


                stockUpdates.push({

                    productId: product._id,

                    type: "variant",

                    variantName,

                    quantity: item.quantity

                });


            }



        } else {


            stockUpdates.push({

                productId: product._id,

                type: "product",

                quantity: item.quantity

            });


        }



        // ======================
        // STOCK CHECK
        // ======================


        if (

            stock === null ||

            stock === undefined

        ) {

            throw new ApiError(

                400,

                `${product.name} stock unavailable`

            );

        }



        if (stock < item.quantity) {

            throw new ApiError(

                400,

                `${product.name} stock insufficient`

            );

        }



        const itemSubtotal =

            price *

            item.quantity;



        subtotal += itemSubtotal;



        orderItems.push({

            product: product._id,

            name: product.name,

            thumbnail:

                product.thumbnail ||

                product.images[0] ||

                "",

            variant: variantName,

            size: sizeName,

            sku,

            price,

            quantity: item.quantity,

            subtotal: itemSubtotal

        });



    }



    // ======================
    // CREATE ORDER
    // ======================


    const order = await orderService.createOrder({
    orderNumber: generateOrderNumber(),
    customer: new mongoose.Types.ObjectId(userId), // ← fix ini
    items: orderItems,
    subtotal,
    total: subtotal,
    shippingAddress,
    notes
});




    // ======================
    // UPDATE STOCK
    // ======================


    for (const update of stockUpdates) {



        if (update.type === "product") {


            await Product.updateOne(

                {

                    _id: update.productId

                },

                {

                    $inc: {

                        stock:

                            -update.quantity

                    }

                }

            );



            await updateProductStock(

                update.productId

            );



        }




        if (update.type === "variant") {


            await Product.updateOne(

                {

                    _id: update.productId,

                    "variants.name":

                        update.variantName

                },

                {

                    $inc: {

                        "variants.$.stock":

                            -update.quantity

                    }

                }

            );


        }





        if (update.type === "size") {


            const product = await Product.findById(

                update.productId

            );



            const variant = product.variants.find(

                v =>

                    v.name === update.variantName

            );



            const size = variant.sizes.find(

                s =>

                    s.name === update.sizeName

            );



            size.stock -= update.quantity;



            await product.save();



        }



    }





    // ======================
    // CLEAR CART
    // ======================


    cart.items = [];

    await cart.save();




    return order;


};



export default {

    createCheckout

};