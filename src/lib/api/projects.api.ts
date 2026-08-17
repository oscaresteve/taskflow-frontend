import { PaginatedResponseDto } from "@/lib/dtos/pagination.dto";
import { ProjectResponseDto } from "@/lib/dtos/projects.dto";
import { request } from "@/lib/http/client";

export function getProjects(workspaceSlug: string) {
  return request<PaginatedResponseDto<ProjectResponseDto>>(`/workspaces/${workspaceSlug}/projects`, {
    method: "GET",
  });
}
