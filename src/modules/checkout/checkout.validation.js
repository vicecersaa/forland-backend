import { z } from "zod";


const shippingAddressSchema = z.object({

    name: z.string().min(1),

    phone: z.string().min(1),

    province: z.string().min(1),

    city: z.string().min(1),

    district: z.string().min(1),

    postalCode: z.string().min(1),

    address: z.string().min(1)

});


export const createCheckoutSchema = z.object({

    shippingAddress: shippingAddressSchema,

    shippingCost: z.number()
        .min(0)
        .default(0),

    coupon: z.string()
        .optional()
        .default(""),

    notes: z.string()
        .optional()
        .default("")

});