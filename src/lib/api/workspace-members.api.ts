import { request } from "@/lib/http/client";
import { PaginatedResponseDto } from "@/lib/dtos/pagination.dto";
import { WorkspaceMemberResponseDto, WorkspaceMemberWithUserResponseDto } from "@/lib/dtos/workspace-members.dto";
import { CreateWorkspaceMemberDto } from "../schemas/workspace-member.schema";

export function getWorkspaceMembers(workspaceSlug: string) {
  return request<PaginatedResponseDto<WorkspaceMemberWithUserResponseDto>>(`/workspaces/${workspaceSlug}/members`, {
    method: "GET",
  });
}

export function createWorkspaceMember({
  workspaceSlug,
  data,
}: {
  workspaceSlug: string;
  data: CreateWorkspaceMemberDto;
}) {
  return request<WorkspaceMemberResponseDto>(`/workspaces/${workspaceSlug}/members`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
