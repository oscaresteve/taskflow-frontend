import { SortOrder } from "@/lib/dtos/pagination.dto";

type ProjectListParams = {
  page?: number;
  limit?: number;
  isArchived?: boolean;
  search?: string;
  sort?: "name" | "createdAt" | "updatedAt";
  order?: SortOrder;
};

export const projectKeys = {
  all: ["projects"] as const,
  // params defaults to {} so existing invalidation calls like projectKeys.lists(workspaceSlug)
  // keep matching every paginated variant (react-query treats {} as a wildcard when
  // partial-matching query keys).
  lists: (workspaceSlug: string, params: ProjectListParams = {}) =>
    [...projectKeys.all, "list", workspaceSlug, params] as const,
  infiniteList: (workspaceSlug: string, params: { limit?: number } = {}) =>
    [...projectKeys.all, "infinite-list", workspaceSlug, params] as const,
  detail: (workspaceSlug: string, projectSlug: string) =>
    [...projectKeys.all, "detail", workspaceSlug, projectSlug] as const,
};
