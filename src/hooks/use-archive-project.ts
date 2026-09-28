import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectKeys } from "@/lib/query-keys/project.keys";
import { archiveProject } from "@/lib/api/projects.api";
import { activityKeys } from "@/lib/query-keys/activity.keys";

export function useArchiveProject(workspaceSlug: string, projectSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => archiveProject({ workspaceSlug, projectSlug }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
    },
  });
}
