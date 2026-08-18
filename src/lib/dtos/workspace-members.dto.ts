import { UserResponseDto } from "./auth.dto";

export type WorkspaceRole = "OWNER" | "ADMIN" | "MEMBER";

export type WorkspaceMemberStatus = "PENDING" | "ACTIVE" | "REMOVED";

export type WorkspaceMemberResponseDto = {
  id: string;

  userId: string;
  workspaceId: string;

  role: WorkspaceRole;
  status: WorkspaceMemberStatus;

  joinedAt: string | null;

  createdAt: string;
  updatedAt: string;
};

export type WorkspaceMemberWithUserResponseDto = WorkspaceMemberResponseDto & {
  user: UserResponseDto;
};
