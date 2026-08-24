import { queryOptions } from "@tanstack/react-query";
import { getWorkspaceMembers } from "@/lib/api/workspace-members.api";
import { workspaceMemberKeys } from "@/lib/query-keys/workspace-member.keys";

// Includes PENDING and REMOVED alongside ACTIVE so the members page can surface people awaiting
// activation and people who were removed, not just the active roster.
export const getWorkspaceMembersQuery = (workspaceSlug: string) =>
  queryOptions({
    queryKey: workspaceMemberKeys.lists(workspaceSlug),
    queryFn: () => getWorkspaceMembers(workspaceSlug, ["ACTIVE", "PENDING", "REMOVED"]),
    enabled: !!workspaceSlug,
  });
