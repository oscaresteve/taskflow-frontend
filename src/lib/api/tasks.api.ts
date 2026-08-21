import { request } from "@/lib/http/client";
import { TaskResponseDto } from "@/lib/dtos/tasks.dto";
import { CreateTaskDto } from "@/lib/schemas/task.schema";

export function createTask(workspaceSlug: string, projectSlug: string, data: CreateTaskDto) {
  return request<TaskResponseDto>(`/workspaces/${workspaceSlug}/projects/${projectSlug}/tasks`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
