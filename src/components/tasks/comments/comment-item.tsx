"use client";

import { useState } from "react";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";
import { ApiError } from "@/lib/http/api-error";
import { CommentResponseDto } from "@/lib/dtos/comments.dto";
import { getFullName, getInitials } from "@/lib/utils";
import { useDeleteComment } from "@/hooks/use-delete-comment";
import { CommentForm } from "./comment-form";
import { useQuery } from "@tanstack/react-query";
import { getProjectMemberQuery } from "@/lib/queries/project-member.queries";

interface CommentItemProps {
  comment: CommentResponseDto;
  authorId: string;
  workspaceSlug: string;
  projectSlug: string;
  taskNumber: string;
  canEdit: boolean;
  canDelete: boolean;
}

export function CommentItem({
  comment,
  authorId,
  workspaceSlug,
  projectSlug,
  taskNumber,
  canEdit,
  canDelete,
}: CommentItemProps) {
  const t = useTranslations("tasks");
  const format = useFormatter();
  const [editing, setEditing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const deleteComment = useDeleteComment(workspaceSlug, projectSlug, taskNumber);
  const { data: author } = useQuery(getProjectMemberQuery({ workspaceSlug, projectSlug, userId: authorId }));
  const authorName = author ? getFullName(author.user.firstName, author.user.lastName) : undefined;

  function handleDelete() {
    deleteComment.mutate(comment.id, {
      onSuccess: () => {
        setDeleteOpen(false);
        toast.add({ type: "success", description: t("comments.deleteSuccess") });
      },
      onError: (error) => {
        toast.add({
          type: "error",
          description: error instanceof ApiError ? error.message : t("errors.generic"),
          priority: "high",
        });
      },
    });
  }

  if (editing) {
    return (
      <CommentForm
        workspaceSlug={workspaceSlug}
        projectSlug={projectSlug}
        taskNumber={taskNumber}
        commentId={comment.id}
        initialContent={comment.content}
        onDone={() => setEditing(false)}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <div className="flex gap-2 group">
      <Avatar size="sm">
        <AvatarImage src={author?.user.avatarUrl ?? undefined} alt={authorName} />
        <AvatarFallback>{authorName ? getInitials(authorName) : "?"}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{authorName ?? t("comments.unknownAuthor")}</span>
          <span className="text-xs text-muted-foreground">
            {format.relativeTime(new Date(comment.createdAt), new Date())}
          </span>
          {comment.editedAt && <span className="text-xs text-muted-foreground">{t("comments.edited")}</span>}
        </div>
        <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
      </div>
      {(canEdit || canDelete) && (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity data-popup-open:opacity-100 focus-visible:opacity-100"
              />
            }
          >
            <MoreHorizontal />
            <span className="sr-only">{t("comments.actionsSrOnly")}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {canEdit && <DropdownMenuItem onClick={() => setEditing(true)}>{t("comments.edit")}</DropdownMenuItem>}
            {canDelete && (
              <DropdownMenuItem variant="destructive" onClick={() => setDeleteOpen(true)}>
                {t("comments.delete")}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={t("comments.deleteConfirmTitle")}
        description={t("comments.deleteConfirmDescription")}
        confirmLabel={t("comments.delete")}
        variant="destructive"
        onConfirm={handleDelete}
        pending={deleteComment.isPending}
        Icon={Trash2}
      />
    </div>
  );
}
