import { queryOptions } from "@tanstack/react-query";
import { getWorkspace, getWorkspaces } from "@/lib/api/workspaces.api";
import { workspaceKeys } from "@/lib/query-keys/workspace.keys";

export const getWorkspacesQuery = () =>
  queryOptions({
    queryKey: workspaceKeys.lists(),
    queryFn: getWorkspaces,
  });

export const getWorkspaceQuery = (workspaceSlug: string) =>
  queryOptions({
    queryKey: workspaceKeys.detail(workspaceSlug),
    queryFn: () => getWorkspace(workspaceSlug),
    enabled: !!workspaceSlug,
  });
