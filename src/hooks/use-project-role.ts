import { useQuery } from "@tanstack/react-query";
import { getMeQuery } from "@/lib/queries/auth.queries";
import { getProjectMembersQuery } from "@/lib/queries/project-member.queries";
import { ProjectRole } from "@/lib/dtos/project-members.dto";

export function useProjectRole(
  workspaceSlug: string,
  projectSlug: string,
): { role: ProjectRole | undefined; isLoading: boolean } {
  const { data: me, isLoading: isMeLoading } = useQuery(getMeQuery());
  const { data: members, isLoading: isMembersLoading } = useQuery(getProjectMembersQuery({ workspaceSlug, projectSlug }));

  return {
    role: members?.data.find((member) => member.userId === me?.id)?.role,
    isLoading: isMeLoading || isMembersLoading,
  };
}
