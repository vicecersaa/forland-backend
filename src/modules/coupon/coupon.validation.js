import { z } from "zod";

export const createCouponSchema = z.object({

    code: z.string().min(3).max(30),

    description: z.string().optional().default(""),

    type: z.enum([
        "percentage",
        "fixed"
    ]),

    value: z.coerce.number().positive(),

    minimumPurchase: z.coerce.number().default(0),

    maximumDiscount: z.coerce.number().default(0),

    usageLimit: z.coerce.number().default(0),

    usagePerUser: z.coerce.number().default(1),

    isPopup: z.boolean().optional().default(false),
    
    label: z.string().optional().default(""),

    startDate: z.coerce.date(),

    endDate: z.coerce.date(),

    isActive: z.boolean().optional().default(true)

});

export const validateCouponSchema = z.object({

    code: z.string().min(1),

    subtotal: z.coerce.number().min(0)

});

export const updateCouponSchema = createCouponSchema.partial();