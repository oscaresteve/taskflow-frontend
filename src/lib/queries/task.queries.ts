import { queryOptions } from "@tanstack/react-query";
import { getBoardTasks, getTask } from "@/lib/api/tasks.api";
import { taskKeys } from "@/lib/query-keys/task.keys";

export const getTasksBoardQuery = (workspaceSlug: string, projectSlug: string) =>
  queryOptions({
    queryKey: taskKeys.board(workspaceSlug, projectSlug),
    queryFn: () => getBoardTasks({ workspaceSlug, projectSlug }),
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
