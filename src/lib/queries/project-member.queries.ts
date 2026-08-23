import { queryOptions } from "@tanstack/react-query";
import { projectMemberKeys } from "../query-keys/project-member.keys";
import { getProjectMembers } from "../api/project-members.api";

export const getProjectMembersQuery = ({
  workspaceSlug,
  projectSlug,
}: {
  workspaceSlug: string;
  projectSlug: string;
}) =>
  queryOptions({
    queryKey: projectMemberKeys.lists(workspaceSlug, projectSlug),
    queryFn: () => getProjectMembers({ workspaceSlug, projectSlug }),
    enabled: !!workspaceSlug && !!projectSlug,
  });
