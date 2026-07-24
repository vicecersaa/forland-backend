import dotenv from "dotenv";
dotenv.config();

import crypto from "crypto";


const orderId = "FL-1784792486873";

const statusCode = "200";

const grossAmount = "2500000";


const signature = crypto
    .createHash("sha512")
    .update(
        orderId +
        statusCode +
        grossAmount +
        process.env.MIDTRANS_SERVER_KEY
    )
    .digest("hex");


console.log(signature);