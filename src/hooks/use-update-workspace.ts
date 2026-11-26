import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceKeys } from "@/lib/query-keys/workspace.keys";
import { updateWorkspace } from "@/lib/api/workspaces.api";
import { UpdateWorkspaceDto } from "@/lib/schemas/workspace.schema";

export function useUpdateWorkspace(workspaceSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateWorkspaceDto) => updateWorkspace({ workspaceSlug, data }),
    // Priming the new slug's detail query (rather than invalidating the old one) avoids
    // refetching a slug the backend just renamed away from, which 404s. Awaited so callers
    // that navigate on success (e.g. slug changed after a rename) land on a page whose query
    // cache is already fresh, not stale.
    onSuccess: async (updatedWorkspace) => {
      queryClient.setQueryData(workspaceKeys.detail(updatedWorkspace.slug), updatedWorkspace);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: workspaceKeys.infiniteList() }),
      ]);
    },
  });
}
