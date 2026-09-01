import { request } from "@/lib/http/client";
import { PaginatedResponseDto } from "@/lib/dtos/pagination.dto";
import { WorkspaceResponseDto } from "@/lib/dtos/workspaces.dto";
import { CreateWorkspaceDto, UpdateWorkspaceDto } from "../schemas/workspace.schema";

export function getWorkspaces(isActive?: boolean[]) {
  const params = new URLSearchParams();
  isActive?.forEach((value) => params.append("isActive", String(value)));
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

export function updateWorkspace(workspaceSlug: string, data: UpdateWorkspaceDto) {
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
