import { useMutation, useQueryClient } from "@tanstack/react-query";
import { taskKeys } from "@/lib/query-keys/task.keys";
import { createTask } from "@/lib/api/tasks.api";
import { CreateTaskDto } from "@/lib/schemas/task.schema";

export function useCreateTask(workspaceSlug: string, projectSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskDto) => createTask({ workspaceSlug, projectSlug, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists(workspaceSlug, projectSlug) });
    },
  });
}
