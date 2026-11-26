import { useQuery } from "@tanstack/react-query";
import { getMyWorkspaceMemberQuery } from "@/lib/queries/workspace-member.queries";
import { WorkspaceRole } from "@/lib/dtos/workspace-members.dto";

export function useWorkspaceRole(workspaceSlug: string): { role: WorkspaceRole | undefined; isLoading: boolean } {
  const { data: membership, isLoading } = useQuery(getMyWorkspaceMemberQuery(workspaceSlug));

  return {
    role: membership?.role,
    isLoading,
  };
}
