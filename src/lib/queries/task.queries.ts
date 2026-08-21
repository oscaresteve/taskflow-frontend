import { queryOptions } from "@tanstack/react-query";
import { getTask, getTasks } from "@/lib/api/tasks.api";
import { taskKeys } from "@/lib/query-keys/task.keys";

export const getTasksQuery = (workspaceSlug: string, projectSlug: string) =>
  queryOptions({
    queryKey: taskKeys.lists(workspaceSlug, projectSlug),
    queryFn: () => getTasks(workspaceSlug, projectSlug),
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
