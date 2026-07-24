import cartService from "./cart.service.js";

import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";



const getCart = asyncHandler(async(req,res)=>{


    const result = await cartService.getCart(

        req.user.id

    );


    ApiResponse.success(

        res,

        result,

        "Cart fetched successfully"

    );


});




const addItem = asyncHandler(async(req,res)=>{


    const result = await cartService.addItem(

        req.user.id,

        req.body

    );


    ApiResponse.success(

        res,

        result,

        "Item added to cart"

    );


});




const updateQuantity = asyncHandler(async(req,res)=>{


    const result = await cartService.updateQuantity(

        req.user.id,

        req.params.productId,

        req.body

    );


    ApiResponse.success(

        res,

        result,

        "Cart updated"

    );


});




const removeItem = asyncHandler(async(req,res)=>{


    const result = await cartService.removeItem(

        req.user.id,

        req.params.productId

    );


    ApiResponse.success(

        res,

        result,

        "Item removed"

    );


});




const clearCart = asyncHandler(async(req,res)=>{


    const result = await cartService.clearCart(

        req.user.id

    );


    ApiResponse.success(

        res,

        result,

        "Cart cleared"

    );


});



export default {

    getCart,

    addItem,

    updateQuantity,

    removeItem,

    clearCart

};