import { queryOptions } from "@tanstack/react-query";
import { getProject, getProjects } from "@/lib/api/projects.api";
import { projectKeys } from "@/lib/query-keys/project.keys";

export const getProjectsQuery = (workspaceSlug: string) =>
  queryOptions({
    queryKey: projectKeys.lists(workspaceSlug),
    queryFn: () => getProjects({ workspaceSlug }),
    enabled: !!workspaceSlug,
  });

export const getProjectQuery = ({ workspaceSlug, projectSlug }: { workspaceSlug: string; projectSlug: string }) =>
  queryOptions({
    queryKey: projectKeys.detail(workspaceSlug, projectSlug),
    queryFn: () => getProject({ workspaceSlug, projectSlug }),
    enabled: !!workspaceSlug && !!projectSlug,
  });
