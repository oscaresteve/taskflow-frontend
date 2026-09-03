import { infiniteQueryOptions, keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getMyWorkspaceMember, getWorkspaceMembers } from "@/lib/api/workspace-members.api";
import { workspaceMemberKeys } from "@/lib/query-keys/workspace-member.keys";
import { getNextPageParam } from "@/lib/queries/pagination";
import { WorkspaceMemberStatus, WorkspaceRole } from "@/lib/dtos/workspace-members.dto";
import { SortOrder } from "@/lib/dtos/pagination.dto";

export const getMyWorkspaceMemberQuery = (workspaceSlug: string) =>
  queryOptions({
    queryKey: workspaceMemberKeys.me(workspaceSlug),
    queryFn: () => getMyWorkspaceMember({ workspaceSlug }),
    enabled: !!workspaceSlug,
  });

// Includes PENDING and REMOVED alongside ACTIVE so the members page can surface people awaiting
// activation and people who were removed, not just the active roster.
export const getWorkspaceMembersQuery = (workspaceSlug: string) =>
  queryOptions({
    queryKey: workspaceMemberKeys.lists(workspaceSlug),
    queryFn: () => getWorkspaceMembers({ workspaceSlug, status: ["ACTIVE", "PENDING", "REMOVED"] }),
    enabled: !!workspaceSlug,
  });

// Only ACTIVE members — used to pick candidates for project membership, since the backend
// requires a user to be an active workspace member before they can be added to a project.
// excludeProjectSlug filters out anyone who already has a project-member row there (any
// isActive value), so someone previously removed from the project doesn't show up as pickable.
// search is server-side (not filtered client-side over a capped page), and pages accumulate via
// "load more" in the picker, same shape as the sidebar nav infinite queries.
export const getActiveWorkspaceMembersInfiniteQuery = ({
  workspaceSlug,
  excludeProjectSlug,
  search,
  limit,
}: {
  workspaceSlug: string;
  excludeProjectSlug?: string;
  search: string;
  limit: number;
}) =>
  infiniteQueryOptions({
    queryKey: workspaceMemberKeys.activeInfiniteList(workspaceSlug, { excludeProjectSlug, search, limit }),
    queryFn: ({ pageParam }) =>
      getWorkspaceMembers({
        workspaceSlug,
        status: ["ACTIVE"],
        excludeProjectSlug,
        // The backend's searchSchema rejects an empty string (min(1)), so an empty search must be
        // omitted rather than sent through — same convention getUsers follows.
        search: search || undefined,
        page: pageParam,
        limit,
      }),
    initialPageParam: 1,
    getNextPageParam,
    enabled: !!workspaceSlug,
  });

// One status per call — used by the members page, which runs one paginated query per tab
// (Current/Pending/Removed) so each tab has its own page and an accurate total count.
export const getWorkspaceMembersPageQuery = ({
  workspaceSlug,
  status,
  role,
  search,
  sort,
  order,
  page,
  limit,
}: {
  workspaceSlug: string;
  status: WorkspaceMemberStatus[];
  role?: WorkspaceRole;
  search?: string;
  sort?: "joinedAt" | "createdAt" | "updatedAt";
  order?: SortOrder;
  page?: number;
  limit?: number;
}) =>
  queryOptions({
    queryKey: workspaceMemberKeys.paginatedList(workspaceSlug, { status, role, search, sort, order, page, limit }),
    queryFn: () => getWorkspaceMembers({ workspaceSlug, status, role, search, sort, order, page, limit }),
    enabled: !!workspaceSlug,
    placeholderData: keepPreviousData,
  });
