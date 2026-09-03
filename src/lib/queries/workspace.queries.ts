import { queryOptions } from "@tanstack/react-query";
import { getWorkspace, getWorkspaces } from "@/lib/api/workspaces.api";
import { workspaceKeys } from "@/lib/query-keys/workspace.keys";
import { SortOrder } from "@/lib/dtos/pagination.dto";

// Active only. Omitting `isActive` relies on the backend's own default filter (active-only) rather
// than fetching everything and filtering client-side — used by the sidebar nav, workspace switcher,
// and the "manage workspaces" page. Inactive workspaces 404 on every workspace-scoped endpoint (the
// backend treats isActive as a soft delete), so nothing in the frontend surfaces them until a
// reactivate flow exists.
export const getWorkspacesQuery = ({
  page,
  limit,
  search,
  sort,
  order,
}: {
  page?: number;
  limit?: number;
  search?: string;
  sort?: "name" | "createdAt" | "updatedAt";
  order?: SortOrder;
} = {}) =>
  queryOptions({
    queryKey: workspaceKeys.lists({ page, limit, search, sort, order }),
    queryFn: () => getWorkspaces({ page, limit, search, sort, order }),
  });

export const getWorkspaceQuery = (workspaceSlug: string) =>
  queryOptions({
    queryKey: workspaceKeys.detail(workspaceSlug),
    queryFn: () => getWorkspace(workspaceSlug),
    enabled: !!workspaceSlug,
  });
