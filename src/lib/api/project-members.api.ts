import { PaginatedResponseDto } from "../dtos/pagination.dto";
import { ProjectMemberWithUserResponseDto } from "../dtos/project-members.dto";
import { request } from "../http/client";

export function getProjectMembers({ workspaceSlug, projectSlug }: { workspaceSlug: string; projectSlug: string }) {
  return request<PaginatedResponseDto<ProjectMemberWithUserResponseDto>>(
    `/workspaces/${workspaceSlug}/projects/${projectSlug}/members`,
    { method: "GET" },
  );
}
