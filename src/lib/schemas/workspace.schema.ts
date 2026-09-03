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

export const updateWorkspaceSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters long")
      .max(100, "Name cannot exceed 100 characters")
      .optional(),
    description: descriptionSchema.nullable(),
    // Nullable para permitir borrar el contenido ya que este es opcional
    logoUrl: z.url("Logo URL must be a valid URL").optional().nullable(),
  })
  .refine((data) => Object.keys(data).length > 0, "At least one field must be provided");

export const updateWorkspaceNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long")
    .max(100, "Name cannot exceed 100 characters"),
});

export const updateWorkspaceDescriptionSchema = z.object({
  description: descriptionSchema.nullable(),
});

export type CreateWorkspaceDto = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceDto = z.infer<typeof updateWorkspaceSchema>;
export type UpdateWorkspaceNameDto = z.infer<typeof updateWorkspaceNameSchema>;
export type UpdateWorkspaceDescriptionDto = z.infer<typeof updateWorkspaceDescriptionSchema>;
