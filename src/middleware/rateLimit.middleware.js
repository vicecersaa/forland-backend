import { rateLimit } from "express-rate-limit";

// ======================
// GLOBAL API
// ======================

export const apiLimiter = rateLimit({

    windowMs: 15 * 60 * 1000,

    limit: 100,

    standardHeaders: true,

    legacyHeaders: false,

    message: {

        success: false,

        message: "Too many requests, please try again later."

    }

});

// ======================
// LOGIN
// ======================

export const loginLimiter = rateLimit({

    windowMs: 15 * 60 * 1000,

    limit: 5,

    standardHeaders: true,

    legacyHeaders: false,

    message: {

        success: false,

        message: "Too many login attempts. Please try again in 15 minutes."

    }

});

// ======================
// REGISTER
// ======================

export const registerLimiter = rateLimit({

    windowMs: 60 * 60 * 1000,

    limit: 5,

    standardHeaders: true,

    legacyHeaders: false,

    message: {

        success: false,

        message: "Too many registrations. Please try again later."

    }

});