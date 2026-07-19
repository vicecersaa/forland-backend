import { z } from "zod";

/* =========================
   Size
========================= */

const sizeSchema = z.object({

    name: z
        .string()
        .trim()
        .min(1)
        .max(100),

    sku: z
        .string()
        .trim()
        .min(1)
        .max(100),

    price: z
        .number()
        .min(0),

    stock: z
        .number()
        .int()
        .min(0),

    isActive: z
        .boolean()
        .optional()
        .default(true)

});

/* =========================
   Variant
========================= */

const variantSchema = z.object({

    name: z
        .string()
        .trim()
        .min(1)
        .max(100),

    sku: z
        .string()
        .trim()
        .optional()
        .default(""),

    price: z
        .number()
        .nullable()
        .optional(),

    stock: z
        .number()
        .int()
        .nullable()
        .optional(),

    sizes: z
        .array(sizeSchema)
        .optional()
        .default([]),

    isActive: z
        .boolean()
        .optional()
        .default(true)

});

/* =========================
   Create Schema
========================= */

export const createProductSchema = z.object({

    name: z
        .string()
        .trim()
        .min(1)
        .max(100),

    description: z
        .string()
        .trim()
        .optional()
        .default(""),

    category: z
        .string()
        .trim(),

    price: z
        .number()
        .nullable()
        .optional(),

    stock: z
        .number()
        .int()
        .nullable()
        .optional(),

    sku: z
        .string()
        .trim()
        .optional()
        .default(""),

    variants: z
        .array(variantSchema)
        .optional()
        .default([]),

    isActive: z
        .boolean()
        .optional()
        .default(true)

}).superRefine((product, ctx) => {

    if (product.variants.length === 0) {

        if (product.price == null) {

            ctx.addIssue({

                code: "custom",

                path: ["price"],

                message: "Price is required."

            });

        }

        if (product.stock == null) {

            ctx.addIssue({

                code: "custom",

                path: ["stock"],

                message: "Stock is required."

            });

        }

        if (!product.sku) {

            ctx.addIssue({

                code: "custom",

                path: ["sku"],

                message: "SKU is required."

            });

        }

    } else {

        if (product.price != null) {

            ctx.addIssue({

                code: "custom",

                path: ["price"],

                message: "Price must be empty when variants exist."

            });

        }

        if (product.stock != null) {

            ctx.addIssue({

                code: "custom",

                path: ["stock"],

                message: "Stock must be empty when variants exist."

            });

        }

        if (product.sku !== "") {

            ctx.addIssue({

                code: "custom",

                path: ["sku"],

                message: "SKU must be empty when variants exist."

            });

        }

    }

    product.variants.forEach((variant, index) => {

        if (variant.sizes.length === 0) {

            if (variant.price == null) {

                ctx.addIssue({

                    code: "custom",

                    path: ["variants", index, "price"],

                    message: "Price is required."

                });

            }

            if (variant.stock == null) {

                ctx.addIssue({

                    code: "custom",

                    path: ["variants", index, "stock"],

                    message: "Stock is required."

                });

            }

            if (!variant.sku) {

                ctx.addIssue({

                    code: "custom",

                    path: ["variants", index, "sku"],

                    message: "SKU is required."

                });

            }

        } else {

            if (variant.price != null) {

                ctx.addIssue({

                    code: "custom",

                    path: ["variants", index, "price"],

                    message: "Price must be empty."

                });

            }

            if (variant.stock != null) {

                ctx.addIssue({

                    code: "custom",

                    path: ["variants", index, "stock"],

                    message: "Stock must be empty."

                });

            }

            if (variant.sku !== "") {

                ctx.addIssue({

                    code: "custom",

                    path: ["variants", index, "sku"],

                    message: "SKU must be empty."

                });

            }

        }

    });

});

/* =========================
   Update Schema
========================= */

export const updateProductSchema = z.object({

    name: z
        .string()
        .trim()
        .min(1)
        .max(100)
        .optional(),

    description: z
        .string()
        .trim()
        .optional(),

    category: z
        .string()
        .trim()
        .optional(),

    price: z
        .number()
        .nullable()
        .optional(),

    stock: z
        .number()
        .int()
        .nullable()
        .optional(),

    sku: z
        .string()
        .trim()
        .optional(),

    variants: z
        .array(variantSchema)
        .optional(),

    isActive: z
        .boolean()
        .optional()

}).superRefine((product, ctx) => {

    // Kalau update hanya nama / kategori / deskripsi
    // jangan validasi business rule.

    if (product.variants === undefined) {
        return;
    }

    if (product.variants.length === 0) {

        if ("price" in product && product.price == null) {

            ctx.addIssue({

                code: "custom",

                path: ["price"],

                message: "Price is required."

            });

        }

        if ("stock" in product && product.stock == null) {

            ctx.addIssue({

                code: "custom",

                path: ["stock"],

                message: "Stock is required."

            });

        }

        if ("sku" in product && !product.sku) {

            ctx.addIssue({

                code: "custom",

                path: ["sku"],

                message: "SKU is required."

            });

        }

    }

    product.variants.forEach((variant, index) => {

        if (variant.sizes.length === 0) {

            if (variant.price == null) {

                ctx.addIssue({

                    code: "custom",

                    path: ["variants", index, "price"],

                    message: "Price is required."

                });

            }

            if (variant.stock == null) {

                ctx.addIssue({

                    code: "custom",

                    path: ["variants", index, "stock"],

                    message: "Stock is required."

                });

            }

            if (!variant.sku) {

                ctx.addIssue({

                    code: "custom",

                    path: ["variants", index, "sku"],

                    message: "SKU is required."

                });

            }

        } else {

            if (variant.price != null) {

                ctx.addIssue({

                    code: "custom",

                    path: ["variants", index, "price"],

                    message: "Price must be empty."

                });

            }

            if (variant.stock != null) {

                ctx.addIssue({

                    code: "custom",

                    path: ["variants", index, "stock"],

                    message: "Stock must be empty."

                });

            }

            if (variant.sku !== "") {

                ctx.addIssue({

                    code: "custom",

                    path: ["variants", index, "sku"],

                    message: "SKU must be empty."

                });

            }

        }

    });

});