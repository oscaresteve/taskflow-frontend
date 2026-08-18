import { UserResponseDto } from "./auth.dto";

export type ProjectRole = "OWNER" | "ADMIN" | "MEMBER";

export type ProjectMemberResponseDto = {
  id: string;

  projectId: string;
  userId: string;

  role: ProjectRole;

  joinedAt: string | null;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
};

export type ProjectMemberWithUserResponseDto = ProjectMemberResponseDto & {
  user: UserResponseDto;
};
