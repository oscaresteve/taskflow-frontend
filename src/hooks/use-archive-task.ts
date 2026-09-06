import { useMutation, useQueryClient } from "@tanstack/react-query";
import { taskKeys } from "@/lib/query-keys/task.keys";
import { archiveTask } from "@/lib/api/tasks.api";

export function useArchiveTask(workspaceSlug: string, projectSlug: string, taskNumber: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => archiveTask({ workspaceSlug, projectSlug, taskNumber }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: taskKeys.detail(workspaceSlug, projectSlug, taskNumber) }),
        queryClient.invalidateQueries({ queryKey: taskKeys.board(workspaceSlug, projectSlug) }),
      ]);
    },
  });
}
