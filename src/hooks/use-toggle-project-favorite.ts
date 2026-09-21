import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectKeys } from "@/lib/query-keys/project.keys";
import { favoriteProject, unfavoriteProject } from "@/lib/api/projects.api";

export function useToggleProjectFavorite(workspaceSlug: string, projectSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (favorite: boolean) =>
      favorite ? favoriteProject({ workspaceSlug, projectSlug }) : unfavoriteProject({ workspaceSlug, projectSlug }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: projectKeys.all }),
  });
}
