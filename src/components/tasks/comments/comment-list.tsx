"use client";

import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyInline } from "@/components/common/empty-inline";
import { CommentItem } from "./comment-item";
import { CommentResponseDto } from "@/lib/dtos/comments.dto";
import { ICONS } from "@/lib/icons";

interface CommentListProps {
  workspaceSlug: string;
  projectSlug: string;
  taskNumber: string;
  meId: string | undefined;
  canManageAny: boolean;
  comments: CommentResponseDto[];
  remaining: number;
  isLoading: boolean;
  isError: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export function CommentList({
  workspaceSlug,
  projectSlug,
  taskNumber,
  meId,
  canManageAny,
  comments,
  remaining,
  isLoading,
  isError,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: CommentListProps) {
  const t = useTranslations("tasks");

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

  if (comments.length === 0) {
    return <EmptyInline icon={ICONS.messages} label={t("comments.empty")} className="py-2" />;
  }

  return (
    <div className="-mx-4 flex flex-col gap-4 overflow-y-auto px-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          authorId={comment.authorId}
          workspaceSlug={workspaceSlug}
          projectSlug={projectSlug}
          taskNumber={taskNumber}
          canEdit={comment.authorId === meId}
          canDelete={comment.authorId === meId || canManageAny}
        />
      ))}
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
