import { request } from "@/lib/http/client";
import { PaginatedResponseDto } from "@/lib/dtos/pagination.dto";
import { WorkspaceResponseDto } from "@/lib/dtos/workspaces.dto";
import { CreateWorkspaceDto, UpdateWorkspaceDto } from "../schemas/workspace.schema";

export function getWorkspaces({
  page,
  limit,
  search,
}: { page?: number; limit?: number; search?: string } = {}) {
  const params = new URLSearchParams();
  if (page) params.set("page", String(page));
  if (limit) params.set("limit", String(limit));
  if (search) params.set("search", search);
  const queryString = params.toString();

  return request<PaginatedResponseDto<WorkspaceResponseDto>>(`/workspaces${queryString ? `?${queryString}` : ""}`, {
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
