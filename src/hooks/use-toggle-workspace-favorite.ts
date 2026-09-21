import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceKeys } from "@/lib/query-keys/workspace.keys";
import { favoriteWorkspace, unfavoriteWorkspace } from "@/lib/api/workspaces.api";

export function useToggleWorkspaceFavorite(workspaceSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (favorite: boolean) =>
      favorite ? favoriteWorkspace(workspaceSlug) : unfavoriteWorkspace(workspaceSlug),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: workspaceKeys.all }),
  });
}
