import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { getTask, getTasks } from "@/lib/api/tasks.api";
import { taskKeys } from "@/lib/query-keys/task.keys";
import { getNextPageParam } from "@/lib/queries/pagination";
import { TaskStatus } from "@/lib/dtos/tasks.dto";

// Each Kanban column paginates independently — a project can have far more than the backend's
// 100-item page cap in a single status, and a column's own "load more" (user-triggered, same
// pattern as the sidebar's project list) scales to that without ever exceeding the cap or
// fetching columns the user isn't looking at.
export const getTasksColumnQuery = (workspaceSlug: string, projectSlug: string, status: TaskStatus, limit: number) =>
  infiniteQueryOptions({
    queryKey: taskKeys.columnList(workspaceSlug, projectSlug, status, { limit }),
    queryFn: ({ pageParam }) =>
      getTasks({ workspaceSlug, projectSlug, status, page: pageParam, limit, isArchived: false }),
    initialPageParam: 1,
    getNextPageParam,
    enabled: !!workspaceSlug && !!projectSlug,
  });

export const getTaskQuery = ({
  workspaceSlug,
  projectSlug,
  taskNumber,
}: {
  workspaceSlug: string;
  projectSlug: string;
  taskNumber: string;
}) =>
  queryOptions({
    queryKey: taskKeys.detail(workspaceSlug, projectSlug, taskNumber),
    queryFn: () => getTask({ workspaceSlug, projectSlug, taskNumber }),
    enabled: !!workspaceSlug && !!projectSlug && !!taskNumber,
  });
