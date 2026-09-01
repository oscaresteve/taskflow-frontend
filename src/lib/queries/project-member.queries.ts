import { queryOptions } from "@tanstack/react-query";
import { projectMemberKeys } from "../query-keys/project-member.keys";
import { getProjectMembers } from "../api/project-members.api";

// Includes both isActive values so the members page can surface active and inactive members,
// not just the active roster.
export const getProjectMembersQuery = ({
  workspaceSlug,
  projectSlug,
}: {
  workspaceSlug: string;
  projectSlug: string;
}) =>
  queryOptions({
    queryKey: projectMemberKeys.lists(workspaceSlug, projectSlug),
    queryFn: () => getProjectMembers({ workspaceSlug, projectSlug, isActive: [true, false] }),
    enabled: !!workspaceSlug && !!projectSlug,
  });
