import { keepPreviousData, queryOptions } from "@tanstack/react-query";
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

// One isActive value per call — used by the members page, which runs one paginated query per tab
// (Current/Inactive) so each tab has its own page and an accurate total count.
export const getProjectMembersPageQuery = ({
  workspaceSlug,
  projectSlug,
  isActive,
  page,
  limit,
}: {
  workspaceSlug: string;
  projectSlug: string;
  isActive: boolean[];
  page?: number;
  limit?: number;
}) =>
  queryOptions({
    queryKey: projectMemberKeys.paginatedList(workspaceSlug, projectSlug, isActive, page, limit),
    queryFn: () => getProjectMembers({ workspaceSlug, projectSlug, isActive, page, limit }),
    enabled: !!workspaceSlug && !!projectSlug,
    placeholderData: keepPreviousData,
  });
