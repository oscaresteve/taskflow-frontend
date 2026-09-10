"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { ApiError } from "@/lib/http/api-error";
import { useCreateComment } from "@/hooks/use-create-comment";
import { useUpdateComment } from "@/hooks/use-update-comment";

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
  const [content, setContent] = useState(initialContent ?? "");
  const createComment = useCreateComment(workspaceSlug, projectSlug, taskNumber);
  const updateComment = useUpdateComment(workspaceSlug, projectSlug, taskNumber);
  const isEditing = !!commentId;
  const pending = isEditing ? updateComment.isPending : createComment.isPending;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;

    try {
      if (isEditing) {
        await updateComment.mutateAsync({ commentId, data: { content: trimmed } });
        toast.add({ type: "success", description: t("comments.updateSuccess") });
      } else {
        await createComment.mutateAsync({ content: trimmed });
        setContent("");
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        aria-label={t("comments.title")}
        placeholder={t("comments.composerPlaceholder")}
        maxLength={MAX_LENGTH}
        disabled={pending}
        autoFocus={isEditing}
      />
      <div className="flex justify-end gap-2">
        {isEditing && (
          <Button type="button" variant="outline" size="sm" onClick={onDone} disabled={pending}>
            {tCommon("actions.cancel")}
          </Button>
        )}
        <Button type="submit" size="sm" disabled={pending || !content.trim()}>
          {pending && <Loader2Icon className="animate-spin" aria-hidden="true" />}
          {isEditing ? tCommon("actions.save") : t("comments.submit")}
        </Button>
      </div>
    </form>
  );
}
