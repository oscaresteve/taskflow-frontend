export const overviewKeys = {
  all: ["overview"] as const,
  my: () => [...overviewKeys.all, "my"] as const,
  myWorkspaces: (params: { page?: number; limit?: number; search?: string } = {}) =>
    [...overviewKeys.my(), "workspaces", params] as const,
  workspace: (workspaceSlug: string) => [...overviewKeys.all, "workspace", workspaceSlug] as const,
  // params por defecto {} para que invalidar sin parametros alcance todas las paginas y busquedas
  // (react-query trata {} como comodin al comparar claves parcialmente).
  workspaceProjects: (workspaceSlug: string, params: { page?: number; limit?: number; search?: string } = {}) =>
    [...overviewKeys.workspace(workspaceSlug), "projects", params] as const,
  project: (workspaceSlug: string, projectSlug: string) =>
    [...overviewKeys.all, "project", workspaceSlug, projectSlug] as const,
};
