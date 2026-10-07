import { TaskPriority, TaskStatus } from "@/lib/dtos/tasks.dto";
import { ProjectRole } from "@/lib/dtos/project-members.dto";
import { WorkspaceRole } from "@/lib/dtos/workspace-members.dto";

export type ActivityPersonDto = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  avatarUrl: string | null;
};

export type ActivityProjectDto = {
  slug: string;
  key: string;
  name: string;
};

type TaskRef = {
  taskNumber: number;
  taskTitle: string;
};

type ProjectRef = {
  projectName: string;
  projectKey: string;
};

type WorkspaceRef = {
  workspaceName: string;
};

type MemberRef = {
  targetUserId: string;
};

type CommentRef = TaskRef & { commentId: string };

export type TaskEditedField = "title" | "description";
export type ProjectEditedField = "name" | "description" | "color";
export type WorkspaceEditedField = "name" | "description" | "avatar";

// Espeja el payload del backend accion a accion. La union discriminada es lo que permite que el
// componente del feed estreche por action y lea los campos sin comprobaciones a mano.
export type ActivityPayloadMap = {
  TASK_CREATED: TaskRef;
  TASK_EDITED: TaskRef & { fields: TaskEditedField[] };
  TASK_STATUS_CHANGED: TaskRef & { from: TaskStatus; to: TaskStatus };
  TASK_PRIORITY_CHANGED: TaskRef & { from: TaskPriority; to: TaskPriority };
  TASK_ASSIGNEE_CHANGED: TaskRef & { from: string | null; to: string | null };
  TASK_DUE_DATE_CHANGED: TaskRef & { from: string | null; to: string | null };
  TASK_ARCHIVED: TaskRef;

  COMMENT_CREATED: CommentRef;
  COMMENT_EDITED: CommentRef;
  COMMENT_DELETED: CommentRef;
  COMMENT_MENTIONED: CommentRef;

  PROJECT_CREATED: ProjectRef;
  PROJECT_UPDATED: ProjectRef & { fields: ProjectEditedField[] };
  PROJECT_ARCHIVED: ProjectRef;

  PROJECT_MEMBER_ADDED: MemberRef & { role: ProjectRole };
  PROJECT_MEMBER_ROLE_CHANGED: MemberRef & { from: ProjectRole; to: ProjectRole };
  PROJECT_MEMBER_DEACTIVATED: MemberRef;

  WORKSPACE_CREATED: WorkspaceRef;
  WORKSPACE_UPDATED: WorkspaceRef & { fields: WorkspaceEditedField[] };
  WORKSPACE_DEACTIVATED: WorkspaceRef;

  WORKSPACE_MEMBER_INVITED: MemberRef & { role: WorkspaceRole };
  WORKSPACE_MEMBER_ACTIVATED: MemberRef;
  WORKSPACE_MEMBER_ROLE_CHANGED: MemberRef & { from: WorkspaceRole; to: WorkspaceRole };
  WORKSPACE_MEMBER_REMOVED: MemberRef;
};

export type ActivityAction = keyof ActivityPayloadMap;

export type ActivityEventResponseDto = {
  [A in ActivityAction]: {
    id: string;

    action: A;
    payload: ActivityPayloadMap[A];

    taskId: string | null;
    project: ActivityProjectDto | null;

    actor: ActivityPersonDto;
    // Solo las acciones que hablan de alguien lo traen ("asigno la tarea a X").
    target: ActivityPersonDto | null;

    createdAt: string;
  };
}[ActivityAction];
