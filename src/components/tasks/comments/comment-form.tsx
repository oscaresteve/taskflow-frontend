"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { ApiError } from "@/lib/http/api-error";
import { useCreateComment } from "@/hooks/use-create-comment";
import { useUpdateComment } from "@/hooks/use-update-comment";
import { CreateCommentDto, createCommentSchema, updateCommentSchema } from "@/lib/schemas/comment.schema";
import { getFullName, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { getMeQuery } from "@/lib/queries/auth.queries";

const MAX_LENGTH = 5000;

interface CommentFormProps {
  workspaceSlug: string;
  projectSlug: string;
  taskNumber: string;
  commentId?: string;
  initialContent?: string;
  onDone?: () => void;
}

export function CommentForm({
  workspaceSlug,
  projectSlug,
  taskNumber,
  commentId,
  initialContent,
  onDone,
}: CommentFormProps) {
  const t = useTranslations("tasks");
  const tCommon = useTranslations("common");
  const createComment = useCreateComment(workspaceSlug, projectSlug, taskNumber);
  const updateComment = useUpdateComment(workspaceSlug, projectSlug, taskNumber);
  const isEditing = !!commentId;
  const { data: author } = useQuery(getMeQuery());
  const authorName = author ? getFullName(author.firstName, author.lastName) : undefined;

  const form = useForm<CreateCommentDto>({
    resolver: zodResolver(isEditing ? updateCommentSchema : createCommentSchema),
    defaultValues: { content: initialContent ?? "" },
  });

  async function onSubmit(data: CreateCommentDto) {
    if (isEditing && !form.formState.isDirty) {
      onDone?.();
      return;
    }

    try {
      if (isEditing) {
        await updateComment.mutateAsync({ commentId, data });
        toast.add({ type: "success", description: t("comments.updateSuccess") });
      } else {
        await createComment.mutateAsync(data);
        form.reset({ content: "" });
        toast.add({ type: "success", description: t("comments.createSuccess") });
      }
      onDone?.();
    } catch (error) {
      toast.add({
        type: "error",
        description: error instanceof ApiError ? error.message : t("errors.generic"),
        priority: "high",
      });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Avatar size="sm">
          <AvatarImage src={author?.avatarUrl ?? undefined} alt={authorName} />
          <AvatarFallback>{authorName ? getInitials(authorName) : "?"}</AvatarFallback>
        </Avatar>
        <Textarea
          {...form.register("content")}
          aria-label={t("comments.title")}
          placeholder={t("comments.composerPlaceholder")}
          maxLength={MAX_LENGTH}
          disabled={form.formState.isSubmitting}
          autoFocus={isEditing}
        />
      </div>
      <div className="flex justify-end gap-2">
        {isEditing && (
          <Button type="button" variant="outline" size="sm" onClick={onDone} disabled={form.formState.isSubmitting}>
            {tCommon("actions.cancel")}
          </Button>
        )}
        <Button
          type="submit"
          size="sm"
          disabled={form.formState.isSubmitting || (isEditing && !form.formState.isDirty)}
        >
          {form.formState.isSubmitting && <Loader2Icon className="animate-spin" aria-hidden="true" />}
          {isEditing ? tCommon("actions.save") : t("comments.submit")}
        </Button>
      </div>
    </form>
  );
}
