import z from "zod";
import { descriptionSchema } from "./common.schema";
import type { Translator } from "./common.schema";

export const taskPriorities = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;
export const taskStatuses = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"] as const;

export const taskTitleSchema = (t: Translator) =>
  z.string().trim().min(2, t("validation.titleMinLength")).max(100, t("validation.titleMaxLength"));

export const taskDescriptionFieldSchema = (t: Translator) =>
  z.string().trim().max(500, t("validation.descriptionMaxLength"));

export const createTaskSchema = (t: Translator) =>
  z.object({
    title: taskTitleSchema(t),
    description: descriptionSchema(t),
    priority: z.enum(taskPriorities),
    assigneeId: z.cuid().optional(),
    dueDate: z.iso.datetime().optional(),
  });

export const updateTaskSchema = (t: Translator) =>
  z
    .object({
      title: taskTitleSchema(t).optional(),
      description: descriptionSchema(t).nullable(),
      priority: z.enum(taskPriorities).optional(),
      status: z.enum(taskStatuses).optional(),
      assigneeId: z.cuid().optional().nullable(),
      dueDate: z.iso.datetime().optional().nullable(),
    })
    .refine((data) => Object.keys(data).length > 0, t("validation.atLeastOneField"));

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

export type CreateTaskDto = z.infer<ReturnType<typeof createTaskSchema>>;
export type UpdateTaskDto = z.infer<ReturnType<typeof updateTaskSchema>>;
export type UpdateTaskStatusDto = z.infer<typeof updateTaskStatusSchema>;
export type UpdateTaskPriorityDto = z.infer<typeof updateTaskPrioritySchema>;
export type UpdateTaskAssigneeDto = z.infer<typeof updateTaskAssigneeSchema>;
export type UpdateTaskDueDateDto = z.infer<typeof updateTaskDueDateSchema>;
