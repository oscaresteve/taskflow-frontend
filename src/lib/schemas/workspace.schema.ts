import z from "zod";
import { descriptionSchema } from "./common.schema";
import workspaces from "@/messages/en/workspaces.json";

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, workspaces.validation.nameMinLength)
    .max(100, workspaces.validation.nameMaxLength),
  description: descriptionSchema,
  logoUrl: z.url(workspaces.validation.logoUrlInvalid).optional(),
});

export const updateWorkspaceSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, workspaces.validation.nameMinLength)
      .max(100, workspaces.validation.nameMaxLength)
      .optional(),
    description: descriptionSchema.nullable(),
    // Nullable para permitir borrar el contenido ya que este es opcional
    logoUrl: z.url(workspaces.validation.logoUrlInvalid).optional().nullable(),
  })
  .refine((data) => Object.keys(data).length > 0, workspaces.validation.atLeastOneField);

export const updateWorkspaceNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, workspaces.validation.nameMinLength)
    .max(100, workspaces.validation.nameMaxLength),
});

export const updateWorkspaceDescriptionSchema = z.object({
  description: descriptionSchema.nullable(),
});

export type CreateWorkspaceDto = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceDto = z.infer<typeof updateWorkspaceSchema>;
export type UpdateWorkspaceNameDto = z.infer<typeof updateWorkspaceNameSchema>;
export type UpdateWorkspaceDescriptionDto = z.infer<typeof updateWorkspaceDescriptionSchema>;
