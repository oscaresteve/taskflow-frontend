import { ProjectRole } from "@/lib/dtos/project-members.dto";
import { WorkspaceRole } from "@/lib/dtos/workspace-members.dto";
import { isWorkspaceManager } from "@/lib/permissions/workspace-member-permissions";

// Mirrors the project-member rules enforced server-side in taskflow-backend's
// shared/auth/permissions.ts (requireProjectManager, requireWorkspaceOrProjectManager,
// requireCanAssignProjectRole). Keep in sync with that file — this only decides what the UI
// shows/enables; the backend is still the source of truth and re-validates every request.
//
// Administrar un proyecto no es solo cosa del rol de proyecto: quien manda en el espacio manda
// tambien en sus proyectos, y entonces la jerarquia interna del proyecto no le aplica. Por eso
// casi todo aqui recibe los dos roles, y el del espacio corta antes.

const ASSIGNABLE_ROLES_BY_ROLE: Record<ProjectRole, ProjectRole[]> = {
  OWNER: ["OWNER", "ADMIN", "MEMBER"],
  ADMIN: ["ADMIN", "MEMBER"],
  MEMBER: [],
};

// OWNER o ADMIN pueden administrar el proyecto.
export function isProjectManager(actorRole: ProjectRole | null | undefined): boolean {
  return actorRole === "OWNER" || actorRole === "ADMIN";
}

// Editar el proyecto, archivarlo y gestionar sus miembros: lo puede quien manda en el proyecto o
// quien manda en el espacio que lo contiene. Un rol de proyecto sin mando no basta, y tampoco hace
// falta tenerlo si el mando viene del espacio.
export function canManageProject({
  workspaceRole,
  projectRole,
}: {
  workspaceRole: WorkspaceRole | undefined;
  // null es el "no soy miembro activo" que trae ProjectResponseDto.myRole; undefined, el de un rol
  // que aun no ha cargado. Para administrar dan lo mismo.
  projectRole: ProjectRole | null | undefined;
}): boolean {
  return isWorkspaceManager(workspaceRole) || isProjectManager(projectRole);
}

// ADMIN no puede asignar el rol OWNER, salvo que su mando venga del espacio.
export function canAssignProjectRole({
  workspaceRole,
  actorRole,
  role,
}: {
  workspaceRole: WorkspaceRole | undefined;
  actorRole: ProjectRole | undefined;
  role: ProjectRole;
}): boolean {
  if (isWorkspaceManager(workspaceRole)) return true;
  if (!isProjectManager(actorRole)) return false;
  if (actorRole === "ADMIN" && role === "OWNER") return false;
  return true;
}

export function assignableProjectRoles({
  workspaceRole,
  actorRole,
}: {
  workspaceRole: WorkspaceRole | undefined;
  actorRole: ProjectRole | undefined;
}): ProjectRole[] {
  if (isWorkspaceManager(workspaceRole)) return ASSIGNABLE_ROLES_BY_ROLE.OWNER;
  if (!actorRole) return [];
  return ASSIGNABLE_ROLES_BY_ROLE[actorRole];
}

// ADMIN no puede administrar un OWNER, salvo que su mando venga del espacio.
export function canManageProjectMember({
  workspaceRole,
  actorRole,
  targetRole,
}: {
  workspaceRole: WorkspaceRole | undefined;
  actorRole: ProjectRole | undefined;
  targetRole: ProjectRole;
}): boolean {
  if (isWorkspaceManager(workspaceRole)) return true;
  if (!isProjectManager(actorRole)) return false;
  if (actorRole === "ADMIN" && targetRole === "OWNER") return false;
  return true;
}

// Un manager no puede cambiar su propio rol, ni el de un miembro inactivo.
export function canUpdateProjectMemberRole({
  actorUserId,
  workspaceRole,
  actorRole,
  targetUserId,
  targetRole,
  targetIsActive,
}: {
  actorUserId: string | undefined;
  workspaceRole: WorkspaceRole | undefined;
  actorRole: ProjectRole | undefined;
  targetUserId: string;
  targetRole: ProjectRole;
  targetIsActive: boolean;
}): boolean {
  if (!actorUserId || actorUserId === targetUserId) return false;
  if (!targetIsActive) return false;
  return canManageProjectMember({ workspaceRole, actorRole, targetRole });
}

// Un manager no puede desactivarse a si mismo, ni desactivar a alguien ya inactivo.
export function canDeactivateProjectMember({
  actorUserId,
  workspaceRole,
  actorRole,
  targetUserId,
  targetRole,
  targetIsActive,
}: {
  actorUserId: string | undefined;
  workspaceRole: WorkspaceRole | undefined;
  actorRole: ProjectRole | undefined;
  targetUserId: string;
  targetRole: ProjectRole;
  targetIsActive: boolean;
}): boolean {
  if (!actorUserId || actorUserId === targetUserId) return false;
  if (!targetIsActive) return false;
  return canManageProjectMember({ workspaceRole, actorRole, targetRole });
}
