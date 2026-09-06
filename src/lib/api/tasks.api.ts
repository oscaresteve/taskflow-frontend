import { request } from "@/lib/http/client";
import { MoveTaskDto, TaskResponseDto } from "@/lib/dtos/tasks.dto";
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

export function getBoardTasks({ workspaceSlug, projectSlug }: { workspaceSlug: string; projectSlug: string }) {
  return request<TaskResponseDto[]>(`/workspaces/${workspaceSlug}/projects/${projectSlug}/tasks/board`, {
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
