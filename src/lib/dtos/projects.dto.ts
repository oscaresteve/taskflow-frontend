import { ProjectMemberWithUserResponseDto } from "./project-members.dto";
import { TaskResponseDto } from "./tasks.dto";
import { WorkspaceResponseDto } from "./workspaces.dto";

export type ProjectResponseDto = {
  id: string;

  name: string;
  slug: string;
  key: string;

  description: string | null;
  icon: string | null;
  color: string | null;

  isArchived: boolean;

  createdAt: string;
  updatedAt: string;
};

export type ProjectDetailResponseDto = ProjectResponseDto & {
  workspace: WorkspaceResponseDto;
  members: ProjectMemberWithUserResponseDto[];
  tasks: TaskResponseDto[];
};
