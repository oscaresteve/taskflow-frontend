import z from "zod";
import { descriptionSchema } from "./common.schema";

export const createProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long")
    .max(100, "Name cannot exceed 100 characters"),
  key: z
    .string()
    .trim()
    .min(2, "Key must be at least 2 characters long")
    .max(10, "Key cannot exceed 10 characters")
    .regex(/^[A-Z0-9]+$/, "Key must contain only uppercase letters and numbers"),
  description: descriptionSchema,
  icon: z.string().optional(),
  color: z.string().optional(),
});

export const updateProjectSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters long")
      .max(100, "Name cannot exceed 100 characters")
      .optional(),
    description: descriptionSchema.nullable(),
    icon: z.string("Icon must be a string").optional().nullable(),
    color: z.string("Color must be a string").optional().nullable(),
  })
  .refine((data) => Object.keys(data).length > 0, "At least one field must be provided");

export type CreateProjectDto = z.infer<typeof createProjectSchema>;
export type UpdateProjectDto = z.infer<typeof updateProjectSchema>;
