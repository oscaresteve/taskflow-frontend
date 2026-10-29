import z from "zod";

export const workspaceRoles = ["OWNER", "ADMIN", "MEMBER"] as const;

export const createWorkspaceMemberSchema = z.object({
  userId: z.cuid(),

  role: z.enum(workspaceRoles),
});

export const updateWorkspaceMemberSchema = z.object({
  role: z.enum(workspaceRoles),
});

// La baja machaco el rol, asi que quien readmite vuelve a elegirlo en el mismo gesto.
export const restoreWorkspaceMemberSchema = z.object({
  role: z.enum(workspaceRoles),
});

export type CreateWorkspaceMemberDto = z.infer<typeof createWorkspaceMemberSchema>;
export type UpdateWorkspaceMemberDto = z.infer<typeof updateWorkspaceMemberSchema>;
export type RestoreWorkspaceMemberDto = z.infer<typeof restoreWorkspaceMemberSchema>;
