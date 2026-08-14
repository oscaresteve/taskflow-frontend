import z from "zod";
import { descriptionSchema } from "./common.schema";

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long")
    .max(100, "Name cannot exceed 100 characters"),
  description: descriptionSchema,
  logoUrl: z.url("Logo URL must be a valid URL").optional(),
});

export type CreateWorkspaceDto = z.infer<typeof createWorkspaceSchema>;
