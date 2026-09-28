import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceKeys } from "@/lib/query-keys/workspace.keys";
import { deleteWorkspaceAvatar } from "@/lib/api/workspaces.api";
import { WorkspaceResponseDto } from "@/lib/dtos/workspaces.dto";
import { activityKeys } from "@/lib/query-keys/activity.keys";

export function useDeleteWorkspaceAvatar(workspaceSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteWorkspaceAvatar(workspaceSlug),
    onSuccess: async () => {
      queryClient.setQueryData<WorkspaceResponseDto>(workspaceKeys.detail(workspaceSlug), (old) =>
        old ? { ...old, avatarUrl: null } : old,
      );

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: workspaceKeys.infiniteList() }),
        queryClient.invalidateQueries({ queryKey: activityKeys.all }),
      ]);
    },
  });
}
