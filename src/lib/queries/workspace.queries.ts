import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { getWorkspace, getWorkspaces } from "@/lib/api/workspaces.api";
import { workspaceKeys } from "@/lib/query-keys/workspace.keys";
import { getNextPageParam } from "@/lib/queries/pagination";
import { SortOrder } from "@/lib/dtos/pagination.dto";
import { WorkspaceSortField } from "../workspace-enums";
import { WorkspaceRole } from "@/lib/dtos/workspace-members.dto";

// "Load more" for the sidebar nav — pages accumulate instead of replacing each other. Same
// getNextPageParam helper can back any other list that outgrows a "load more" button later.
export const getWorkspacesInfiniteQuery = ({
  limit,
  search,
  isFavorite,
}: {
  limit: number;
  search?: string;
  isFavorite?: boolean;
}) =>
  infiniteQueryOptions({
    queryKey: workspaceKeys.infiniteList({ limit, search, isFavorite }),
    queryFn: ({ pageParam }) =>
      getWorkspaces({ page: pageParam, limit, sort: "name", order: "asc", search: search || undefined, isFavorite }),
    initialPageParam: 1,
    getNextPageParam,
  });

// Only the "manage workspaces" page passes `isActive`, because it is the one that offers to
// reactivate. Omitting it leans on the backend's own default filter (active-only), which is what
// the sidebar nav, the workspace switcher and every other consumer want: a deactivated workspace
// still 404s on everything but its own reactivate route, so surfacing it anywhere else would lead
// nowhere.
export const getWorkspacesQuery = ({
  page,
  limit,
  search,
  isActive,
  isFavorite,
  myRole,
  sort,
  order,
}: {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  isFavorite?: boolean;
  myRole?: readonly WorkspaceRole[];
  sort?: WorkspaceSortField;
  order?: SortOrder;
} = {}) =>
  queryOptions({
    queryKey: workspaceKeys.lists({ page, limit, search, isActive, isFavorite, myRole, sort, order }),
    queryFn: () => getWorkspaces({ page, limit, search, isActive, isFavorite, myRole, sort, order }),
  });

export const getWorkspaceQuery = (workspaceSlug: string) =>
  queryOptions({
    queryKey: workspaceKeys.detail(workspaceSlug),
    queryFn: () => getWorkspace(workspaceSlug),
    enabled: !!workspaceSlug,
  });
