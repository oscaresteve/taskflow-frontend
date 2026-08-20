import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectKeys } from "@/lib/query-keys/project.keys";
import { archiveProject } from "@/lib/api/projects.api";

export function useArchiveProject(workspaceSlug: string, projectSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => archiveProject(workspaceSlug, projectSlug),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: projectKeys.detail(workspaceSlug, projectSlug) }),
        queryClient.invalidateQueries({ queryKey: projectKeys.lists(workspaceSlug) }),
      ]);
    },
  });
}
