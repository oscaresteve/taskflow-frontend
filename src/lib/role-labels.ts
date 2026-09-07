import { CrownIcon, ShieldIcon, UserIcon, UsersIcon, type LucideIcon } from "lucide-react";

export type MemberRole = "OWNER" | "ADMIN" | "MEMBER";

export const roleLabel: Record<MemberRole, string> = {
  OWNER: "Owner",
  ADMIN: "Admin",
  MEMBER: "Member",
};

export const roleDescription: Record<MemberRole, string> = {
  OWNER: "Full control, including removing it and managing every member.",
  ADMIN: "Manages members and settings, but can't remove it.",
  MEMBER: "Can access and contribute, without management access.",
};

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
  ALL: "All roles",
  ...roleLabel,
};

export const roleFilterIcon: Record<RoleFilter, LucideIcon> = {
  ALL: UsersIcon,
  ...roleIcon,
};
