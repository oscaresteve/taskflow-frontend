import { UserResponseDto } from "./auth.dto";
import { MemberRole } from "./members.dto";

export type ProjectRole = MemberRole;

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
