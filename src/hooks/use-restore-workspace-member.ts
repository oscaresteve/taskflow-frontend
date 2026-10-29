import { useMutation, useQueryClient } from "@tanstack/react-query";
import { restoreWorkspaceMember } from "@/lib/api/workspace-members.api";
import { workspaceMemberKeys } from "@/lib/query-keys/workspace-member.keys";
import { RestoreWorkspaceMemberDto } from "@/lib/schemas/workspace-member.schema";

export function useRestoreWorkspaceMember(workspaceSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: RestoreWorkspaceMemberDto }) =>
      restoreWorkspaceMember({ workspaceSlug, userId, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceMemberKeys.all });
    },
  });
}
