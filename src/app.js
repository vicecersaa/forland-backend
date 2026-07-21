import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middleware/error.middleware.js";
import orderRoute from "./modules/order/order.route.js";
import routes from "./routes/index.js";
import path from "path";

const app = express();

app.use(
    "/uploads",
    express.static(
        path.join(process.cwd(), "uploads")
    )
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1", routes);







app.use(errorMiddleware);

export default app;