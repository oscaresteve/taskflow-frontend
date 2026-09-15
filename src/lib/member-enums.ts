import { CrownIcon, ShieldIcon, UserIcon, UsersIcon } from "lucide-react";
import { roleAdminColors, roleMemberColors, neutralColors, roleOwnerColors } from "@/lib/enum-colors";
import type { EnumOption } from "@/lib/enum-option";
import { MemberRole } from "@/lib/dtos/members.dto";
import members from "@/messages/en/members.json";

export const roleOptions: Record<MemberRole, EnumOption> = {
  OWNER: {
    label: members.roleLabel.OWNER,
    icon: CrownIcon,
    description: members.roleDescription.OWNER,
    colors: roleOwnerColors,
  },
  ADMIN: {
    label: members.roleLabel.ADMIN,
    icon: ShieldIcon,
    description: members.roleDescription.ADMIN,
    colors: roleAdminColors,
  },
  MEMBER: {
    label: members.roleLabel.MEMBER,
    icon: UserIcon,
    description: members.roleDescription.MEMBER,
    colors: roleMemberColors,
  },
};

export const roleFilters = ["ALL", "OWNER", "ADMIN", "MEMBER"] as const;
export type RoleFilter = (typeof roleFilters)[number];

export const roleFilterOptions: Record<RoleFilter, EnumOption> = {
  ALL: {
    label: members.roleFilter.all,
    icon: UsersIcon,
    colors: neutralColors,
  },
  ...roleOptions,
};
