import { queryOptions } from "@tanstack/react-query";
import { getProjects } from "@/lib/api/projects.api";

export const projectsQuery = (workspaceSlug: string) =>
  queryOptions({
    queryKey: ["projects", workspaceSlug],
    queryFn: () => getProjects(workspaceSlug),
  });
