import z from "zod";
import tasks from "@/messages/en/tasks.json";

export const createCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, tasks.comments.validation.contentRequired)
    .max(5000, tasks.comments.validation.contentMaxLength),
});

export const updateCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, tasks.comments.validation.contentRequired)
    .max(5000, tasks.comments.validation.contentMaxLength),
});

export type CreateCommentDto = z.infer<typeof createCommentSchema>;
export type UpdateCommentDto = z.infer<typeof updateCommentSchema>;
