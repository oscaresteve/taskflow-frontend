import { infiniteQueryOptions } from "@tanstack/react-query";
import { commentKeys } from "@/lib/query-keys/comment.keys";
import { getComments } from "@/lib/api/comments.api";
import { getNextPageParam } from "@/lib/queries/pagination";

export const getCommentsInfiniteQuery = ({
  workspaceSlug,
  projectSlug,
  taskNumber,
  limit,
}: {
  workspaceSlug: string;
  projectSlug: string;
  taskNumber: string;
  limit?: number;
}) =>
  infiniteQueryOptions({
    queryKey: commentKeys.infiniteList(workspaceSlug, projectSlug, taskNumber, { limit }),
    queryFn: ({ pageParam }) => getComments({ workspaceSlug, projectSlug, taskNumber, page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam,
    enabled: !!workspaceSlug && !!projectSlug && !!taskNumber,
  });
