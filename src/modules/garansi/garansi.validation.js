import { z } from "zod";

export const createGaransiSchema = z
    .object({
        phone: z.string().min(1, "Nomor HP wajib diisi"),
        customerName: z.string().min(1, "Nama pelanggan wajib diisi"),
        address: z.string().optional().default(""),
        productName: z.string().min(1, "Nama produk wajib diisi"),
        variant: z.string().optional().default(""),
        purchaseDate: z.coerce.date({ required_error: "Tanggal pembelian wajib diisi" }),
        warrantyStart: z.coerce.date({ required_error: "Tanggal mulai garansi wajib diisi" }),
        warrantyEnd: z.coerce.date({ required_error: "Tanggal berakhir garansi wajib diisi" }),
        status: z.enum(["active", "expired", "claimed", "void"]).optional().default("active"),
        notes: z.string().optional().default("")
    })
    .refine((data) => data.warrantyEnd >= data.warrantyStart, {
        message: "Tanggal berakhir garansi tidak boleh sebelum tanggal mulai",
        path: ["warrantyEnd"]
    });

export const updateGaransiSchema = z
    .object({
        customerName: z.string().min(1).optional(),
        address: z.string().optional(),
        productName: z.string().min(1).optional(),
        variant: z.string().optional(),
        purchaseDate: z.coerce.date().optional(),
        warrantyStart: z.coerce.date().optional(),
        warrantyEnd: z.coerce.date().optional(),
        status: z.enum(["active", "expired", "claimed", "void"]).optional(),
        notes: z.string().optional()
    })
    .refine(
        (data) => !data.warrantyStart || !data.warrantyEnd || data.warrantyEnd >= data.warrantyStart,
        { message: "Tanggal berakhir garansi tidak boleh sebelum tanggal mulai", path: ["warrantyEnd"] }
    );