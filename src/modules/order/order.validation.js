import { z } from "zod";

const orderItemSchema = z.object({

    product: z.string().min(1),

    variant: z.string().optional().default(""),

    size: z.string().optional().default(""),

    quantity: z.coerce.number().int().min(1)

});

const shippingAddressSchema = z.object({

    name: z.string().min(1),

    phone: z.string().min(1),

    province: z.string().min(1),

    city: z.string().min(1),

    district: z.string().min(1),

    postalCode: z.string().min(1),

    address: z.string().min(1)

});

export const createOrderSchema = z.object({

    body: z.object({

        customer: z.string().optional(),

        items: z.array(orderItemSchema).min(1),

        paymentMethod: z.string().default(""),

        shippingCost: z.coerce.number().default(0),

        discount: z.coerce.number().default(0),

        shippingAddress: shippingAddressSchema,

        notes: z.string().optional().default("")

    })

});

export const updateOrderStatusSchema = z.object({

    body: z.object({

        status: z.enum([

            "pending",

            "processing",

            "shipped",

            "completed",

            "cancelled"

        ])

    })

});

export const updatePaymentStatusSchema = z.object({

    body: z.object({

        paymentStatus: z.enum([

            "pending",

            "paid",

            "failed",

            "refunded"

        ])

    })

});

export const updateShippingStatusSchema = z.object({

    body: z.object({

        shippingStatus: z.enum([

            "pending",

            "packed",

            "shipped",

            "delivered"

        ])

    })

});