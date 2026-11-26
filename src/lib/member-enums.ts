import { ICONS } from "@/lib/icons";
import { roleAdminColors, roleMemberColors, neutralColors, roleOwnerColors } from "@/lib/enum-colors";
import type { EnumOption } from "@/lib/enum-option";
import { MemberRole } from "@/lib/dtos/members.dto";

export const roleOptions: Record<MemberRole, EnumOption> = {
  OWNER: {
    labelKey: "members.roleLabel.OWNER",
    icon: ICONS.roleOwner,
    descriptionKey: "members.roleDescription.OWNER",
    colors: roleOwnerColors,
  },
  ADMIN: {
    labelKey: "members.roleLabel.ADMIN",
    icon: ICONS.roleAdmin,
    descriptionKey: "members.roleDescription.ADMIN",
    colors: roleAdminColors,
  },
  MEMBER: {
    labelKey: "members.roleLabel.MEMBER",
    icon: ICONS.roleMember,
    descriptionKey: "members.roleDescription.MEMBER",
    colors: roleMemberColors,
  },
};

export const roleFilters = ["ALL", "OWNER", "ADMIN", "MEMBER"] as const;
export type RoleFilter = (typeof roleFilters)[number];

export const roleFilterOptions: Record<RoleFilter, EnumOption> = {
  ALL: {
    labelKey: "members.roleFilter.all",
    icon: ICONS.roleAll,
    colors: neutralColors,
  },
  ...roleOptions,
};

export const memberSortFields = ["joinedAt", "createdAt", "updatedAt"] as const;
export type MemberSortField = (typeof memberSortFields)[number];

// Las pestanas por estado de los dos listados de miembros. Viven aqui, y no en el DTO, porque lo que
// necesitan las pestanas es una lista recorrible y un parser de nuqs, no solo el tipo.
export const workspaceMemberStatusTabs = ["ACTIVE", "PENDING", "REMOVED"] as const;

// En proyecto la pertenencia es un booleano, no un enum, asi que su pestana es solo activo/inactivo.
export const projectMemberStatusTabs = ["ACTIVE", "INACTIVE"] as const;
export type ProjectMemberStatusTab = (typeof projectMemberStatusTabs)[number];
