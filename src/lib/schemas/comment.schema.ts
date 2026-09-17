import z from "zod";
import type { Translator } from "./common.schema";

export const createCommentSchema = (t: Translator) =>
  z.object({
    content: z
      .string()
      .trim()
      .min(1, t("comments.validation.contentRequired"))
      .max(5000, t("comments.validation.contentMaxLength")),
  });

export const updateCommentSchema = (t: Translator) =>
  z.object({
    content: z
      .string()
      .trim()
      .min(1, t("comments.validation.contentRequired"))
      .max(5000, t("comments.validation.contentMaxLength")),
  });

export type CreateCommentDto = z.infer<ReturnType<typeof createCommentSchema>>;
export type UpdateCommentDto = z.infer<ReturnType<typeof updateCommentSchema>>;
