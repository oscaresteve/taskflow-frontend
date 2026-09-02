import { useQuery } from "@tanstack/react-query";
import { getMeQuery } from "@/lib/queries/auth.queries";
import { getWorkspaceMembersQuery } from "@/lib/queries/workspace-member.queries";
import { WorkspaceRole } from "@/lib/dtos/workspace-members.dto";

export function useWorkspaceRole(workspaceSlug: string): { role: WorkspaceRole | undefined; isLoading: boolean } {
  const { data: me, isLoading: isMeLoading } = useQuery(getMeQuery());
  const { data: members, isLoading: isMembersLoading } = useQuery(getWorkspaceMembersQuery(workspaceSlug));

  return {
    role: members?.data.find((member) => member.userId === me?.id)?.role,
    isLoading: isMeLoading || isMembersLoading,
  };
}
