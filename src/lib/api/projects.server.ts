import { serverRequest } from "@/lib/http/server-client";
import { ProjectDetailResponseDto } from "@/lib/dtos/projects.dto";

export function getProjectServer(workspaceSlug: string, projectSlug: string) {
  return serverRequest<ProjectDetailResponseDto>(`/workspaces/${workspaceSlug}/projects/${projectSlug}`);
}
