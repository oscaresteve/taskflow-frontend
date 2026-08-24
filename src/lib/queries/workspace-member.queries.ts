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

// Only ACTIVE members — used to pick candidates for project membership, since the backend
// requires a user to be an active workspace member before they can be added to a project.
// excludeProjectSlug filters out anyone who already has a project-member row there (any
// isActive value), so someone previously removed from the project doesn't show up as pickable.
export const getActiveWorkspaceMembersQuery = (workspaceSlug: string, excludeProjectSlug?: string) =>
  queryOptions({
    queryKey: workspaceMemberKeys.activeList(workspaceSlug, excludeProjectSlug),
    queryFn: () => getWorkspaceMembers(workspaceSlug, ["ACTIVE"], excludeProjectSlug),
    enabled: !!workspaceSlug,
  });
