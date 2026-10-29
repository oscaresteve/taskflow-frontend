import { useMutation, useQueryClient } from "@tanstack/react-query";
import { taskKeys } from "@/lib/query-keys/task.keys";
import { unarchiveTask } from "@/lib/api/tasks.api";

export function useUnarchiveTask(workspaceSlug: string, projectSlug: string, taskNumber: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => unarchiveTask({ workspaceSlug, projectSlug, taskNumber }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: taskKeys.detail(workspaceSlug, projectSlug, taskNumber) }),
        queryClient.invalidateQueries({ queryKey: taskKeys.board(workspaceSlug, projectSlug) }),
        queryClient.invalidateQueries({ queryKey: taskKeys.lists(workspaceSlug, projectSlug) }),
      ]);
    },
  });
}
