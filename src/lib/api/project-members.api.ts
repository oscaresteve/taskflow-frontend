import { PaginatedResponseDto } from "../dtos/pagination.dto";
import { ProjectMemberResponseDto, ProjectMemberWithUserResponseDto } from "../dtos/project-members.dto";
import { request } from "../http/client";
import { CreateProjectMemberDto } from "../schemas/project-member.schema";

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
