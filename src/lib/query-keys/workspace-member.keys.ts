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

type ActiveInfiniteListParams = {
  excludeProjectSlug?: string;
  search?: string;
  limit?: number;
};

export const workspaceMemberKeys = {
  all: ["workspace-members"] as const,
  me: (workspaceSlug: string) => [...workspaceMemberKeys.all, "me", workspaceSlug] as const,
  lists: (workspaceSlug: string) => [...workspaceMemberKeys.all, "list", workspaceSlug] as const,
  // params defaults to {} (and callers may pass a subset, e.g. only excludeProjectSlug) so
  // invalidation can wildcard-match every search/limit variant, same trick as paginatedList below.
  activeInfiniteList: (workspaceSlug: string, params: ActiveInfiniteListParams = {}) =>
    [...workspaceMemberKeys.all, "active-infinite-list", workspaceSlug, params] as const,
  paginatedList: (workspaceSlug: string, params: WorkspaceMemberListParams = {}) =>
    [...workspaceMemberKeys.all, "paginated-list", workspaceSlug, params] as const,
};
