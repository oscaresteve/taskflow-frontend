import { CrownIcon, ShieldIcon, UserIcon, UsersIcon, type LucideIcon } from "lucide-react";
import members from "@/messages/en/members.json";

export type MemberRole = "OWNER" | "ADMIN" | "MEMBER";

export const roleLabel: Record<MemberRole, string> = members.roleLabel;

export const roleDescription: Record<MemberRole, string> = members.roleDescription;

export const roleVariant: Record<MemberRole, "default" | "secondary" | "outline"> = {
  OWNER: "default",
  ADMIN: "secondary",
  MEMBER: "outline",
};

export const roleIcon: Record<MemberRole, LucideIcon> = {
  OWNER: CrownIcon,
  ADMIN: ShieldIcon,
  MEMBER: UserIcon,
};

export const roleFilters = ["ALL", "OWNER", "ADMIN", "MEMBER"] as const;
export type RoleFilter = (typeof roleFilters)[number];

export const roleFilterLabels: Record<RoleFilter, string> = {
  ALL: members.roleFilter.all,
  ...roleLabel,
};

export const roleFilterIcon: Record<RoleFilter, LucideIcon> = {
  ALL: UsersIcon,
  ...roleIcon,
};
