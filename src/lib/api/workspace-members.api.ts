import { request } from "@/lib/http/client";
import { PaginatedResponseDto } from "@/lib/dtos/pagination.dto";
import { WorkspaceMemberWithUserResponseDto } from "@/lib/dtos/workspace-members.dto";

export function getWorkspaceMembers(workspaceSlug: string) {
  return request<PaginatedResponseDto<WorkspaceMemberWithUserResponseDto>>(`/workspaces/${workspaceSlug}/members`, {
    method: "GET",
  });
}
