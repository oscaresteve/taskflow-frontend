import z from "zod";

export const projectRoles = ["OWNER", "ADMIN", "MEMBER"] as const;

export const createProjectMemberSchema = z.object({
  userId: z.cuid(),

  role: z.enum(projectRoles),
});

export type CreateProjectMemberDto = z.infer<typeof createProjectMemberSchema>;
