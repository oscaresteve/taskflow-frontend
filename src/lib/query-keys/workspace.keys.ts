import { SortOrder } from "@/lib/dtos/pagination.dto";
import { WorkspaceSortField } from "../workspace-enums";

type WorkspaceListParams = {
  page?: number;
  limit?: number;
  search?: string;
  isFavorite?: boolean;
  sort?: WorkspaceSortField;
  order?: SortOrder;
};

export const workspaceKeys = {
  all: ["workspaces"] as const,
  lists: (params: WorkspaceListParams = {}) => [...workspaceKeys.all, "list", params] as const,
  infiniteList: (params: { limit?: number; search?: string; isFavorite?: boolean } = {}) =>
    [...workspaceKeys.all, "infinite-list", params] as const,
  detail: (workspaceSlug: string) => [...workspaceKeys.all, "detail", workspaceSlug] as const,
};
