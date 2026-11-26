import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectKeys } from "@/lib/query-keys/project.keys";
import { unarchiveProject } from "@/lib/api/projects.api";

export function useUnarchiveProject(workspaceSlug: string, projectSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => unarchiveProject({ workspaceSlug, projectSlug }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}
