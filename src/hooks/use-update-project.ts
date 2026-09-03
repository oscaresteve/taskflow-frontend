import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectKeys } from "@/lib/query-keys/project.keys";
import { updateProject } from "@/lib/api/projects.api";
import { UpdateProjectDto } from "@/lib/schemas/project.schema";

export function useUpdateProject(workspaceSlug: string, projectSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProjectDto) => updateProject({ workspaceSlug, projectSlug, data }),
    // Priming the new slug's detail query (rather than invalidating the old one) avoids
    // refetching a slug the backend just renamed away from, which 404s. Awaited so callers
    // that navigate on success (e.g. slug changed after a rename) land on a page whose query
    // cache is already fresh, not stale.
    onSuccess: async (updatedProject) => {
      queryClient.setQueryData(projectKeys.detail(workspaceSlug, updatedProject.slug), updatedProject);
      await queryClient.invalidateQueries({ queryKey: projectKeys.lists(workspaceSlug) });
    },
  });
}
