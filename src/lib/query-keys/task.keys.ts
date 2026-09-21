import { SortOrder } from "@/lib/dtos/pagination.dto";
import { DueDateFilter, PriorityFilter, TaskSortField } from "@/lib/task-enums";

type TaskListParams = {
  page?: number;
  limit?: number;
  search?: string;
  assigneeId?: string;
  priority?: PriorityFilter;
  dueDate?: DueDateFilter;
  isFavorite?: boolean;
  sort?: TaskSortField;
  order?: SortOrder;
};

export const taskKeys = {
  all: ["tasks"] as const,
  board: (workspaceSlug: string, projectSlug: string) =>
    [...taskKeys.all, "board", workspaceSlug, projectSlug] as const,
  lists: (workspaceSlug: string, projectSlug: string, params: TaskListParams = {}) =>
    [...taskKeys.all, "list", workspaceSlug, projectSlug, params] as const,
  detail: (workspaceSlug: string, projectSlug: string, taskNumber: string) =>
    [...taskKeys.all, "detail", workspaceSlug, projectSlug, taskNumber] as const,
};
