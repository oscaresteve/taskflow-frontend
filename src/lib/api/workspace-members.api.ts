import { request } from "@/lib/http/client";
import { PaginatedResponseDto } from "@/lib/dtos/pagination.dto";
import {
  WorkspaceMemberResponseDto,
  WorkspaceMemberStatus,
  WorkspaceMemberWithUserResponseDto,
} from "@/lib/dtos/workspace-members.dto";
import { CreateWorkspaceMemberDto } from "../schemas/workspace-member.schema";

export function getWorkspaceMembers(workspaceSlug: string, status?: WorkspaceMemberStatus[]) {
  const params = new URLSearchParams();
  status?.forEach((s) => params.append("status", s));
  const queryString = params.toString();

  return request<PaginatedResponseDto<WorkspaceMemberWithUserResponseDto>>(
    `/workspaces/${workspaceSlug}/members${queryString ? `?${queryString}` : ""}`,
    { method: "GET" },
  );
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

export function activateWorkspaceMember({ workspaceSlug, userId }: { workspaceSlug: string; userId: string }) {
  return request<void>(`/workspaces/${workspaceSlug}/members/${userId}/activate`, {
    method: "PATCH",
  });
}
