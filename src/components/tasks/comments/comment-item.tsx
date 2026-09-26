"use client";

import { useState } from "react";
import { ICONS } from "@/lib/icons";
import { useFormatter, useTranslations } from "next-intl";
import { CustomAvatar } from "@/components/common/custom-avatar";
import { UserPopup } from "@/components/common/user-popup";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ActionsMenuContent, ActionsMenuItem } from "@/components/common/actions-menu";
import { toast } from "@/components/ui/toast";
import { ApiError } from "@/lib/http/api-error";
import { CommentResponseDto } from "@/lib/dtos/comments.dto";
import { getFullName } from "@/lib/utils";
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
      <Tooltip>
        <UserPopup
          userId={authorId}
          align="start"
          render={
            <TooltipTrigger
              render={
                <CustomAvatar
                  size="sm"
                  avatarUrl={author?.user.avatarUrl ?? null}
                  alt={authorName}
                  seed={authorId}
                  variant="glyphs"
                  className="cursor-pointer"
                />
              }
            />
          }
        />
        <TooltipContent>{authorName ?? t("comments.unknownAuthor")}</TooltipContent>
      </Tooltip>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{authorName ?? t("comments.unknownAuthor")}</span>
          <span className="text-xs text-muted-foreground">
            {format.relativeTime(new Date(comment.createdAt), new Date())}
          </span>
          {comment.editedAt && <span className="text-xs text-muted-foreground">{t("comments.edited")}</span>}
          {canEdit && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    onClick={() => setEditing(true)}
                    variant="ghost"
                    size="icon-sm"
                    className="text-muted-foreground"
                    aria-label={t("comments.edit")}
                  />
                }
              >
                <ICONS.edit />
              </TooltipTrigger>
              <TooltipContent>{t("comments.edit")}</TooltipContent>
            </Tooltip>
          )}
          {canDelete && (
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="ml-auto text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 data-popup-open:opacity-100"
                          aria-label={t("comments.actionsSrOnly")}
                        />
                      }
                    />
                  }
                >
                  <ICONS.moreActions />
                </TooltipTrigger>
                <TooltipContent>{t("comments.actionsSrOnly")}</TooltipContent>
              </Tooltip>
              <ActionsMenuContent align="end">
                <ActionsMenuItem variant="destructive" onClick={() => setDeleteOpen(true)}>
                  <ICONS.delete />
                  {t("comments.delete")}
                </ActionsMenuItem>
              </ActionsMenuContent>
            </DropdownMenu>
          )}
        </div>
        <p className="mt-1 text-sm whitespace-pre-wrap">{comment.content}</p>
      </div>
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={t("comments.deleteConfirmTitle")}
        description={t("comments.deleteConfirmDescription")}
        confirmLabel={t("comments.delete")}
        variant="destructive"
        onConfirm={handleDelete}
        pending={deleteComment.isPending}
        Icon={ICONS.delete}
      />
    </div>
  );
}
