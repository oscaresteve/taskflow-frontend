import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentKeys } from "@/lib/query-keys/comment.keys";
import { updateComment } from "@/lib/api/comments.api";
import { UpdateCommentDto } from "@/lib/schemas/comment.schema";

export function useUpdateComment(workspaceSlug: string, projectSlug: string, taskNumber: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, data }: { commentId: string; data: UpdateCommentDto }) =>
      updateComment({ workspaceSlug, projectSlug, taskNumber, commentId, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.all });
    },
  });
}
