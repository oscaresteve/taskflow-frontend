import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { projectMemberKeys } from "../query-keys/project-member.keys";
import { getMyProjectMember, getProjectMembers } from "../api/project-members.api";
import { ProjectRole } from "../dtos/project-members.dto";
import { SortOrder } from "../dtos/pagination.dto";

export const getMyProjectMemberQuery = (workspaceSlug: string, projectSlug: string) =>
  queryOptions({
    queryKey: projectMemberKeys.me(workspaceSlug, projectSlug),
    queryFn: () => getMyProjectMember({ workspaceSlug, projectSlug }),
    enabled: !!workspaceSlug && !!projectSlug,
  });

// The endpoint is paginated and caps a page at 100. A project's active roster stays well under
// that, so it is fetched in one go rather than chained page by page.
const ACTIVE_ROSTER_LIMIT = 100;

// The active roster of a project: who can be assigned a task and who shows up as an avatar.
// Inactive members are excluded server-side rather than filtered out here — filtering a capped page
// on the client silently drops active members whose slot on page 1 was taken by an inactive one.
export const getActiveProjectMembersQuery = ({
  workspaceSlug,
  projectSlug,
}: {
  workspaceSlug: string;
  projectSlug: string;
}) =>
  queryOptions({
    queryKey: projectMemberKeys.activeList(workspaceSlug, projectSlug),
    queryFn: () =>
      getProjectMembers({ workspaceSlug, projectSlug, isActive: [true], limit: ACTIVE_ROSTER_LIMIT }),
    enabled: !!workspaceSlug && !!projectSlug,
  });

// One isActive value per call — used by the members page, which runs one paginated query per tab
// (Current/Inactive) so each tab has its own page and an accurate total count.
export const getProjectMembersPageQuery = ({
  workspaceSlug,
  projectSlug,
  isActive,
  role,
  search,
  sort,
  order,
  page,
  limit,
}: {
  workspaceSlug: string;
  projectSlug: string;
  isActive: boolean[];
  role?: ProjectRole;
  search?: string;
  sort?: "joinedAt" | "createdAt" | "updatedAt";
  order?: SortOrder;
  page?: number;
  limit?: number;
}) =>
  queryOptions({
    queryKey: projectMemberKeys.paginatedList(workspaceSlug, projectSlug, {
      isActive,
      role,
      search,
      sort,
      order,
      page,
      limit,
    }),
    queryFn: () => getProjectMembers({ workspaceSlug, projectSlug, isActive, role, search, sort, order, page, limit }),
    enabled: !!workspaceSlug && !!projectSlug,
    placeholderData: keepPreviousData,
  });
