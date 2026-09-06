import { PaginatedResponseDto, SortOrder } from "../dtos/pagination.dto";
import { ProjectMemberResponseDto, ProjectMemberWithUserResponseDto, ProjectRole } from "../dtos/project-members.dto";
import { request } from "../http/client";
import { buildQueryString } from "../http/query-string";
import { CreateProjectMemberDto, UpdateProjectMemberDto } from "../schemas/project-member.schema";

export function getProjectMembers({
  workspaceSlug,
  projectSlug,
  page,
  limit,
  isActive,
  role,
  search,
  sort,
  order,
}: {
  workspaceSlug: string;
  projectSlug: string;
  page?: number;
  limit?: number;
  isActive?: boolean | boolean[];
  role?: ProjectRole;
  search?: string;
  sort?: "joinedAt" | "createdAt" | "updatedAt";
  order?: SortOrder;
}) {
  const queryString = buildQueryString({ page, limit, isActive, role, search, sort, order });

  return request<PaginatedResponseDto<ProjectMemberWithUserResponseDto>>(
    `/workspaces/${workspaceSlug}/projects/${projectSlug}/members${queryString}`,
    { method: "GET" },
  );
}

export function getAllProjectMembers({
  workspaceSlug,
  projectSlug,
  isActive,
  role,
  search,
  sort,
  order,
}: {
  workspaceSlug: string;
  projectSlug: string;
  isActive?: boolean | boolean[];
  role?: ProjectRole;
  search?: string;
  sort?: "joinedAt" | "createdAt" | "updatedAt";
  order?: SortOrder;
}) {
  const queryString = buildQueryString({ isActive, role, search, sort, order });

  return request<ProjectMemberWithUserResponseDto[]>(
    `/workspaces/${workspaceSlug}/projects/${projectSlug}/members/all${queryString}`,
    { method: "GET" },
  );
}

export function getMyProjectMember({ workspaceSlug, projectSlug }: { workspaceSlug: string; projectSlug: string }) {
  return request<ProjectMemberResponseDto>(`/workspaces/${workspaceSlug}/projects/${projectSlug}/members/me`, {
    method: "GET",
  });
}

export function createProjectMember({
  workspaceSlug,
  projectSlug,
  data,
}: {
  workspaceSlug: string;
  projectSlug: string;
  data: CreateProjectMemberDto;
}) {
  return request<ProjectMemberResponseDto>(`/workspaces/${workspaceSlug}/projects/${projectSlug}/members`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateProjectMember({
  workspaceSlug,
  projectSlug,
  userId,
  data,
}: {
  workspaceSlug: string;
  projectSlug: string;
  userId: string;
  data: UpdateProjectMemberDto;
}) {
  return request<ProjectMemberResponseDto>(`/workspaces/${workspaceSlug}/projects/${projectSlug}/members/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deactivateProjectMember({
  workspaceSlug,
  projectSlug,
  userId,
}: {
  workspaceSlug: string;
  projectSlug: string;
  userId: string;
}) {
  return request<void>(`/workspaces/${workspaceSlug}/projects/${projectSlug}/members/${userId}/deactivate`, {
    method: "PATCH",
  });
}
