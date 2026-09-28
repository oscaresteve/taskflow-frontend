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

export const getMyOverviewWorkspacesQuery = (params: { page?: number; limit?: number; search?: string } = {}) =>
  queryOptions({
    queryKey: overviewKeys.myWorkspaces(params),
    queryFn: () => getMyOverviewWorkspaces(params),
  });

export const getWorkspaceOverviewQuery = (workspaceSlug: string) =>
  queryOptions({
    queryKey: overviewKeys.workspace(workspaceSlug),
    queryFn: () => getWorkspaceOverview(workspaceSlug),
    enabled: !!workspaceSlug,
  });

export const getWorkspaceOverviewProjectsQuery = (
  workspaceSlug: string,
  params: { page?: number; limit?: number; search?: string } = {},
) =>
  queryOptions({
    queryKey: overviewKeys.workspaceProjects(workspaceSlug, params),
    queryFn: () => getWorkspaceOverviewProjects({ workspaceSlug, ...params }),
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
