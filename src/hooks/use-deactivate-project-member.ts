import { deactivateProjectMember } from "@/lib/api/project-members.api";
import { projectMemberKeys } from "@/lib/query-keys/project-member.keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeactivateProjectMember(workspaceSlug: string, projectSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => deactivateProjectMember({ workspaceSlug, projectSlug, userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectMemberKeys.all });
    },
  });
}
