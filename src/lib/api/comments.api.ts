import { request } from "@/lib/http/client";
import { buildQueryString } from "@/lib/http/query-string";
import { PaginatedResponseDto, SortOrder } from "@/lib/dtos/pagination.dto";
import { CommentResponseDto } from "@/lib/dtos/comments.dto";
import { CreateCommentDto, UpdateCommentDto } from "@/lib/schemas/comment.schema";

export function getComments({
  workspaceSlug,
  projectSlug,
  taskNumber,
  page,
  limit,
  authorId,
  search,
  sort,
  order,
}: {
  workspaceSlug: string;
  projectSlug: string;
  taskNumber: string;
  page?: number;
  limit?: number;
  authorId?: string;
  search?: string;
  sort?: "createdAt" | "updatedAt";
  order?: SortOrder;
}) {
  const queryString = buildQueryString({ page, limit, authorId, search, sort, order });

  return request<PaginatedResponseDto<CommentResponseDto>>(
    `/workspaces/${workspaceSlug}/projects/${projectSlug}/tasks/${taskNumber}/comments${queryString}`,
    { method: "GET" },
  );
}

export function createComment({
  workspaceSlug,
  projectSlug,
  taskNumber,
  data,
}: {
  workspaceSlug: string;
  projectSlug: string;
  taskNumber: string;
  data: CreateCommentDto;
}) {
  return request<CommentResponseDto>(`/workspaces/${workspaceSlug}/projects/${projectSlug}/tasks/${taskNumber}/comments`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateComment({
  workspaceSlug,
  projectSlug,
  taskNumber,
  commentId,
  data,
}: {
  workspaceSlug: string;
  projectSlug: string;
  taskNumber: string;
  commentId: string;
  data: UpdateCommentDto;
}) {
  return request<CommentResponseDto>(
    `/workspaces/${workspaceSlug}/projects/${projectSlug}/tasks/${taskNumber}/comments/${commentId}`,
    { method: "PATCH", body: JSON.stringify(data) },
  );
}

export function deleteComment({
  workspaceSlug,
  projectSlug,
  taskNumber,
  commentId,
}: {
  workspaceSlug: string;
  projectSlug: string;
  taskNumber: string;
  commentId: string;
}) {
  return request<void>(
    `/workspaces/${workspaceSlug}/projects/${projectSlug}/tasks/${taskNumber}/comments/${commentId}/delete`,
    { method: "PATCH" },
  );
}
