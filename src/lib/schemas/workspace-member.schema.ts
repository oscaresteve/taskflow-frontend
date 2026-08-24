import z from "zod";

export const workspaceRoles = ["OWNER", "ADMIN", "MEMBER"] as const;

export const createWorkspaceMemberSchema = z.object({
  userId: z.cuid(),

  role: z.enum(workspaceRoles),
});

export type CreateWorkspaceMemberDto = z.infer<typeof createWorkspaceMemberSchema>;
