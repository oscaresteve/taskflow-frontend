import { request } from "@/lib/http/client";
import { PaginatedResponseDto } from "@/lib/dtos/pagination.dto";
import { WorkspaceDetailResponseDto, WorkspaceResponseDto } from "@/lib/dtos/workspaces.dto";
import { CreateWorkspaceDto } from "../schemas/workspace.schema";

export function getWorkspaces() {
  return request<PaginatedResponseDto<WorkspaceResponseDto>>("/workspaces", {
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
  return request<WorkspaceDetailResponseDto>(`/workspaces/${workspaceSlug}`, {
    method: "GET",
  });
}
