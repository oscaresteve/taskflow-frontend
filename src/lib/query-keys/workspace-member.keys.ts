import { WorkspaceMemberStatus, WorkspaceRole } from "@/lib/dtos/workspace-members.dto";
import { SortOrder } from "@/lib/dtos/pagination.dto";

type WorkspaceMemberListParams = {
  status?: WorkspaceMemberStatus | WorkspaceMemberStatus[];
  role?: WorkspaceRole;
  search?: string;
  sort?: "joinedAt" | "createdAt" | "updatedAt";
  order?: SortOrder;
  page?: number;
  limit?: number;
};

export const workspaceMemberKeys = {
  all: ["workspace-members"] as const,
  me: (workspaceSlug: string) => [...workspaceMemberKeys.all, "me", workspaceSlug] as const,
  lists: (workspaceSlug: string) => [...workspaceMemberKeys.all, "list", workspaceSlug] as const,
  activeList: (workspaceSlug: string, excludeProjectSlug?: string) =>
    [...workspaceMemberKeys.all, "active-list", workspaceSlug, excludeProjectSlug] as const,
  paginatedList: (workspaceSlug: string, params: WorkspaceMemberListParams = {}) =>
    [...workspaceMemberKeys.all, "paginated-list", workspaceSlug, params] as const,
};
