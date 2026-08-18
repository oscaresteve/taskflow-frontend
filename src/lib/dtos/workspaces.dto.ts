import { ProjectResponseDto } from "./projects.dto";
import { WorkspaceMemberWithUserResponseDto } from "./workspace-members.dto";

export type WorkspaceResponseDto = {
  id: string;

  name: string;
  slug: string;

  description: string | null;
  logoUrl: string | null;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
};

export type WorkspaceDetailResponseDto = WorkspaceResponseDto & {
  projects: ProjectResponseDto[];
  members: WorkspaceMemberWithUserResponseDto[];
};
