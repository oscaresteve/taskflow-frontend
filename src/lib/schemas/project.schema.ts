import z from "zod";
import { descriptionSchema } from "./common.schema";
import projects from "@/messages/en/projects.json";

export const createProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, projects.validation.nameMinLength)
    .max(100, projects.validation.nameMaxLength),
  key: z
    .string()
    .trim()
    .min(2, projects.validation.keyMinLength)
    .max(10, projects.validation.keyMaxLength)
    .regex(/^[A-Z0-9]+$/, projects.validation.keyFormat),
  description: descriptionSchema,
  icon: z.string().optional(),
  color: z.string().optional(),
});

export const updateProjectSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, projects.validation.nameMinLength)
      .max(100, projects.validation.nameMaxLength)
      .optional(),
    description: descriptionSchema.nullable(),
    icon: z.string(projects.validation.iconMustBeString).optional().nullable(),
    color: z.string(projects.validation.colorMustBeString).optional().nullable(),
  })
  .refine((data) => Object.keys(data).length > 0, projects.validation.atLeastOneField);

export const updateProjectNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, projects.validation.nameMinLength)
    .max(100, projects.validation.nameMaxLength),
});

export const updateProjectDescriptionSchema = z.object({
  description: descriptionSchema.nullable(),
});

export const updateProjectColorSchema = z.object({
  color: z.string().nullable(),
});

export type CreateProjectDto = z.infer<typeof createProjectSchema>;
export type UpdateProjectDto = z.infer<typeof updateProjectSchema>;
export type UpdateProjectNameDto = z.infer<typeof updateProjectNameSchema>;
export type UpdateProjectDescriptionDto = z.infer<typeof updateProjectDescriptionSchema>;
export type UpdateProjectColorDto = z.infer<typeof updateProjectColorSchema>;
