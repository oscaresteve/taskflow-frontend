import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceKeys } from "@/lib/query-keys/workspace.keys";
import { createWorkspace } from "@/lib/api/workspaces.api";
import { CreateWorkspaceDto } from "@/lib/schemas/workspace.schema";

// Convention: creation hooks resolve with the created entity so callers can
// navigate to its own page (e.g. `/workspaces/${workspace.slug}`) instead of
// a generic resolver route. Follow this same pattern in future create-*
// hooks (create-project, etc).
export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWorkspaceDto) => createWorkspace(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() });
    },
  });
}
