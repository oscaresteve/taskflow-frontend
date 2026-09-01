import { queryOptions } from "@tanstack/react-query";
import { getWorkspace, getWorkspaces } from "@/lib/api/workspaces.api";
import { workspaceKeys } from "@/lib/query-keys/workspace.keys";

// Both active and inactive — used by the "manage workspaces" admin page, which shows both in tabs.
export const getWorkspacesQuery = () =>
  queryOptions({
    queryKey: workspaceKeys.lists(),
    queryFn: () => getWorkspaces([true, false]),
  });

// Active only. Omitting `isActive` relies on the backend's own default filter (active-only) rather
// than fetching everything and filtering client-side — used by the sidebar nav and workspace switcher.
export const getActiveWorkspacesQuery = () =>
  queryOptions({
    queryKey: workspaceKeys.activeList(),
    queryFn: () => getWorkspaces(),
  });

export const getWorkspaceQuery = (workspaceSlug: string) =>
  queryOptions({
    queryKey: workspaceKeys.detail(workspaceSlug),
    queryFn: () => getWorkspace(workspaceSlug),
    enabled: !!workspaceSlug,
  });
