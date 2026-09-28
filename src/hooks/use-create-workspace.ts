import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceKeys } from "@/lib/query-keys/workspace.keys";
import { createWorkspace } from "@/lib/api/workspaces.api";
import { CreateWorkspaceDto } from "@/lib/schemas/workspace.schema";
import { activityKeys } from "@/lib/query-keys/activity.keys";

export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWorkspaceDto) => createWorkspace(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.all });
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
    },
  });
}
