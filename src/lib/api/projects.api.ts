import { PaginatedResponseDto, SortOrder } from "@/lib/dtos/pagination.dto";
import { ProjectResponseDto } from "@/lib/dtos/projects.dto";
import { request } from "@/lib/http/client";
import { buildQueryString } from "@/lib/http/query-string";
import { CreateProjectDto, UpdateProjectDto } from "@/lib/schemas/project.schema";

export function getProjects({
  workspaceSlug,
  page,
  limit,
  isArchived,
  search,
  sort,
  order,
}: {
  workspaceSlug: string;
  page?: number;
  limit?: number;
  isArchived?: boolean;
  search?: string;
  sort?: "name" | "createdAt" | "updatedAt";
  order?: SortOrder;
}) {
  const queryString = buildQueryString({ page, limit, isArchived, search, sort, order });

  return request<PaginatedResponseDto<ProjectResponseDto>>(`/workspaces/${workspaceSlug}/projects${queryString}`, {
    method: "GET",
  });
}

export function createProject({ workspaceSlug, data }: { workspaceSlug: string; data: CreateProjectDto }) {
  return request<ProjectResponseDto>(`/workspaces/${workspaceSlug}/projects`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getProject({ workspaceSlug, projectSlug }: { workspaceSlug: string; projectSlug: string }) {
  return request<ProjectResponseDto>(`/workspaces/${workspaceSlug}/projects/${projectSlug}`, {
    method: "GET",
  });
}

export function updateProject({
  workspaceSlug,
  projectSlug,
  data,
}: {
  workspaceSlug: string;
  projectSlug: string;
  data: UpdateProjectDto;
}) {
  return request<ProjectResponseDto>(`/workspaces/${workspaceSlug}/projects/${projectSlug}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function archiveProject({ workspaceSlug, projectSlug }: { workspaceSlug: string; projectSlug: string }) {
  return request<void>(`/workspaces/${workspaceSlug}/projects/${projectSlug}/archive`, {
    method: "PATCH",
  });
}
