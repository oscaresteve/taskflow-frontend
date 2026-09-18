import { ProjectRole } from "@/lib/dtos/project-members.dto";
import { SortOrder } from "@/lib/dtos/pagination.dto";
import { MemberSortField } from "@/lib/member-enums";

type ProjectMemberListParams = {
  isActive?: boolean | boolean[];
  role?: ProjectRole;
  search?: string;
  sort?: MemberSortField;
  order?: SortOrder;
  page?: number;
  limit?: number;
};

type ActiveInfiniteListParams = {
  search?: string;
  limit?: number;
};

export const projectMemberKeys = {
  all: ["project-members"] as const,
  me: (workspaceSlug: string, projectSlug: string) =>
    [...projectMemberKeys.all, "me", workspaceSlug, projectSlug] as const,
  detail: (workspaceSlug: string, projectSlug: string, userId: string) =>
    [...projectMemberKeys.all, "detail", workspaceSlug, projectSlug, userId] as const,
  activeList: (workspaceSlug: string, projectSlug: string) =>
    [...projectMemberKeys.all, "active-list", workspaceSlug, projectSlug] as const,
  activeInfiniteList: (workspaceSlug: string, projectSlug: string, params: ActiveInfiniteListParams = {}) =>
    [...projectMemberKeys.all, "active-infinite-list", workspaceSlug, projectSlug, params] as const,
  paginatedList: (workspaceSlug: string, projectSlug: string, params: ProjectMemberListParams = {}) =>
    [...projectMemberKeys.all, "paginated-list", workspaceSlug, projectSlug, params] as const,
};
