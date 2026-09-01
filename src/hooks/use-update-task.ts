import { useMutation, useQueryClient } from "@tanstack/react-query";
import { taskKeys } from "@/lib/query-keys/task.keys";
import { updateTask } from "@/lib/api/tasks.api";
import { UpdateTaskDto } from "@/lib/schemas/task.schema";

export function useUpdateTask(workspaceSlug: string, projectSlug: string, taskNumber: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTaskDto) => updateTask({ workspaceSlug, projectSlug, taskNumber, data }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: taskKeys.detail(workspaceSlug, projectSlug, taskNumber) }),
        queryClient.invalidateQueries({ queryKey: taskKeys.lists(workspaceSlug, projectSlug) }),
      ]);
    },
  });
}
