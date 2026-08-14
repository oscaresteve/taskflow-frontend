import { serverRequest } from "@/lib/http/server-client";
import { PaginatedResponseDto } from "@/lib/dtos/pagination.dto";
import { WorkspaceResponseDto } from "@/lib/dtos/workspaces.dto";

export function getWorkspacesServer() {
  return serverRequest<PaginatedResponseDto<WorkspaceResponseDto>>("/workspaces");
}

export async function hasWorkspaces() {
  const workspaces = await getWorkspacesServer();
  return workspaces !== null && workspaces.data.length > 0;
}
