import { useMutation, useQueryClient } from "@tanstack/react-query";
import { activateProjectMember } from "@/lib/api/project-members.api";
import { projectMemberKeys } from "@/lib/query-keys/project-member.keys";
import { ActivateProjectMemberDto } from "@/lib/schemas/project-member.schema";

export function useActivateProjectMember(workspaceSlug: string, projectSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: ActivateProjectMemberDto }) =>
      activateProjectMember({ workspaceSlug, projectSlug, userId, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectMemberKeys.all });
    },
  });
}
