import { request } from "@/lib/http/client";
import { PaginatedResponseDto, SortOrder } from "@/lib/dtos/pagination.dto";
import { MoveTaskDto, TaskPriority, TaskResponseDto } from "@/lib/dtos/tasks.dto";
import { CreateTaskDto, UpdateTaskDto } from "@/lib/schemas/task.schema";
import { buildQueryString } from "@/lib/http/query-string";
import { DueDateFilter, TaskSortField } from "@/lib/task-enums";

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

export function getBoardTasks({ workspaceSlug, projectSlug }: { workspaceSlug: string; projectSlug: string }) {
  return request<TaskResponseDto[]>(`/workspaces/${workspaceSlug}/projects/${projectSlug}/tasks/board`, {
    method: "GET",
  });
}

export function getTasks({
  workspaceSlug,
  projectSlug,
  page,
  limit,
  search,
  priority,
  assigneeId,
  dueDate,
  isFavorite,
  sort,
  order,
}: {
  workspaceSlug: string;
  projectSlug: string;
  page?: number;
  limit?: number;
  search?: string;
  priority?: TaskPriority;
  assigneeId?: string;
  dueDate?: Exclude<DueDateFilter, "ALL">;
  isFavorite?: boolean;
  sort?: TaskSortField;
  order?: SortOrder;
}) {
  const queryString = buildQueryString({ page, limit, search, priority, assigneeId, dueDate, isFavorite, sort, order });

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

export function moveTask({
  workspaceSlug,
  projectSlug,
  taskNumber,
  data,
}: {
  workspaceSlug: string;
  projectSlug: string;
  taskNumber: string;
  data: MoveTaskDto;
}) {
  return request<TaskResponseDto>(`/workspaces/${workspaceSlug}/projects/${projectSlug}/tasks/${taskNumber}/move`, {
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

export function favoriteTask({
  workspaceSlug,
  projectSlug,
  taskNumber,
}: {
  workspaceSlug: string;
  projectSlug: string;
  taskNumber: string;
}) {
  return request<void>(`/workspaces/${workspaceSlug}/projects/${projectSlug}/tasks/${taskNumber}/favorite`, {
    method: "POST",
  });
}

export function unfavoriteTask({
  workspaceSlug,
  projectSlug,
  taskNumber,
}: {
  workspaceSlug: string;
  projectSlug: string;
  taskNumber: string;
}) {
  return request<void>(`/workspaces/${workspaceSlug}/projects/${projectSlug}/tasks/${taskNumber}/favorite`, {
    method: "DELETE",
  });
}
