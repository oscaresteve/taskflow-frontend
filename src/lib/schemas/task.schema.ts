import z from "zod";
import { descriptionSchema } from "./common.schema";

export const taskPriorities = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;
export const taskStatuses = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"] as const;

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters long")
    .max(100, "Title cannot exceed 100 characters"),
  description: descriptionSchema,
  priority: z.enum(taskPriorities),
  assigneeId: z.cuid().optional(),
  dueDate: z.iso.datetime().optional(),
});

export const updateTaskSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2, "Title must be at least 2 characters long")
      .max(100, "Title cannot exceed 100 characters")
      .optional(),
    description: descriptionSchema.nullable(),
    priority: z.enum(taskPriorities).optional(),
    status: z.enum(taskStatuses).optional(),
    assigneeId: z.cuid().optional().nullable(),
    dueDate: z.iso.datetime().optional().nullable(),
    position: z.number().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, "At least one field must be provided");

export type CreateTaskDto = z.infer<typeof createTaskSchema>;
export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;
