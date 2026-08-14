import z from "zod";

export const descriptionSchema = z.string().trim().max(500, "Description cannot exceed 500 characters").optional();
