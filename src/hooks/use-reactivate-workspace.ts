import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceKeys } from "@/lib/query-keys/workspace.keys";
import { projectKeys } from "@/lib/query-keys/project.keys";
import { reactivateWorkspace } from "@/lib/api/workspaces.api";

export function useReactivateWorkspace(workspaceSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => reactivateWorkspace(workspaceSlug),
    onSuccess: async () => {
      // Tambien los proyectos: mientras el espacio estuvo inactivo sus listados respondian 404 y
      // ese error se queda en la cache.
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: workspaceKeys.all }),
        queryClient.invalidateQueries({ queryKey: projectKeys.all }),
      ]);
    },
  });
}
