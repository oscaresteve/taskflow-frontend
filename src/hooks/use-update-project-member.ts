import { updateProjectMember } from "@/lib/api/project-members.api";
import { projectMemberKeys } from "@/lib/query-keys/project-member.keys";
import { UpdateProjectMemberDto } from "@/lib/schemas/project-member.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateProjectMember(workspaceSlug: string, projectSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateProjectMemberDto }) =>
      updateProjectMember({ workspaceSlug, projectSlug, userId, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectMemberKeys.lists(workspaceSlug, projectSlug) });
    },
  });
}
