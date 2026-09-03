import { createProjectMember } from "@/lib/api/project-members.api";
import { projectMemberKeys } from "@/lib/query-keys/project-member.keys";
import { workspaceMemberKeys } from "@/lib/query-keys/workspace-member.keys";
import { CreateProjectMemberDto } from "@/lib/schemas/project-member.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateProjectMember(workspaceSlug: string, projectSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectMemberDto) => createProjectMember({ workspaceSlug, projectSlug, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectMemberKeys.lists(workspaceSlug, projectSlug) });
      // The added user should no longer show up as an addable candidate for this project.
      queryClient.invalidateQueries({
        queryKey: workspaceMemberKeys.activeInfiniteList(workspaceSlug, { excludeProjectSlug: projectSlug }),
      });
    },
  });
}
