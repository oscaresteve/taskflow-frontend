import { request } from "@/lib/http/client";
import {
  MyOverviewResponseDto,
  OverviewProjectDto,
  ProjectOverviewResponseDto,
  WorkspaceOverviewResponseDto,
} from "@/lib/dtos/overview.dto";
import { PaginatedResponseDto } from "@/lib/dtos/pagination.dto";
import { buildQueryString } from "@/lib/http/query-string";

export function getMyOverview() {
  return request<MyOverviewResponseDto>("/me/overview", {
    method: "GET",
  });
}

export function getWorkspaceOverview(workspaceSlug: string) {
  return request<WorkspaceOverviewResponseDto>(`/workspaces/${workspaceSlug}/overview`, {
    method: "GET",
  });
}

export function getWorkspaceOverviewProjects({
  workspaceSlug,
  page,
  limit,
  search,
}: {
  workspaceSlug: string;
  page?: number;
  limit?: number;
  search?: string;
}) {
  const queryString = buildQueryString({ page, limit, search });

  return request<PaginatedResponseDto<OverviewProjectDto>>(
    `/workspaces/${workspaceSlug}/overview/projects${queryString}`,
    { method: "GET" },
  );
}

export function getProjectOverview({ workspaceSlug, projectSlug }: { workspaceSlug: string; projectSlug: string }) {
  return request<ProjectOverviewResponseDto>(`/workspaces/${workspaceSlug}/projects/${projectSlug}/overview`, {
    method: "GET",
  });
}
