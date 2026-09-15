import { UserResponseDto } from "./auth.dto";
import { MemberRole } from "./members.dto";

export type WorkspaceRole = MemberRole;

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
