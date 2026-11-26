import { createWorkspaceMember } from "@/lib/api/workspace-members.api";
import { workspaceMemberKeys } from "@/lib/query-keys/workspace-member.keys";
import { userKeys } from "@/lib/query-keys/user.keys";
import { CreateWorkspaceMemberDto } from "@/lib/schemas/workspace-member.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateWorkspaceMember(workspaceSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWorkspaceMemberDto) => createWorkspaceMember({ workspaceSlug, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceMemberKeys.all });
      // The added user should no longer show up in workspace-scoped user search results.
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}
