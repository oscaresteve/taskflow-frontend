import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceKeys } from "@/lib/query-keys/workspace.keys";
import { overviewKeys } from "@/lib/query-keys/overview.keys";
import { favoriteWorkspace, unfavoriteWorkspace } from "@/lib/api/workspaces.api";

export function useToggleWorkspaceFavorite(workspaceSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (favorite: boolean) =>
      favorite ? favoriteWorkspace(workspaceSlug) : unfavoriteWorkspace(workspaceSlug),
    // La rejilla de My Space trae su propia copia de los espacios, con la estrella.
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.all });
      queryClient.invalidateQueries({ queryKey: overviewKeys.myWorkspaces() });
    },
  });
}
