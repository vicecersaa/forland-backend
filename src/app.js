import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import routes from "./routes/index.js";

import errorMiddleware from "./middleware/error.middleware.js";
import { apiLimiter } from "./middleware/rateLimit.middleware.js";

const app = express();

// ======================
// HELMET
// ======================

app.use(

    helmet({

        crossOriginResourcePolicy: false

    })

);

// ======================
// STATIC
// ======================

app.use(

    "/uploads",

    express.static(

        path.join(

            process.cwd(),

            "uploads"

        )

    )

);

// ======================
// CORS
// ======================

const allowedOrigins = [

    "http://localhost:5173",

    "https://forlandliving.com",
    "https://www.forlandliving.com",

    "https://admin.forlandliving.com",

    "https://forland-living.vicecersaa.workers.dev",
    "https://forland-dashboard.vicecersaa.workers.dev"

];

app.use(

    cors({

        origin(origin, callback) {

            if (!origin) {

                return callback(

                    null,

                    true

                );

            }

            if (

                allowedOrigins.includes(origin)

            ) {

                return callback(

                    null,

                    true

                );

            }

            return callback(

                new Error(

                    "Not allowed by CORS"

                )

            );

        },

        credentials: true,

        methods: [

            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE"

        ],

        allowedHeaders: [

            "Content-Type",
            "Authorization"

        ]

    })

);

// ======================
// RATE LIMIT
// ======================

app.use(

    "/api",

    apiLimiter

);

// ======================
// BODY PARSER
// ======================

app.use(express.json());

app.use(

    express.urlencoded({

        extended: true

    })

);

app.use(cookieParser());

// ======================
// ROUTES
// ======================

app.use(

    "/api/v1",

    routes

);

// ======================
// ERROR HANDLER
// ======================

app.use(

    errorMiddleware

);

export default app;