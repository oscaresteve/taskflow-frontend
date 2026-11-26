import z from "zod";

export const projectRoles = ["OWNER", "ADMIN", "MEMBER"] as const;

export const createProjectMemberSchema = z.object({
  userId: z.cuid(),

  role: z.enum(projectRoles),
});

export const updateProjectMemberSchema = z.object({
  role: z.enum(projectRoles),
});

// La baja machaco el rol, asi que quien reactiva vuelve a elegirlo en el mismo gesto.
export const activateProjectMemberSchema = z.object({
  role: z.enum(projectRoles),
});

export type CreateProjectMemberDto = z.infer<typeof createProjectMemberSchema>;
export type UpdateProjectMemberDto = z.infer<typeof updateProjectMemberSchema>;
export type ActivateProjectMemberDto = z.infer<typeof activateProjectMemberSchema>;
