import { redirect } from "next/navigation";
import { serverRequest } from "@/lib/http/server-client";
import { PaginatedResponseDto } from "@/lib/dtos/pagination.dto";
import { WorkspaceDetailResponseDto, WorkspaceResponseDto } from "@/lib/dtos/workspaces.dto";

export function getWorkspacesServer() {
  return serverRequest<PaginatedResponseDto<WorkspaceResponseDto>>("/workspaces");
}

export function getWorkspaceServer(workspaceSlug: string) {
  return serverRequest<WorkspaceDetailResponseDto>(`/workspaces/${workspaceSlug}`);
}

export async function hasWorkspaces() {
  const workspaces = await getWorkspacesServer();
  return workspaces !== null && workspaces.data.length > 0;
}

export async function requireWorkspaces() {
  if (!(await hasWorkspaces())) {
    redirect("/onboarding");
  }
}
