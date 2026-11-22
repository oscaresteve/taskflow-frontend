import { SortOrder } from "@/lib/dtos/pagination.dto";
import { WorkspaceSortField } from "../workspace-enums";
import { WorkspaceRole } from "@/lib/dtos/workspace-members.dto";

type WorkspaceListParams = {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  isFavorite?: boolean;
  myRole?: readonly WorkspaceRole[];
  sort?: WorkspaceSortField;
  order?: SortOrder;
};

export const workspaceKeys = {
  all: ["workspaces"] as const,
  lists: (params: WorkspaceListParams = {}) => [...workspaceKeys.all, "list", params] as const,
  // `sort`/`order` entran en la clave: el rail pide los recientes y el conmutador el orden por
  // nombre con los mismos limit/search, y sin esto compartirian cache.
  infiniteList: (
    params: { limit?: number; search?: string; isFavorite?: boolean; sort?: string; order?: string } = {},
  ) =>
    [...workspaceKeys.all, "infinite-list", params] as const,
  detail: (workspaceSlug: string) => [...workspaceKeys.all, "detail", workspaceSlug] as const,
};
