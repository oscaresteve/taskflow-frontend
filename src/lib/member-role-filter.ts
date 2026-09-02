export type MemberRole = "OWNER" | "ADMIN" | "MEMBER";

export const roleFilters = ["ALL", "OWNER", "ADMIN", "MEMBER"] as const;
export type RoleFilter = (typeof roleFilters)[number];

export const roleFilterLabels: Record<RoleFilter, string> = {
  ALL: "All roles",
  OWNER: "Owner",
  ADMIN: "Admin",
  MEMBER: "Member",
};
