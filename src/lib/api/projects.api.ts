import { PaginatedResponseDto, SortOrder } from "@/lib/dtos/pagination.dto";
import { ProjectListItemResponseDto, ProjectResponseDto } from "@/lib/dtos/projects.dto";
import { request } from "@/lib/http/client";
import { buildQueryString } from "@/lib/http/query-string";
import { CreateProjectDto, UpdateProjectDto } from "@/lib/schemas/project.schema";
import { ProjectSortField } from "../project-enums";
import { ProjectRole } from "@/lib/dtos/project-members.dto";

export function getProjects({
  workspaceSlug,
  page,
  limit,
  isArchived,
  isFavorite,
  myRole,
  search,
  sort,
  order,
}: {
  workspaceSlug: string;
  page?: number;
  limit?: number;
  isArchived?: boolean;
  isFavorite?: boolean;
  // Acota el listado a los proyectos en los que tengo uno de esos roles.
  myRole?: readonly ProjectRole[];
  search?: string;
  sort?: ProjectSortField;
  order?: SortOrder;
}) {
  const queryString = buildQueryString({ page, limit, isArchived, isFavorite, myRole, search, sort, order });

  return request<PaginatedResponseDto<ProjectListItemResponseDto>>(
    `/workspaces/${workspaceSlug}/projects${queryString}`,
    { method: "GET" },
  );
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

// La unica ruta que resuelve un proyecto archivado, y exige que su espacio este activo.
export function unarchiveProject({ workspaceSlug, projectSlug }: { workspaceSlug: string; projectSlug: string }) {
  return request<void>(`/workspaces/${workspaceSlug}/projects/${projectSlug}/unarchive`, {
    method: "PATCH",
  });
}

export function favoriteProject({ workspaceSlug, projectSlug }: { workspaceSlug: string; projectSlug: string }) {
  return request<void>(`/workspaces/${workspaceSlug}/projects/${projectSlug}/favorite`, {
    method: "POST",
  });
}

export function unfavoriteProject({ workspaceSlug, projectSlug }: { workspaceSlug: string; projectSlug: string }) {
  return request<void>(`/workspaces/${workspaceSlug}/projects/${projectSlug}/favorite`, {
    method: "DELETE",
  });
}
