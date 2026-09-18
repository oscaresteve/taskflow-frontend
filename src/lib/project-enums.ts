export const projectSortFields = ["name", "createdAt", "updatedAt"] as const;
export type ProjectSortField = (typeof projectSortFields)[number];