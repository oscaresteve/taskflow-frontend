export const overviewKeys = {
  all: ["overview"] as const,
  my: () => [...overviewKeys.all, "my"] as const,
  workspace: (workspaceSlug: string) => [...overviewKeys.all, "workspace", workspaceSlug] as const,
  project: (workspaceSlug: string, projectSlug: string) =>
    [...overviewKeys.all, "project", workspaceSlug, projectSlug] as const,
};
