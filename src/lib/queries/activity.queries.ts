import { infiniteQueryOptions } from "@tanstack/react-query";
import { activityKeys } from "@/lib/query-keys/activity.keys";
import { getProjectActivity, getTaskActivity } from "@/lib/api/activity.api";
import { getNextPageParam } from "@/lib/queries/pagination";

export const getProjectActivityInfiniteQuery = ({
  workspaceSlug,
  projectSlug,
  limit,
}: {
  workspaceSlug: string;
  projectSlug: string;
  limit?: number;
}) =>
  infiniteQueryOptions({
    queryKey: activityKeys.projectInfiniteList(workspaceSlug, projectSlug, { limit }),
    queryFn: ({ pageParam }) => getProjectActivity({ workspaceSlug, projectSlug, page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam,
    enabled: !!workspaceSlug && !!projectSlug,
  });

export const getTaskActivityInfiniteQuery = ({
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
    queryKey: activityKeys.taskInfiniteList(workspaceSlug, projectSlug, taskNumber, { limit }),
    queryFn: ({ pageParam }) => getTaskActivity({ workspaceSlug, projectSlug, taskNumber, page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam,
    enabled: !!workspaceSlug && !!projectSlug && !!taskNumber,
  });
