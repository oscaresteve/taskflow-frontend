import { request } from "@/lib/http/client";
import { buildQueryString } from "@/lib/http/query-string";
import { PaginatedResponseDto } from "@/lib/dtos/pagination.dto";
import { TaskResponseDto, TaskStatus } from "@/lib/dtos/tasks.dto";
import { CreateTaskDto, UpdateTaskDto } from "@/lib/schemas/task.schema";

export function createTask({
  workspaceSlug,
  projectSlug,
  data,
}: {
  workspaceSlug: string;
  projectSlug: string;
  data: CreateTaskDto;
}) {
  return request<TaskResponseDto>(`/workspaces/${workspaceSlug}/projects/${projectSlug}/tasks`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getTasks({
  workspaceSlug,
  projectSlug,
  page,
  limit,
  isArchived,
  status,
}: {
  workspaceSlug: string;
  projectSlug: string;
  page?: number;
  limit?: number;
  isArchived?: boolean;
  status?: TaskStatus;
}) {
  const queryString = buildQueryString({ page, limit, isArchived, status });

  return request<PaginatedResponseDto<TaskResponseDto>>(
    `/workspaces/${workspaceSlug}/projects/${projectSlug}/tasks${queryString}`,
    { method: "GET" },
  );
}

export function getTask({
  workspaceSlug,
  projectSlug,
  taskNumber,
}: {
  workspaceSlug: string;
  projectSlug: string;
  taskNumber: string;
}) {
  return request<TaskResponseDto>(`/workspaces/${workspaceSlug}/projects/${projectSlug}/tasks/${taskNumber}`, {
    method: "GET",
  });
}

export function updateTask({
  workspaceSlug,
  projectSlug,
  taskNumber,
  data,
}: {
  workspaceSlug: string;
  projectSlug: string;
  taskNumber: string;
  data: UpdateTaskDto;
}) {
  return request<TaskResponseDto>(`/workspaces/${workspaceSlug}/projects/${projectSlug}/tasks/${taskNumber}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function archiveTask({
  workspaceSlug,
  projectSlug,
  taskNumber,
}: {
  workspaceSlug: string;
  projectSlug: string;
  taskNumber: string;
}) {
  return request<void>(`/workspaces/${workspaceSlug}/projects/${projectSlug}/tasks/${taskNumber}/archive`, {
    method: "PATCH",
  });
}
