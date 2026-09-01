import { request } from "@/lib/http/client";
import { PaginatedResponseDto } from "@/lib/dtos/pagination.dto";
import {
  WorkspaceMemberResponseDto,
  WorkspaceMemberStatus,
  WorkspaceMemberWithUserResponseDto,
} from "@/lib/dtos/workspace-members.dto";
import { CreateWorkspaceMemberDto, UpdateWorkspaceMemberDto } from "../schemas/workspace-member.schema";

export function getWorkspaceMembers({
  workspaceSlug,
  status,
  excludeProjectSlug,
  page,
  limit,
}: {
  workspaceSlug: string;
  status?: WorkspaceMemberStatus[];
  excludeProjectSlug?: string;
  page?: number;
  limit?: number;
}) {
  const params = new URLSearchParams();
  status?.forEach((s) => params.append("status", s));
  if (excludeProjectSlug) {
    params.set("excludeProjectSlug", excludeProjectSlug);
  }
  if (page) params.set("page", String(page));
  if (limit) params.set("limit", String(limit));
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

export function updateWorkspaceMember({
  workspaceSlug,
  userId,
  data,
}: {
  workspaceSlug: string;
  userId: string;
  data: UpdateWorkspaceMemberDto;
}) {
  return request<void>(`/workspaces/${workspaceSlug}/members/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function removeWorkspaceMember({ workspaceSlug, userId }: { workspaceSlug: string; userId: string }) {
  return request<void>(`/workspaces/${workspaceSlug}/members/${userId}/remove`, {
    method: "PATCH",
  });
}
