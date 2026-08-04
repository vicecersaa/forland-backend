import snap from "./payment.config.js";
import Order from "../order/order.model.js";
import ApiError from "../../utils/ApiError.js";

const createPayment = async (userId, orderId) => {
    const order = await Order.findById(orderId);
    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    if (order.customer && order.customer.toString() !== userId) {
        throw new ApiError(403, "Forbidden");
    }

    // =========================
    // PREVENT DOUBLE PAYMENT
    // =========================
    if (order.paymentStatus === "paid") {
        throw new ApiError(400, "Order already paid");
    }

    // =========================
    // BUILD ITEM DETAILS
    // =========================
    const itemDetails = order.items.map(item => ({
        id: item.product.toString(),
        price: Math.round(item.price),
        quantity: item.quantity,
        name: item.name.substring(0, 50),
    }));

    if (order.tax > 0) {
        itemDetails.push({
            id: "TAX",
            price: Math.round(order.tax),
            quantity: 1,
            name: "PPN 11%",
        });
    }

    if (order.discount > 0) {
        itemDetails.push({
            id: "DISCOUNT",
            price: -Math.round(order.discount),
            quantity: 1,
            name: "Diskon Voucher",
        });
    }

    const grossAmount = itemDetails.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    // =========================
    // MIDTRANS PARAMETER
    // =========================
    const parameter = {
        transaction_details: {
            order_id: order.orderNumber,
            gross_amount: grossAmount,
        },
        item_details: itemDetails,
        customer_details: {
            first_name: order.shippingAddress.name,
            phone: order.shippingAddress.phone,
        },
        callbacks: {
            finish: "https://forlandliving.com/orders",
            error: "https://forlandliving.com/orders",
            pending: "https://forlandliving.com/orders",
        },
    };

    const transaction = await snap.createTransaction(parameter);

    // =========================
    // SAVE MIDTRANS DATA
    // =========================
    order.paymentToken = transaction.token;
    order.paymentUrl = transaction.redirect_url;
    order.paymentMethod = "midtrans";
    await order.save();

    return {
        token: transaction.token,
        redirectUrl: transaction.redirect_url,
    };
};

export default {
    createPayment,
};