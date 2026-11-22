import { SortOrder } from "@/lib/dtos/pagination.dto";
import { ProjectSortField } from "../project-enums";
import { ProjectRole } from "@/lib/dtos/project-members.dto";

type ProjectListParams = {
  page?: number;
  limit?: number;
  isArchived?: boolean;
  isFavorite?: boolean;
  myRole?: readonly ProjectRole[];
  search?: string;
  sort?: ProjectSortField;
  order?: SortOrder;
};

export const projectKeys = {
  all: ["projects"] as const,
  // params defaults to {} so existing invalidation calls like projectKeys.lists(workspaceSlug)
  // keep matching every paginated variant (react-query treats {} as a wildcard when
  // partial-matching query keys).
  lists: (workspaceSlug: string, params: ProjectListParams = {}) =>
    [...projectKeys.all, "list", workspaceSlug, params] as const,
  // `sort`/`order` entran en la clave: el rail pide los recientes y el resto el orden por nombre,
  // y sin esto compartirian cache y se pisarian el uno al otro.
  infiniteList: (
    workspaceSlug: string,
    params: { limit?: number; search?: string; isFavorite?: boolean; sort?: string; order?: string } = {},
  ) =>
    [...projectKeys.all, "infinite-list", workspaceSlug, params] as const,
  detail: (workspaceSlug: string, projectSlug: string) =>
    [...projectKeys.all, "detail", workspaceSlug, projectSlug] as const,
};
