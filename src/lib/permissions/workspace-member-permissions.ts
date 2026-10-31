import { WorkspaceMemberStatus, WorkspaceRole } from "@/lib/dtos/workspace-members.dto";

// Mirrors the workspace-member rules enforced server-side in taskflow-backend's
// shared/auth/permissions.ts (requireWorkspaceManager, requireCanManageWorkspaceMember,
// requireCanAssignWorkspaceRole). Keep in sync with that file — this only decides what the UI
// shows/enables; the backend is still the source of truth and re-validates every request.

const ASSIGNABLE_ROLES_BY_ROLE: Record<WorkspaceRole, WorkspaceRole[]> = {
  OWNER: ["OWNER", "ADMIN", "MEMBER"],
  ADMIN: ["ADMIN", "MEMBER"],
  MEMBER: [],
};

// OWNER o ADMIN pueden administrar el workspace. La lista existe aparte del predicado porque los
// listados filtran por rol en el servidor (`?myRole=`), y ahi hace falta recorrerla.
export const workspaceManagerRoles = ["OWNER", "ADMIN"] as const satisfies readonly WorkspaceRole[];

export function isWorkspaceManager(actorRole: WorkspaceRole | undefined): boolean {
  return actorRole === "OWNER" || actorRole === "ADMIN";
}

// ADMIN no puede administrar un OWNER.
export function canManageWorkspaceMember({
  actorRole,
  targetRole,
}: {
  actorRole: WorkspaceRole | undefined;
  targetRole: WorkspaceRole;
}): boolean {
  if (!isWorkspaceManager(actorRole)) return false;
  if (actorRole === "ADMIN" && targetRole === "OWNER") return false;
  return true;
}

// ADMIN no puede asignar el rol OWNER.
export function canAssignWorkspaceRole({
  actorRole,
  role,
}: {
  actorRole: WorkspaceRole | undefined;
  role: WorkspaceRole;
}): boolean {
  if (!isWorkspaceManager(actorRole)) return false;
  if (actorRole === "ADMIN" && role === "OWNER") return false;
  return true;
}

export function assignableWorkspaceRoles(actorRole: WorkspaceRole | undefined): WorkspaceRole[] {
  if (!actorRole) return [];
  return ASSIGNABLE_ROLES_BY_ROLE[actorRole];
}

// Activar es solo aceptar una invitacion pendiente; a quien ya fue eliminado se le restaura.
export function canActivateWorkspaceMember({
  actorRole,
  targetRole,
  targetStatus,
}: {
  actorRole: WorkspaceRole | undefined;
  targetRole: WorkspaceRole;
  targetStatus: WorkspaceMemberStatus;
}): boolean {
  if (targetStatus !== "PENDING") return false;
  return canManageWorkspaceMember({ actorRole, targetRole });
}

// Cancelar es la vuelta de invitar, asi que solo cabe mientras la invitacion siga pendiente. No se
// comprueba que el objetivo no sea uno mismo: un manager activo nunca es su propia invitacion.
export function canCancelWorkspaceMemberInvitation({
  actorRole,
  targetRole,
  targetStatus,
}: {
  actorRole: WorkspaceRole | undefined;
  targetRole: WorkspaceRole;
  targetStatus: WorkspaceMemberStatus;
}): boolean {
  if (targetStatus !== "PENDING") return false;
  return canManageWorkspaceMember({ actorRole, targetRole });
}

// Y al reves: solo se restaura a quien fue eliminado.
export function canRestoreWorkspaceMember({
  actorUserId,
  actorRole,
  targetUserId,
  targetRole,
  targetStatus,
}: {
  actorUserId: string | undefined;
  actorRole: WorkspaceRole | undefined;
  targetUserId: string;
  targetRole: WorkspaceRole;
  targetStatus: WorkspaceMemberStatus;
}): boolean {
  if (!actorUserId || actorUserId === targetUserId) return false;
  if (targetStatus !== "REMOVED") return false;
  return canManageWorkspaceMember({ actorRole, targetRole });
}

// Un manager no puede cambiar su propio rol, ni el de un miembro ya eliminado.
export function canUpdateWorkspaceMemberRole({
  actorUserId,
  actorRole,
  targetUserId,
  targetRole,
  targetStatus,
}: {
  actorUserId: string | undefined;
  actorRole: WorkspaceRole | undefined;
  targetUserId: string;
  targetRole: WorkspaceRole;
  targetStatus: WorkspaceMemberStatus;
}): boolean {
  if (!actorUserId || actorUserId === targetUserId) return false;
  if (targetStatus === "REMOVED") return false;
  return canManageWorkspaceMember({ actorRole, targetRole });
}

// Un manager no puede eliminarse a si mismo, ni eliminar a alguien ya eliminado.
export function canRemoveWorkspaceMember({
  actorUserId,
  actorRole,
  targetUserId,
  targetRole,
  targetStatus,
}: {
  actorUserId: string | undefined;
  actorRole: WorkspaceRole | undefined;
  targetUserId: string;
  targetRole: WorkspaceRole;
  targetStatus: WorkspaceMemberStatus;
}): boolean {
  if (!actorUserId || actorUserId === targetUserId) return false;
  if (targetStatus === "REMOVED") return false;
  return canManageWorkspaceMember({ actorRole, targetRole });
}
