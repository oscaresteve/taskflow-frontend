import { SortOrder } from "@/lib/dtos/pagination.dto";

type WorkspaceListParams = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: "name" | "createdAt" | "updatedAt";
  order?: SortOrder;
};

export const workspaceKeys = {
  all: ["workspaces"] as const,
  lists: (params: WorkspaceListParams = {}) => [...workspaceKeys.all, "list", params] as const,
  infiniteList: (limit: number) => [...workspaceKeys.all, "infinite-list", limit] as const,
  detail: (workspaceSlug: string) => [...workspaceKeys.all, "detail", workspaceSlug] as const,
};
