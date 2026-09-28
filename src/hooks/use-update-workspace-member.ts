import { updateWorkspaceMember } from "@/lib/api/workspace-members.api";
import { workspaceMemberKeys } from "@/lib/query-keys/workspace-member.keys";
import { UpdateWorkspaceMemberDto } from "@/lib/schemas/workspace-member.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateWorkspaceMember(workspaceSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateWorkspaceMemberDto }) =>
      updateWorkspaceMember({ workspaceSlug, userId, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceMemberKeys.all });
    },
  });
}
