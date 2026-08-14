import { request } from "@/lib/http/client";
import { PaginatedResponseDto } from "@/lib/dtos/pagination.dto";
import { WorkspaceResponseDto } from "@/lib/dtos/workspaces.dto";

export function getWorkspaces() {
  return request<PaginatedResponseDto<WorkspaceResponseDto>>("/workspaces", {
    method: "GET",
  });
}
