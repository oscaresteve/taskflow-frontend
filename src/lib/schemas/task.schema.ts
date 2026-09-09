import z from "zod";
import { descriptionSchema } from "./common.schema";
import tasks from "@/messages/en/tasks.json";

export const taskPriorities = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;
export const taskStatuses = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"] as const;

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, tasks.validation.titleMinLength)
    .max(100, tasks.validation.titleMaxLength),
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
      .min(2, tasks.validation.titleMinLength)
      .max(100, tasks.validation.titleMaxLength)
      .optional(),
    description: descriptionSchema.nullable(),
    priority: z.enum(taskPriorities).optional(),
    status: z.enum(taskStatuses).optional(),
    assigneeId: z.cuid().optional().nullable(),
    dueDate: z.iso.datetime().optional().nullable(),
  })
  .refine((data) => Object.keys(data).length > 0, tasks.validation.atLeastOneField);

export type CreateTaskDto = z.infer<typeof createTaskSchema>;
export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;
