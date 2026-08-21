import z from "zod";
import { descriptionSchema } from "./common.schema";

export const taskPriorities = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;

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

export type CreateTaskDto = z.infer<typeof createTaskSchema>;
