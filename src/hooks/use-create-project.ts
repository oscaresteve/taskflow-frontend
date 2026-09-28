import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectKeys } from "@/lib/query-keys/project.keys";
import { createProject } from "@/lib/api/projects.api";
import { CreateProjectDto } from "@/lib/schemas/project.schema";
import { activityKeys } from "@/lib/query-keys/activity.keys";

export function useCreateProject(workspaceSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectDto) => createProject({ workspaceSlug, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
    },
  });
}
