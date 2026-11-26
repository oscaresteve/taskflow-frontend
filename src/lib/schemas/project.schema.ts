import z from "zod";
import { descriptionSchema } from "./common.schema";
import type { Translator } from "./common.schema";

export const createProjectSchema = (t: Translator) =>
  z.object({
    name: z.string().trim().min(2, t("validation.nameMinLength")).max(100, t("validation.nameMaxLength")),
    key: z
      .string()
      .trim()
      .min(2, t("validation.keyMinLength"))
      .max(10, t("validation.keyMaxLength"))
      .regex(/^[A-Z0-9]+$/, t("validation.keyFormat")),
    description: descriptionSchema(t),
    color: z.string().optional(),
  });

export const updateProjectSchema = (t: Translator) =>
  z
    .object({
      name: z.string().trim().min(2, t("validation.nameMinLength")).max(100, t("validation.nameMaxLength")).optional(),
      description: descriptionSchema(t).nullable(),
      color: z.string(t("validation.colorMustBeString")).optional().nullable(),
    })
    .refine((data) => Object.keys(data).length > 0, t("validation.atLeastOneField"));

export const updateProjectNameSchema = (t: Translator) =>
  z.object({
    name: z.string().trim().min(2, t("validation.nameMinLength")).max(100, t("validation.nameMaxLength")),
  });

export const updateProjectDescriptionSchema = (t: Translator) =>
  z.object({
    description: descriptionSchema(t).nullable(),
  });

export const updateProjectColorSchema = z.object({
  color: z.string().nullable(),
});

export type CreateProjectDto = z.infer<ReturnType<typeof createProjectSchema>>;
export type UpdateProjectDto = z.infer<ReturnType<typeof updateProjectSchema>>;
export type UpdateProjectNameDto = z.infer<ReturnType<typeof updateProjectNameSchema>>;
export type UpdateProjectDescriptionDto = z.infer<ReturnType<typeof updateProjectDescriptionSchema>>;
export type UpdateProjectColorDto = z.infer<typeof updateProjectColorSchema>;
