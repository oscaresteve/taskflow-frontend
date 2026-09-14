import { request } from "@/lib/http/client";
import { MyOverviewResponseDto, ProjectOverviewResponseDto, WorkspaceOverviewResponseDto } from "@/lib/dtos/overview.dto";

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

export function getProjectOverview({ workspaceSlug, projectSlug }: { workspaceSlug: string; projectSlug: string }) {
  return request<ProjectOverviewResponseDto>(`/workspaces/${workspaceSlug}/projects/${projectSlug}/overview`, {
    method: "GET",
  });
}
