import { WorkspaceRole } from "@/lib/dtos/workspace-members.dto";

// Mirrors the workspace-member rules enforced server-side in taskflow-backend's
// shared/auth/permissions.ts (requireWorkspaceManager, requireCanManageWorkspaceMember,
// requireCanAssignWorkspaceRole). Keep in sync with that file — this only decides what the UI
// shows/enables; the backend is still the source of truth and re-validates every request.

const ASSIGNABLE_ROLES_BY_ROLE: Record<WorkspaceRole, WorkspaceRole[]> = {
  OWNER: ["OWNER", "ADMIN", "MEMBER"],
  ADMIN: ["ADMIN", "MEMBER"],
  MEMBER: [],
};

// OWNER o ADMIN pueden administrar el workspace.
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

export function canActivateWorkspaceMember({
  actorRole,
  targetRole,
}: {
  actorRole: WorkspaceRole | undefined;
  targetRole: WorkspaceRole;
}): boolean {
  return canManageWorkspaceMember({ actorRole, targetRole });
}

// Un manager no puede cambiar su propio rol.
export function canUpdateWorkspaceMemberRole({
  actorUserId,
  actorRole,
  targetUserId,
  targetRole,
}: {
  actorUserId: string | undefined;
  actorRole: WorkspaceRole | undefined;
  targetUserId: string;
  targetRole: WorkspaceRole;
}): boolean {
  if (!actorUserId || actorUserId === targetUserId) return false;
  return canManageWorkspaceMember({ actorRole, targetRole });
}

// Un manager no puede eliminarse a si mismo.
export function canRemoveWorkspaceMember({
  actorUserId,
  actorRole,
  targetUserId,
  targetRole,
}: {
  actorUserId: string | undefined;
  actorRole: WorkspaceRole | undefined;
  targetUserId: string;
  targetRole: WorkspaceRole;
}): boolean {
  if (!actorUserId || actorUserId === targetUserId) return false;
  return canManageWorkspaceMember({ actorRole, targetRole });
}
