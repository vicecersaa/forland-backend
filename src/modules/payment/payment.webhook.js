import crypto from "crypto";

import Order from "../order/order.model.js";

import ApiError from "../../utils/ApiError.js";


const handleNotification = async (payload) => {


    const {

        order_id,

        status_code,

        gross_amount,

        signature_key,

        transaction_status

    } = payload;



    // =========================
    // VERIFY SIGNATURE
    // =========================

    const signatureString =

        order_id +

        status_code +

        gross_amount +

        process.env.MIDTRANS_SERVER_KEY;



    const signatureHash = crypto

        .createHash("sha512")

        .update(signatureString)

        .digest("hex");



    if (signatureHash !== signature_key) {

        throw new ApiError(

            403,

            "Invalid Midtrans signature"

        );

    }




    // =========================
    // FIND ORDER
    // =========================


    const order = await Order.findOne({

        orderNumber: order_id

    });



    if (!order) {

        throw new ApiError(

            404,

            "Order not found"

        );

    }



    // =========================
    // PREVENT DUPLICATE CALLBACK
    // =========================


    if (order.paymentStatus === "paid") {

        return order;

    }




    // =========================
    // UPDATE PAYMENT STATUS
    // =========================


    switch (transaction_status) {


        case "capture":

        case "settlement":


            order.paymentStatus = "paid";


            order.paidAt = new Date();


            break;



        case "pending":


            order.paymentStatus = "pending";


            break;



        case "deny":

        case "cancel":

        case "expire":


            order.paymentStatus = "failed";


            break;



        case "refund":

        case "partial_refund":


            order.paymentStatus = "refunded";


            break;


    }




    await order.save();



    return order;


};



export default {

    handleNotification

};