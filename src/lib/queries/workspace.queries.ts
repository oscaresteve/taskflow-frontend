import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { getWorkspace, getWorkspaces } from "@/lib/api/workspaces.api";
import { workspaceKeys } from "@/lib/query-keys/workspace.keys";
import { getNextPageParam } from "@/lib/queries/pagination";
import { SortOrder } from "@/lib/dtos/pagination.dto";
import { WorkspaceSortField } from "../workspace-enums";

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

// Active only. Omitting `isActive` relies on the backend's own default filter (active-only) rather
// than fetching everything and filtering client-side — used by the sidebar nav, workspace switcher,
// and the "manage workspaces" page. Inactive workspaces 404 on every workspace-scoped endpoint (the
// backend treats isActive as a soft delete), so nothing in the frontend surfaces them until a
// reactivate flow exists.
export const getWorkspacesQuery = ({
  page,
  limit,
  search,
  isFavorite,
  sort,
  order,
}: {
  page?: number;
  limit?: number;
  search?: string;
  isFavorite?: boolean;
  sort?: WorkspaceSortField;
  order?: SortOrder;
} = {}) =>
  queryOptions({
    queryKey: workspaceKeys.lists({ page, limit, search, isFavorite, sort, order }),
    queryFn: () => getWorkspaces({ page, limit, search, isFavorite, sort, order }),
  });

export const getWorkspaceQuery = (workspaceSlug: string) =>
  queryOptions({
    queryKey: workspaceKeys.detail(workspaceSlug),
    queryFn: () => getWorkspace(workspaceSlug),
    enabled: !!workspaceSlug,
  });
