import { removeWorkspaceMember } from "@/lib/api/workspace-members.api";
import { workspaceMemberKeys } from "@/lib/query-keys/workspace-member.keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useRemoveWorkspaceMember(workspaceSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => removeWorkspaceMember({ workspaceSlug, userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceMemberKeys.lists(workspaceSlug) });
    },
  });
}
