import { queryOptions } from "@tanstack/react-query";
import { getWorkspace, getWorkspaces } from "@/lib/api/workspaces.api";

export const getWorkspacesQuery = queryOptions({
  queryKey: ["workspaces"],
  queryFn: getWorkspaces,
});

export const getWorkspaceQuery = (workspaceSlug: string) =>
  queryOptions({
    queryKey: ["workspace", workspaceSlug],
    queryFn: () => getWorkspace(workspaceSlug),
  });
