export const workspaceMemberKeys = {
  all: ["workspace-members"] as const,
  lists: (workspaceSlug: string) => [...workspaceMemberKeys.all, "list", workspaceSlug] as const,
  activeList: (workspaceSlug: string, excludeProjectSlug?: string) =>
    [...workspaceMemberKeys.all, "active-list", workspaceSlug, excludeProjectSlug] as const,
  paginatedList: (workspaceSlug: string, status?: string[], page?: number, limit?: number) =>
    [...workspaceMemberKeys.all, "paginated-list", workspaceSlug, status, page, limit] as const,
};
