export const taskKeys = {
  all: ["tasks"] as const,
  lists: (workspaceSlug: string, projectSlug: string) => [...taskKeys.all, "list", workspaceSlug, projectSlug] as const,
  detail: (workspaceSlug: string, projectSlug: string, taskNumber: string) =>
    [...taskKeys.all, "detail", workspaceSlug, projectSlug, taskNumber] as const,
};
