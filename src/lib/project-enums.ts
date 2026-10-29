export const projectSortFields = ["name", "createdAt", "updatedAt"] as const;
export type ProjectSortField = (typeof projectSortFields)[number];

// Igual que el ciclo de vida del espacio: una pestana por estado en el listado de gestion.
export const projectLifecycles = ["ACTIVE", "ARCHIVED"] as const;
export type ProjectLifecycle = (typeof projectLifecycles)[number];

