import { request } from "@/lib/http/client";
import { buildQueryString } from "@/lib/http/query-string";
import { PaginatedResponseDto, SortOrder } from "@/lib/dtos/pagination.dto";
import { WorkspaceResponseDto } from "@/lib/dtos/workspaces.dto";
import { CreateWorkspaceDto, UpdateWorkspaceDto } from "../schemas/workspace.schema";

export function getWorkspaces({
  page,
  limit,
  isActive,
  search,
  sort,
  order,
}: {
  page?: number;
  limit?: number;
  isActive?: boolean | boolean[];
  search?: string;
  sort?: "name" | "createdAt" | "updatedAt";
  order?: SortOrder;
} = {}) {
  const queryString = buildQueryString({ page, limit, isActive, search, sort, order });

  return request<PaginatedResponseDto<WorkspaceResponseDto>>(`/workspaces${queryString}`, {
    method: "GET",
  });
}

export function createWorkspace(data: CreateWorkspaceDto) {
  return request<WorkspaceResponseDto>("/workspaces", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getWorkspace(workspaceSlug: string) {
  return request<WorkspaceResponseDto>(`/workspaces/${workspaceSlug}`, {
    method: "GET",
  });
}

export function updateWorkspace({ workspaceSlug, data }: { workspaceSlug: string; data: UpdateWorkspaceDto }) {
  return request<WorkspaceResponseDto>(`/workspaces/${workspaceSlug}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deactivateWorkspace(workspaceSlug: string) {
  return request<void>(`/workspaces/${workspaceSlug}/deactivate`, {
    method: "PATCH",
  });
}
