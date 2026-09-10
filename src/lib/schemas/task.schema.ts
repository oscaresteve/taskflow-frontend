import z from "zod";
import { descriptionSchema } from "./common.schema";
import tasks from "@/messages/en/tasks.json";
import common from "@/messages/en/common.json";

export const taskPriorities = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;
export const taskStatuses = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"] as const;

export const taskTitleSchema = z
  .string()
  .trim()
  .min(2, tasks.validation.titleMinLength)
  .max(100, tasks.validation.titleMaxLength);

export const taskDescriptionFieldSchema = z.string().trim().max(500, common.validation.descriptionMaxLength);

export const createTaskSchema = z.object({
  title: taskTitleSchema,
  description: descriptionSchema,
  priority: z.enum(taskPriorities),
  assigneeId: z.cuid().optional(),
  dueDate: z.iso.datetime().optional(),
});

export const updateTaskSchema = z
  .object({
    title: taskTitleSchema.optional(),
    description: descriptionSchema.nullable(),
    priority: z.enum(taskPriorities).optional(),
    status: z.enum(taskStatuses).optional(),
    assigneeId: z.cuid().optional().nullable(),
    dueDate: z.iso.datetime().optional().nullable(),
  })
  .refine((data) => Object.keys(data).length > 0, tasks.validation.atLeastOneField);

export const updateTaskStatusSchema = z.object({
  status: z.enum(taskStatuses),
});

export const updateTaskPrioritySchema = z.object({
  priority: z.enum(taskPriorities),
});

export const updateTaskAssigneeSchema = z.object({
  assigneeId: z.cuid().nullable(),
});

export const updateTaskDueDateSchema = z.object({
  dueDate: z.iso.datetime().nullable(),
});

export type CreateTaskDto = z.infer<typeof createTaskSchema>;
export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;
export type UpdateTaskStatusDto = z.infer<typeof updateTaskStatusSchema>;
export type UpdateTaskPriorityDto = z.infer<typeof updateTaskPrioritySchema>;
export type UpdateTaskAssigneeDto = z.infer<typeof updateTaskAssigneeSchema>;
export type UpdateTaskDueDateDto = z.infer<typeof updateTaskDueDateSchema>;
