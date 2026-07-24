import snap from "./payment.config.js";

import Order from "../order/order.model.js";

import ApiError from "../../utils/ApiError.js";


const createPayment = async (userId, orderId) => {


    const order = await Order.findById(orderId);



    if (!order) {

        throw new ApiError(
            404,
            "Order not found"
        );

    }



    if (

        order.customer &&

        order.customer.toString() !== userId

    ) {

        throw new ApiError(
            403,
            "Forbidden"
        );

    }



    // =========================
    // PREVENT DOUBLE PAYMENT
    // =========================

    if (order.paymentStatus === "paid") {

        throw new ApiError(
            400,
            "Order already paid"
        );

    }



    // =========================
    // MIDTRANS PARAMETER
    // =========================

    const parameter = {


        transaction_details: {


            order_id:
                order.orderNumber,


            gross_amount:
                order.total


        },



        item_details:


            order.items.map(item => ({


                id:
                    item.product.toString(),


                price:
                    item.price,


                quantity:
                    item.quantity,


                name:
                    item.name


            })),



        customer_details: {


            first_name:
                order.shippingAddress.name,


            phone:
                order.shippingAddress.phone


        }


    };





    const transaction =

        await snap.createTransaction(parameter);





    // =========================
    // SAVE MIDTRANS DATA
    // =========================


    order.paymentToken =
        transaction.token;


    order.paymentUrl =
        transaction.redirect_url;



    order.paymentMethod =
        "midtrans";



    await order.save();





    return {


        token:

            transaction.token,



        redirectUrl:

            transaction.redirect_url


    };


};





export default {


    createPayment


};