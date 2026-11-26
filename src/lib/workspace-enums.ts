export const workspaceSortFields = ["name", "createdAt", "updatedAt"] as const;
export type WorkspaceSortField = (typeof workspaceSortFields)[number];

// Los dos estados en los que puede estar un espacio. El listado de gestion los separa en pestanas y
// ensena uno a la vez: asi cada vista es homogenea y no hace falta una columna de estado.
export const workspaceLifecycles = ["ACTIVE", "INACTIVE"] as const;
export type WorkspaceLifecycle = (typeof workspaceLifecycles)[number];

