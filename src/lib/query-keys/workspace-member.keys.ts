export const workspaceMemberKeys = {
  all: ["workspace-members"] as const,
  lists: (workspaceSlug: string) => [...workspaceMemberKeys.all, "list", workspaceSlug] as const,
};
