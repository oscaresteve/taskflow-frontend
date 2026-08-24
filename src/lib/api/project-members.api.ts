import { PaginatedResponseDto } from "../dtos/pagination.dto";
import { ProjectMemberResponseDto, ProjectMemberWithUserResponseDto } from "../dtos/project-members.dto";
import { request } from "../http/client";
import { CreateProjectMemberDto, UpdateProjectMemberDto } from "../schemas/project-member.schema";

export function getProjectMembers({ workspaceSlug, projectSlug }: { workspaceSlug: string; projectSlug: string }) {
  return request<PaginatedResponseDto<ProjectMemberWithUserResponseDto>>(
    `/workspaces/${workspaceSlug}/projects/${projectSlug}/members`,
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
