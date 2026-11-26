import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceKeys } from "@/lib/query-keys/workspace.keys";
import { deactivateWorkspace } from "@/lib/api/workspaces.api";

export function useDeactivateWorkspace(workspaceSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deactivateWorkspace(workspaceSlug),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: workspaceKeys.all });
    },
  });
}
