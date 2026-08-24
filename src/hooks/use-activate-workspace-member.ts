import { activateWorkspaceMember } from "@/lib/api/workspace-members.api";
import { workspaceMemberKeys } from "@/lib/query-keys/workspace-member.keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useActivateWorkspaceMember(workspaceSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => activateWorkspaceMember({ workspaceSlug, userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceMemberKeys.lists(workspaceSlug) });
    },
  });
}
