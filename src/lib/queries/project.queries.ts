import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { getProject, getProjects } from "@/lib/api/projects.api";
import { projectKeys } from "@/lib/query-keys/project.keys";
import { getNextPageParam } from "@/lib/queries/pagination";
import { SortOrder } from "@/lib/dtos/pagination.dto";

// "Load more" for the sidebar nav — pages accumulate instead of replacing each other. Same
// getNextPageParam helper can back any other list that outgrows a "load more" button later.
export const getProjectsInfiniteQuery = ({
  workspaceSlug,
  limit,
  search,
}: {
  workspaceSlug: string;
  limit: number;
  search?: string;
}) =>
  infiniteQueryOptions({
    queryKey: projectKeys.infiniteList(workspaceSlug, { limit, search }),
    queryFn: ({ pageParam }) =>
      getProjects({ workspaceSlug, page: pageParam, limit, sort: "name", order: "asc", search: search || undefined }),
    initialPageParam: 1,
    getNextPageParam,
    enabled: !!workspaceSlug,
  });

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
