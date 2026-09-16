import { CrownIcon, ShieldIcon, UserIcon, UsersIcon } from "lucide-react";
import { roleAdminColors, roleMemberColors, neutralColors, roleOwnerColors } from "@/lib/enum-colors";
import type { EnumOption } from "@/lib/enum-option";
import { MemberRole } from "@/lib/dtos/members.dto";

export const roleOptions: Record<MemberRole, EnumOption> = {
  OWNER: {
    labelKey: "members.roleLabel.OWNER",
    icon: CrownIcon,
    descriptionKey: "members.roleDescription.OWNER",
    colors: roleOwnerColors,
  },
  ADMIN: {
    labelKey: "members.roleLabel.ADMIN",
    icon: ShieldIcon,
    descriptionKey: "members.roleDescription.ADMIN",
    colors: roleAdminColors,
  },
  MEMBER: {
    labelKey: "members.roleLabel.MEMBER",
    icon: UserIcon,
    descriptionKey: "members.roleDescription.MEMBER",
    colors: roleMemberColors,
  },
};

export const roleFilters = ["ALL", "OWNER", "ADMIN", "MEMBER"] as const;
export type RoleFilter = (typeof roleFilters)[number];

export const roleFilterOptions: Record<RoleFilter, EnumOption> = {
  ALL: {
    labelKey: "members.roleFilter.all",
    icon: UsersIcon,
    colors: neutralColors,
  },
  ...roleOptions,
};
