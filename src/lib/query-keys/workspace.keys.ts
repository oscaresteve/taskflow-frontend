export const workspaceKeys = {
  all: ["workspaces"] as const,
  lists: (page?: number, search?: string, limit?: number) =>
    [...workspaceKeys.all, "list", page, search, limit] as const,
  detail: (workspaceSlug: string) => [...workspaceKeys.all, "detail", workspaceSlug] as const,
};
