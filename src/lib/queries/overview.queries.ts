import { queryOptions } from "@tanstack/react-query";
import {
  getMyOverview,
  getMyOverviewWorkspaces,
  getProjectOverview,
  getWorkspaceOverview,
  getWorkspaceOverviewProjects,
} from "@/lib/api/overview.api";
import { overviewKeys } from "@/lib/query-keys/overview.keys";

export const getMyOverviewQuery = () =>
  queryOptions({
    queryKey: overviewKeys.my(),
    queryFn: () => getMyOverview(),
  });

export const getMyOverviewWorkspacesQuery = (
  params: { page?: number; limit?: number; search?: string; isFavorite?: boolean } = {},
) =>
  queryOptions({
    queryKey: overviewKeys.myWorkspaces(params),
    // Solo favoritos es un si o no: en `false` el parametro no viaja, o el backend devolveria
    // justo los que no lo son.
    queryFn: () => getMyOverviewWorkspaces({ ...params, isFavorite: params.isFavorite || undefined }),
  });

export const getWorkspaceOverviewQuery = (workspaceSlug: string) =>
  queryOptions({
    queryKey: overviewKeys.workspace(workspaceSlug),
    queryFn: () => getWorkspaceOverview(workspaceSlug),
    enabled: !!workspaceSlug,
  });

export const getWorkspaceOverviewProjectsQuery = (
  workspaceSlug: string,
  params: { page?: number; limit?: number; search?: string; isFavorite?: boolean } = {},
) =>
  queryOptions({
    queryKey: overviewKeys.workspaceProjects(workspaceSlug, params),
    queryFn: () =>
      getWorkspaceOverviewProjects({ workspaceSlug, ...params, isFavorite: params.isFavorite || undefined }),
    enabled: !!workspaceSlug,
  });

export const getProjectOverviewQuery = ({
  workspaceSlug,
  projectSlug,
}: {
  workspaceSlug: string;
  projectSlug: string;
}) =>
  queryOptions({
    queryKey: overviewKeys.project(workspaceSlug, projectSlug),
    queryFn: () => getProjectOverview({ workspaceSlug, projectSlug }),
    enabled: !!workspaceSlug && !!projectSlug,
  });
