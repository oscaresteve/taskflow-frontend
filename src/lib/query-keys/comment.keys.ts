import { SortOrder } from "@/lib/dtos/pagination.dto";

type CommentListParams = {
  authorId?: string;
  search?: string;
  sort?: "createdAt" | "updatedAt";
  order?: SortOrder;
  limit?: number;
};

export const commentKeys = {
  all: ["comments"] as const,
  infiniteList: (
    workspaceSlug: string,
    projectSlug: string,
    taskNumber: string,
    params: CommentListParams = {},
  ) => [...commentKeys.all, "infinite-list", workspaceSlug, projectSlug, taskNumber, params] as const,
};
