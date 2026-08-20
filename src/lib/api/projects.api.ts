import { PaginatedResponseDto } from "@/lib/dtos/pagination.dto";
import { ProjectDetailResponseDto, ProjectResponseDto } from "@/lib/dtos/projects.dto";
import { request } from "@/lib/http/client";
import { CreateProjectDto, UpdateProjectDto } from "@/lib/schemas/project.schema";

export function getProjects(workspaceSlug: string) {
  return request<PaginatedResponseDto<ProjectResponseDto>>(`/workspaces/${workspaceSlug}/projects`, {
    method: "GET",
  });
}

export function createProject(workspaceSlug: string, data: CreateProjectDto) {
  return request<ProjectResponseDto>(`/workspaces/${workspaceSlug}/projects`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getProject({ workspaceSlug, projectSlug }: { workspaceSlug: string; projectSlug: string }) {
  return request<ProjectDetailResponseDto>(`/workspaces/${workspaceSlug}/projects/${projectSlug}`, {
    method: "GET",
  });
}

export function updateProject(workspaceSlug: string, projectSlug: string, data: UpdateProjectDto) {
  return request<ProjectResponseDto>(`/workspaces/${workspaceSlug}/projects/${projectSlug}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function archiveProject(workspaceSlug: string, projectSlug: string) {
  return request<void>(`/workspaces/${workspaceSlug}/projects/${projectSlug}/archive`, {
    method: "PATCH",
  });
}
