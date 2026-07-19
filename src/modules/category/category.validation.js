import { z } from "zod";

export const createCategorySchema = z.object({
    name: z
        .string({
            required_error: "Category name is required"
        })
        .trim()
        .min(1)
        .max(100),

    description: z
        .string()
        .trim()
        .max(500)
        .optional()
        .default(""),

   

    sortOrder: z
        .coerce
        .number()
        .int()
        .min(0)
        .optional()
        .default(0),

    isActive: z
        .coerce
        .boolean()
        .optional()
        .default(true)
});

export const updateCategorySchema =
    createCategorySchema.partial();