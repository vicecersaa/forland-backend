import { z } from "zod";

export const createBannerSchema = z.object({

    link: z.string().optional().default(""),

    sortOrder: z.coerce.number().default(0),

    isActive: z.coerce.boolean().default(true)

});

export const updateBannerSchema =
    createBannerSchema.partial();