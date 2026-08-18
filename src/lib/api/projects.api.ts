import { PaginatedResponseDto } from "@/lib/dtos/pagination.dto";
import { ProjectDetailResponseDto, ProjectResponseDto } from "@/lib/dtos/projects.dto";
import { request } from "@/lib/http/client";

export function getProjects(workspaceSlug: string) {
  return request<PaginatedResponseDto<ProjectResponseDto>>(`/workspaces/${workspaceSlug}/projects`, {
    method: "GET",
  });
}

export function getProject({ workspaceSlug, projectSlug }: { workspaceSlug: string; projectSlug: string }) {
  return request<ProjectDetailResponseDto>(`/workspaces/${workspaceSlug}/projects/${projectSlug}`, {
    method: "GET",
  });
}
