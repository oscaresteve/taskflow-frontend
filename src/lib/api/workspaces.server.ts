import { redirect } from "next/navigation";
import { serverRequest } from "@/lib/http/server-client";
import { PaginatedResponseDto } from "@/lib/dtos/pagination.dto";
import { WorkspaceResponseDto } from "@/lib/dtos/workspaces.dto";

export function getWorkspacesServer() {
  return serverRequest<PaginatedResponseDto<WorkspaceResponseDto>>("/workspaces");
}

export function getWorkspaceServer(workspaceSlug: string) {
  return serverRequest<WorkspaceResponseDto>(`/workspaces/${workspaceSlug}`);
}

export async function hasWorkspaces() {
  const workspaces = await getWorkspacesServer();
  return workspaces !== null && workspaces.data.length > 0;
}

// Redirigir aqui solo es seguro porque `serverRequest` lanza ante un fallo: el `false` de
// `hasWorkspaces()` significa un 200 con la lista vacia, no "no se pudo preguntar".
export async function requireWorkspaces() {
  if (!(await hasWorkspaces())) {
    redirect("/onboarding");
  }
}
