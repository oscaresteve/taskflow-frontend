import { serverRequest } from "@/lib/http/server-client";
import { PaginatedResponseDto } from "@/lib/dtos/pagination.dto";
import { WorkspaceResponseDto } from "@/lib/dtos/workspaces.dto";

export function getWorkspacesServer() {
  return serverRequest<PaginatedResponseDto<WorkspaceResponseDto>>("/workspaces");
}
