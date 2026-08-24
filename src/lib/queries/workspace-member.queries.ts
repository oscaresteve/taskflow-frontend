import { queryOptions } from "@tanstack/react-query";
import { getWorkspaceMembers } from "@/lib/api/workspace-members.api";
import { workspaceMemberKeys } from "@/lib/query-keys/workspace-member.keys";

// Includes PENDING alongside ACTIVE so the members page can surface people awaiting activation.
export const getWorkspaceMembersQuery = (workspaceSlug: string) =>
  queryOptions({
    queryKey: workspaceMemberKeys.lists(workspaceSlug),
    queryFn: () => getWorkspaceMembers(workspaceSlug, ["ACTIVE", "PENDING"]),
    enabled: !!workspaceSlug,
  });
