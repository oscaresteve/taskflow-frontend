"use client";

import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import { getCommentsInfiniteQuery } from "@/lib/queries/comment.queries";
import { ProjectMemberWithUserResponseDto } from "@/lib/dtos/project-members.dto";
import { CommentItem } from "./comment-item";

const PAGE_SIZE = 20;

interface CommentListProps {
  workspaceSlug: string;
  projectSlug: string;
  taskNumber: string;
  members: ProjectMemberWithUserResponseDto[];
  meId: string | undefined;
  canManageAny: boolean;
}

export function CommentList({
  workspaceSlug,
  projectSlug,
  taskNumber,
  members,
  meId,
  canManageAny,
}: CommentListProps) {
  const t = useTranslations("tasks");
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    getCommentsInfiniteQuery({ workspaceSlug, projectSlug, taskNumber, limit: PAGE_SIZE }),
  );

  const membersById = useMemo(() => new Map(members.map((member) => [member.userId, member.user])), [members]);
  const comments = data?.pages.flatMap((page) => page.data) ?? [];
  const remaining = data ? data.pages[data.pages.length - 1].pagination.total - comments.length : 0;

  if (isError) {
    return <p className="text-sm text-muted-foreground">{t("comments.failedToLoad")}</p>;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {comments.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("comments.empty")}</p>
      ) : (
        comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            author={membersById.get(comment.authorId)}
            workspaceSlug={workspaceSlug}
            projectSlug={projectSlug}
            taskNumber={taskNumber}
            canEdit={comment.authorId === meId}
            canDelete={comment.authorId === meId || canManageAny}
          />
        ))
      )}
      {hasNextPage && (
        <button
          type="button"
          onClick={() => !isFetchingNextPage && fetchNextPage()}
          aria-disabled={isFetchingNextPage}
          className="cursor-pointer self-start text-sm text-muted-foreground hover:text-foreground"
        >
          {isFetchingNextPage ? t("comments.loading") : t("comments.remaining", { count: remaining })}
        </button>
      )}
    </div>
  );
}
