import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceKeys } from "@/lib/query-keys/workspace.keys";
import { updateWorkspace } from "@/lib/api/workspaces.api";
import { UpdateWorkspaceDto } from "@/lib/schemas/workspace.schema";

export function useUpdateWorkspace(workspaceSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateWorkspaceDto) => updateWorkspace(workspaceSlug, data),
    // Awaited so callers that navigate on success (e.g. slug changed after a
    // rename) land on a page whose query cache is already fresh, not stale.
    onSuccess: async (updatedWorkspace) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: workspaceKeys.detail(updatedWorkspace.slug) }),
        queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() }),
      ]);
    },
  });
}
