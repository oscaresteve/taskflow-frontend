export const workspaceSortFields = ["name", "createdAt", "updatedAt"] as const;
export type WorkspaceSortField = (typeof workspaceSortFields)[number];
