import { serverRequest } from "@/lib/http/server-client";
import { ProjectResponseDto } from "@/lib/dtos/projects.dto";

export function getProjectServer({ workspaceSlug, projectSlug }: { workspaceSlug: string; projectSlug: string }) {
  return serverRequest<ProjectResponseDto>(`/workspaces/${workspaceSlug}/projects/${projectSlug}`);
}
