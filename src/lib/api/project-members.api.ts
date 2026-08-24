import { PaginatedResponseDto } from "../dtos/pagination.dto";
import { ProjectMemberResponseDto, ProjectMemberWithUserResponseDto } from "../dtos/project-members.dto";
import { request } from "../http/client";
import { CreateProjectMemberDto, UpdateProjectMemberDto } from "../schemas/project-member.schema";

export function getProjectMembers({
  workspaceSlug,
  projectSlug,
  isActive,
}: {
  workspaceSlug: string;
  projectSlug: string;
  isActive?: boolean[];
}) {
  const params = new URLSearchParams();
  isActive?.forEach((value) => params.append("isActive", String(value)));
  const queryString = params.toString();

  return request<PaginatedResponseDto<ProjectMemberWithUserResponseDto>>(
    `/workspaces/${workspaceSlug}/projects/${projectSlug}/members${queryString ? `?${queryString}` : ""}`,
    { method: "GET" },
  );
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
