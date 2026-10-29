import { request } from "@/lib/http/client";
import { buildQueryString } from "@/lib/http/query-string";
import { PaginatedResponseDto, SortOrder } from "@/lib/dtos/pagination.dto";
import {
  WorkspaceMemberResponseDto,
  WorkspaceMemberStatus,
  WorkspaceMemberWithUserResponseDto,
  WorkspaceRole,
} from "@/lib/dtos/workspace-members.dto";
import {
  CreateWorkspaceMemberDto,
  RestoreWorkspaceMemberDto,
  UpdateWorkspaceMemberDto,
} from "../schemas/workspace-member.schema";
import { MemberSortField } from "../member-enums";

export function getWorkspaceMembers({
  workspaceSlug,
  page,
  limit,
  role,
  status,
  search,
  excludeProjectSlug,
  sort,
  order,
}: {
  workspaceSlug: string;
  page?: number;
  limit?: number;
  role?: WorkspaceRole;
  status?: WorkspaceMemberStatus | WorkspaceMemberStatus[];
  search?: string;
  excludeProjectSlug?: string;
  sort?: MemberSortField;
  order?: SortOrder;
}) {
  const queryString = buildQueryString({ page, limit, role, status, search, excludeProjectSlug, sort, order });

  return request<PaginatedResponseDto<WorkspaceMemberWithUserResponseDto>>(
    `/workspaces/${workspaceSlug}/members${queryString}`,
    { method: "GET" },
  );
}

export function getAllWorkspaceMembers({
  workspaceSlug,
  role,
  status,
  search,
  excludeProjectSlug,
  sort,
  order,
}: {
  workspaceSlug: string;
  role?: WorkspaceRole;
  status?: WorkspaceMemberStatus | WorkspaceMemberStatus[];
  search?: string;
  excludeProjectSlug?: string;
  sort?: MemberSortField;
  order?: SortOrder;
}) {
  const queryString = buildQueryString({ role, status, search, excludeProjectSlug, sort, order });

  return request<WorkspaceMemberWithUserResponseDto[]>(`/workspaces/${workspaceSlug}/members/all${queryString}`, {
    method: "GET",
  });
}

export function getMyWorkspaceMember({ workspaceSlug }: { workspaceSlug: string }) {
  return request<WorkspaceMemberResponseDto>(`/workspaces/${workspaceSlug}/members/me`, {
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

// La vuelta de `removeWorkspaceMember`, no de `activateWorkspaceMember`: ese sigue siendo solo para
// aceptar una invitacion pendiente.
export function restoreWorkspaceMember({
  workspaceSlug,
  userId,
  data,
}: {
  workspaceSlug: string;
  userId: string;
  data: RestoreWorkspaceMemberDto;
}) {
  return request<void>(`/workspaces/${workspaceSlug}/members/${userId}/restore`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// Salir por cuenta propia. Endpoint aparte de `removeWorkspaceMember` porque el del manager exige
// permisos de gestion.
export function leaveWorkspace({ workspaceSlug }: { workspaceSlug: string }) {
  return request<void>(`/workspaces/${workspaceSlug}/members/me/leave`, {
    method: "PATCH",
  });
}
