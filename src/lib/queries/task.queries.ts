import { queryOptions } from "@tanstack/react-query";
import { getBoardTasks, getTask, getTasks } from "@/lib/api/tasks.api";
import { taskKeys } from "@/lib/query-keys/task.keys";
import { SortOrder } from "@/lib/dtos/pagination.dto";
import { ALL_ASSIGNEES, DueDateFilter, PriorityFilter, TaskSortField } from "@/lib/task-enums";

export const getTasksBoardQuery = (workspaceSlug: string, projectSlug: string) =>
  queryOptions({
    queryKey: taskKeys.board(workspaceSlug, projectSlug),
    queryFn: () => getBoardTasks({ workspaceSlug, projectSlug }),
    enabled: !!workspaceSlug && !!projectSlug,
  });

export const getTasksQuery = ({
  workspaceSlug,
  projectSlug,
  page,
  limit,
  search,
  assigneeId,
  priority,
  dueDate,
  isFavorite,
  sort,
  order,
}: {
  workspaceSlug: string;
  projectSlug: string;
  page?: number;
  limit?: number;
  search?: string;
  assigneeId?: string;
  priority?: PriorityFilter;
  dueDate?: DueDateFilter;
  isFavorite?: boolean;
  sort?: TaskSortField;
  order?: SortOrder;
}) =>
  queryOptions({
    queryKey: taskKeys.lists(workspaceSlug, projectSlug, {
      page,
      limit,
      search,
      assigneeId,
      priority,
      dueDate,
      isFavorite,
      sort,
      order,
    }),
    queryFn: () =>
      getTasks({
        workspaceSlug,
        projectSlug,
        page,
        limit,
        search: search || undefined,
        assigneeId: assigneeId && assigneeId !== ALL_ASSIGNEES ? assigneeId : undefined,
        priority: priority && priority !== "ALL" ? priority : undefined,
        dueDate: dueDate && dueDate !== "ALL" ? dueDate : undefined,
        isFavorite: isFavorite || undefined,
        sort,
        order,
      }),
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
