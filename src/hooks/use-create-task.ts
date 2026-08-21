import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectKeys } from "@/lib/query-keys/project.keys";
import { createTask } from "@/lib/api/tasks.api";
import { CreateTaskDto } from "@/lib/schemas/task.schema";

export function useCreateTask(workspaceSlug: string, projectSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskDto) => createTask(workspaceSlug, projectSlug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(workspaceSlug, projectSlug) });
    },
  });
}
