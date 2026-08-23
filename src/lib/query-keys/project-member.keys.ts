export const projectMemberKeys = {
  all: ["project-members"] as const,
  lists: (workspaceSlug: string, projectSlug: string) =>
    [...projectMemberKeys.all, "list", workspaceSlug, projectSlug] as const,
};
