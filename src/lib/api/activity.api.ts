import { request } from "@/lib/http/client";
import { buildQueryString } from "@/lib/http/query-string";
import { PaginatedResponseDto } from "@/lib/dtos/pagination.dto";
import { ActivityEventResponseDto } from "@/lib/dtos/activity.dto";

export function getWorkspaceActivity({
  workspaceSlug,
  page,
  limit,
}: {
  workspaceSlug: string;
  page?: number;
  limit?: number;
}) {
  const queryString = buildQueryString({ page, limit });

  return request<PaginatedResponseDto<ActivityEventResponseDto>>(
    `/workspaces/${workspaceSlug}/activity${queryString}`,
    { method: "GET" },
  );
}

export function getProjectActivity({
  workspaceSlug,
  projectSlug,
  page,
  limit,
}: {
  workspaceSlug: string;
  projectSlug: string;
  page?: number;
  limit?: number;
}) {
  const queryString = buildQueryString({ page, limit });

  return request<PaginatedResponseDto<ActivityEventResponseDto>>(
    `/workspaces/${workspaceSlug}/projects/${projectSlug}/activity${queryString}`,
    { method: "GET" },
  );
}

export function getTaskActivity({
  workspaceSlug,
  projectSlug,
  taskNumber,
  page,
  limit,
}: {
  workspaceSlug: string;
  projectSlug: string;
  taskNumber: string;
  page?: number;
  limit?: number;
}) {
  const queryString = buildQueryString({ page, limit });

  return request<PaginatedResponseDto<ActivityEventResponseDto>>(
    `/workspaces/${workspaceSlug}/projects/${projectSlug}/tasks/${taskNumber}/activity${queryString}`,
    { method: "GET" },
  );
}
