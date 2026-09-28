import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentKeys } from "@/lib/query-keys/comment.keys";
import { createComment } from "@/lib/api/comments.api";
import { CreateCommentDto } from "@/lib/schemas/comment.schema";
import { activityKeys } from "@/lib/query-keys/activity.keys";

export function useCreateComment(workspaceSlug: string, projectSlug: string, taskNumber: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentDto) => createComment({ workspaceSlug, projectSlug, taskNumber, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.all });
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
    },
  });
}
