import { ProjectRole } from "@/lib/dtos/project-members.dto";

// Mirrors the project-member rules enforced server-side in taskflow-backend's
// shared/auth/permissions.ts (requireProjectManager, requireCanAssignProjectRole). Keep in sync
// with that file — this only decides what the UI shows/enables; the backend is still the source
// of truth and re-validates every request.

const ASSIGNABLE_ROLES_BY_ROLE: Record<ProjectRole, ProjectRole[]> = {
  OWNER: ["OWNER", "ADMIN", "MEMBER"],
  ADMIN: ["ADMIN", "MEMBER"],
  MEMBER: [],
};

// OWNER o ADMIN pueden administrar el proyecto.
export function isProjectManager(actorRole: ProjectRole | undefined): boolean {
  return actorRole === "OWNER" || actorRole === "ADMIN";
}

// ADMIN no puede asignar el rol OWNER.
export function canAssignProjectRole({
  actorRole,
  role,
}: {
  actorRole: ProjectRole | undefined;
  role: ProjectRole;
}): boolean {
  if (!isProjectManager(actorRole)) return false;
  if (actorRole === "ADMIN" && role === "OWNER") return false;
  return true;
}

export function assignableProjectRoles(actorRole: ProjectRole | undefined): ProjectRole[] {
  if (!actorRole) return [];
  return ASSIGNABLE_ROLES_BY_ROLE[actorRole];
}

// ADMIN no puede administrar un OWNER.
export function canManageProjectMember({
  actorRole,
  targetRole,
}: {
  actorRole: ProjectRole | undefined;
  targetRole: ProjectRole;
}): boolean {
  if (!isProjectManager(actorRole)) return false;
  if (actorRole === "ADMIN" && targetRole === "OWNER") return false;
  return true;
}

// Un manager no puede cambiar su propio rol, ni el de un miembro inactivo.
export function canUpdateProjectMemberRole({
  actorUserId,
  actorRole,
  targetUserId,
  targetRole,
  targetIsActive,
}: {
  actorUserId: string | undefined;
  actorRole: ProjectRole | undefined;
  targetUserId: string;
  targetRole: ProjectRole;
  targetIsActive: boolean;
}): boolean {
  if (!actorUserId || actorUserId === targetUserId) return false;
  if (!targetIsActive) return false;
  return canManageProjectMember({ actorRole, targetRole });
}

// Un manager no puede desactivarse a si mismo, ni desactivar a alguien ya inactivo.
export function canDeactivateProjectMember({
  actorUserId,
  actorRole,
  targetUserId,
  targetRole,
  targetIsActive,
}: {
  actorUserId: string | undefined;
  actorRole: ProjectRole | undefined;
  targetUserId: string;
  targetRole: ProjectRole;
  targetIsActive: boolean;
}): boolean {
  if (!actorUserId || actorUserId === targetUserId) return false;
  if (!targetIsActive) return false;
  return canManageProjectMember({ actorRole, targetRole });
}
