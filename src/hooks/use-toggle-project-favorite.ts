import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectKeys } from "@/lib/query-keys/project.keys";
import { overviewKeys } from "@/lib/query-keys/overview.keys";
import { favoriteProject, unfavoriteProject } from "@/lib/api/projects.api";

export function useToggleProjectFavorite(workspaceSlug: string, projectSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (favorite: boolean) =>
      favorite ? favoriteProject({ workspaceSlug, projectSlug }) : unfavoriteProject({ workspaceSlug, projectSlug }),
    // La rejilla del overview del espacio trae su propia copia de los proyectos, con la estrella.
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      queryClient.invalidateQueries({ queryKey: overviewKeys.workspaceProjects(workspaceSlug) });
    },
  });
}
