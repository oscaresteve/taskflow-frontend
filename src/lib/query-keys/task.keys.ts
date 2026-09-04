import { TaskStatus } from "@/lib/dtos/tasks.dto";

export const taskKeys = {
  all: ["tasks"] as const,
  // Prefix shared by every column's paginated list for a project — invalidating this (no status)
  // marks all 4 columns stale at once, since react-query treats a key as a prefix match.
  columnLists: (workspaceSlug: string, projectSlug: string) =>
    [...taskKeys.all, "column-list", workspaceSlug, projectSlug] as const,
  columnList: (workspaceSlug: string, projectSlug: string, status: TaskStatus, params: { limit?: number } = {}) =>
    [...taskKeys.columnLists(workspaceSlug, projectSlug), status, params] as const,
  detail: (workspaceSlug: string, projectSlug: string, taskNumber: string) =>
    [...taskKeys.all, "detail", workspaceSlug, projectSlug, taskNumber] as const,
};
