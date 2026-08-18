export const projectKeys = {
  all: ["projects"] as const,
  lists: (workspaceSlug: string) => [...projectKeys.all, "list", workspaceSlug] as const,
  detail: (workspaceSlug: string, projectSlug: string) =>
    [...projectKeys.all, "detail", workspaceSlug, projectSlug] as const,
};
