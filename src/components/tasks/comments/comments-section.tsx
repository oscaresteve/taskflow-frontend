"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { getMeQuery } from "@/lib/queries/auth.queries";
import { useProjectRole } from "@/hooks/use-project-role";
import { isProjectManager } from "@/lib/permissions/project-member-permissions";
import { ProjectMemberWithUserResponseDto } from "@/lib/dtos/project-members.dto";
import { CommentList } from "./comment-list";
import { CommentForm } from "./comment-form";
import { getCommentsInfiniteQuery } from "@/lib/queries/comment.queries";

const PAGE_SIZE = 20;

const ORDER = "desc";

interface CommentsSectionProps {
  workspaceSlug: string;
  projectSlug: string;
  taskNumber: string;
  members: ProjectMemberWithUserResponseDto[];
}

export function CommentsSection({ workspaceSlug, projectSlug, taskNumber, members }: CommentsSectionProps) {
  const t = useTranslations("tasks");
  const { data: me } = useQuery(getMeQuery());
  const { role: myRole } = useProjectRole(workspaceSlug, projectSlug);
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    getCommentsInfiniteQuery({ workspaceSlug, projectSlug, taskNumber, limit: PAGE_SIZE, order: ORDER }),
  );

  const comments = data?.pages.flatMap((page) => page.data) ?? [];
  const remaining = data ? data.pages[data.pages.length - 1].pagination.total - comments.length : 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <h2 className="text-sm font-semibold">{t("comments.title")}</h2>

      <CommentList
        workspaceSlug={workspaceSlug}
        projectSlug={projectSlug}
        taskNumber={taskNumber}
        members={members}
        meId={me?.id}
        canManageAny={isProjectManager(myRole)}
        comments={comments}
        remaining={remaining}
        isLoading={isLoading}
        isError={isError}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />

      <CommentForm workspaceSlug={workspaceSlug} projectSlug={projectSlug} taskNumber={taskNumber} />
    </div>
  );
}
