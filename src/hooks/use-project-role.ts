import { useQuery } from "@tanstack/react-query";
import { getMyProjectMemberQuery } from "@/lib/queries/project-member.queries";
import { ProjectRole } from "@/lib/dtos/project-members.dto";

export function useProjectRole(
  workspaceSlug: string,
  projectSlug: string,
): { role: ProjectRole | undefined; isLoading: boolean } {
  const { data: membership, isLoading } = useQuery(getMyProjectMemberQuery(workspaceSlug, projectSlug));

  return {
    role: membership?.role,
    isLoading,
  };
}
