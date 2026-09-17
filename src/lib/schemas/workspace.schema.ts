import z from "zod";
import { descriptionSchema } from "./common.schema";
import type { Translator } from "./common.schema";

export const createWorkspaceSchema = (t: Translator) =>
  z.object({
    name: z.string().trim().min(2, t("validation.nameMinLength")).max(100, t("validation.nameMaxLength")),
    description: descriptionSchema(t),
    logoUrl: z.url(t("validation.logoUrlInvalid")).optional(),
  });

export const updateWorkspaceSchema = (t: Translator) =>
  z
    .object({
      name: z.string().trim().min(2, t("validation.nameMinLength")).max(100, t("validation.nameMaxLength")).optional(),
      description: descriptionSchema(t).nullable(),
      // Nullable para permitir borrar el contenido ya que este es opcional
      logoUrl: z.url(t("validation.logoUrlInvalid")).optional().nullable(),
    })
    .refine((data) => Object.keys(data).length > 0, t("validation.atLeastOneField"));

export const updateWorkspaceNameSchema = (t: Translator) =>
  z.object({
    name: z.string().trim().min(2, t("validation.nameMinLength")).max(100, t("validation.nameMaxLength")),
  });

export const updateWorkspaceDescriptionSchema = (t: Translator) =>
  z.object({
    description: descriptionSchema(t).nullable(),
  });

export type CreateWorkspaceDto = z.infer<ReturnType<typeof createWorkspaceSchema>>;
export type UpdateWorkspaceDto = z.infer<ReturnType<typeof updateWorkspaceSchema>>;
export type UpdateWorkspaceNameDto = z.infer<ReturnType<typeof updateWorkspaceNameSchema>>;
export type UpdateWorkspaceDescriptionDto = z.infer<ReturnType<typeof updateWorkspaceDescriptionSchema>>;
