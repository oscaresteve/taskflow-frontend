import { ProjectRole } from "@/lib/dtos/project-members.dto";
import { SortOrder } from "@/lib/dtos/pagination.dto";

type ProjectMemberListParams = {
  isActive?: boolean | boolean[];
  role?: ProjectRole;
  search?: string;
  sort?: "joinedAt" | "createdAt" | "updatedAt";
  order?: SortOrder;
  page?: number;
  limit?: number;
};

export const projectMemberKeys = {
  all: ["project-members"] as const,
  me: (workspaceSlug: string, projectSlug: string) =>
    [...projectMemberKeys.all, "me", workspaceSlug, projectSlug] as const,
  activeList: (workspaceSlug: string, projectSlug: string) =>
    [...projectMemberKeys.all, "active-list", workspaceSlug, projectSlug] as const,
  paginatedList: (workspaceSlug: string, projectSlug: string, params: ProjectMemberListParams = {}) =>
    [...projectMemberKeys.all, "paginated-list", workspaceSlug, projectSlug, params] as const,
};
