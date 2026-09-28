import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentKeys } from "@/lib/query-keys/comment.keys";
import { deleteComment } from "@/lib/api/comments.api";
import { activityKeys } from "@/lib/query-keys/activity.keys";

export function useDeleteComment(workspaceSlug: string, projectSlug: string, taskNumber: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => deleteComment({ workspaceSlug, projectSlug, taskNumber, commentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.all });
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
    },
  });
}
