import { request } from "@/lib/http/client";
import { PaginatedResponseDto } from "@/lib/dtos/pagination.dto";
import { TaskResponseDto } from "@/lib/dtos/tasks.dto";
import { CreateTaskDto, UpdateTaskDto } from "@/lib/schemas/task.schema";

export function createTask(workspaceSlug: string, projectSlug: string, data: CreateTaskDto) {
  return request<TaskResponseDto>(`/workspaces/${workspaceSlug}/projects/${projectSlug}/tasks`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getTasks(workspaceSlug: string, projectSlug: string) {
  return request<PaginatedResponseDto<TaskResponseDto>>(`/workspaces/${workspaceSlug}/projects/${projectSlug}/tasks`, {
    method: "GET",
  });
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

export function updateTask(
  workspaceSlug: string,
  projectSlug: string,
  taskNumber: string,
  data: UpdateTaskDto,
) {
  return request<TaskResponseDto>(`/workspaces/${workspaceSlug}/projects/${projectSlug}/tasks/${taskNumber}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
