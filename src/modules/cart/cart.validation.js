import { z } from "zod";


export const addCartSchema = z.object({

    product: z.string().min(1),

    variant: z.string().optional().default(""),

    size: z.string().optional().default(""),

    quantity: z.coerce.number().int().min(1)

});


export const updateCartSchema = z.object({

    quantity: z.coerce.number().int().min(1)

});