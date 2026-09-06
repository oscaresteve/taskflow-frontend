export const taskKeys = {
  all: ["tasks"] as const,
  board: (workspaceSlug: string, projectSlug: string) =>
    [...taskKeys.all, "board", workspaceSlug, projectSlug] as const,
  detail: (workspaceSlug: string, projectSlug: string, taskNumber: string) =>
    [...taskKeys.all, "detail", workspaceSlug, projectSlug, taskNumber] as const,
};
