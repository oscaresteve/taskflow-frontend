import { queryOptions } from "@tanstack/react-query";
import { getWorkspaceMembers } from "@/lib/api/workspace-members.api";
import { workspaceMemberKeys } from "@/lib/query-keys/workspace-member.keys";

export const getWorkspaceMembersQuery = (workspaceSlug: string) =>
  queryOptions({
    queryKey: workspaceMemberKeys.lists(workspaceSlug),
    queryFn: () => getWorkspaceMembers(workspaceSlug),
    enabled: !!workspaceSlug,
  });
