import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceKeys } from "@/lib/query-keys/workspace.keys";
import { updateWorkspace } from "@/lib/api/workspaces.api";
import { UpdateWorkspaceDto } from "@/lib/schemas/workspace.schema";

export function useUpdateWorkspace(workspaceSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateWorkspaceDto) => updateWorkspace(workspaceSlug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.detail(workspaceSlug) });
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() });
    },
  });
}
