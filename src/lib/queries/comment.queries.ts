import { infiniteQueryOptions } from "@tanstack/react-query";
import { commentKeys } from "@/lib/query-keys/comment.keys";
import { getComments } from "@/lib/api/comments.api";
import { getNextPageParam } from "@/lib/queries/pagination";
import { SortOrder } from "@/lib/dtos/pagination.dto";

export const getCommentsInfiniteQuery = ({
  workspaceSlug,
  projectSlug,
  taskNumber,
  limit,
  order,
}: {
  workspaceSlug: string;
  projectSlug: string;
  taskNumber: string;
  limit?: number;
  order?: SortOrder;
}) =>
  infiniteQueryOptions({
    queryKey: commentKeys.infiniteList(workspaceSlug, projectSlug, taskNumber, { limit, order }),
    queryFn: ({ pageParam }) => getComments({ workspaceSlug, projectSlug, taskNumber, page: pageParam, limit, order }),
    initialPageParam: 1,
    getNextPageParam,
    enabled: !!workspaceSlug && !!projectSlug && !!taskNumber,
  });
