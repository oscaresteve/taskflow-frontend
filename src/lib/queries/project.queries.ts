import { queryOptions } from "@tanstack/react-query";
import { getProject, getProjects } from "@/lib/api/projects.api";
import { projectKeys } from "@/lib/query-keys/project.keys";
import { SortOrder } from "@/lib/dtos/pagination.dto";

export const getProjectsQuery = (
  workspaceSlug: string,
  params: {
    page?: number;
    limit?: number;
    isArchived?: boolean;
    search?: string;
    sort?: "name" | "createdAt" | "updatedAt";
    order?: SortOrder;
  } = {},
) =>
  queryOptions({
    queryKey: projectKeys.lists(workspaceSlug, params),
    queryFn: () => getProjects({ workspaceSlug, ...params }),
    enabled: !!workspaceSlug,
  });

export const getProjectQuery = ({ workspaceSlug, projectSlug }: { workspaceSlug: string; projectSlug: string }) =>
  queryOptions({
    queryKey: projectKeys.detail(workspaceSlug, projectSlug),
    queryFn: () => getProject({ workspaceSlug, projectSlug }),
    enabled: !!workspaceSlug && !!projectSlug,
  });
