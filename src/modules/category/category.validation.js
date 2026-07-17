import { z } from "zod";

export const createCategorySchema = z.object({
    name: z
        .string({
            required_error: "Category name is required"
        })
        .trim()
        .min(1, "Category name is required")
        .max(100, "Category name cannot exceed 100 characters"),

    description: z
        .string()
        .trim()
        .max(500, "Description cannot exceed 500 characters")
        .optional()
        .default(""),

    image: z
        .string()
        .trim()
        .optional()
        .default(""),

    sortOrder: z
        .number()
        .int()
        .min(0)
        .optional()
        .default(0),

    isActive: z
        .boolean()
        .optional()
        .default(true)
});

export const updateCategorySchema =
    createCategorySchema.partial();