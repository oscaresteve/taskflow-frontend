export type MemberRole = "OWNER" | "ADMIN" | "MEMBER";

export const roleFilters = ["ALL", "OWNER", "ADMIN", "MEMBER"] as const;
export type RoleFilter = (typeof roleFilters)[number];

export const roleFilterLabels: Record<RoleFilter, string> = {
  ALL: "All roles",
  OWNER: "Owner",
  ADMIN: "Admin",
  MEMBER: "Member",
};

export function matchesMemberFilters(
  member: { role: MemberRole; user: { name: string; email: string } },
  search: string,
  roleFilter: RoleFilter,
) {
  if (roleFilter !== "ALL" && member.role !== roleFilter) return false;
  if (!search) return true;
  const query = search.toLowerCase();
  return member.user.name.toLowerCase().includes(query) || member.user.email.toLowerCase().includes(query);
}
