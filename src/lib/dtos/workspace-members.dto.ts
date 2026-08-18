import { UserResponseDto } from "./auth.dto";

export type WorkspaceRole = {
  OWNER: "OWNER";
  ADMIN: "ADMIN";
  MEMBER: "MEMBER";
};

export type WorkspaceMemberStatus = {
  PENDING: "PENDING";
  ACTIVE: "ACTIVE";
  REMOVED: "REMOVED";
};

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
