import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentKeys } from "@/lib/query-keys/comment.keys";
import { deleteComment } from "@/lib/api/comments.api";

export function useDeleteComment(workspaceSlug: string, projectSlug: string, taskNumber: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => deleteComment({ workspaceSlug, projectSlug, taskNumber, commentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.all });
    },
  });
}
