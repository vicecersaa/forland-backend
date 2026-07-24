import Cart from "./cart.model.js";
import Product from "../product/product.model.js";

import ApiError from "../../utils/ApiError.js";


const getCart = async (userId) => {

    let cart = await Cart.findOne({

        user: userId

    })
    .populate(
        "items.product"
    );


    if (!cart) {

        cart = await Cart.create({

            user: userId,

            items: []

        });

    }


    return cart;

};



const addItem = async (userId, payload) => {


    const product = await Product.findById(

        payload.product

    );


    if (!product || !product.isActive) {

        throw new ApiError(
            404,
            "Product not found"
        );

    }


    const variant = payload.variant || "";

    const size = payload.size || "";


    const cart = await Cart.findOne({

        user: userId

    }) || await Cart.create({

        user: userId,

        items: []

    });



    const existing = cart.items.find(item =>

        item.product.toString() === product._id.toString()
        &&
        item.variant === variant
        &&
        item.size === size

    );



    if (existing) {

        existing.quantity += payload.quantity;

    } else {


        cart.items.push({

            product: product._id,

            variant,

            size,

            quantity: payload.quantity

        });


    }


    await cart.save();


    return cart;

};



const updateQuantity = async (

    userId,

    productId,

    payload

) => {


    const cart = await Cart.findOne({

        user: userId

    });


    if (!cart) {

        throw new ApiError(
            404,
            "Cart not found"
        );

    }



    const item = cart.items.find(item =>

        item.product.toString() === productId

    );


    if (!item) {

        throw new ApiError(
            404,
            "Cart item not found"
        );

    }



    item.quantity = payload.quantity;


    await cart.save();


    return cart;

};



const removeItem = async (

    userId,

    productId

) => {


    const cart = await Cart.findOne({

        user:userId

    });


    if (!cart) {

        throw new ApiError(
            404,
            "Cart not found"
        );

    }



    cart.items = cart.items.filter(item =>

        item.product.toString() !== productId

    );


    await cart.save();


    return cart;

};



const clearCart = async(userId)=>{


    const cart = await Cart.findOne({

        user:userId

    });


    if(!cart){

        throw new ApiError(
            404,
            "Cart not found"
        );

    }


    cart.items = [];


    await cart.save();


    return cart;

};



export default {

    getCart,

    addItem,

    updateQuantity,

    removeItem,

    clearCart

};