import { queryOptions } from "@tanstack/react-query";
import { getProject, getProjects } from "@/lib/api/projects.api";

export const getProjectsQuery = (workspaceSlug: string) =>
  queryOptions({
    queryKey: ["projects", workspaceSlug],
    queryFn: () => getProjects(workspaceSlug),
  });

export const getProjectQuery = ({ workspaceSlug, projectSlug }: { workspaceSlug: string; projectSlug: string }) =>
  queryOptions({
    queryKey: ["project", projectSlug],
    queryFn: () => getProject({ workspaceSlug, projectSlug }),
  });
