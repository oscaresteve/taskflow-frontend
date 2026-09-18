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
