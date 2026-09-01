export const workspaceKeys = {
  all: ["workspaces"] as const,
  lists: () => [...workspaceKeys.all, "list"] as const,
  activeList: () => [...workspaceKeys.all, "active-list"] as const,
  detail: (workspaceSlug: string) => [...workspaceKeys.all, "detail", workspaceSlug] as const,
};
