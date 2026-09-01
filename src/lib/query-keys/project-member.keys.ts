export const projectMemberKeys = {
  all: ["project-members"] as const,
  lists: (workspaceSlug: string, projectSlug: string) =>
    [...projectMemberKeys.all, "list", workspaceSlug, projectSlug] as const,
  paginatedList: (workspaceSlug: string, projectSlug: string, isActive?: boolean[], page?: number, limit?: number) =>
    [...projectMemberKeys.all, "paginated-list", workspaceSlug, projectSlug, isActive, page, limit] as const,
};
