import { queryOptions } from "@tanstack/react-query";
import { getWorkspaces } from "@/lib/api/workspaces.api";

export const workspacesQuery = queryOptions({
  queryKey: ["workspaces"],
  queryFn: getWorkspaces,
});
